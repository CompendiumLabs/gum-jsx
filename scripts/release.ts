import { mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
// Dependency order; applications remain private and are built/deployed separately.
const packages = ['core', 'math', 'png', 'pdf', 'mark', 'react', 'docs', 'cli']

async function pack(destination = join(root, 'dist/release')) {
  mkdirSync(destination, { recursive: true })
  const artifacts: Record<string, string> = {}
  let version: string | undefined
  for (const name of packages) {
    const directory = join(root, `gum-jsx-${name}`)
    const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
    version ??= manifest.version
    if (manifest.private || manifest.version !== version) {
      throw new Error(`${manifest.name}: public release versions must agree`)
    }
    const path = join(destination, `gum-jsx-${name}-${version}.tgz`)
    const result = Bun.spawnSync([process.execPath, 'pm', 'pack', '--quiet', '--filename', path], {
      cwd: directory, stdout: 'pipe', stderr: 'pipe', env: { ...process.env, BUN_TMPDIR: '/tmp' },
    })
    if (result.exitCode) throw new Error(result.stderr.toString() || result.stdout.toString())
    artifacts[manifest.name] = path
    console.log(`Packed ${manifest.name}@${version}`)
  }
  await Bun.write(join(destination, 'artifacts.json'), JSON.stringify(artifacts, null, 2) + '\n')
  return artifacts
}

if (import.meta.main) await pack(process.argv[2] ? resolve(process.argv[2]) : undefined)
export { pack }
