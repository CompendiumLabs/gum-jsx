---
name: gum-jsx
description: Create and revise SVG diagrams, plots, mathematical figures, and slides using Gum's JSX language. Use for authoring or debugging Gum figures, not general React or HTML development.
---

# Gum

Gum describes figures with JavaScript and JSX, then measures and renders them as
SVG. It is not React, HTML, or a browser DOM. For environment setup, follow
the instructions on CLI setup below before searching for or installing Gum.

Use the references for supported components and properties. Preserve the
user's chosen data, visual intent, and output format. Ordinary functions returning
elements are the simplest way to make reusable components.

## Source format

A single bare JSX element is returned automatically. With declarations or other
statements, finish with an explicit `return`. Return one element for a figure;
rendering hosts wrap a bare root in `Svg`. Put design dimensions and base
font props on that root. Use an explicit `Svg` when you need viewport control;
its width and height accept pixels only (`px(640)` or `"640px"`), or can be omitted
to hug content. The evaluator supplies elements, `px`, `em`, palette constants,
and numeric helpers. Math bindings are supplied by the rendering host as well.

Gum source runs as a function body, not an imported module. Do not put static
imports in an evaluated `.jsx` file. JSX attribute dashes become underscores:
`font-size` reaches a component as `font_size`. Use underscore keys in JavaScript
objects and spread props; camelCase is not normalized. Unknown SVG/CSS attributes
are not automatically forwarded.

For example, a rounded frame around a circle needs no fixed outer viewport:

```jsx
<Frame font-size={px(20)} padding={em(0.75)} border-radius={em(0.4)}>
  <Circle width={em(5)} fill={blue} stroke={none} />
</Frame>
```

For repeated elements, use ordinary components and array helpers. Put layout
props on the component's outer element so its parent can allocate it:

```jsx
const Card = ({ label, color, ...props }) => (
  <TextFrame padding={em(0.75)} border-color={color} {...props}>
    <Text color={color}>{label}</Text>
  </TextFrame>
)
return (
  <TextBox width={px(440)} font-size={px(20)} padding={em(0.75)}>
    <HStack gap={em(0.75)}>
      <Card label="Input" color={blue} grow={1} />
      <Card label="Output" color={red} grow={1} />
    </HStack>
  </TextBox>
)
```

Keep nested JSX and compound math operands on separate, indented lines. `range`,
`linspace`, `zip`, and array `.map()` are useful for repeated geometry. `linspace`
includes the endpoint by default; pass `false` as its fourth argument for periodic samples.
Use `setSeed` when a generative figure should be repeatable.

Use `Latex` for display math and `Tex` inside `Text` for inline formulas. In a
JavaScript string expression, use `String.raw` for TeX backslashes, for example
``<Tex>{String.raw`\frac{a}{b}`}</Tex>``, without surrounding `$` delimiters.

## Design philosophy

Gum code should express the structure of a figure and let the layout system do
the measuring and positioning. Strive for the simplest, most elegant composition
that preserves the visual intent and is easy to reuse. Hard-coded dimensions and
positions are a last resort, not the starting point.

- Use layout classes whenever feasible. Compose `HStack`, `VStack`, `TextCol`,
  `Box`, and `Frame` for rows, columns, spacing, and decoration. Use higher-level
  elements such as `Slide`, `TextFigure`, and `Plot` for the structures they
  already understand. Read their documented examples before inventing a layout.
- Express relationships instead of coordinates. Let content determine natural
  sizes; use `grow`, `gap`, alignment, and fill sizing to distribute available
  space. For a note at the bottom of a panel, put flexible content above it in a
  column rather than assigning the note a y coordinate. Let titles and captions
  be measured instead of subtracting guessed heights from a canvas.
- Establish the outer design size and base typography where needed, then use
  `em` for internal spacing and type scales. Use fractions and aspect ratios for
  meaningful proportional relationships. Replacing pixel coordinates with `em`
  coordinates alone does not make a layout compositional.
- Reuse design decisions. Extract repeated structures into small components,
  share palette and typography choices, and generate repeated content from data.
  Forward layout props to a component's outer element so it remains useful in
  different containers. Prefer a few clear abstractions over copied markup or
  wrappers that add no useful behavior.
- Reserve explicit coordinates and fixed sizes for genuine geometric or output
  requirements, such as data positions, a physical page size, or a diagram whose
  placement carries meaning. When layout classes cannot express the requirement,
  keep the manual geometry local and derive related values from shared parameters.

Judge the source as well as the rendered result. A polished picture with brittle
code is an unfinished example. Check that changes to text, content count, or
viewport size are handled by the layout rather than requiring a new set of
hand-tuned offsets.

## Layout and styling essentials

- Lengths accept `px(24)` / `"24px"` and `em(1.5)` / `"1.5em"`.
  `"50%"` and `0.5` use the property's established fraction
  reference. `width={100}` is not 100 pixels. Quoted JSX attributes work directly,
  including `font-size="24px"` and `padding="1em"`. Zero, including `"0"`, needs no
  reference. Nonzero unitless strings and boolean padding are not supported.
- Font weights accept numbers or names: `font-weight="bold"`, `{bold}`, and
  `{700}` are equivalent. `"light"` is 300; `"regular"` and `"normal"` are 400.
- For a standalone figure, set a design height and base `font-size` on its outer
  element; `aspect` can supply the width. Viewers scale the completed SVG for
  display, including text and strokes. Use ems for descendant typography,
  padding, gaps, and details. Content-sized figures may omit outer dimensions.
- Boxes, frames, stacks, `TextBox`, `TextFrame`, and `TextCol` are content-sized
  by default. Use `width="fill"` or `height="fill"` only to occupy an offer;
  `width={1}` requires an established parent width. Fill is not a length unit.
  Omit dimensions for content sizing; there is no content-sizing keyword.
- `align="fill"` allocates automatic child dimensions while respecting explicit
  sizes and limits; `align="stretch"` imposes the allocation even on sized children.
  Use `align-self` on a direct child to override its parent's alignment. A child's
  own `width="fill"` still fills the offer.
- Whole standalone formulas shrink automatically when needed; inline formulas
  and nested atoms keep their normal scale. `fit={false}` disables this behavior.
  Put `fit` directly on a fixed composition to measure naturally and
  shrink the complete drawing when needed. It hugs the scaled result; ordinary
  text still reflows unless fitting is requested. `fit="contain"` also enlarges;
  `fit="cover"` fills and crops. No fitting wrapper is needed. Authored dimensions
  describe the natural drawing; host offers and maxima bound the fitted result.
- A `Box` contains one element. Wrap siblings in `HStack`, `VStack`, or `Group`.
  Use `padding`, `border-width`, `border-color`, `border-radius`, and `background` for
  its decoration. `fill` and `stroke` instead inherit to child shapes. `Text`
  uses `color`, not `fill`. Use `justify` for text inside its allocated box.
  Padding tuples are `[horizontal, vertical]` or `[top, bottom, left, right]`;
  use named sides when that is clearer.
- Stack `gap` separates items, `align` controls the cross axis, and `justify`
  controls the main axis. Set `grow`, `shrink`, and optional `basis` on direct
  children for flex allocation. Main-axis fractions use the stack length after
  gaps: two half-width children tile an established row. Unsized children with
  equal `grow` weights share the remaining budget from zero bases; use
  `basis="auto"` for content-based growth. Flex props do not pass through wrappers.
  `HStack wrap` makes multiple rows; give growing cards a `basis` or `min-width`
  to control row breaks.
- Every element accepts `aspect` as preferred allocated width divided by height.
  One established dimension derives the other; naturally sized content grows
  its allocation to the ratio. Two exact dimensions and conflicting limits take
  precedence. Aspect does not scale fonts or drawings; use `fit` for that.
  Stacks do not infer a composite aspect from their children.
- `Grid columns={3}` shares equal column widths across rows, dividing an offered
  width or using the widest natural cell. A track array such as
  `columns={[em(6), "auto", em(12)]}` uses explicit and content-sized widths.
  `column-gap` and `row-gap` override `gap`; rows hug their tallest wrapped cell.
  Alignment defaults to horizontal fill and vertical start; `align="fill"`
  also fills automatic cell heights. `TextGrid` converts strings/numbers and
  defaults to em-based gaps. Use `<Box />` for an intentional blank cell.
  Numeric tracks are fractions, not weights. Cell percentage heights cannot
  size content-based rows; use absolute lengths or fill/stretch instead.
- `Group` is a finite positioning canvas, not a content-hugging box. Establish
  both axes with dimensions, finite offers, or one dimension plus aspect. Its
  children use `pos={[x, y]}` or `pos={{x, y}}` and `anchor`, with top-left origin and y pointing down.
  With `pos`, the default anchor is `"center"`; use `anchor="start"` for top-left
  placement. Without `pos`, children default to a start anchor at the local origin.
  In `Graph`, `Plot`, and `Network`, bare numeric positions are data coordinates,
  with y pointing up by default. Unit strings and `px`/`em` positions are local
  lengths; widths and font sizes also use layout units. Give positioned shapes
  explicit sizes: each receives an offer for the whole canvas.
- Projected Graph marks, annotations, and parametric `f(t)` samples accept named
  numeric records such as `{theta, r}` or `{x, y, z}`. Projection callbacks map
  records to records or null; Graph needs final `x` and `y` plus explicit limits.
  GeoMap children use `{lon, lat}` in degrees; `[longitude, latitude]` and `{x, y}`
  remain aliases. Keep one complete naming scheme per geographic record. Local
  tagged lengths still use Cartesian pairs. Use two explicit Fill boundary
  arrays for named coordinates; scalar baselines and Field vectors are Cartesian.
- Scoped props such as `title-font-size`, `xaxis-label-color`, and `head-open`
  configure parts created by their owner. Use only the scopes in that owner's
  reference. Function-valued sampling props such as `SymLine fy` are consumed
  during construction; callbacks are not arbitrary mutable layout state.

Use shared palette constants such as `blue`, `red`, `green`, `gray`, and `none`,
or semantic theme paints such as `"theme:accent"`. Themes do not paint backgrounds;
set `background` when needed. Text retains its font size during ordinary layout,
so wrapping, usable width, and space for labels matter. Keep padding for ink
overhang; the outer SVG clips at its viewport.

Consult each component's reference for its layout controls: for example, `Box`
uses padding for spacing around its content, while `Plot` also has a `margin`.
Use `HStack` and `VStack` for rows and columns, `Grid` for shared columns across
rows, and `Group` for positioned geometry.

## References

Read the relevant pages when choosing components or resolving a layout question;
there is no need to load the entire catalog. Each reference includes its
runnable JSX example.

- [Guides](references/guides.md): the language, units, sizing, styles, helpers,
  fonts, math setup, and host rendering APIs.
- [Elements by category](references/elements.md): layout, geometry, plotting,
  maps, networks, text, math, video, and external images, including `PngImage`.
- [Gallery](references/gallery.md): complete figures and focused examples,
  grouped by category. Start from a close example when it fits the request.

Useful starting points:

- Layout: [Units](references/guides/units.md), [Sizing](references/guides/sizing.md),
  [Positioning](references/guides/positioning.md), [Fitting](references/guides/fitting.md),
  [Stacks](references/guides/stack.md),
  [Box](references/elements/layout.md#Box), [Grid](references/elements/layout.md#Grid), and
  [Group](references/elements/layout.md#Group).
- Plots: [Plot](references/elements/plotting.md#Plot), [Graph](references/elements/plotting.md#Graph),
  [SymLine](references/elements/plotting.md#SymLine), and [BarPlot](references/elements/plotting.md#BarPlot).
  Plot axes use linear scales. `bounds="frame"` sizes and aligns the data area;
  leave space for the labels and titles outside it.
  [Projections](references/guides/projections.md) covers polar Graph callbacks
  and geographic marks. Supply explicit output limits and sampled paths.
- Maps: [Making maps](references/guides/maps.md) walks through sources, styles,
  views, and annotations. [GeoMap](references/elements/maps.md#GeoMap) documents the
  element and its helpers. Start with `world_countries()` or `us_states()`;
  nest markers and labels inside GeoMap, or see
  [map routes](references/gallery/maps.md#map_routes) for a sampled Arrow.
  [Filtering and bounds](references/gallery/maps.md#filtered_region) combines source
  `ids` selection with `bounds={[west, south, east, north]}`.
- Diagrams: [Network](references/elements/networks.md#Network) connects named
  [Node](references/elements/networks.md#Node) frames, or any element with an `id`, using
  [Edge](references/elements/networks.md#Edge).
  It does not automatically arrange nodes or avoid obstacles.
  Use [Overlay](references/elements/layout.md#Overlay) for annotations around a measured base.
- Text and math: [Text](references/elements/text.md#Text),
  [TitleFrame](references/elements/text.md#TitleFrame), [math authoring](references/guides/math.md),
  and [Shape Algebra](references/gallery/math.md#shape_algebra).
- Video: [Video](references/elements/video.md#Video) accepts frame children or a frame
  generator; use the CLI for MP4 export and individual frame previews.
- Complete compositions: [Transformer](references/gallery/networks.md#transformer),
  [Pendulum Physics](references/gallery/geometry.md#pendulum_physics), and
  [Two columns](references/gallery/layout.md#two_columns).
- Host integration: [Rendering](references/guides/rendering.md),
  [Fonts](references/guides/fonts.md), and [Custom elements](references/guides/custom_elements.md).

For features without a dedicated component, compose supported primitives or
explain the limitation.

## CLI setup

The `gum` command evaluates JSX, lays out the result, and writes SVG, PNG, PDF,
kitty graphics, a fragment tree, or JSON. **Prefer a local package installation
with npm and Node.js 24+**. The authoring plugin does not install an executable
automatically.

Use this discovery order:

1. Reuse an exact renderer invocation already established in this task.
2. Look for `gum` on PATH (`command -v gum` in a POSIX shell or
   `Get-Command gum` in PowerShell). If found, use it.
3. Otherwise, run `npm prefix` to find the current project's root and check
   `node_modules/.bin` for `gum` (`gum.cmd` on Windows). If found, use that path.

Use the first available renderer invocation.

Stop discovery after these checks: do not search Codex directories, plugin
caches, old tasks, user profiles, package-manager caches, or the filesystem for
a hidden installation. Do not use `bunx` or `npx` to probe.

If no renderer is found, explain that rendering requires downloading and running
Gum 2.1.0-beta.0. Follow the host's approval flow before installing or running downloaded
software. Ask the user for setup approval when it is not already authorized.
Honor installation restrictions and the user's chosen scope. If setup is denied
or blocked, provide JSX source and rendering instructions.

## Local package installation

Create a dedicated directory under the task's writable tools or temporary
directory and put a minimal `package.json` containing `{"private":true}` there.
Run this command **from that directory**:

```sh
npm install --save-exact --ignore-scripts gum-jsx@2.1.0-beta.0
```

If npm's default cache is not writable in a sandbox, set `npm_config_cache` to
a writable directory (such as a cache directory under the task's temporary
directory) and retry the installation.

The bundled package has no runtime package dependencies and needs no install
scripts. Verify the installation with the installed `gum --version` command.
Keep the generated lockfile, including the registry integrity metadata.
Use the pinned version; if it is unavailable or integrity verification fails,
stop and report the error. Invoke
`/absolute/tools-dir/node_modules/.bin/gum` (or `gum.cmd` on Windows).
Retain the exact invocation for later renders. Run rendering commands from the caller's working directory so input
files resolve there.

Bun 1.4.2+ works equally well: install with `bun add --exact --ignore-scripts gum-jsx@2.1.0-beta.0`
and run `bun /absolute/tools-dir/node_modules/.bin/gum`.

This installation needs no global install, PATH or shell-profile changes, or
changes to the user's project dependencies. Only install into the project when
the user requests integration.

If neither Node.js 24+ nor Bun 1.4.2+ is available and no existing Gum renderer
was found, provide JSX source and the npm installation and rendering instructions
for an environment with a supported runtime.

## Project and library integration

The bundled npm CLI runs under Node.js 24+ with no runtime package dependencies.

- **Project CLI:** install with `npm install --save-dev --save-exact --ignore-scripts gum-jsx@2.1.0-beta.0`,
  then use `./node_modules/.bin/gum` (or its Windows wrapper).
- **Global CLI:** install with `npm install -g --ignore-scripts gum-jsx@2.1.0-beta.0`, then use `gum`.
- **Library integration:** source packages require Bun or a browser bundler.
  Add the libraries the host code needs, for example
  `npm install --save-exact --ignore-scripts @gum-jsx/core@2.1.0-beta.0 @gum-jsx/math@2.1.0-beta.0`.
  See [Rendering](references/guides/rendering.md) for evaluation, layout, and export APIs, and
  [Math export](references/guides/math_export.md) for fonts and standalone formulas.

Choose project-local CLI installation when the user wants dependencies managed
with the project; use global installation when they ask for commands across
projects. Preserve any scope already chosen.
If installation is declined or commands cannot run, provide source and rendering
instructions without claiming to have rendered it.

## Render with the CLI

Save a draft `.jsx` file and render it with `gum`. The examples below assume
`gum` is on PATH; substitute the established local invocation when needed.
Pass a JSX file, multiple JSX files, or one deck directory; omit the input or
use `-` to read stdin. Input and output paths are relative to the current directory.

```sh
# With your source saved in figure.jsx:
gum figure.jsx -o figure.svg
gum figure.jsx -o figure.png --ratio 2
gum figure.jsx -o figure.pdf
gum figure.jsx -f tree --stats
gum figure.jsx -f json -o figure.json
gum --help
```

### Options

| Option | Meaning |
|---|---|
| `[files...]` | JSX files or one deck directory; omit or use `-` for stdin |
| `-f, --format <format>` | Image output: `kitty`, `svg`, `png`, `pdf`; layout inspection: `tree` or `json` |
| `-o, --output <file>` | Write to a file instead of stdout |
| `-W, --width <pixels>` | Exact viewport width in pixels |
| `-H, --height <pixels>` | Exact viewport height in pixels |
| `-r, --ratio <number>` | Positive PNG/kitty sampling ratio; default `1` |
| `--png-encoding <preset>` | Lossless PNG/kitty encoding: `fast` (default) or `standard` |
| `--select <x,y,width,height>` | Inspect a PNG/kitty region in source pixels; combine with `--ratio` to magnify |
| `-b, --background <color>` | Paint the viewport background |
| `-t, --theme <theme>` | `light` or `dark`; override the source root theme |
| `--title <text>` | SVG or PDF document title |
| `--id-prefix <name>` | SVG definition prefix; default `gum` |
| `--precision <digits\|full>` | Output decimal places, 0–100 or `full`; default `10` |
| `--text-mode <mode>` | SVG/PDF/PPTX text and math as `path`, `live`, or `mixed` (live prose, outlined math); defaults to `path` for SVG, `live` for PDF, and `mixed` for PPTX |
| `--plugin <module>` | Load element/helper exports from a package or file; repeatable, requires Bun |
| `--stats` | Machine-readable layout counters on stderr |
| `-V, --version` | Print the CLI version |
| `-h, --help` | Show help |

#### Inspect a region with `--select`

Use `--select` to examine fine details and alignment without shrinking the whole
figure to fit the viewer. Supply `x,y,width,height` in source pixels, with the
origin at the viewport's top-left. The CLI lays out the full figure, then crops
before rasterization; selecting a region does not reflow its contents.

```sh
gum figure.jsx --select 100,50,200,100 --ratio 3 -o detail.png
```

This produces a 600 × 300 PNG of the 200 × 100 region starting at `(100, 50)`.
`--ratio` increases sampling resolution, preserving sharp vector edges rather
than enlarging an existing bitmap. Use `-f kitty` instead of `-o detail.png` to
view the crop in a compatible terminal.

Selection works only with PNG and kitty. Width and height must be positive;
fractional coordinates and regions extending outside the viewport are allowed.
Outside areas are transparent unless `--background` supplies a paint. Compare
magnified crops with the full image to check both detail and composition.

#### Inspect layout with `-f tree` and `-f json`

These formats expose the fragments produced by layout:

- **`tree`** gives an indented view of fragment names, measured sizes, child
  offsets and transforms, ink and content bounds, overflow, guides, and clipping.
  Use it to trace unexpected spacing, alignment, or content extending beyond a box.
  `--precision full` preserves full numeric precision in this report.
- **`json`** serializes the fragment data, including drawing commands and nested
  child placements, for structured inspection or further processing. JSON retains
  full numeric precision regardless of `--precision`.

```sh
gum figure.jsx -f tree --precision full
gum figure.jsx -f json -o fragments.json
```

Both formats describe the result after layout. To inspect the source element
tree before layout, use the host APIs in the
[rendering guide](references/guides/rendering.md). Combine fragment inspection
with temporary `debug` props and a rendered image to connect numeric bounds to
visible geometry. `--stats` adds layout counters on stderr without mixing them
into the tree or JSON output.

### Output, sizing, and backgrounds

An explicit format wins; otherwise the output extension selects SVG, PNG, or
PDF. For a file or stdin, stdout defaults to kitty graphics even when piped or
redirected. Choose `-f svg` for SVG text on stdout or `-f pdf` for binary PDF.
Kitty display requires a compatible terminal. Directories and multiple files
require PDF output.

With neither `-W` nor `-H`, JSX gets a 640 × 480 offer; content can hug or exceed
it, and authored dimensions still win. Viewport overrides are independent: an
unspecified axis uses source dimensions or hugs content. `-W 320` reflows a
document without fixing its height; it does not uniformly scale fonts or strokes.
Use `fit` on the composition for uniform scaling. SVG/tree/JSON allow zero-sized
axes; PNG/PDF/kitty require positive dimensions.

`--ratio` changes raster resolution without changing layout.

`--precision` controls SVG, PDF, and tree numbers without changing layout.
PNG and kitty use full geometry precision. Both PNG encoding presets preserve
the same decoded pixels; they differ in compression policy.

Kitty defaults to a dark theme; other formats default to light. A source root
`<Svg theme="light">` or `<Svg theme="dark">` overrides that default, and
`--theme` overrides the root selection. Explicit paints and nested themes still
apply. Themes leave backgrounds transparent; `--background` paints behind
explicit source backgrounds. See [Themes](references/guides/themes.md).
For a fully opaque white PNG, use `--background '#FFFFFF'`: a white root Box
can leave transparency along the last pixel row or column when fractional
dimensions round up to whole pixels.

### Rendering behavior

Core, math, and map bindings are included by default; `GeoMap`,
`world_countries()`, and `us_states()` need no extra flags. The CLI wraps a bare
element in `Svg`; the core evaluator itself does not add this wrapper.
Errors go to stderr and exit with status 1. `--stats` writes layout counters
independently of the rendered output.

PNG and kitty render fragments directly through `@gum-jsx/png`'s WebAssembly
renderer. Text and math always use glyph outlines, including when
`--text-mode live` selects live SVG text. No native addon or host font
registration is needed. Emoji without outlines cannot be rasterized; export
SVG for a browser with suitable fonts.

PDF uses `@gum-jsx/pdf` to write vector pages at 96 pixels per inch with the
same viewport, themes, and backgrounds. Text and math glyphs default to selectable
native text with embedded font subsets shared across pages. Use `--text-mode path`
for outlines. Math decorations remain vector geometry; debug overlays are omitted.
`--ratio` and `--id-prefix` do not affect PDF output.

PPTX defaults to `mixed`: editable prose with fixed line breaks and styled runs,
plus outlined math. It references installed prose fonts without embedding them.
Use `--text-mode live` to make math glyphs editable too; this requires matching math fonts.
Use `--text-mode path` for outlines or for reflected/skewed/nonuniformly scaled text.
PPTX ignores fragment clips and exports their content in full.

Watch mode is not implemented. Only run trusted JSX; evaluation executes JavaScript.

Inspect a rendered PNG when image viewing is available. Use `-f tree` or `-f json`
to inspect allocations and overflow alongside temporary `debug` overlays. If
visual inspection is unavailable, report the checks actually performed.

## Multipage PDFs and decks

Pass JSX files in argument order or one directory of slides to render a multipage PDF:

```sh
gum slides/ -o talk.pdf
gum slides/ > talk.pdf
```

Directories and multiple files default to PDF; other output formats are rejected.
Directories and stdin cannot be combined with other inputs. Each slide
must return a Gum element and becomes one page with its own viewport size. Long
content is not automatically split into pages. Put multiple figures in a deck
directory to combine them into a PDF. `-W` and `-H` apply to every page; `--stats`
writes one JSON line per page to stderr.

### Deck manifest

A deck directory can contain an `index.json`:

```json
{
  "title": "My talk",
  "prelude": "prelude.jsx",
  "slides": ["intro.jsx", "results.jsx", "conclusion.jsx"]
}
```

All three fields are optional. Paths in the manifest are relative to its
directory. `slides` sets the exact page order. When omitted, Gum uses that
directory's `.jsx` files in natural filename order (`slide_2.jsx` before
`slide_10.jsx`), excluding the named prelude. It does not recurse into
subdirectories. `title` supplies PDF document metadata; `--title` overrides it.

### Shared preludes

Use a prelude for shared colors, data, and reusable JSX components. It contains
ordinary declarations, without imports or exports, and does not need to return
a figure. For example, `prelude.jsx` can define:

```jsx
const accent = '#167C73'
function Card({ children, ...props }) {
  return (
    <Frame padding={em(0.75)} border-color={accent} {...props}>
      <Text>{children}</Text>
    </Frame>
  )
}
```

Each prelude is evaluated once per command, and its top-level bindings are shared
by the slides that use it. Core and math helpers remain available. Each slide has
its own local declarations and can be a bare JSX element or JavaScript ending
with an explicit `return`:

```jsx
<Slide title="Shared components">
  <HStack gap={em(1)}>
    <Card grow={1}>First idea</Card>
    <Card grow={1}>Second idea</Card>
  </HStack>
</Slide>
```

Manifest and prelude handling applies to directory input. Explicit files or stdin
use the standard core, math, and map bindings without loading neighboring `index.json`
files. A slide rendered as an individual file must be self-contained. Pass the
deck directory to use its prelude.

The `gum-jsx-docs/decks/gum` sample deck demonstrates a shared page layout,
reusable panels, and a five-page manifest.

## Generation Workflow

Work in a short loop: write a draft, render it with the CLI, and revise the
source. Start with the main structure and content, then refine spacing,
typography, colors, and fine details once the composition works.

1. **Draft.** Save an editable `.jsx` file. Use a relevant example as a starting
   point and choose dimensions suited to the intended output.
2. **Render.** Run `gum figure.jsx -o figure.png` using the established CLI
   invocation. Open the rendered image and assess the whole composition:
   hierarchy, legibility, spacing, alignment, clipping, and overlapping labels
   or connectors. A successful command alone does not establish visual quality.
3. **Revise.** Fix the layout or content causing the problem, render again, and
   inspect the new result. Check the full composition after local adjustments.
   Repeat until both the overall figure and its details work.

### Inspection tools

Sometimes looking at the rendered PNG is not enough. You can use the following
tools to inspect the layout and content.

- **Debug overlays:** add temporary `debug` props to the relevant layout
  elements to reveal allocated rectangles and content bounds. These help locate
  unexpected spacing, overflow, and alignment problems.
- **Magnified regions:** use `--select x,y,width,height` with `--ratio` to render
  a specific region at higher resolution. Selection coordinates are in source
  pixels, measured from the top-left. This is especially useful for fine details,
  small text, line joins, and precise alignment; inspect the crop alongside the
  full figure.
- **Raw SVG:** render with `-f svg` or save a `.svg` file to inspect paths,
  transforms, clipping, and paints when the image alone does not explain a
  problem.
- **Layout fragments:** use `-f tree` for a readable fragment tree or `-f json`
  for raw fragment data, including measured sizes and child placements. Add
  `--stats` when layout counters would help diagnose the behavior.
- **Source elements:** when necessary, inspect the evaluated element tree before
  layout and compare it with the resulting fragments. The
  [rendering guide](references/guides/rendering.md) describes the host APIs for
  accessing elements and fragments directly.
