// Fresh published-package check for every server-side CLI/MCP PNG path.
import assert from 'node:assert/strict'
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const directory = await mkdtemp(join(tmpdir(), 'gum-png-integration-'))
const consumer = join(directory, 'consumer')
await mkdir(consumer)
console.log(`Package integration artifacts: ${directory}`)
async function run(args: string[], cwd = root): Promise<string> {
  const child = Bun.spawn(args, {
    cwd, env: { ...process.env, npm_config_cache: process.env.npm_config_cache ?? join(directory, 'cache') },
    stdout: 'pipe', stderr: 'pipe',
  })
  const [code, out, err] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ])
  assert.equal(code, 0, `${args.join(' ')}\n${out}\n${err}`)
  return out
}
await run(['bun', 'run', 'build'], join(root, 'gum-jsx-png'))
const archives: string[] = []
for (const name of ['core', 'math', 'maps', 'png', 'pdf', 'mark', 'docs', 'cli', 'mcp']) {
  const packed = JSON.parse(await run(['npm', 'pack', '--ignore-scripts', '--json',
    '--pack-destination', directory], join(root, `gum-jsx-${name}`)))
  const metadata = (Array.isArray(packed) ? packed[0] : Object.values(packed)[0]) as { filename: string }
  archives.push(join(directory, metadata.filename))
}
await writeFile(join(consumer, 'package.json'), '{"name":"gum-png-integration","private":true,"type":"module"}\n')
await run(['npm', 'install', '--ignore-scripts', '--no-audit', '--no-fund', ...archives], consumer)
const lock = JSON.parse(await readFile(join(consumer, 'package-lock.json'), 'utf8'))
assert.ok(!Object.keys(lock.packages).some(path => path.endsWith('/canvas')), 'Fresh CLI/MCP installs must not install canvas')
await copyFile(join(root, 'test/png-consumer.ts'), join(consumer, 'smoke.ts'))
console.log((await run(['bun', '--no-addons', 'smoke.ts'], consumer)).trim())
console.log('ok - fresh npm CLI/MCP packages work with install scripts and native addons disabled')
