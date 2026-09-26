---
name: gum-jsx
description: Create and revise SVG diagrams, plots, mathematical figures, and slides using Gum's JSX language. Use for authoring or debugging Gum figures, not general React or HTML development.
---

# Gum JSX

Gum describes figures with JavaScript and JSX, then measures and renders them as
SVG. It is not React, HTML, or a browser DOM.

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
  children use `x`, `y`, and `anchor`, with top-left origin and y pointing down.
  In `Graph`, `Plot`, and `Network`, bare numeric positions are data coordinates,
  with y pointing up by default. Unit strings and `px`/`em` positions are local
  lengths; widths and font sizes also use layout units. Give positioned shapes
  explicit sizes: each receives an offer for the whole canvas.
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
  maps, networks, text, math, and special elements, including `PngImage`.
- [Gallery](references/gallery.md): complete figures and focused examples,
  grouped by category. Start from a close example when it fits the request.

Useful starting points:

- Layout: [Units](references/guides/units.md), [Sizing](references/guides/sizing.md),
  [Fitting](references/guides/fitting.md), [Stacks](references/guides/stack.md),
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
- Complete compositions: [Transformer](references/gallery/networks.md#transformer),
  [Pendulum Physics](references/gallery/geometry.md#pendulum_physics), and
  [Two Columns](references/gallery/layout.md#two_column).
- Host integration: [Rendering](references/guides/rendering.md),
  [Fonts](references/guides/fonts.md), and [Custom elements](references/guides/custom_elements.md).

For features without a dedicated component, compose supported primitives or
explain the limitation.

## Render and refine

Start from a relevant example and render a draft using the host's available
rendering workflow. Check text legibility, alignment, clipping, and overlap of
labels and connectors. Temporary `debug` props show container allocations and
content bounds. Fix the allocation or content causing the issue, then render
again; remove diagnostic overlays from the finished figure.

For a sine plot, use explicit layout units and `samples`:

```jsx
<Plot
  width={px(640)}
  aspect={2}
  font-size={px(18)}
  title="Sine wave"
  xlim={[0, 2 * pi]}
  ylim={[-1.5, 1.5]}
  grid
  grid-stroke-dasharray={em(0.2)}
>
  <SymLine
    fy={sin}
    xlim={[0, 2 * pi]}
    samples={161}
    stroke={blue}
    stroke-width={em(0.12)}
  />
</Plot>
```

`stroke-dasharray` accepts one length for equal dashes and gaps, or an array for
a custom pattern. Use `px(...)` or `em(...)` for explicit units; bare numbers are fractions.

## Host code

In host TypeScript, use `evaluate(source)` then `render_element(result)` from
`@gum-jsx/core`. The latter wraps bare elements in `Svg` and returns a tagged
`svg` or plain `value` result. For layout inspection or another output backend,
use `layout_element`; the lower-level stages are `make_viewport(element)` →
`LayoutPass.layout(viewport)` → `render_svg(fragment)`.

Provide `@gum-jsx/math` bindings through `evaluate`'s `scope` and
`math.createMathFonts()` through the rendering helper's `fonts` option when needed.
Use a distinct `id_prefix` for each SVG embedded in the same HTML document.
Read the rendering and math guides for font loading and viewport options.

Evaluation executes JavaScript in the host environment; it is not a security
sandbox. Only evaluate trusted source or use a separate isolation boundary.

## CLI setup

Use an existing Gum CLI when available, or install the scoped prerelease CLI.
Native rendering has been tested with Bun 1.4.2 or newer on Linux x64, macOS,
and Windows.

```sh
bun install -g @gum-jsx/cli@beta
```

This provides the `gum`, `gum-tex`, and `gum-mark` commands. The examples assume
they are available on your PATH. In a workspace checkout, run `bun install` at
the root and use `bun run gum` (or `bun run gum-tex`) instead.

## Render with the CLI

Save a draft `.jsx` file and render it with `gum`. The command accepts one input
file or deck directory; omit the input or use `-` to read stdin. See the
[CLI guide](references/guides/cli.md) for the complete options.

```sh
# With your source saved in figure.jsx:
gum figure.jsx -o figure.svg
gum figure.jsx -o figure.png --ratio 2
gum figure.jsx -o figure.pdf
gum figure.jsx -f tree --stats
gum figure.jsx -f json -o figure.json
```

For a file or stdin, choose `-f svg` explicitly for SVG on stdout; the CLI defaults
to kitty graphics even when redirected. Output extensions select SVG, PNG, or PDF when `-f` is
omitted. With neither `-W` nor `-H`, JSX gets a 640 × 480 offer; content can hug
or exceed it, and authored dimensions still win.
`-W` and `-H` impose exact viewport dimensions; an unspecified axis uses source
dimensions or hugs content. Use `fit` on the composition for uniform scaling.
`--ratio` changes raster resolution without changing layout. For a detailed PNG
crop, `--select x,y,width,height` uses source-image pixels.

Kitty defaults to a dark theme; file exports default to light. Use `--theme` to
override the root theme and `--background` when the export needs a backdrop.

Inspect a rendered PNG when image viewing is available. Use `-f tree` or `-f json`
to inspect allocations and overflow alongside temporary `debug` overlays. If
visual inspection is unavailable, report the checks actually performed.

## Plugins

Core bindings are mandatory, and math and maps are bundled by default. Map
elements and helpers, including `GeoMap`, `world_countries()`, and `us_states()`,
are available without extra flags. Add `--plugin <package>` for another installed
package or `--plugin ./elements.ts`
for a local JavaScript/TypeScript module. Package names and relative module
paths resolve from the current working directory, not the CLI installation or
the input's directory. Packages must already be installed in that project.

Named exports become available in the evaluated source; default exports are
ignored. Repeat `--plugin` to load multiple modules. Later exports override
earlier bindings, including math, maps, and core names. The same plugin bindings are
available to a file, stdin, and every prelude and slide in a deck.

## Multipage PDFs and decks

Pass one directory of slides to render a multipage PDF:

```sh
gum slides/ -o talk.pdf
gum slides/ > talk.pdf
```

Directory input defaults to PDF; other output formats are rejected. Each slide
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

Manifest and prelude handling applies to directory input. A single file or stdin
uses ordinary core and math bindings without loading neighboring `index.json`
files. A slide rendered as an individual file must be self-contained. Pass the
deck directory to use its prelude.

The `gum-jsx-docs/decks/gum` sample deck demonstrates a shared page layout,
reusable panels, and a five-page manifest.
