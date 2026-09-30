# Gum

Gum is a JSX language for vector graphics: plots, diagrams, mathematical figures,
and slides. Compose shapes, text, and TeX with measured layouts, then export SVG,
PNG, or PDF, or display the result directly in an image-capable terminal.

Use Gum as a command-line tool, a TypeScript library, or through its browser
editor and React bindings. JSX figures use ordinary JavaScript functions and data;
they do not require React.

[Start with the CLI](https://github.com/CompendiumLabs/gum-jsx-cli#readme) ·
[Documentation and gallery](https://compendiumlabs.ai/gum)

## Get started

For the 2.0 prerelease, use Node.js 24 or newer and install the bundled CLI:

```sh
npm install -g @gum-jsx/cli@beta
```

The CLI includes the core renderer, math, maps, and PNG/PDF exporters. It
provides the `gum` command. Plugins require Bun 1.4.2 or newer; built-in rendering
runs under Node without Bun.

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

Render it:

```sh
gum figure.jsx -o figure.svg
gum figure.jsx -o figure.png --ratio 2
gum figure.jsx -o figure.pdf
```

![Sine wave rendered from the JSX above](docs/images/readme-plot.svg)

Elements, units, and helpers such as `Plot`, `px`, `sin`, and `tau` are already in
scope. Use `px(24)` for pixels, `em(1.5)` for font-relative lengths, and fractions
such as `0.5` for relative sizes. Gum measures text and composes layouts with
boxes, stacks, and positioned canvases. Start with the
[units](gum-jsx-docs/docs/guides/text/units.md) and
[sizing](gum-jsx-docs/docs/guides/text/sizing.md) guides.

## Ways to use Gum

**Command line.** Omit `-o` to display a figure in a terminal supporting the kitty
graphics protocol. Use `-f svg` for SVG on stdout, or `-f tree --stats` to inspect
layout. The CLI includes math bindings:

```sh
gum figure.jsx
gum figure.jsx -f tree --stats
gum slides/ -o talk.pdf
```

PNG and terminal rendering use tiny-skia WebAssembly without native addons or
install scripts. Raster output uses outlined text; emoji without outlines and
external SVG images are unsupported. PDF output preserves vector paths and embedded PNG images;
text is outlined and is not searchable or selectable. See the
[CLI](gum-jsx-cli/README.md) and [PDF](gum-jsx-pdf/README.md) references for details.

**Browser editor.** From a [development checkout](#development), run `bun --filter @gum-jsx/edit dev`
and open the printed URL to edit JSX with a live SVG preview. The `/docs` page
provides searchable, editable examples.

**Library.** Evaluate JSX and render it to SVG from a Bun script:

```ts
import { evaluate, render_element } from '@gum-jsx/core'

const source = await Bun.file('figure.jsx').text()
const result = render_element(evaluate(source))
if (result.kind === 'svg') {
  await Bun.write('figure.svg', result.svg)
}
```

You can also construct elements directly in TypeScript. The core and math
renderers support browser hosts with preloaded font resources. Use
[@gum-jsx/math](gum-jsx-math/README.md) for TeX or
[@gum-jsx/react](gum-jsx-react/README.md) to compose figures as React components.
Evaluated JSX executes JavaScript in the host environment; use trusted source
or an application-provided isolation boundary.

**Coding agents and MCP.** From the workspace root, `bun run plugin:build` generates the
[plugin's authoring skill](plugins/gum-jsx/README.md) from the maintained
documentation. `bun run plugin:pack` rebuilds it and packages the plugin ZIP. The
[MCP server](gum-jsx-mcp/README.md) provides documentation tools, PNG inspection,
and an embedded figure viewer.

To install the beta plugin from GitHub:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx
codex plugin add gum-jsx@gum-jsx-beta
```

Start a new task after installation. Rendering uses the Gum CLI described above.

## Packages

Each package is a separate repository, developed together through Git submodules.

| Package | Purpose |
| --- | --- |
| [@gum-jsx/core](gum-jsx-core/README.md) | JSX evaluation, layout, shapes, text, plots, networks, and SVG output. |
| [@gum-jsx/math](gum-jsx-math/README.md) | TeX parsing, math layout, and standalone formula exports. |
| [@gum-jsx/png](gum-jsx-png/README.md) | Fragment rasterization to PNG or RGBA through WebAssembly. |
| [@gum-jsx/pdf](gum-jsx-pdf/README.md) | Vector PDF export from laid-out fragments. |
| [@gum-jsx/react](gum-jsx-react/README.md) | React bindings, headless rendering, and the `gum-react` command. |
| [@gum-jsx/mark](gum-jsx-mark/README.md) | Markdown terminal rendering with figures and math. |
| [@gum-jsx/cli](gum-jsx-cli/README.md) | The `gum` command. |
| [@gum-jsx/edit](gum-jsx-edit/README.md) | Browser editor and interactive documentation viewer. |
| [@gum-jsx/docs](gum-jsx-docs/README.md) | Guides, element references, gallery sources, and skill generation. |
| [@gum-jsx/mcp](gum-jsx-mcp/README.md) | MCP tools and an MCP Apps figure viewer. |

## Development

Clone the workspace and its package submodules:

```sh
git clone https://github.com/CompendiumLabs/gum-jsx.git
cd gum-jsx
git -c url."https://github.com/".insteadOf=git@github.com: submodule update --init --recursive
bun install
bun --filter @gum-jsx/png build
```

The submodule command uses HTTPS for the repository's SSH remotes, so a public
checkout does not require a GitHub SSH key.

Run shared commands from the workspace root:

```sh
bun run test          # Every package's suite, sequentially
bun run typecheck     # TypeScript checks across all packages
bun run perf          # Core, math, maps, and demos benchmarks, sequentially
bun --filter @gum-jsx/edit build # Production browser editor and docs viewer
bun run visual-test   # Searchable HTML report of rendered examples
bun run rehearse      # Publish to a temporary local registry and check fresh installs
bun run --cwd gum-jsx-cli test # Includes isolated npm CLI installation checks
```

To work on one package, use its scripts, for example
`bun --filter @gum-jsx/core test`. Package READMEs cover additional checks and
dependencies. The [design](docs/DESIGN.md), [roadmap](docs/ROADMAP.md), and
[feature map](docs/FEATURES.md) describe implementation decisions and planned work.
The [release checklist](docs/RELEASE.md) covers packaging and publication checks.

### Performance

```sh
bun run perf                 # All suites, measured sequentially
bun run perf:core            # Core only
bun run perf:math            # Math only
bun run perf:maps            # Maps only
bun run perf:demos           # Full JSX demos, split by rendering stage
bun run perf --list          # List case names without preparing fixtures
bun run perf --smoke         # Exercise every case twice without timing
bun run perf --filter '^core/layout/'
bun run perf --json > /tmp/gum-perf.json
```

Each of these packages also exposes `bun run perf` from its own directory, with
the same options. The suites use Mitata for warmup, sampling, and latency
statistics. Inputs are deterministic and maps use bundled atlases. Construction,
fresh-pass layout, SVG serialization, full renders, and cache hits have separate
cases so their costs can be compared. Fonts are warmed except in explicitly named
fresh-provider cases.

See the [core](gum-jsx-core/test/perf/README.md),
[math](gum-jsx-math/test/perf/README.md),
[maps](gum-jsx-maps/test/perf/README.md), and
[demos](gum-jsx-docs/test/perf/README.md) workload notes for exact timing boundaries.
Run on an idle machine, save JSON reports before and after a change, and compare
the same case names on the same hardware and Bun version. JSON timings are in
nanoseconds. Record Git revisions with reports and repeat runs to check noise;
performance results are separate from correctness tests.

Compare freezing modes with the regular benchmark commands:

```sh
GUM_FREEZE=1 bun run perf --json > /tmp/gum-freeze.json
GUM_FREEZE=0 bun run perf --json > /tmp/gum-no-freeze.json
GUM_FREEZE=0 bun run perf:demos
```

Run modes sequentially and alternate their order across repeats.

For production rendering, `NODE_ENV=production` disables runtime freezing while
retaining input snapshots and validation. `GUM_FREEZE=1` or `0` overrides the
default before Gum loads. Browser builds use `__GUM_FREEZE__`; Studio and the
MCP viewer configure this automatically. See the
[immutability policy](gum-jsx-core/API.md#immutability-policy).
`bun run test:immutability` runs the workspace tests with freezing both enabled
and disabled.

For a CPU profile of selected cases:

```sh
bun --cpu-prof --cpu-prof-dir=/tmp test/perf.ts --filter '^core/layout/'
```
