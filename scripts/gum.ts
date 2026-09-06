#! /usr/bin/env bun

import { Command, InvalidArgumentError } from 'commander'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { basename, dirname, resolve } from 'path'

import { evaluateGum, fitSize } from '../src/eval'
import { rasterizeSvg, formatImage, readStdin } from '@gum-jsx/node'
import { renderPdf } from '@gum-jsx/pdf'
import { Element, Group, validateZoom, zoomSvg, layoutSvg, LAYOUT_DEPTH } from '@gum-jsx/core'
import type { CliArgs, LoadFile, Rect } from '@gum-jsx/core/lib/types'
import { devCommand } from './dev'

type GumArgs = Omit<CliArgs, 'format'> & {
  files: string[]
  format: CliArgs['format'] | 'pdf'
}

//
// argument transform
//

// a zoom region as four comma (or space) separated fractions: "0,0,0.5,0.5"
function parseZoom(value: string): Rect {
  const zoom = value.split(/[\s,]+/).filter(s => s.length > 0).map(Number)
  const problem = validateZoom(zoom)
  if (problem != null) throw new InvalidArgumentError(problem)
  return zoom as Rect
}

function transformArgs(cmd: Command) {
  const files0 = cmd.args
  let { format, output, theme, background, size, unitSize, rasterSize, dev, strict, seed, zoom, depth, select } = cmd.opts()

  // add white background for light theme
  if (theme == 'light' && background == null) background = 'white'

  // auto-detect format for output
  if (format == null) {
    if (output == null) {
      format = 'kitty'
    } else {
      if (output.endsWith('.svg')) format = 'svg'
      if (output.endsWith('.png')) format = 'png'
      if (output.endsWith('.pdf')) format = 'pdf'
    }
  }

  if (format !== 'pdf' && files0.length > 1) {
    throw new InvalidArgumentError('Multiple inputs are only supported for PDF output')
  }

  // make loadFile function
  const files = files0.map(file => resolve(file))
  const file = files[0]
  const cwd = file != null ? dirname(file) : process.cwd()
  const loadFile = loadFileFrom(cwd)

  return { files, file, format, output, theme, background, size, unitSize, rasterSize, dev, strict, seed, zoom, depth, select, loadFile } as GumArgs
}

//
// convert to JSON
//

function convertToTree(elem: Element): any {
  const type = elem.constructor.name
  const args = elem.args
  if (elem instanceof Group) {
    const { children, ...args1 } = args
    const children1 = elem.children.map(convertToTree)
    return { type, children: children1, ...args1 }
  }
  return { type, ...args }
}

//
// run command
//

function loadFileFrom(cwd: string): LoadFile {
  return function loadFile(path: string, encoding: string = 'utf8') {
    const file = resolve(cwd, path)
    return encoding == 'bytes'
      ? readFileSync(file)
      : readFileSync(file, encoding as BufferEncoding)
  }
}

function pdfInputFiles(inputs: string[]): string[] {
  const order = new Intl.Collator('en', { numeric: true })
  return inputs.flatMap(input => {
    if (!statSync(input).isDirectory()) return [input]
    const files = readdirSync(input, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.jsx'))
      .map(entry => entry.name)
      .sort(order.compare)
      .map(name => resolve(input, name))
    if (!files.length) throw new Error(`No JSX files in ${input}`)
    return files
  })
}

async function pdfOutput(args: GumArgs): Promise<Buffer> {
  const { files: inputs, output, theme, background, size: size0 = 1000, unitSize, strict, seed, zoom } = args
  const files = pdfInputFiles(inputs)
  const outputPath = output == null ? undefined : resolve(output)
  if (outputPath != null && files.includes(outputPath)) throw new Error('The output must not overwrite an input file')

  const pages = files.length === 0
    ? [{
        element: evaluateGum(await readStdin(), { size: size0, unit_size: unitSize, theme, strict, seed, loadFile: loadFileFrom(process.cwd()) }),
        baseDir: process.cwd(),
      }]
    : files.map(file => {
        try {
          const element0 = evaluateGum(readFileSync(file, 'utf8'), {
            size: size0,
            unit_size: unitSize,
            theme,
            strict,
            seed,
            loadFile: loadFileFrom(dirname(file)),
          })
          return { element: zoom == null ? element0 : zoomSvg(element0, zoom), baseDir: dirname(file) }
        } catch (error) {
          throw new Error(`${file}: ${(error as Error).message}`, { cause: error })
        }
      })
  if (files.length === 0 && zoom != null) pages[0]!.element = zoomSvg(pages[0]!.element, zoom)

  return Buffer.from(await renderPdf(pages, {
    title: output == null ? undefined : basename(output, '.pdf'),
    background,
  }))
}

async function runCommand(args: GumArgs) {
  const { file, files, format, output, theme, background, size: size0 = 1000, unitSize, rasterSize, dev, strict, seed, zoom, depth, select, loadFile } = args

  // divert to dev command if update is on
  if (dev) {
    if (format === 'pdf') throw new Error('PDF is not supported with --dev')
    devCommand(args as CliArgs)
    return
  }

  if (format === 'pdf') {
    const out = await pdfOutput(args)
    if (output) writeFileSync(output, out)
    else process.stdout.write(out)
    return
  }

  // wait for stdin
  const code = file ? readFileSync(file, 'utf-8') : await readStdin()

  // evaluate gum with size
  const elem0 = evaluateGum(code, { size: size0, unit_size: unitSize, theme, strict, seed, loadFile })

  // crop to the zoom region for the image formats (the layout listing works on
  // the unzoomed element, with zoom as a filter; the json tree has no view)
  const elem = (zoom != null && (format == 'svg' || format == 'png' || format == 'kitty')) ? zoomSvg(elem0, zoom) : elem0

  // rasterize output
  let out: string | Buffer
  if (format == 'json') {
    const tree = convertToTree(elem)
    out = JSON.stringify(tree, null, 2)
  } else if (format == 'layout') {
    out = layoutSvg(elem, { zoom, depth, select }) + '\n'
  } else if (format == 'svg') {
    out = elem.svg()
  } else if (format == 'png' || format == 'kitty') {
    let svg = elem.svg()
    if (rasterSize != null) {
      const [ rasterWidth, rasterHeight ] = fitSize(elem.size, rasterSize)
      const elem1 = elem.clone({ width: rasterWidth, height: rasterHeight })
      svg = elem1.svg()
    }
    const dat = rasterizeSvg(svg, { background })
    out = (format == 'kitty') ? (formatImage(dat) + '\n') : dat
  } else {
    throw new Error(`Unsupported output format: ${format}`)
  }

  // write output
  if (output) {
    writeFileSync(output, out)
  } else {
    process.stdout.write(out)
  }
}

// main program

const program = new Command()
program.name('gum')
  .description('gum.jsx command line tools')
  .argument('[files...]', 'gum.jsx files to render (PDF accepts multiple files or directories; otherwise reads one file or stdin)')
  .option('-d, --dev', 'live update display', false)
  .option('--strict', 'throw on rendering fallbacks instead of drawing them', false)
  .option('--seed <seed>', 'seed for random/uniform/normal/integer', (value: string) => parseInt(value))
  .option('-f, --format <format>', 'format to output: svg, png, pdf, kitty, layout, json (default: kitty, or inferred from the output file)')
  .option('-t, --theme <theme>', 'theme to use', 'dark')
  .option('-b, --background <background>', 'background color')
  .option('-s, --size <size>', 'SVG/viewBox size', (value: string) => parseInt(value))
  .option('-u, --unit-size <size>', 'image size at which stroke_width = 1 is one pixel (default: 1000)', (value: string) => parseInt(value))
  .option('-r, --raster-size <size>', 'max rasterized PNG size', (value: string) => parseInt(value))
  .option('-z, --zoom <region>', 'region to zoom into, as x0,y0,x1,y1 fractions of the figure from the top left (magnified to fill the output size; a filter for the layout format)', parseZoom)
  .option('--depth <levels>', `layout format: how many levels below the root to list (default: ${LAYOUT_DEPTH})`, (value: string) => parseInt(value))
  .option('--select <text>', 'layout format: only list elements whose path, type, id, or class contains this text')
  .option('-o, --output <output>', 'output file')
  .action(async function(this: Command) {
    const args = transformArgs(this)
    await runCommand(args)
  })
try {
  await program.parseAsync()
} catch (error) {
  console.error(`gum: ${(error as Error).message}`)
  process.exitCode = 1
}
