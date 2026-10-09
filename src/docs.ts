import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Command } from 'commander'
import catalog from '@gum-jsx/docs/catalog'
import { format_doc, get_doc, list_docs, search_docs } from '@gum-jsx/docs/docs'
import type { DocPage } from '@gum-jsx/docs/docs'

// Keep indexes concise and make every result directly retrievable.
function print_index(pages: DocPage[]): void {
  console.log(pages.map(page => `- \`${page.id}\` — ${page.title}: ${page.description}`).join('\n'))
}

// Export complete examples; stdout remains usable as raw JSX without this option.
function write_example(page: DocPage, output?: string): void {
  if (!output) {
    process.stdout.write(page.code + '\n')
    if (Object.keys(page.assets).length) {
      console.error(`Example files needed: ${Object.keys(page.assets).join(', ')}. `
        + `Export them with gum docs example ${page.id} --output example.`)
    }
    return
  }
  mkdirSync(output, { recursive: true })
  const file = join(output, page.id.split('/')[1] + '.jsx')
  writeFileSync(file, page.code + '\n')
  for (const [name, data] of Object.entries(page.assets)) {
    writeFileSync(join(output, name), Buffer.from(data, 'base64'))
  }
  console.error(`Wrote ${file} and ${Object.keys(page.assets).length} example files.`)
}

// Documentation commands operate entirely on the installed catalog.
function create_docs_cli(): Command {
  const program = new Command()
    .name('gum docs')
    .description('Read and search the documentation bundled with this Gum version, offline.')
    .version(catalog.version)
    .allowExcessArguments(false)
    .action(() => console.log(`Gum ${catalog.version}\n\n${catalog.intro}`))

  program.command('list [collection]')
    .description('List page IDs and descriptions (elements, guides, or gallery)')
    .action((collection?: string) => print_index(list_docs(catalog, collection)))
  program.command('search <query...>')
    .description('Find references and examples by name or text')
    .option('-l, --limit <count>', 'Maximum number of results', '10')
    .action((query: string[], options: { limit: string }) => {
      const pages = search_docs(catalog, query.join(' '), Number(options.limit))
      if (pages.length) print_index(pages)
      else console.log('No matching documentation. Try fewer words or gum docs list.')
    })
  program.command('get <id>')
    .description('Read a reference page and its JSX example')
    .action((id: string) => {
      const page = get_doc(catalog, id)
      console.log(`Gum ${catalog.version} · ${page.id}\n\n${format_doc(page)}`)
    })
  program.command('example <id>')
    .description('Print JSX source, or export it with any required data files')
    .option('-o, --output <directory>', 'Write the JSX and fixtures into this directory (replaces existing files)')
    .action((id: string, options: { output?: string }) => write_example(get_doc(catalog, id), options.output))
  return program
}

export { create_docs_cli }
