#! /usr/bin/env bun

// Render Markdown (with embedded gum.jsx, images, and TeX math) in a kitty terminal

import { Command } from 'commander'
import { spawnSync } from 'child_process'
import { readFileSync, openSync, writeSync, closeSync } from 'fs'

import { displayMarkdown, type VirtualOptions } from '@gum-jsx/mark'
import { readStdin, queryCellSize } from '@gum-jsx/node'
import '../src/eval' // the math plugin on the default Env, for <Latex> in gum blocks

// Page through `less -R`: images go as kitty virtual placements straight to the tty (the
// pager would mangle the escapes), and the pager only sees the Unicode placeholder text
function displayPaged(content: string, opts: object): void {
  const cell: [number, number] = queryCellSize() ?? [ 10, 20 ]
  const columns = process.stdout.columns
  const images: string[] = []
  const virtual: VirtualOptions = { cell, columns, transmit: esc => images.push(esc) }
  const text = displayMarkdown(content, { ...opts, virtual })

  // ghostty keeps kitty image storage per screen (main vs alternate), so images sent on
  // the main screen are invisible to the placeholders less draws on the alternate screen:
  // switch to the alternate screen first so the transmissions land where they will be
  // looked up (less's own switch is then a no-op, and it restores the main screen on exit)
  const ALT_ON = '\x1b[?1049h', ALT_OFF = '\x1b[?1049l'
  // a single write() of megabytes to a tty can come up short, which would truncate an
  // escape mid-stream and corrupt every transmission after it — loop until it all lands
  const data = Buffer.from(ALT_ON + images.join(''))
  try {
    const tty = openSync('/dev/tty', 'w')
    let off = 0
    while (off < data.length) off += writeSync(tty, data, off, data.length - off)
    closeSync(tty)
  } catch {
    process.stdout.write(data)
  }

  // less ≥ 633 treats private-use chars as binary unless declared printable; without
  // this the U+10EEEE placeholders come out as reverse-video <U+10EEEE> caret notation
  const chardef = [ process.env.LESSUTFCHARDEF, '10eeee:p' ].filter(Boolean).join(',')
  const env = { ...process.env, LESSUTFCHARDEF: chardef }
  const result = spawnSync('less', ['-R'], { input: text, env, stdio: ['pipe', 'inherit', 'inherit'] })
  if (result.error) process.stdout.write(ALT_OFF + text)
}

// main program

const program = new Command()
program.name('gum-mark')
  .description('Markdown pager with embedded gum.jsx visualizations')
  .argument('[file]', 'Markdown file to render (reads from stdin if not provided)')
  .option('-t, --theme <theme>', 'theme to use for gum.jsx and math: light or dark', 'dark')
  .option('-I, --image-height <pixels>', 'max height for gum blocks and images (default: 500)', (value: string) => parseInt(value))
  .option('-H, --height <pixels>', 'target height for display math (default: 100)', (value: string) => parseInt(value))
  .option('-i, --inline-height <pixels>', 'target height for inline math (default: 48)', (value: string) => parseInt(value))
  .option('-p, --pager', 'page through less, with images as kitty Unicode placeholders')
  .action(async function(this: Command) {
    const [ file ] = this.args
    const { pager, ...opts } = this.opts()
    const content = file ? readFileSync(file, 'utf-8') : await readStdin()
    if (pager) {
      displayPaged(content, opts)
    } else {
      // the cell size lets PNG links be capped by terminal-side scaling (null off a tty)
      const cell = queryCellSize() ?? undefined
      process.stdout.write(displayMarkdown(content, { ...opts, cell }))
    }
  })
program.parse()
