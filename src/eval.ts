// gum-jsx/eval: evaluateGum with the math plugin on the default Env
import { gum } from '@gum-jsx/core'
import { math } from '@gum-jsx/math'
gum.use(math)
export * from '@gum-jsx/core/eval'
