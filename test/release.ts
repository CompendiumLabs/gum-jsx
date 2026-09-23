import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pack } from '../scripts/release'
import { checkBrowser } from './release-browser'
import { pdfImageChecks } from './release-pdf'

const directory = mkdtempSync(join(tmpdir(), 'gum-release-'))
const keep = process.argv.includes('--keep')
const offline = process.argv.includes('--offline')
function run(args: string[], cwd = directory): string {
  const result = Bun.spawnSync(args, { cwd, stdout: 'pipe', stderr: 'pipe' })
  assert.equal(result.exitCode, 0, result.stderr.toString() || result.stdout.toString())
  return result.stdout.toString()
}

try {
  const artifacts = await pack(join(directory, 'artifacts'))
  const versions = new Map<string, string>()
  for (const [name, path] of Object.entries(artifacts)) {
    const manifest = JSON.parse(run(['tar', '-xOf', path, 'package/package.json']))
    assert.equal(manifest.name, name)
    versions.set(name, manifest.version)
    assert.ok(!manifest.private)
    assert.equal(manifest.publishConfig.access, 'public')
    for (const range of Object.values(manifest.dependencies ?? {}) as string[]) {
      assert.ok(!range.startsWith('workspace:'), `${name}: unpacked workspace dependency`)
    }
    const files = run(['tar', '-tf', path]).trim().split('\n')
    for (const entry of [manifest.module, manifest.types, ...Object.values(manifest.bin ?? {})]) {
      if (entry) assert.ok(files.includes(`package/${String(entry).replace(/^\.\//, '')}`), `${name}: missing entry ${entry}`)
    }
    assert.ok(files.includes('package/LICENSE'), `${name}: missing license`)
    assert.ok(!files.some(file => /^package\/(test|node_modules|out|dist)\//.test(file)))
    if (name === '@gum-jsx/core') {
      assert.equal(files.filter(file => file.endsWith('.ttf')).length, 7)
      assert.ok(files.some(file => /OFL|LICENSE/.test(file) && file.includes('/fonts/')))
    }
  }
  for (const [name, path] of Object.entries(artifacts)) {
    const manifest = JSON.parse(run(['tar', '-xOf', path, 'package/package.json']))
    for (const [dependency, range] of Object.entries(manifest.dependencies ?? {})) {
      if (dependency.startsWith('@gum-jsx/')) assert.equal(range, versions.get(dependency), `${name}: uncoordinated dependency ${dependency}`)
    }
  }
  const dependencies = Object.fromEntries(Object.entries(artifacts).map(([name, path]) => [name, `file:${path}`]))
  await Bun.write(join(directory, 'package.json'), JSON.stringify({
    private: true, type: 'module', dependencies, overrides: dependencies,
    trustedDependencies: ['canvas'],
  }, null, 2))
  run([process.execPath, 'install', ...(offline ? ['--offline'] : [])])
  for (const name of Object.keys(artifacts)) {
    const location = realpathSync(join(directory, 'node_modules', name))
    assert.ok(location.startsWith(directory + '/'), `${name}: consumer escaped into workspace`)
    const manifest = JSON.parse(readFileSync(join(location, 'package.json'), 'utf8'))
    assert.equal(manifest.version, versions.get(name))
  }

  await Bun.write(join(directory, 'consumer.tsx'), `
import assert from 'node:assert/strict'
import { evaluate, render_element, px, Fonts, Text, PngImage } from '@gum-jsx/core'
import { mathToSvg } from '@gum-jsx/math'
import { rasterize_svg, rasterize_pixels } from '@gum-jsx/png'
import { select_svg } from '@gum-jsx/png/selection'
import { render_pdf } from '@gum-jsx/pdf'
import { displayMarkdown } from '@gum-jsx/mark'
import { createGumRoot, GUM } from '@gum-jsx/react'
import { getElements, getGuides, buildSkillFiles } from '@gum-jsx/docs'

const fonts = new Fonts()
await fonts.load()
const result = render_element(new Text({ children: 'Packed fonts work', font_size: px(20) }), { fonts })
assert.equal(result.kind, 'svg')
assert.ok(result.svg.includes('<path'))
assert.ok(mathToSvg(String.raw\`\\frac{a}{b}\`).includes('<path'))
const png = rasterize_svg(result.svg, { size: result.size })
assert.equal(png.toString('hex', 0, 8), '89504e470d0a1a0a')
assert.ok(rasterize_pixels(result.svg).data.length > 0)
assert.ok(select_svg(result.svg, { x: 0, y: 0, width: 5, height: 5 }, result.size).includes('<svg'))
assert.ok(new TextDecoder().decode(render_pdf(result.fragment)).startsWith('%PDF-'))
${pdfImageChecks}
assert.ok(displayMarkdown('# Hello').includes('Hello'))
assert.ok(getElements().tags.includes('Plot'))
assert.ok(getGuides().tags.includes('Gum'))
assert.ok(buildSkillFiles().size > 0)
assert.throws(() => evaluate('<Frame paddding={px(20)} />'), /padding/)
const root = createGumRoot({ size: 320 })
await root.loadFonts()
root.render(<GUM.Text>React from a tarball</GUM.Text>)
assert.ok(root.getSvg().includes('<path'))
root.unmount()
console.log('Packed library and asset checks passed')
`)
  console.log(run([process.execPath, 'consumer.tsx']).trim())
  await Bun.write(join(directory, 'figure.jsx'), '<Frame padding={em(1)}><Text>Packed CLI</Text></Frame>')
  for (const format of ['svg', 'png', 'pdf']) {
    run([process.execPath, 'node_modules/.bin/gum', 'figure.jsx', '-o', `figure.${format}`])
  }
  run([process.execPath, 'node_modules/.bin/gum-tex', 'x^2', '-o', 'formula.svg'])
  await Bun.write(join(directory, 'notes.md'), '# Packed Markdown\n\nInline math: $x^2$')
  assert.ok(run([process.execPath, 'node_modules/.bin/gum-mark', 'notes.md']).includes('Packed Markdown'))
  await Bun.write(join(directory, 'figure.tsx'), `
import { GUM } from '@gum-jsx/react'
export default function Figure() { return <GUM.Text>Packed React CLI</GUM.Text> }
`)
  assert.ok(run([process.execPath, 'node_modules/.bin/gum-react', 'figure.tsx']).startsWith('<svg'))
  console.log('All four packed CLI commands passed')

  // Browser consumers must supply core font assets for runtime URL loading.
  // Math fonts are static imports and are copied by the bundler itself.
  await Bun.write(join(directory, 'browser.ts'), `
export { Fonts, render_element, Text, PngImage } from '@gum-jsx/core'
export { mathToSvgAsync } from '@gum-jsx/math'
export { render_pdf } from '@gum-jsx/pdf'
export { Gum } from '@gum-jsx/react'
export { select_svg } from '@gum-jsx/png/selection'
`)
  const result = await Bun.build({ entrypoints: [join(directory, 'browser.ts')],
    target: 'browser', outdir: join(directory, 'browser'), naming: { asset: '[name].[ext]' } })
  assert.ok(result.success, result.logs.map(log => log.message).join('\n'))
  assert.equal(result.outputs.filter(output => output.path.endsWith('.ttf')).length, 18)
  console.log('Packed browser entry points bundle with all 18 math font assets')
  await checkBrowser(directory)
  console.log('Release artifact checks passed, including the documented tiny RGB PNG limitation.')
} finally {
  if (keep) console.log(`Artifacts and consumer retained in ${directory}`)
  else rmSync(directory, { recursive: true, force: true })
}
