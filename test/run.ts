#! /usr/bin/env bun

// Render every example in strict mode: the docs and gala examples out of
// @gum-jsx/docs plus the feature tests in test/code, which is what runUnitTests
// does by default (see ./unit.ts); pass --report to also write the
// renders and manifest to test/data for test/report

import { runUnitTests } from './unit'
import { runEnvTests } from './env'
import { runEmTests } from './em'

runEnvTests()
runEmTests()
const report = process.argv.includes('--report')
const { failed } = runUnitTests({ report })
process.exit(failed > 0 ? 1 : 0)
