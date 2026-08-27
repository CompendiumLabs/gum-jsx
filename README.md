# gum-jsx

The batteries-included [gum.jsx](https://github.com/CompendiumLabs/gum.jsx): a JSX vector graphics language that evaluates to SVG, designed for plots, diagrams, flow charts, and more. This package bundles the pure libraries — [`@gum-jsx/core`](https://www.npmjs.com/package/@gum-jsx/core) (the evaluator and elements), [`@gum-jsx/math`](https://www.npmjs.com/package/@gum-jsx/math) (LaTeX), [`@gum-jsx/node`](https://www.npmjs.com/package/@gum-jsx/node) (PNG rasterizing and terminal output), and [`@gum-jsx/mark`](https://www.npmjs.com/package/@gum-jsx/mark) (Markdown to terminal) — and ships the `gum`, `gum-tex`, and `gum-mark` commands.

## Installation

```bash
bun i gum-jsx
```

Add a `-g` flag to install globally and get the commands on your `PATH`. If you only need the evaluator in a browser or a server, install `@gum-jsx/core` (and whichever of the others you use) instead; nothing in `@gum-jsx/*` is node-specific except `@gum-jsx/node` and `@gum-jsx/mark`.

## Library Usage

```javascript
import { evaluateGum } from 'gum-jsx/eval'          // with <Latex> and friends registered
import { rasterizeSvg, formatImage } from 'gum-jsx/render'
import { mathToSvg, mathToPng } from 'gum-jsx/math'
import { displayMarkdown } from 'gum-jsx/mark'

const svg = evaluateGum('<Plot xlim={[0, 2*pi]} ylim={[-1.5, 1.5]} grid><SymLine fy={sin} stroke={blue} /></Plot>').svg()
const png = rasterizeSvg(svg, { size: 800, background: 'white' })
```

`gum-jsx` itself re-exports everything from the four libraries (`import { Plot, Latex, rasterizeSvg, displayMarkdown } from 'gum-jsx'`), and importing any of its entry points registers the math elements and fonts. See the individual packages' READMEs for the library APIs.

## Command Line

You can use the `gum` command to convert `gum.jsx` into SVG text or PNG data. You can even just display it directly in the terminal. For the latter you need a terminal that supports images, such as `ghostty` or `kitty`. There are a bunch of code examples in `docs/code/` and `gala/code/` of `@gum-jsx/docs` to try out.

Generate an SVG from a `gum.jsx` file:

```bash
gum input.jsx -o output.svg
```

Generate a PNG from a `gum.jsx` file:

```bash
gum input.jsx -o output.png
```

Display a `gum.jsx` file in the terminal:
```bash
gum input.jsx
```

CLI options:

| Option | Description | Default |
|--------|-------------|---------|
| `file` | Gum JSX file to render | stdin |
| `-s, --size <size>` | SVG/viewBox size in pixels | 1000 |
| `-t, --theme <theme>` | Theme: `light` or `dark` | light |
| `-b, --background <color>` | Background color | white |
| `-f, --format <format>` | Format: `json`, `svg`, `png`, `kitty` | auto |
| `-o, --output <output>` | Output file | stdout |
| `-r, --raster-size <size>` | Max rasterized PNG size | auto |
| `-d, --dev` | Live update display | off |
| `--strict` | Throw on rendering fallbacks instead of drawing them | off |
| `--seed <seed>` | Seed for `random`/`uniform`/`normal`/`integer` | 42 |

## Math and Markdown

```bash
gum-tex '\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}' -o sum.svg   # LaTeX to SVG/PNG/terminal (see @gum-jsx/math)
gum-mark notes.md -t light -w 800                                        # Markdown in a kitty terminal (see @gum-jsx/mark)
```

## Development

```bash
bun scripts/test.ts            # render every docs, gala and test example in strict mode
bun scripts/test.ts --report   # also write test/data for the report browser
bun run report                 # browse the report at the printed URL
```

The Claude skill for writing gum.jsx lives in `@gum-jsx/docs`, generated from the docs and gallery there (`bun run skill` in that package, which writes `skills/gum-jsx` and zips it to `skills/gum-jsx.skill`).
