#! /usr/bin/env bun

// Render every example in strict mode: the docs and gala examples out of
// @gum-jsx/docs plus the feature tests in test/code, which is what runTests
// does by default (see src/test.ts); pass --report to also write the renders
// and manifest to test/data for test/report

import { runTests } from '../src/test'

const report = process.argv.includes('--report')
const { failed } = runTests({ report })
process.exit(failed > 0 ? 1 : 0)
