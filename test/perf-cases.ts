import { cases as core } from '../gum-jsx-core/test/perf/cases'
import { cases as math } from '../gum-jsx-math/test/perf/cases'
import { cases as maps } from '../gum-jsx-maps/test/perf/cases'
import { cases as demos } from '../gum-jsx-docs/test/perf/cases'

export const cases = { ...core, ...math, ...maps, ...demos }
