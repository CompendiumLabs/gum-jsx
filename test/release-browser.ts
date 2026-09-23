import assert from 'node:assert/strict'
import { join, resolve } from 'node:path'

// Run against only the installed tarballs and their emitted browser assets.
export async function checkBrowser(directory: string): Promise<void> {
  const chrome = process.env.GUM_CHROME ?? Bun.which('chromium') ?? Bun.which('google-chrome-stable')
  assert.ok(chrome, 'Chromium is required for release checks; set GUM_CHROME to its path')
  const html = `<!doctype html><html><body><pre id="status">Loading</pre>
<script type="module">
import { Fonts, Text, render_element, mathToSvgAsync, render_pdf } from '/browser/browser.js';
try {
  const fonts = new Fonts();
  await fonts.load();
  const text = render_element(new Text({ children: 'Packed browser fonts' }), { fonts });
  if (text.kind !== 'svg' || !text.svg.includes('<path')) throw Error('Text outlines missing');
  const math = await mathToSvgAsync(String.raw\`\\frac{x}{y}\`);
  if (!math.includes('<path')) throw Error('Math outlines missing');
  if (!new TextDecoder().decode(render_pdf(text.fragment)).startsWith('%PDF-')) throw Error('PDF failed');
  document.body.dataset.result = 'passed';
  document.querySelector('#status').textContent = 'Passed';
} catch (error) {
  document.body.dataset.result = 'failed';
  document.querySelector('#status').textContent = error.stack ?? String(error);
}
</script></body></html>`
  const loaded = new Set<string>()
  const server = Bun.serve({ hostname: '127.0.0.1', port: 0, async fetch(request) {
    const pathname = new URL(request.url).pathname
    if (pathname === '/') return new Response(html, { headers: { 'Content-Type': 'text/html' } })
    // Core URLs are relative to the bundle; hosts copy/serve these packaged
    // assets at /fonts. Math fonts are emitted beside the bundled module.
    const path = pathname.startsWith('/fonts/')
      ? resolve(directory, 'node_modules/@gum-jsx/core/src', '.' + pathname)
      : resolve(directory, '.' + pathname)
    if (!path.startsWith(directory + '/') || !(pathname.startsWith('/fonts/') || pathname.startsWith('/browser/'))) {
      return new Response('Not found', { status: 404 })
    }
    const file = Bun.file(path)
    if (!await file.exists()) return new Response('Not found', { status: 404 })
    if (pathname.endsWith('.ttf')) loaded.add(pathname)
    return new Response(file)
  } })
  try {
    const child = Bun.spawn([chrome, '--headless=new', '--no-sandbox', '--disable-gpu',
      '--disable-dev-shm-usage', `--user-data-dir=${join(directory, 'chrome')}`,
      '--virtual-time-budget=10000', '--dump-dom', server.url.href], { stdout: 'pipe', stderr: 'pipe' })
    const timeout = setTimeout(() => child.kill(), 30000)
    const [exit, dom, stderr] = await Promise.all([child.exited,
      new Response(child.stdout).text(), new Response(child.stderr).text()])
    clearTimeout(timeout)
    assert.equal(exit, 0, stderr)
    assert.ok(dom.includes('data-result="passed"'), dom)
    assert.equal(loaded.size, 25, 'All seven core and eighteen math faces must load from the artifacts')
    console.log('Packed browser text, math, PDF, and all 25 font requests passed')
  } finally {
    server.stop(true)
  }
}
