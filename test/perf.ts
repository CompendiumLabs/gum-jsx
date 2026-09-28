import { cases } from './perf-cases'
import { run_benchmarks } from '../gum-jsx-core/test/perf/runner'

// One runner measures cases sequentially and emits one JSON document when asked.
await run_benchmarks(cases)
