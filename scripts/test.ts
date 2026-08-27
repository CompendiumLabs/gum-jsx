#! /usr/bin/env bun

// Render every example in strict mode: the docs and gala examples out of
// @gum-jsx/core plus the feature tests in test/code (see src/test.ts); pass
// --report to also write the renders and manifest to test/data for test/report

import { join } from 'path'
import { runTests, packageDir } from '../src/test'

const core = packageDir('@gum-jsx/core')
const report = process.argv.includes('--report')
const { failed } = runTests({
    groups: [
        { name: 'docs', dir: join(core, 'docs', 'code') },
        { name: 'gala', dir: join(core, 'gala', 'code') },
        'test',
    ],
    dataDir: join(core, 'docs', 'data'),
    report,
})
process.exit(failed > 0 ? 1 : 0)
