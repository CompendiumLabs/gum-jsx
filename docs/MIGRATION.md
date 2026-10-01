# Migration from original Gum

gum-jsx is a ground-up rewrite, not a drop-in replacement for the original Gum
(`gum-old`). Layout follows a flexbox-like model with explicit sizes: parents own
allocation and position, and children answer layout requests with geometry. The
examples in [gum-jsx-docs](../gum-jsx-docs/README.md) use the current API exclusively.

This page maps original conventions onto current ones. [FEATURES](./FEATURES.md)
is the element-by-element inventory, [ROADMAP](./ROADMAP.md) records the layout
contracts and milestones, and [PLOTTING](./PLOTTING.md) and [MATH](./MATH.md)
cover those slices in detail.

## Release packages and runtimes

2.0 publishes only `@gum-jsx/*` packages. The workspace root remains private;
there is no new `gum-jsx` umbrella install. The CLI package supplies `gum`; `@gum-jsx/mark` supplies `gum-mark`, and React
supplies `gum-react`. The standalone `gum-tex` command has been retired.

The stable release uses coordinated `2.0.0` versions and the `latest` tag.
Most packages ship TypeScript source for Bun 1.4.2 or newer and supported browser
bundlers. PNG ships built JavaScript with embedded WebAssembly and also supports
Node 22+. The bundled npm CLI supports Node 24+ for built-in
rendering. Direct Node execution of the source-published
libraries is outside this contract.
The WASM renderer has been verified on Linux x64. macOS and Windows standalone
runtime verification remains outstanding. Core, math, maps, PDF, React, and PNG's package
root support browser bundlers.
See [RELEASE.md](./RELEASE.md) for artifact verification and remaining gates.

## Changes in 2.0.0

The following sections record the changes introduced during prerelease development.

### Changes from beta.3 to beta.4

- The npm CLI ships bundled JavaScript, fonts, and notices with no runtime
  package dependencies. Run built-in rendering under Node 24+ or Bun.
- Install `@gum-jsx/mark` separately for `gum-mark`. Its bundled command runs
  under Node.js 24+ or Bun 1.4.2+; the library exports retain their source API.
- Replace `gum-tex` with `gum` rendering a JSX file containing `Tex` or `Latex`,
  or use `@gum-jsx/math` export helpers.
- From the workspace root, use `bun gum-jsx-cli/src/cli.ts` for the CLI and
  `bun --filter @gum-jsx/edit dev` / `build` for the editor. Root shortcut
  scripts for these commands have been removed.

### Changes from beta.2 to beta.3

- **Breaking coordinates:** use atomic `pos={[x, y]}` or `pos={{x, y}}` instead
  of placement `x`/`y`. Projection callbacks take and return numeric records,
  or return `null` to omit a point. Named dimensions survive sampling and
  projection. See [coordinate migration](#coordinate-contract-migration) for
  single-axis placement, custom components, and geographic aliases.
- **Breaking PNG API:** replace `rasterize_svg` / `rasterize_pixels` and the old
  PNG subpaths with `render_png(fragment)` / `render_pixels(fragment)` from
  `@gum-jsx/png`. Crop with the `select` option; import `RasterSelection` from
  the package root. The synchronous tiny-skia WASM renderer needs no native
  addon, install script, host fonts, or separately served WASM file.
- CLI PNG/kitty, Markdown figures, and MCP rendering now use fragments directly.
  SVG supports `--text-mode live`; CLI raster and PDF exports always use glyph
  paths. Direct PNG rendering rejects live text and emoji without outlines.
  Export these as SVG for a browser with suitable fonts. See the
  [PNG limits](../gum-jsx-png/README.md#fragment-rendering) for supported paints,
  image sizes, and browser CSP requirements.
- Added built-in polar, isometric, orthographic, and perspective projections,
  `SymArrow`, and adaptive axis sizing. See the
  [projection guide](../gum-jsx-docs/docs/guides/text/projections.md).
- `Points` and `SymPoints` accept a single marker child as an alternative to
  `shape`. Explicit point fill/stroke styling is inherited by custom markers
  unless overridden. A child and `shape` cannot be supplied together.
- Layout, text, and WASM startup/rasterization performance improved. TitleBox
  background clipping and live SVG text handling were corrected.

### Changes from beta.1 to beta.2

- The CLI, editor, and MCP host now include `@gum-jsx/maps`: `GeoMap`, GeoJSON
  and TopoJSON sources, and bundled country/state atlases. Maps support filtering,
  feature styles, fitting, bounds, and projected child annotations. See the
  [maps guide](../gum-jsx-docs/docs/guides/text/maps.md).
- `Evaluator` holds reusable scope, seed, and source-name defaults. Evaluation
  returns the source's value; use `render_element` or `layout_element` separately
  for layout and rendering. A fresh local scope and random stream are created
  for each call; `evaluate_prelude` explicitly shares declarations.
- `Graph` supports record-to-record projections with explicit output-space limits;
  `GeoMap` supplies a fitted geographic projection to its children. See
  [projections](../gum-jsx-docs/docs/guides/text/projections.md).
- Fragments accept `clip_path` commands, including intersections with rectangular
  clips, in SVG and PDF. This is a fragment API; arbitrary element-level clip
  props and general masks remain deferred.
- `gum` accepts multiple JSX inputs in order as PDF pages; directories and
  multiple files default to PDF. With no viewport overrides, JSX receives a
  640 × 480 offer, while authored sizes and content sizing remain effective.
  The `--natural` option has been removed. A single explicit `-W` or `-H` leaves
  the other axis governed by source sizing or content. Standalone TeX retains
  natural sizing.
- Core and React now install the fontkit and reconciler declarations needed
  to typecheck their published TypeScript source in a strict consumer.

## Coordinate contract migration

The migration in [COORDS.md](./COORDS.md) changes Projection callbacks and direct
calls from pairs to records:

```jsx
// Before
const projection = new Projection(([x, y]) => [x + y, y])

// After
const projection = new Projection(({x, y}) => ({x: x + y, y}))
```

Direct calls now use `projection.project({x: 1, y: 2})`. Source tuple shorthand
is still accepted by marks and coordinate helpers; it always expands to `{x, y}`
before projection. Use `read_coordinate` to expand a tuple for a direct call.
The `PointPair` projection type is replaced by `Coordinate`, with
`CoordinateValue` for source shorthand and `CoordinatePosition` for data or
local-length positions.

Core coordinate helpers, annotation `pos` values, projected mark geometry, and
parametric `f(t)` samples preserve arbitrary numeric dimensions through a
projection. Points callbacks receive every source dimension. Use explicit Fill
boundary arrays for named coordinates; scalar boundaries and Field vector
arithmetic require Cartesian `{x, y}` sources. Samples with any nonfinite
dimension become gaps.

GeoMap children now accept `{lon, lat}` in degrees for both marks and `pos`.
`[longitude, latitude]` and `{x: longitude, y: latitude}` remain aliases. Both
components are required, and a record cannot mix geographic and Cartesian names.
Local lengths use Cartesian pairs. GeoJSON, TopoJSON, `GeoMap.center`, and the
geographic projection helpers keep their array formats.

The same contract works in evaluated JSX, React TSX, the editor, CLI, Markdown
gum blocks, and MCP rendering. React primitives retain constructor prop types,
including contextual numeric projection callbacks and inferred Points callback
fields. Tuple/object expressions and spreads need no JSX grammar changes.

Element placement now uses `pos={[x, y]}` or `pos={{x, y}}`. The `x` and `y`
props receive the same handling as other unknown props. A position override
replaces the entire value, so update component defaults and spreads together.
Custom components may consume `x` and `y` as input parameters, then produce
`pos` during construction.

An omitted `pos` uses the parent's unpositioned behavior. In Graph, explicit
`pos={[0, 0]}` maps data zero, while `pos={[px(0), px(0)]}` stays at local zero.
When migrating a single-axis Cartesian Graph annotation such as `x={v}`, use
`pos={[v, px(0)]}` to preserve the previously omitted local axis. Group and
Overlay can use `pos={[v, 0]}`. Node retains an explicit `[0, 0]` default.

## Props and elements

| Original convention | Current convention |
|---|---|
| Untagged em or stroke-unit lengths; `unit_size` | Explicit `px(...)` / `em(...)`; a raw number is always a fraction. There is no stroke-unit system |
| Svg `size` and an implicit 500px or 1000px canvas | `width` / `height` in `px(...)`; omitted axes hug the content |
| size / xsize / ysize / pos / rect | `width` / `height`; `pos` / `anchor` for direct **Group** children |
| Group contains its positioned children automatically | **Group** needs a finite canvas and its children never size it; **Overlay** hugs its first child and layers the rest |
| Rectangle | **Rect** |
| rounded | `border-radius` in JSX, or `border_radius` in constructor props |
| Box border / fill, with `border-*` and `fill-*` subunit attributes | `border-width` / `border-color` / `background` |
| Padding as a scalar, `[h, v]`, or `[left, top, right, bottom]` in em | `[h, v]` / `[t, b, l, r]`, `{ h, v }`, `{ t, b, l, r }`, or full side names; values are lengths. Note the different four-value order |
| Boolean padding, margin, border, and rounded | Explicit lengths; wrap in an outer **Box** for space outside the border |
| HWrap | **HStack** with `wrap`, `gap`, and `line-gap` |
| Stack with `direc` | **HStack** / **VStack**; there is no public Stack |
| Automatic stack figure fitting, share, even | Explicit `basis` / `grow` / `shrink` and chosen dimensions; **Spacer** for flexible space |
| spacing and direction-sensitive justify / valign | `gap`, cross-axis `align`, main-axis `justify`, and `align-self` on a direct child |
| Text scale / justify | `font-size` / `justify` |
| Text that scales down to fit its box | Text reflows at a fixed font size and reports overflow; set `fit` on it to scale the completed text |
| Bold / Italic wrappers | `font-weight` / `font-style` on **Text** or **Span** |
| TextBox / TextFrame / TextCol / TextRow | Same names; text reflows at the allocated width and font size stays fixed |
| LabelBox | A **TextBox**, content-sized by default |
| Absolute | Ordinary `px(...)` width and height |
| fit flag on an element | `fit` on a composition; whole standalone formulas shrink automatically |
| Line points as coordinate pairs | **Line** `from` / `to`; **Polyline** or **Polygon** `points`. All accept `[x, y]` or `{ x, y }` |
| SVG path strings and the MoveCmd / LineCmd / CubicSplineCmd constructors | **Path** commands built with move_to, line_to, quad_to, curve_to, close_path. Arc and corner commands are absent |
| Graph clones geometry into a coord | Explicit coordinate context; **CoordLine** and the plotting marks map their data |
| Untagged plot dimensions and prefixed styles | Pixel/em strokes and labels; scoped component props such as `tick-` and `label-`, or nested `*-style` objects |
| N symbolic samples | `samples`; functions execute once at construction and missing values create gaps |
| Element rotate / spin / transform shortcuts | Explicit **Rotate** / **TransformBox** wrappers |
| Env theme | `theme="light"` / `theme="dark"` on **Svg**, or a host default |

These are design correspondences, not mechanical renames. In particular, sizing
and alignment have different contracts, styles use a limited vocabulary, and
**Box** and **Svg** accept one content element.

JSX attributes accept dashes or underscores, so `border-width` and `border_width`
name the same prop. JavaScript objects and spreads use underscore keys. See
[JSX](../gum-jsx-docs/docs/guides/text/jsx.md) and
[Style](../gum-jsx-docs/docs/guides/text/style.md) for the prop vocabulary and
scoped component props.

Use the supported `text-*`, `title-*`, and axis scopes for generated children;
for example, `TextBox` needs `text-whitespace="pre"`, while `Text` takes
`whitespace="pre"`. Unknown prop names are not checked at runtime. Existing
value and layout checks still apply.

## Layout contracts

The original engine inferred sizes and aspects; the current one asks the author
to establish them. The rules most likely to surprise a ported figure are:

- A fractional width or height refers to the parent's established content box.
  A nonzero fraction on an axis that still hugs its content is a property-path
  error, not a guess. Use an absolute length on that axis or establish its size.
- `em(...)` refers to the element's resolved font size. While resolving
  `font-size` itself, it refers to the inherited font size.
- **Box** `width` and `height` measure the border box: content, padding, and
  border. Borders draw inside it, and there is no margin prop.
- Making a container smaller reflows, constrains, or records overflow. It never
  scales content or typography; `fit` explicitly scales a completed fragment (root maxima may also bound a preview).
- Stack `grow` and `shrink` default to zero, so nothing stretches unless asked.
  A tall **Svg** does not make a **VStack**'s children grow.
- Stacks do not solve for a composite aspect. A height-only column of unsized
  figures stays naturally sized unless the author supplies width or explicit flex.
- Flex props are read only by the immediate stack, and `pos` / `anchor` only
  by the immediate **Group**. They do not inherit or pass through wrappers.
- Shapes keep their pixel stroke width when resized. Square and Circle prefer a
  1:1 aspect; Rect and Ellipse fill both offered axes.
- Text is emitted as glyph outlines, so output needs no installed fonts and is
  not selectable. Emoji remain live text for the host's emoji font.

See [Units](../gum-jsx-docs/docs/guides/text/units.md),
[Sizing](../gum-jsx-docs/docs/guides/text/sizing.md),
[Stack](../gum-jsx-docs/docs/guides/text/stack.md), and
[layout choices](../gum-jsx-docs/docs/gallery/text/layout_choices.md) for natural
sizing versus explicit flex.

## Evaluation and rendering

Elements are immutable descriptions and no longer render themselves. A layout
pass produces fragments, and the serializer consumes fragments.

| Original convention | Current convention |
|---|---|
| evaluateGum(...).svg() | `render_element(evaluate(source))`, or evaluate → LayoutPass.layout → render_svg |
| evaluateGum `size` | A layout request, such as `make_request({ width: exact(400) })`, or **Svg** dimensions |
| evaluateGum `theme` and Svg arguments | render_element `defaults` / `overrides` viewport props |
| evaluateGum `bindings` | The evaluate `scope` option |
| evaluateGum `seed` | The evaluate `seed` option; each evaluation has its own stream |
| evaluateGum `prelude` | `evaluate_prelude(code)` returns bindings for `evaluate` scope; CLI decks load a manifest prelude |
| evaluateGum `strict`, `loadFile`, `debug` | Not ported |
| `gum.use(math)` plugin registration | `evaluate(source, { scope: math })` plus a `createMathFonts()` font resource on the pass |
| `new Square({ rounded: true })`, children always an array | `new Square({ border_radius: px(10) })`; `children` may be a single element |
| layoutRows / layoutSvg placement report | `inspect_fragment`, or the CLI's `tree` and `json` formats |
| rasterizeSvg from gum-jsx/render | `render_png(fragment)` / `render_pixels(fragment)` from @gum-jsx/png |

See [Rendering](../gum-jsx-docs/docs/guides/text/rendering.md),
[Math](../gum-jsx-docs/docs/guides/text/math.md), and
[custom elements](../gum-jsx-docs/docs/guides/text/custom_elements.md), which
replace the original element registration with `Element` subclasses and
`define_element`.

## Packages

| Original package | Current package |
|---|---|
| gum-jsx, the batteries-included package and commands | No umbrella re-export; import the scoped packages. [@gum-jsx/cli](../gum-jsx-cli/README.md) ships `gum`; install `@gum-jsx/mark` separately for `gum-mark` |
| @gum-jsx/core | [@gum-jsx/core](../gum-jsx-core/README.md) |
| @gum-jsx/math | [@gum-jsx/math](../gum-jsx-math/README.md), supplied as evaluation scope rather than a plugin |
| Geographic data and maps | [@gum-jsx/maps](../gum-jsx-maps/README.md), included by the CLI and available to library consumers |
| @gum-jsx/node | [@gum-jsx/png](../gum-jsx-png/README.md) for rasterization; kitty output lives in the CLI |
| @gum-jsx/react | [@gum-jsx/react](../gum-jsx-react/README.md): `GUM`, `<Gum>`, `createGumRoot`, and the `gum-react` command |
| @gum-jsx/pdf, asynchronous `renderPdf` over one or more pages | [@gum-jsx/pdf](../gum-jsx-pdf/README.md): synchronous `render_pdf(fragmentOrPages)` for one or more pages in Bun or a browser bundle |
| @gum-jsx/mark | [@gum-jsx/mark](../gum-jsx-mark/README.md): `displayMarkdown` and the `gum-mark` command |
| @gum-jsx/docs | [@gum-jsx/docs](../gum-jsx-docs/README.md): element pages, guides, gallery, and the generated skill |
| gum-mcp | Retired; use the [Gum authoring plugin](../plugins/gum-jsx/README.md). |
| @gum-jsx/web | Not ported. The [editor](../gum-jsx-edit/README.md) loads its own fonts; outlined SVG needs none |
| gum-jsx-viewer, the VS Code extension | Not ported |

## Command line

| Original option | Current option |
|---|---|
| `-s, --size` | `-W, --width` and `-H, --height` in pixels; omitted axes keep source sizing or hug the content |
| `-r, --raster-size` | `--ratio`, a sampling ratio that leaves layout unchanged |
| `-z, --zoom` with fractional `x0,y0,x1,y1` | `--select x,y,width,height` in source pixels, with `--ratio` to magnify |
| `-f layout`, `--depth`, `--select <text>` | `-f tree` or `-f json`, with `--stats` for layout counters |
| `-t, --theme`, dark by default | `--theme`; dark for kitty and light for every other format |
| `-b, --background` | `--background`; transparent unless given |
| `--strict`, `--seed`, `--dev`, decks | Not ported |
| — | `-f pdf` or a `.pdf` output filename |

Stdout still defaults to kitty graphics, and the output extension still selects
the format. See the [CLI guide](../gum-jsx-docs/prompt/cli.md#render-with-the-cli).

## Numeric helpers

The original core's public math, array, vector, complex, color, and random
helpers are available in JSX and as imports. See
[Math helpers](../gum-jsx-docs/docs/guides/text/math_helpers.md),
[Arrays](../gum-jsx-docs/docs/guides/text/arrays.md),
[Vectors](../gum-jsx-docs/docs/guides/text/vectors.md),
[Colors](../gum-jsx-docs/docs/guides/text/colors.md), and
[Random](../gum-jsx-docs/docs/guides/text/random.md) for the full reference.
A few contracts are deliberate:

- range uses an excluded stop and includes every step before it, including a
  final partial interval. Negative steps work; invalid sizes fail before allocation.
- linspace defaults to 101 values, a singleton at the start, and an included
  endpoint. A fourth false argument omits the endpoint.
- polar, polard, add2/sub2/mul2/div2, and lingrid return native `{ x, y }` points.
  Complex numbers remain `[real, imaginary]` pairs.
- reshape requires an exact element count, and N-dimensional arithmetic requires
  equal vector lengths. zip still stops at the shortest input.
- integer excludes its upper bound, matching range. Each evaluation has an
  independent seeded stream; use setSeed or the host's evaluate seed option.
- Color interpolation clamps to its endpoint colors. Generated arrays and points
  are frozen; user-owned objects are not frozen by these helpers.
- `tau` joins the original `e`, `pi`, `phi`, `r2d`, and `d2r` constants. The
  `moji` / `cmoji` are not ported. Math font constants such as `mathrm`,
  `mathbf`, and `mathbb` are exported by `@gum-jsx/math`.

## What has been ported?

Most of the original surface now has a counterpart, often with a different API:

- Plotting: [Graph](../gum-jsx-docs/docs/elements/text/Graph.md),
  [Plot](../gum-jsx-docs/docs/elements/text/Plot.md),
  [BarPlot](../gum-jsx-docs/docs/elements/text/BarPlot.md), axes, scales, meshes,
  legends, arrows, and [Spline](../gum-jsx-docs/docs/elements/text/Spline.md).
  Symbolic sampling lives in [SymLine](../gum-jsx-docs/docs/elements/text/SymLine.md)
  and its siblings, including [SymField](../gum-jsx-docs/docs/elements/text/SymField.md).
- Text and slides: [TextBox](../gum-jsx-docs/docs/elements/text/TextBox.md),
  [TextCol](../gum-jsx-docs/docs/elements/text/TextCol.md),
  [TextStack](../gum-jsx-docs/docs/elements/text/TextStack.md),
  [TextFigure](../gum-jsx-docs/docs/elements/text/TextFigure.md),
  [Bullets](../gum-jsx-docs/docs/elements/text/Bullets.md),
  [TitleFrame](../gum-jsx-docs/docs/elements/text/TitleFrame.md), and
  [Slide](../gum-jsx-docs/docs/elements/text/Slide.md). Emoji work in plain text.
- Diagrams: [Network](../gum-jsx-docs/docs/elements/text/Network.md) connects
  [Node](../gum-jsx-docs/docs/elements/text/Node.md) frames, or any element with
  an `id`, using [Edge](../gum-jsx-docs/docs/elements/text/Edge.md).
- Math: [Latex](../gum-jsx-docs/docs/elements/text/Latex.md),
  [Tex](../gum-jsx-docs/docs/elements/text/Tex.md), the full math element tree, and
  standalone math export helpers. See [Math](../gum-jsx-docs/docs/guides/text/math.md).
- Images and themes: [PngImage](../gum-jsx-docs/docs/elements/text/PngImage.md) and
  the light and dark palettes in [Themes](../gum-jsx-docs/docs/guides/text/themes.md).
- Hosts: the CLI with SVG, PNG, PDF, kitty, tree, and JSON output; React
  bindings; vector PDF; Markdown in the terminal; and the web editor.
- The old gallery figures, ported as showcases such as
  [Pendulum Physics](../gum-jsx-docs/docs/gallery/text/pendulum_physics.md) and
  [Transformer Architecture](../gum-jsx-docs/docs/gallery/text/transformer.md).

## What is not ported?

- Layout: the optional common-height figure policy and legacy Grid aspect/track
  inference. [Grid](../gum-jsx-docs/docs/elements/text/Grid.md) and TextGrid now use
  explicit column counts or length/auto track arrays with content-sized rows.
  Use `HStack wrap` or `TextRow wrap` for wrapping rows; there is no HWrap alias.
- Text: TextLine, Verbatim, and native selectable SVG text. Use `whitespace="pre"`
  with the `mono` family for preformatted text.
- Images and data: SvgImage, LoadImage, `loadFile`, and the parseTable /
  loadTable CSV helpers. SvgImage is explicitly deferred beyond 2.0; convert
  external SVG artwork to PNG and embed it with PngImage.
- Language: the legacy `{ elems, bindings, fonts }` plugin protocol and isolated
  Env, strict rendering mode, boolean shorthands for length props, and automatic
  wrapping of a top-level fragment or array. Hosts do wrap a single bare element
  in **Svg**. Use `Evaluator` scope for host-provided bindings.
- Plotting: axes use linear scales. Log and date scales, minor ticks, label
  collision avoidance, adaptive sampling, and discontinuity detection are not
  implemented.
- Geometry: arc and corner path commands, custom Spline endpoint directions,
  advanced ArrowHead barbs, general masks and arbitrary element-level clip props,
  and arbitrary SVG attributes beyond paint, dashes, and opacity. Custom fragment
  `clip_path` commands are supported in SVG and PDF.
- Networks: shared node and edge defaults through prefixed Network props, and
  node outlines beyond rounded rectangles and ellipses.
- Math: automatic equation numbering, explicit tags, and `CD` diagrams.
- Hosts: the browser export package, the VS Code extension, the zoomSvg helpers,
  `gum --dev` and PDF bookmarks.

The original placement conveniences (rect, pos, size, rad, xrect, yrect, expand)
and the public path command classes are retired rather than deferred.

For the full porting inventory, see the [feature map](./FEATURES.md).
