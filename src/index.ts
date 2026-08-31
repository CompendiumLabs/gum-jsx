// gum-jsx: the batteries-included gum.jsx
//
// Re-exports @gum-jsx/core, @gum-jsx/math, @gum-jsx/node and @gum-jsx/mark.
// Importing it applies the math plugin to the default Env, so <Latex> and the
// KaTeX faces are there out of the box.

import { gum } from '@gum-jsx/core'
import { math } from '@gum-jsx/math'
gum.use(math)

export * from '@gum-jsx/core'
export * from '@gum-jsx/math'
export * from '@gum-jsx/node'
export * from '@gum-jsx/mark'
