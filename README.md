# Gum

Gum is a JSX language for vector graphics: plots, diagrams, mathematical figures,
and slides. Compose shapes, text, and TeX with measured layouts, then export SVG,
PNG, or PDF, or display the result directly in an image-capable terminal.

Use Gum as a command-line tool, a TypeScript library, or through its browser
editor and React bindings. JSX figures use ordinary JavaScript functions and data;
they do not require React.

[Getting started](gum-jsx-docs/docs/gallery/text/Gum.md) ·
[Documentation and gallery](gum-jsx-docs/README.md) ·
[CLI reference](gum-jsx-cli/README.md)

## Get started

This repository contains the current Gum implementation as a Bun workspace.
2.0 publishes the scoped `@gum-jsx/*` packages; the workspace root, editor, and
MCP application remain private. The release candidate is being prepared as
`2.0.0-beta.0`; use a checkout until it is published.
Install Bun 1.4.2 or newer and Git, then clone the workspace and its packages:

```sh
git clone https://github.com/CompendiumLabs/gum-jsx.git
cd gum-jsx
git -c url."https://github.com/".insteadOf=git@github.com: submodule update --init --recursive
bun install
```

The submodule command uses HTTPS for the repository's SSH remotes, so a public
checkout does not require a GitHub SSH key. If you already cloned recursively,
only `bun install` is needed.

Save this as `figure.jsx`:

```jsx
<Plot
  width={px(640)}
  aspect={2}
  font-size={px(18)}
  title="Sine wave"
  xlabel="x"
  ylabel="sin(x)"
  xlim={[0, tau]}
  ylim={[-1.5, 1.5]}
  background="white"
>
  <SymLine
    fy={sin}
    xlim={[0, tau]}
    samples={161}
    stroke={blue}
    stroke-width={px(2)}
  />
</Plot>
```

Render it from the workspace root:

```sh
bun run gum figure.jsx -o figure.svg
bun run gum figure.jsx -o figure.png --ratio 2
bun run gum figure.jsx -o figure.pdf
```

![Sine wave rendered from the JSX above](docs/images/readme-plot.svg)

Elements, units, and helpers such as `Plot`, `px`, `sin`, and `tau` are already in
scope. Use `px(24)` for pixels, `em(1.5)` for font-relative lengths, and fractions
such as `0.5` for relative sizes. Gum measures text and composes layouts with
boxes, stacks, and positioned canvases. Start with the
[units](gum-jsx-docs/docs/gallery/text/Units.md) and
[sizing](gum-jsx-docs/docs/gallery/text/Sizing.md) guides.

## Ways to use Gum

**Command line.** Omit `-o` to display a figure in a terminal supporting the kitty
graphics protocol. Use `-f svg` for SVG on stdout, or `-f tree --stats` to inspect
layout. The CLI includes math and Markdown commands:

```sh
bun run gum figure.jsx
bun run gum figure.jsx -f tree --stats
bun run gum-tex 'e^{i\pi}+1=0' -o euler.svg
bun run gum-mark notes.md
```

PNG and terminal rendering use node-canvas, which needs its native dependencies
and SVG support. PDF output preserves vector paths and embedded PNG images;
text is outlined and is not searchable or selectable. See the
[CLI](gum-jsx-cli/README.md) and [PDF](gum-jsx-pdf/README.md) references for details.

**Browser editor.** Run `bun run dev` and open the printed URL to edit JSX with a
live SVG preview. The `/docs` page provides searchable, editable examples.

**Library.** Evaluate JSX and render it to SVG from a Bun script in this workspace:

```ts
import { evaluate, render_element } from '@gum-jsx/core'

const source = await Bun.file('figure.jsx').text()
const result = render_element(evaluate(source))
if (result.kind === 'svg') {
  await Bun.write('figure.svg', result.svg)
}
```

This checkout example imports the local source entry point. In a consuming
workspace package, declare `@gum-jsx/core` as a dependency and import from
`@gum-jsx/core`. You can also construct elements directly in TypeScript. The core and math
renderers support browser hosts with preloaded font resources. Add
[@gum-jsx/math](gum-jsx-math/README.md) for TeX or
[@gum-jsx/react](gum-jsx-react/README.md) to compose figures as React components.
Evaluated JSX executes JavaScript in the host environment; use trusted source
or an application-provided isolation boundary.

**Coding agents and MCP.** `bun run skill` builds a portable authoring skill from
the maintained documentation. The [MCP server](gum-jsx-mcp/README.md) provides
documentation tools, PNG inspection, and an embedded figure viewer.

## Packages

Each package is a separate repository, developed together through Git submodules.

| Package | Purpose |
| --- | --- |
| [@gum-jsx/core](gum-jsx-core/README.md) | JSX evaluation, layout, shapes, text, plots, networks, and SVG output. |
| [@gum-jsx/math](gum-jsx-math/README.md) | TeX parsing, math layout, and standalone formula exports. |
| [@gum-jsx/png](gum-jsx-png/README.md) | SVG rasterization to PNG or RGBA through node-canvas. |
| [@gum-jsx/pdf](gum-jsx-pdf/README.md) | Vector PDF export from laid-out fragments. |
| [@gum-jsx/react](gum-jsx-react/README.md) | React bindings, headless rendering, and the `gum-react` command. |
| [@gum-jsx/mark](gum-jsx-mark/README.md) | Markdown terminal rendering with figures and math. |
| [@gum-jsx/cli](gum-jsx-cli/README.md) | The `gum`, `gum-tex`, and `gum-mark` commands. |
| [@gum-jsx/edit](gum-jsx-edit/README.md) | Browser editor and interactive documentation viewer. |
| [@gum-jsx/docs](gum-jsx-docs/README.md) | Guides, element references, gallery sources, and skill generation. |
| [@gum-jsx/mcp](gum-jsx-mcp/README.md) | MCP tools and an MCP Apps figure viewer. |

## Release packages

Once the candidate is published, install the commands with
`bun install -g @gum-jsx/cli@beta`, or add the library packages you need with
`bun add @gum-jsx/core@beta @gum-jsx/math@beta`. React's CLI comes from
`@gum-jsx/react@beta`. There is no 2.0 umbrella `gum-jsx` package.

Packages ship TypeScript source for Bun and compatible browser bundlers. Direct
Node execution is not part of the 2.0 support contract. Browser hosts must arrange
font assets and preload them before layout. See the
[release checklist](docs/RELEASE.md) for packaging commands and remaining gates.

## Development

Run shared commands from the workspace root:

```sh
bun run test          # Every package's suite, sequentially
bun run typecheck     # TypeScript checks across all packages
bun run build         # Production browser editor and docs viewer
bun run visual-test   # Searchable HTML report of rendered examples
```

To work on one package, use its scripts, for example
`bun --filter @gum-jsx/core test`. Package READMEs cover additional checks and
dependencies. The [design](docs/DESIGN.md), [roadmap](docs/ROADMAP.md), and
[feature map](docs/FEATURES.md) describe implementation decisions and planned work.
For code written against earlier Gum versions, see the
[migration notes](docs/MIGRATION.md).
