// A few pointed checks on the Env semantics the example suite can't see (it
// renders everything against one Env): settings never leak between
// evaluations or calls, Envs are isolated from each other, and the random
// and id streams behave. The per-element guarantee — every element of a tree
// carries the Env it was evaluated against — is enforced by the runner
// itself, which walks every example tree in strict mode (test/unit.ts).

import { strict as assert } from 'node:assert'

import { gum, Env, Circle, defaultEnv } from '@gum-jsx/core'
import { math, mathToSvg } from '@gum-jsx/math'

function runEnvTests(): void {
    const light = gum.evaluate('<Circle />').svg()
    const dark = gum.evaluate('<Circle />', { theme: 'dark' }).svg()

    // per-evaluation settings leave nothing behind
    assert.notEqual(light, dark, 'theme should change the output')
    assert.equal(gum.evaluate('<Circle />').svg(), light, 'a dark evaluation must not leak into the next')
    assert.equal(new Env({ theme: 'dark' }).evaluate('<Circle />').svg(), dark, 'an Env theme should apply')

    // Envs are isolated: a fresh one has no math, and use on a derived copy
    // leaves the original alone
    assert.throws(() => new Env().evaluate('<Latex>x</Latex>'), /Latex is not defined/, 'plugins should not register globally')
    const base = new Env()
    base.with({}).use(math)
    assert.ok(!('Latex' in base.elems), 'use on a with() copy must not reach the original')

    // mathToSvg lays out against a copy: per-call theme, no plugin left behind
    assert.notEqual(mathToSvg('x^2', { theme: 'dark' }), mathToSvg('x^2'), 'math theme should be per call')
    assert.ok(!('Latex' in base.elems) && base.theme == 'light', 'mathToSvg must not change the Env it is given')

    // the user stream resets per evaluation (repeatable), ids keep advancing
    // (no clip id collisions across figures on one page)
    assert.equal(gum.evaluate('<Circle rad={random()} />').svg(), gum.evaluate('<Circle rad={random()} />').svg(), 'evaluations should be repeatable')
    assert.notEqual(gum.evaluate('<Circle rad={random()} />', { seed: 7 }).svg(), light, 'a seed should change the draws')
    const id = (s: string) => s.match(/clip-[a-z0-9]+/)![0]
    assert.notEqual(id(gum.evaluate('<Box clip><Circle /></Box>').svg()), id(gum.evaluate('<Box clip><Circle /></Box>').svg()), 'clip ids should advance across evaluations')

    // host construction without env falls back to the default Env
    assert.equal(new Circle().env, defaultEnv())

    console.error('env checks passed')
}

export { runEnvTests }
