import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// This is an isolated source-loading experiment, not a production runtime option.
const args = process.argv.slice(2)
const index = args.indexOf('--mode')
const mode = index < 0 ? 'freeze' : args[index + 1]
if (mode !== 'freeze' && mode !== 'no-freeze') throw new Error('--mode must be freeze or no-freeze')
if (index >= 0) args.splice(index, 2)
const audit = args.includes('--audit')
if (audit) args.splice(args.indexOf('--audit'), 1)
const snapshot_index = args.indexOf('--snapshot')
const snapshot = snapshot_index < 0 ? undefined : args[snapshot_index + 1]
if (snapshot_index >= 0) {
  if (!snapshot || snapshot.startsWith('--')) throw new Error('--snapshot needs an output path')
  args.splice(snapshot_index, 2)
  if (args.length) throw new Error('--snapshot cannot be combined with perf runner options')
}
if (audit && (mode !== 'no-freeze' || !args.includes('--smoke'))) {
  throw new Error('--audit requires --mode no-freeze --smoke; audit tracking is not timed')
}
process.argv = [...process.argv.slice(0, 2), ...args]

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Freeze experiment: bun run perf:freeze --mode <freeze|no-freeze> [perf options]
  --audit  Check reference ownership tracking during a no-freeze smoke run
  --snapshot <path>  Write untimed output hashes for all cases instead of running timings
Normal perf options follow. See test/PERF-FREEZE.md for scope and limitations.\n`)
}

const root = fileURLToPath(new URL('../', import.meta.url))
if (mode === 'no-freeze') {
  const support = fileURLToPath(new URL('./perf-freeze-support.ts', import.meta.url))
  // Only these seven sites produce frozen boxes used by make_measure's copy check.
  // Fail if the source changes so an obsolete experiment cannot silently mislead.
  const sites: Record<string, string[]> = {
    'engine/geometry.ts': ['Object.freeze({ width, height })'],
    'engine/pass.ts': ['return Object.freeze(result)'],
    'engine/units.ts': ['Object.freeze({})', 'Object.freeze({ ...reference })'],
    'elems/stack.ts': ['Object.freeze({ ...reference, [main]: Math.max(0, reference[main] - gaps) })'],
    'lib/composition.ts': ['return Object.freeze(result)', 'const reference = Object.freeze({'],
  }
  const seen = new Set<string>()
  Bun.plugin({ name: 'gum-freeze-experiment', setup(build) {
    build.onLoad({ filter: /gum-jsx-(core|math|maps)\/src\/.*\.ts$/ }, ({ path }) => {
      // Match package suffixes because this workspace can be accessed through a symlink.
      let source = readFileSync(path, 'utf8')
      for (const [file, snippets] of Object.entries(sites)) {
        if (!path.endsWith(`/gum-jsx-core/src/${file}`)) continue
        for (const snippet of snippets) {
          assert.equal(source.split(snippet).length - 1, 1, `Freeze experiment site changed: ${file}: ${snippet}`)
          source = source.replace(snippet, snippet.replace('Object.freeze', '__perf_reference'))
        }
        seen.add(file)
      }
      source = source.replaceAll('Object.freeze', '__perf_identity')
        .replaceAll('Object.isFrozen', '__perf_is_frozen')
      const prefix = audit ? 'audit_' : ''
      return { loader: 'ts', contents:
        `import { ${prefix}identity as __perf_identity, ${prefix}reference as __perf_reference, ` +
        `${prefix}is_frozen as __perf_is_frozen } from ${JSON.stringify(support)};\n${source}` }
    })
  } })
  const core = await import(`${root}gum-jsx-core/src/index.ts`)
  assert.equal(Object.isFrozen(core.make_point(1, 2)), false, 'Core source hook did not activate')
  assert.equal(Object.isFrozen(core.make_size(1, 2)), false, 'Reference boxes should also be unfrozen')
  assert.equal(seen.size, Object.keys(sites).length, 'Reference producers were not all loaded')
  const { is_frozen } = await import('./perf-freeze-support')
  assert.ok(is_frozen(core.make_size(1, 2)), 'Reference ownership marker did not activate')
}

// Both modes must retain snapshot semantics and validation at API boundaries.
const core = await import(`${root}gum-jsx-core/src/index.ts`)
const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }]
const element = new core.Polyline({ points })
points[1].y = 5
assert.equal(element.props.points[1].y, 1)
assert.equal(Object.isFrozen(points[1]), false)
assert.equal(Object.isFrozen(element.props.points[1]), mode === 'freeze')
const reference = { width: 10 }
const measure = core.make_measure({ reference })
reference.width = 20
assert.equal(measure.reference.width, 10)
assert.throws(() => core.make_point(NaN, 0))
assert.throws(() => core.make_size(-1, 0))

console.error(`Freeze experiment: ${mode}${audit ? ' (ownership audit)' : ''}; production files unchanged`)
if (snapshot) {
  const { cases } = await import('./perf-cases')
  const hashes: Record<string, string> = {}
  for (const [name, setup] of Object.entries(cases)) {
    const serialized = JSON.stringify(setup()(), (_, value) => {
      if (typeof value === 'number' && (Object.is(value, -0) || !Number.isFinite(value))) {
        return { $number: Object.is(value, -0) ? '-0' : String(value) }
      }
      return value && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]])) : value
    })
    hashes[name] = new Bun.CryptoHasher('sha256').update(serialized).digest('hex')
  }
  await Bun.write(snapshot, JSON.stringify(hashes, null, 2) + '\n')
  console.error(`${Object.keys(hashes).length} output hashes saved`)
} else {
  await import('./perf')
}
