// time the gum.jsx → svg pipeline on a snippet
//
//   bun scripts/perf.ts snippet.jsx           # a file
//   echo '<Circle />' | bun scripts/perf.ts   # stdin
//   bun scripts/perf.ts snippet.jsx -n 50     # more warm runs
//
// evaluation (parse, run, and lay out the element tree, math included) and
// svg serialization are timed separately. the first run is reported on its
// own since it pays for anything cached across runs (the text shaping memo,
// jit warmup), and the runs after it are averaged

import { parseArgs } from 'util'
import { readFileSync } from 'fs'
import { evaluateGum } from '../src/eval'
import { readStdin } from '@gum-jsx/node'
import type { Size } from '@gum-jsx/core/lib/types'

const USAGE = `usage: bun scripts/perf.ts [file | -] [-n runs] [--size w,h]`
const DEFAULT_SIZE: Size = [ 500, 500 ]

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    runs: { type: 'string', short: 'n', default: '20' },
    size: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (values.help) {
  console.log(USAGE)
  process.exit(0)
}

// the snippet: a file or stdin
const [ source ] = positionals
const code = source == null || source == '-' ? await readStdin() : readFileSync(source, 'utf8')

const runs = parseInt(values.runs)
const size = values.size != null ? values.size.split(',').map(Number) as Size : DEFAULT_SIZE

// one pass through the pipeline: eval and svg times, and the output size
type Timing = { evaluate: number, svg: number, bytes: number }

function timeOnce(): Timing {
  const t0 = performance.now()
  const elem = evaluateGum(code, { size })
  const t1 = performance.now()
  const text = elem.svg()
  const t2 = performance.now()
  return { evaluate: t1 - t0, svg: t2 - t1, bytes: text.length }
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const fmt = (ms: number) => `${ms.toFixed(2)} ms`.padStart(11)

// the cold run, then the warm ones (an error surfaces from the first run; the
// syntax and runtime errors carry a traceback into the snippet)
let cold: Timing
try {
  cold = timeOnce()
} catch (err: any) {
  const where = typeof err?.traceback == 'function' ? err.traceback() : ''
  console.log(where.length > 0 ? `${err.message}\n\n${where}` : String(err?.message ?? err))
  process.exit(1)
}
const warm: Timing[] = []
for (let i = 0; i < runs; i++) warm.push(timeOnce())

const evals = warm.map(t => t.evaluate)
const svgs = warm.map(t => t.svg)

console.log(`size ${size[0]}x${size[1]}, svg ${cold.bytes} bytes, ${runs} warm runs\n`)
console.log(`               evaluate         svg       total`)
console.log(`cold      ${fmt(cold.evaluate)} ${fmt(cold.svg)} ${fmt(cold.evaluate + cold.svg)}`)
console.log(`warm mean ${fmt(mean(evals))} ${fmt(mean(svgs))} ${fmt(mean(evals) + mean(svgs))}`)
console.log(`warm min  ${fmt(Math.min(...evals))} ${fmt(Math.min(...svgs))} ${fmt(Math.min(...evals) + Math.min(...svgs))}`)
