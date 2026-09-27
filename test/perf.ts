import { cases as core } from '../gum-jsx-core/test/perf/cases'
import { cases as math } from '../gum-jsx-math/test/perf/cases'
import { cases as maps } from '../gum-jsx-maps/test/perf/cases'
import { run_benchmarks } from '../gum-jsx-core/test/perf/runner'

// One runner measures cases sequentially and emits one JSON document when asked.
await run_benchmarks({ ...core, ...math, ...maps })
