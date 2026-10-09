#!/usr/bin/env bun

import { version } from '../package.json'

// Only the first argument selects a command; everything else retains render syntax.
const args = process.argv.slice(2)
try {
  if (args[0] === 'docs') {
    const { create_docs_cli } = await import('./docs')
    await create_docs_cli().parseAsync(args.slice(1), { from: 'user' })
  } else {
    const { create_cli } = await import('@gum-jsx/cli')
    const explicit = args[0] === 'render'
    const program = create_cli(version).name(explicit ? 'gum render' : 'gum')
    if (!explicit) program.addHelpText('after', `
Commands:
  render [options] [files...]  Render files or stdin (also the default)
  docs                        Learn Gum and browse its offline documentation

For agents: start with gum docs, then search for the components and examples you need.`)
    await program.parseAsync(explicit ? args.slice(1) : args, { from: 'user' })
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
