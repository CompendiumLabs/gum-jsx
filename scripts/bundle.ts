import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build_catalog } from '@gum-jsx/docs'

export const root = fileURLToPath(new URL('../', import.meta.url))
// Build dependencies whose code/assets ship in the CLI and need notices.
export const bundled_dependencies = ['@gum-jsx/cli', '@gum-jsx/docs']

// Match acorn-jsx's CommonJS entry to avoid bundling a second Acorn parser.
const acorn = createRequire(import.meta.resolve('@gum-jsx/core')).resolve('acorn')
export function bundle_options(): Bun.BuildConfig {
  return {
    entrypoints: [resolve(root, 'src/bundled.ts')],
    target: 'bun',
    minify: { whitespace: true, syntax: true, identifiers: false },
    plugins: [{
      name: 'bundled-documentation',
      setup(build) {
        build.onResolve({ filter: /^@gum-jsx\/docs\/catalog$/ }, () => ({
          path: 'catalog', namespace: 'gum-docs',
        }))
        build.onLoad({ filter: /.*/, namespace: 'gum-docs' }, () => ({
          contents: JSON.stringify(build_catalog()), loader: 'json',
        }))
      },
    }, {
      name: 'deduplicate-acorn',
      setup(build) {
        build.onResolve({ filter: /^acorn$/ }, () => ({ path: acorn }))
      },
    }],
  }
}
