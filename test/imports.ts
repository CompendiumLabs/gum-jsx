import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const workspace = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
let checked = 0
for (const directory of workspace.workspaces as string[]) {
  const base = join(root, directory)
  const manifest = JSON.parse(readFileSync(join(base, 'package.json'), 'utf8'))
  const runtime = new Set([manifest.name, ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {})])
  const declared = new Set([manifest.name, ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}), ...Object.keys(manifest.peerDependencies ?? {})])
  function visit(path: string) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (['node_modules', '.git', 'dist', 'out', 'skills'].includes(entry.name)) continue
      const file = join(path, entry.name)
      if (entry.isDirectory()) { visit(file); continue }
      const extension = entry.name.split('.').at(-1)
      if (!['ts', 'tsx', 'js', 'jsx'].includes(extension!) || entry.name.endsWith('.d.ts')) continue
      const loader = extension as 'ts' | 'tsx' | 'js' | 'jsx'
      for (const { path: specifier } of new Bun.Transpiler({ loader }).scanImports(readFileSync(file, 'utf8').replace(/^#![^\n]*\n/, ''))) {
        if (!/^(gum-jsx-|@gum-jsx\/)/.test(specifier)) continue
        assert.ok(specifier.startsWith('@gum-jsx/'), `${file}: obsolete import ${specifier}`)
        const name = specifier.split('/').slice(0, 2).join('/')
        assert.ok(declared.has(name), `${file}: undeclared dependency ${name}`)
        if (file.startsWith(join(base, 'src') + '/')) {
          assert.ok(runtime.has(name), `${file}: runtime import ${name} is only a dev dependency`)
        }
        checked++
      }
    }
  }
  visit(base)
}
console.log(`Checked ${checked} workspace imports against package manifests`)
