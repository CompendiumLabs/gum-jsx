#!/usr/bin/env bun

import { run_cli } from '@gum-jsx/cli'
import { version } from '../package.json'

// The distribution owns the command version and process entry point.
await run_cli(process.argv.slice(2), version)
