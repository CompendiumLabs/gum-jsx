import { afterAll, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { version } from '../package.json'

const scratch = mkdtempSync(join(tmpdir(), 'gum-docs-'))
afterAll(() => rmSync(scratch, { recursive: true, force: true }))
let invocation = 0

// Run outside the workspace; package tests reuse this suite under Node and Bun.
async function cli(args: string[], input = '') {
  const output = join(scratch, `stdout-${++invocation}`)
  const errors = join(scratch, `stderr-${invocation}`)
  const entry = process.env.GUM_CLI_ENTRY ?? fileURLToPath(new URL('../src/cli.ts', import.meta.url))
  const child = Bun.spawn([process.env.GUM_CLI_RUNTIME ?? process.execPath, entry, ...args], {
    cwd: scratch, stdin: new Blob([input]), stdout: Bun.file(output), stderr: Bun.file(errors),
    env: { ...process.env, PATH: '' },
  })
  const code = await child.exited
  return { code, text: await Bun.file(output).text(), error: await Bun.file(errors).text() }
}

test('docs starts with versioned orientation and a runnable example without reading stdin', async () => {
  const result = await cli(['docs'], 'throw new Error("Unexpected evaluation")')
  expect(result.code).toBe(0)
  expect(result.error).toBe('')
  expect(result.text).toContain(`Gum ${version}`)
  expect(result.text).toContain('gum docs search')
  const source = /^```jsx\n([\s\S]*?)^```/m.exec(result.text)![1]
  const rendered = await cli(['render', '-f', 'svg'], source)
  expect(rendered.code, rendered.error).toBe(0)
  expect(rendered.text).toStartWith('<svg ')
})

test('docs retrieves focused pages, ranked searches, and collection indexes', async () => {
  const page = await cli(['docs', 'get', 'elements/Plot'])
  expect(page.code, page.error).toBe(0)
  expect(page.text).toContain('# Plot')
  expect(page.text).toContain('```jsx')
  expect(page.text).toContain('(elements/Graph)')
  expect(page.text).not.toContain('../../guides/text/')
  const search = await cli(['docs', 'search', 'plot', '--limit', '2'])
  expect(search.code).toBe(0)
  expect(search.text).toStartWith('- `elements/Plot`')
  expect(search.text.trim().split('\n')).toHaveLength(2)
  const words = await cli(['docs', 'search', 'axis', 'labels'])
  expect(words.code).toBe(0)
  expect(words.text).toStartWith('- `elements/Axis`')
  const index = await cli(['docs', 'list', 'guides'])
  expect(index.code).toBe(0)
  expect(index.text).toContain('`guides/units`')
  expect(index.text).not.toContain('`elements/')
})

test('example stdout is executable JSX and fixture exports render independently', async () => {
  const example = await cli(['docs', 'example', 'elements/Plot'])
  expect(example.code).toBe(0)
  expect(example.error).toBe('')
  expect(example.text).toStartWith('// ')
  expect(example.text).not.toContain('```')
  const rendered = await cli(['render', '-f', 'svg'], example.text)
  expect(rendered.code, rendered.error).toBe(0)
  expect(rendered.text).toStartWith('<svg ')
  for (const name of ['load_csv', 'load_json', 'load_png']) {
    const exported = await cli(['docs', 'example', `guides/${name}`, '--output', name])
    expect(exported.code, exported.error).toBe(0)
    expect(exported.text).toBe('')
    const result = await cli(['render', `${name}/${name}.jsx`, '-f', 'svg'])
    expect(result.code, result.error).toBe(0)
    expect(result.text).toStartWith('<svg ')
  }
  const needs_files = await cli(['docs', 'example', 'guides/load_csv'])
  expect(needs_files.code).toBe(0)
  expect(needs_files.text).toStartWith('// ')
  expect(needs_files.error).toContain('temperatures.csv')
})

test('render dispatch preserves file and stdin shorthand and advertises docs', async () => {
  const source = '<Circle width={px(32)} />'
  await Bun.write(join(scratch, 'figure.jsx'), source)
  const implicit = await cli(['-f', 'svg'], source)
  for (const args of [
    ['render', '-f', 'svg'], ['render', 'figure.jsx', '-f', 'svg'], ['figure.jsx', '-f', 'svg'],
  ]) {
    const result = await cli(args, source)
    expect(result.code, result.error).toBe(0)
    expect(result.text).toBe(implicit.text)
  }
  const help = await cli(['--help'])
  expect(help.text).toContain('For agents: start with gum docs')
  expect((await cli(['render', '--help'])).text).toContain('Usage: gum render')
  expect((await cli(['docs', '--help'])).text).toContain('search')
})

test('missing pages, invalid queries, and unknown commands report useful errors', async () => {
  for (const args of [
    ['get', 'elements/Missing'], ['example', 'gallery/Missing'],
    ['search', 'plot', '--limit', '0'], ['search', ''], ['list', 'missing'], ['missing'],
  ]) {
    const result = await cli(['docs', ...args])
    expect(result.code).toBe(1)
    expect(result.text).toBe('')
    expect(result.error.length).toBeGreaterThan(0)
  }
  const empty = await cli(['docs', 'search', 'no_such_gum_feature_9231'])
  expect(empty.code).toBe(0)
  expect(empty.text).toContain('No matching documentation')
})
