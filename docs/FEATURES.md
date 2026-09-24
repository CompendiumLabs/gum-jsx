# Original gum feature inventory

This is the parity inventory for the fresh gum implementation. It records the
public elements and supporting capabilities of the original `gum-old` workspace
(see `../gum-old`) so that features can be restored, redesigned, or explicitly
retired without being forgotten.

The original sources of truth are `gum-jsx-core/src/env.ts` (`CORE_ELEMS`),
`gum-jsx-core/src/gum.ts` (the direct JavaScript API),
`gum-jsx-math/src/elems.ts` (`MATH_ELEMS`), and the package READMEs in the
original workspace. Names below are the original public names, even where the
fresh core will choose a different API.

Checkboxes describe current capability coverage in the fresh core:

- `[x]` means the essential capability is implemented, although the API may differ.
- `[-]` means the capability is intentionally retired.
- `[ ]` means work or an explicit product decision remains.
- A note beginning with **Partial** names useful infrastructure that exists but
  does not yet cover the original feature.

This is a feature ledger, not a requirement to reproduce old architecture. The
fresh parent-owned layout protocol, immutable descriptions and fragments, pixel
lengths, and explicit `fit` remain the foundation.

## Language and evaluation

- [x] Parse JSX expressions and top-level JavaScript containing a returned JSX
  value.
- [x] Support custom JavaScript component functions, spreads, expression
  children, nested fragments, arrays within children, and ordinary collection
  methods such as `map`.
- [x] Construct elements directly from JavaScript or TypeScript as well as from
  evaluated source.
- [x] Define custom element classes against the public layout protocol, directly
  in JSX or host code. `Element` supplies the inherited constructor, merged static
  defaults, automatic names, and layout/normalize/data_bounds hooks. `define_element`
  remains a convenience over the same immutable source machinery.
- [x] Report syntax and runtime failures with source locations and JSX
  construction sites.
- [ ] Accept a top-level JSX fragment or array of elements and wrap it in the
  root `Svg` automatically.
- [x] Provide shared preludes: evaluate declarations once and reuse their
  bindings across figures or slides.
- [x] Allow hosts to inject extra bindings into evaluated code. The fresh
  `scope` option covers the original evaluation `bindings` capability.
- [ ] Restore an isolated `Env` abstraction containing element registrations,
  bindings, fonts, theme, strictness, text scale, and random streams.
- [ ] Restore plugins of the form `{ elems, bindings, fonts }`, including
  registration and derived environments with independent settings.
- [x] Add inherited light and dark palettes with semantic per-element paint
  defaults, a light web default, and CLI theme selection (dark for kitty).
- [-] Boolean shorthands for length-valued padding, rounding, and spacing. Use
  explicit lengths. Actual boolean props such as `grid`, `wrap`, and `debug` remain valid.
- [ ] Restore strict rendering mode, with permissive visual fallbacks in normal
  mode and typed failures in strict mode.
- [x] Deterministic evaluation-local random streams through `evaluate(..., { seed })`
  and `setSeed`, separate from renderer-generated identifiers.
- [ ] Restore host-provided `loadFile`, `loadTable(path)`, and `<LoadImage>`
  bindings.
- [x] Hyphenated JSX attributes normalize to underscores. Typed compound scopes
  such as `axis-stroke-width` and `title-font-size` configure generated parts.

## Core layout and composition model

- [x] Lengths in parent fractions, `em()`, and `px()` with delayed resolution
  against the correct reference.
- [x] Explicit width, height, minimum, maximum, and preferred aspect constraints.
- [x] Natural, available, and exact layout requests; content hugging, reflow,
  fixed allocation, and explicit overflow.
- [x] Parent-owned allocation and placement, including stack flex metadata and
  positioned-group `x`, `y`, and `anchor` metadata.
- [x] Cross-axis alignment with child `align_self` overrides, main-axis packing,
  flex grow/shrink/basis, spacers, and real text-baseline alignment.
- [x] Content boxes with padding, borders, backgrounds, rounded corners,
  clipping, nested reference boxes, and explicit fitting.
- [x] Paint bounds, layout bounds, overflow, clips, affine placement transforms,
  and reusable immutable fragments remain distinct.
- [x] Arbitrary local coordinate systems (`coord`, `xlim`, `ylim`) with flipped
  axes and mappings between data coordinates and drawing coordinates.
- [-] Original placement conveniences: `rect`, `pos`, `size`, `rad`, `xrect`,
  `yrect`, `align`, `expand`, and automatic containment of positioned children.
  **Partial:** the fresh API provides the core sizing and positioned-group cases.
- [x] Element-level `rotate`, `spin`, `orient`, `upright`, and aspect-invariant
  behavior. **Basic:** Rotate and TransformBox are explicit wrappers;
  ordinary data mapping leaves fonts, marker sizes, and strokes in layout units.
  Original per-element shorthand and automatic orientation policies are deferred.
- [x] Content-sized overlay composition in which one child sizes the container
  and decorations layer over it.
- [x] `debug` overlays show allocated and content rectangles without changing layout.

## Foundation and layout elements

- [x] **`Element`** — common source description, sizing and style surface.
- [x] **`Svg`** — root viewport and SVG document serialization, including
  explicit or content-sized axes.
- [x] **`Group`** — layered children on a finite positioned canvas with optional
  clipping.
- [x] **`Box`**, **`Frame`** — padded content, background, border, rounding,
  alignment, clipping, and a bordered convenience variant.
- [x] **`Stack`** — public direction-selectable stack. **Partial:** the shared
  implementation exists behind `HStack` and `VStack`.
- [x] **`HStack`**, **`VStack`** — horizontal and vertical flow for figures,
  text, and nested containers.
- [x] **`HWrap` capability** — `HStack wrap` and `TextRow wrap` form rows at an
  offered width, with `gap`, `line_gap`, and per-line flex allocation. No HWrap alias.
- [x] **`Grid`** — shared columns with an explicit count for equal widths or a
  length/auto track array, content-sized rows, separate gaps, and cell alignment.
  **Basic:** use an empty Box for a missing cell; spans, CSS track sizing, automatic
  column counts, and inferred overall aspect remain deferred.
- [x] **`Points`** — clone a configurable point shape at a list of coordinates,
  with scalar, pair, or functional point sizes.
- [x] **`Anchor`** — place a child around a zero-width or zero-height anchor line.
  **Basic:** the child's measured allocation is aligned around a point or line;
  visible ink and overflow are retained.
- [x] **`Attach`** — attach a child outside a selected side of another box with
  offset, extent, location, and justification. **Basic:** Attach supplies side,
  offset, at, and child_anchor without reserving outer space.
- [x] **`Absolute`** — give a child an absolute drawing-unit size while it
  participates in proportional layout. **API choice:** ordinary px() width and
  height cover this capability; no separate Absolute element is needed.
- [x] **`Spacer`** — empty flexible stack item.
- [x] **Fitting** — put `fit` on an element to shrink the completed drawing;
  `fit="contain"` permits enlargement and `fit="cover"` fills and clips.
  The earlier standalone Fit element has been removed.

## Geometry elements

### Basic shapes and paths

- [x] **`Rectangle` / `Rect`** — aspectless rectangle. The fresh core currently
  exposes `Rect`; restoring `Rectangle` as an alias is still a compatibility
  choice.
- [x] **`RoundedRect`** — rounded rectangle with pixel-stable corner radii.
- [x] **`Square`** — rectangle with a preferred 1:1 aspect.
- [x] **`Ellipse`**, **`Circle`** — elliptical and 1:1 circular shapes with
  configurable centers and radii.
- [x] **`Line`** — a line segment. **Partial:** the original `Line` also accepted
  any number of points as one polyline; the fresh core exposes `Polyline`
  separately.
- [x] **`Polygon`** — closed piecewise-linear path.
- [x] **`Path`** — explicit path command sequence.
- [x] **`UnitLine`**, **`HLine`**, **`VLine`** — unit-length line and directional
  conveniences.
- [x] **`CoordLine`** — piecewise path whose points are interpreted directly in
  the containing coordinate system.
- [x] **`Segments`** — many independent line segments in one element.
- [x] **`Ray`** — ray from an origin through a direction or angle.
- [x] **`Dot`** — filled circle with useful point defaults.
- [x] **`Triangle`** — three-sided polygon convenience.
- [x] **`Arc`** — portion of an ellipse between two angles.
- [x] **`Spline`** — open or closed cubic spline through points, with curvature
  and optional endpoint directions.
  **Basic:** uniform tangents and tension; custom endpoint directions are deferred.
- [x] **`RoundedLine`** — polyline with circularly rounded interior corners,
  intended for right-angle routes.
  **API choice:** the fresh implementation uses quadratic rounded corners.
- [x] **`Fill`**, **`HFill`**, **`VFill`** — filled region between paired paths,
  with horizontal and vertical conveniences.

### Arrows and low-level path construction

- [x] **`ArrowHead`** — independently usable filled or stroked head with angle,
  barb selection, spread, base, exact tip placement, and curved barbs.
  **Basic:** triangular or open heads with exact tips and layout-unit dimensions;
  advanced barb shapes remain deferred.
- [x] **`Arrow`** — straight, spline-curved, or rounded multi-point shaft with
  independently styled heads at either end.
  **Basic:** start/end heads are independently enabled and share head_style,
  also available through `head_` scoped style props.
  Shafts retreat at headed ends using pixel stroke/cap clearance while tips
  retain the original endpoints; short routes cannot reverse from shortening.
- [x] Low-level move, line, quadratic, cubic, and close commands through
  `move_to`, `line_to`, `quad_to`, `curve_to`, and `close_path`.
- [-] Original public command constructors **`Command`**, **`MoveCmd`**,
  **`LineCmd`**, **`ArcCmd`**, **`CornerCmd`**, **`RoundedCornerCmd`**, and
  **`CubicSplineCmd`**. **Partial:** most have functional equivalents, but arc
  and corner commands are absent.
- [x] One-dimensional and two-dimensional cubic interpolation helpers
  **`spline1d`** and **`spline2d`**.

### Drawing and SVG behavior

- [x] Fill and stroke paint, stroke width, caps, joins, and miter limits with
  inheritance.
- [x] Stable, escaped SVG serialization with clip definitions and accessible
  labels.
- [ ] Arbitrary SVG presentation attributes on every element, including dash
  arrays, opacity, filters, CSS classes, IDs, and data attributes. **Partial:**
  core paint, stroke_dasharray, and per-drawing opacity are implemented.
- [ ] General masks, custom clip shapes, shared definitions, and style/metadata
  nodes. **Partial:** rectangular and rounded fragment clips are implemented.

## Text and document elements

### Text shaping and flow

- [x] **`Span`** — styled inline text runs.
- [x] **`Text`** — measured paragraphs with real font metrics, wrapping,
  explicit newlines, whitespace handling, alignment, line height, inherited
  style, mixed spans, and indivisible inline elements with expanding line boxes.
- [ ] **`TextLine`** — public single-line normalized span container. The fresh
  `Text` owns line construction internally.
- [x] **`Verbatim` capability** — `Text whitespace="pre" font-family={mono}`; no alias.
- [x] **`Bold`**, **`Italic`** — text convenience wrappers. Their behavior is
  available through ordinary `font_weight` and `font_style` props.
- [x] Emoji measurement and host-font fallback behavior. A bundled metrics face
  measures emoji clusters, which the SVG keeps as live text for the host's Noto
  Color Emoji or system emoji font. Other faces can register with `fallback: true`.

### Text-aware layout

- [x] **`TextStack`** — em-based mixed text/figure stack.
- [x] **`TextCol`**, **`TextRow`** — text-aware column and row with inherited
  type scale, wrapping, fixed-size children, and shared remaining space.
- [x] **`TextGrid`** — Grid with string/number conversion and em-based gaps,
  filled row by row with text wrapping at the selected column widths.
- [x] **`TextFigure`** — figure with an em-sized image area and caption.
- [x] **`Bullets`** — wrapped bulleted and nested lists with shared indentation,
  marker customization, and item spacing.
- [x] **`TextBox`**, **`TextFrame`** — box conveniences that accept strings,
  formulas, or text columns directly and supply text-oriented padding defaults.
  Mixed prose, styled spans, and inline formulas are supported; a sole block is preserved.

### Labels, slides, and presentation composition

- [x] **`LabelBox`** — label-sized box used as a presentation building block.
  **API choice:** use the content-hugging TextBox; no LabelBox alias.
- [x] **`TitleBox`** — framed content with a title. **Basic:** the fresh title is
  measured above content; edge-attached decoration remains deferred.
- [x] **`TitleFrame`** — bordered title-box convenience.
- [x] **`Slide`** — fixed 16:9 presentation canvas with title, content column,
  document-wide em sizing, overflow policy, and slide-specific subunit styling.
  **Basic:** ordinary font inheritance supplies document sizing; `title_` scoped
  props and the compatible title_style object configure the generated title.

### Fonts

- [x] Bundled IBM Plex Sans and Mono faces, real advance/kerning/ink
  measurement, weight selection, italic synthesis, and glyph-outline SVG.
- [x] Replaceable font provider and explicit browser font preloading.
- [ ] Original `FontRegistry` surface: named paths and faces, cloning, lazy
  loading, loaded-state queries, raw byte access, and process-wide file cache.
- [ ] Browser `FontFace` installation paired with the exact bytes used for
  measurement. The fresh editor loads measurement bytes, while general web
  installation remains a host-package feature.
- [ ] Native selectable SVG `<text>` output as an option. The fresh core emits
  self-contained glyph paths.

## Data coordinates, plotting, and charts

**Basic implementations are available.** See [PLOTTING](PLOTTING.md) for APIs,
examples, and deliberate differences. Limits are linear and directed; parts accept
scoped props and nested objects. Plot measures margins, and callbacks expand at construction.
Advanced legacy options in the descriptions below are not parity promises.

### Graph containers

- [x] **`Graph`** — propagate a data coordinate system to graphable children,
  infer limits from their data, accept explicit `coord`/`xlim`/`ylim`, apply
  padding, and support flipped axes.
- [x] **`Plot`** — compose graph content with axes, labels, mesh/grid, title,
  margins, box decoration, inferred limits, and prefixed subunit styling.
  **API choice:** typed component scopes route at construction; nested style/options
  objects remain compatible. Specific scopes override shared settings per field.

### Bars

- [x] **`Bar`**, **`VBar`**, **`HBar`** — rounded bar primitives in either
  orientation.
- [x] **`Bars`**, **`VBars`**, **`HBars`** — generate bar sets from values,
  positions, widths, bases, and functional styles.
- [x] **`BarPlot`** — put bars in a plot with suitable inferred limits and axis
  defaults.

### Scales, axes, labels, and grids

- [x] **`Scale`**, **`HScale`**, **`VScale`** — ticks from explicit values or
  generated intervals, with side/orientation and tick styling.
- [x] **`Label`**, **`HLabel`**, **`VLabel`** — one positioned tick label with
  rotation, offset, and alignment.
- [x] **`Labels`**, **`HLabels`**, **`VLabels`** — generated or explicit sets of
  tick labels, including `[value, label]` pairs.
- [x] **`Axis`**, **`HAxis`**, **`VAxis`** — axis line, tick scale, tick labels,
  optional arrowheads, locations and sides, and prefixed styling of each part.
  **API choice:** line_, tick_, and label_ scopes coexist with line_style,
  tick_style, and label_style objects. Labels also accept text options such as wrap.
- [x] **`OuterLabel`** — axis title attached outside a plot edge.
- [x] **`Mesh`**, **`HMesh`**, **`VMesh`** — grid lines generated from one scale.
- [x] **`Mesh2D`** — combined horizontal and vertical mesh.
- [x] **`Legend`** — framed badge/label rows with automatic swatches and
  separate badge and label styles.

## Symbolic and sampled geometry

Sampling uses `samples` (default 101), point records or parametric pair results,
and explicit domains/arrays. Nonfinite samples remain gaps, and line/fill paths
split at them. Samplers are construction-time operations; resizing does not
reexecute callbacks. Adaptive sampling and discontinuity detection are deferred.

- [x] Shared symbolic sampler accepting parametric `f(t)`, separate `fx(t)` and
  `fy(t)`, explicit `xvals`/`yvals`/`tvals`, domain limits, and sample count;
  infer compatible missing values and omit non-finite samples.
- [x] **`SymPoints`** — sampled points with a configurable element-producing
  shape function and functional point size.
- [x] **`SymLine`** — sampled piecewise-linear function or parametric curve.
- [x] **`SymSpline`** — sampled smooth function or parametric curve.
- [x] **`SymPoly`** — sampled closed polygon.
- [x] **`SymFill`** — sampled filled region between two functions, including a
  scalar as either boundary.
- [x] **`Field`** — place and orient a shape over explicit vector-field samples.
- [x] **`SymField`** — sample a regular grid and orient/scale a shape from a
  function, using arrows by default.

## Networks and diagrams

- [x] **`Node`** — ID-addressable TextFrame with rounded/elliptical corners,
  text-aware sizing, padding, style, and explicit connection geometry.
- [x] **`Edge`** — arrow between node IDs or node instances; infer attachment
  sides, trim to node boundaries, route straight, curved, or rounded paths, and
  style shaft and heads independently.
- [x] **Generic nodes** — any element with an `id` is an edge endpoint; boxes and
  basic shapes connect at their visible outline and other elements at their allocation.
- [x] **`Network`** — lay out nodes before resolving edges, establish Graph
  coordinates and inherited font sizes, preserve source layering and annotations,
  and follow node boundaries through fitting, padding, and arbitrary affine transforms.
  Nested networks have separate ID scopes. See the
  [connection example](../gum-jsx-docs/docs/gallery/code/network_connections.jsx).
- [ ] Shared node/edge defaults through prefixed Network props, and arbitrary
  node outlines beyond rounded rectangles and ellipses.

## Images and external data

- [x] **`PngImage`** — embed a PNG data URI and infer its aspect from the PNG
  header.
- [ ] **`SvgImage`** — embed SVG markup, infer aspect from dimensions or
  `viewBox`, and map its inner document into an element rectangle.
  **Deferred:** will not implement for now; excluded from 2.0. Convert external
  SVG artwork to PNG for `PngImage`.
- [ ] **`LoadImage`** — evaluation-only image element supplied by a host
  `loadFile` callback.
- [ ] CSV table parsing through **`parseTable`** and evaluation-local
  **`loadTable`**, including Papa Parse options and row objects.

## Math elements and TeX rendering

Math was an optional `@gum-jsx/math` environment plugin. It parsed TeX with
KaTeX, converted the AST to ordinary gum elements, measured bundled KaTeX font
faces, and aligned formulas through an em metric record carrying width, height,
math-axis anchor, ink overhang, atom class, italic correction, and style scale.

Phases 1–7 now run in `gum-jsx-math`, including CLI/editor bindings and
KaTeX/LaTeX comparison tooling. See [the math roadmap](MATH.md).

### Public math elements

- [x] **`MathSpan`** — measured math/text glyph run with ink-based metrics.
- [x] **`MathSymbol`** — symbol-table lookup, font selection, atom class,
  italic correction, and accent skew.
- [x] **`MathOp`** — named or glyph operator with display sizing and optional
  over/under limits.
- [x] **`MathSpacer`** — explicit or named TeX glue/kern.
- [x] **`MathRow`**, **`MathCol`** — math-axis-aware horizontal and vertical
  composition.
- [x] **`MathBox`** — padding, positioning, width, and atom-class wrapper.
- [x] **`MathRule`** — scalable line/rule used by fractions, arrays, and
  decorations.
- [x] **`MathArray`** — aligned rows and columns, separators, row gaps, and rules.
- [x] **`MathStretch`** — drawn extensible arrows, groups, segments, and accents.
- [x] **`HorizBrace`** — over/under brace or bracket with an optional label.
- [x] **`XArrow`** — extensible relation with upper/lower labels.
- [x] **`MathText`** — atom row with TeX inter-atom spacing and binary-operator
  cancellation.
- [x] **`SupSub`** — superscripts, subscripts, combined scripts, italic
  correction, style descent, and operator limits.
- [x] **`Frac`** — fractions with style-dependent numerator/denominator shifts,
  clearance, optional rule, and generalized-fraction behavior.
- [x] **`Underline`**, **`Overline`** — rule decorations around arbitrary math.
- [x] **`Sqrt`** — extensible radical with optional index.
- [x] **`Accent`** — glyph or stretchy accents with skew and script attachment.
- [x] **`Bracket`** — auto-sized left/middle/right delimiters and explicit delimiter
  levels.
- [x] **`Latex`** — parse a TeX string in display or selected style and expose it
  as one gum element.
- [x] **`Tex`** — inline-style `Latex` convenience.
- [x] **`TextMode`** — literal upright text inside math with family, bold, and
  italic controls.
- [x] **`Phantom`**, **`Smash`**, **`Lap`** — independently suppress ink,
  vertical dimensions, or advance while preserving the remaining metrics.
- [x] **`Enclose`**, **`RaiseBox`**, **`VCenter`**, **`Pmb`** — frames,
  cancellation, vertical positioning, and overprinted bold.

### Math capabilities

- [x] KaTeX parsing with display/text/script/scriptscript and cramped styles,
  style descent, size commands, colors, font families, macros, symbol aliases,
  text mode, and strict/permissive failures.
- [x] TeX atom classes and spacing, binary cancellation, named functions,
  large operators, side scripts, and over/under limits.
- [x] Fractions and generalized fractions; binomials; roots; delimiters;
  accents; over/under lines, braces, arrows, groups, and segments; overset,
  underset, and stackrel.
- [x] Matrices and the original ordinary math environments: arrays,
  `matrix` variants, `cases`, `aligned`, `gathered`, `substack`, `align`,
  `alignat`, `gather`, `equation`, `split`, and `subarray`, with column
  alignment, separators, `hline`/`hdashline`, and row spacing. All 32 supported
  environments and their variants are listed in the
  [math package](../gum-jsx-math/README.md#arrays-and-multiline-math).
  Automatic numbering, explicit tags, and `CD` diagrams remain deferred.
- [x] Boxes and enclosures: boxed/fbox/colorbox/fcolorbox, cancellation,
  strikeout, phantom/smash/lap, rules, raisebox, vcenter, and verbatim.
- [x] Mix arbitrary gum elements inside formulas and formulas inside normal
  text/layout while preserving a shared axis/baseline protocol.
- [x] Standalone synchronous and asynchronous `mathToElement` and `mathToSvg`,
  with caller-owned font resources, selective base/full preload, natural ink
  viewports, and explicit clipping or `fit` sizing.
- [ ] Preserve or explicitly reconsider the original known omissions:
  `\middle`, display-margin `\tag`, arrows in the `CD` environment, three
  exotic enclosures, several missing-font symbols, script-style metric drift,
  and large-operator ink overhang.

The original math implementation covered 41 of KaTeX's 57 emitted parse-node
types, all 33 environments, nearly the full KaTeX math and text symbol tables,
and 119 strict rendering cases. Those numbers are useful regression targets,
not a requirement to retain KaTeX as the parser.

## Built-in constants and utilities

These names were globals inside evaluated gum JSX and were also exported for
direct JavaScript use.

- [x] Mathematical constants **`e`**, **`pi`**, **`phi`**, **`r2d`**, and
  **`d2r`**. Next also provides **`tau`** (2 pi).
- [x] Paint constants **`none`**, **`white`**, **`black`**, **`blue`**, **`red`**,
  **`green`**, **`yellow`**, **`purple`**, **`gray`**, **`lightgray`**,
  **`darkgray`**, and **`slate`**.
- [x] Supported font and weight constants **`sans`**, **`mono`**, **`light`**,
  **`regular`**, and **`bold`**.
- [x] Math font constants including `mathrm`, `mathit`, `mathbf`, `mathbb`,
  `mathcal`, `mathfrak`, `mathscr`, `mathsf`, `mathtt`, and `boldsymbol` are exported
  by `@gum-jsx/math`.
- [-] Emoji constants `moji` and `cmoji`; core uses a fallback metrics face and
  the display host supplies its emoji font.
- [x] Array creation and manipulation: **`range`**, **`linspace`**,
  **`enumerate`**, **`repeat`**, **`meshgrid`**, **`lingrid`**, **`zip`**,
  **`reshape`**, **`split`**, **`concat`**, and **`slice`**.
- [x] Reductions and elementwise numeric helpers: **`sum`**, **`prod`**,
  **`mean`**, **`cumsum`**, **`min`**, **`max`**, **`minimum`**, **`maximum`**,
  **`norm`**, **`clamp`**, **`rescale`**, and **`normalize`**.
- [x] Scalar math aliases: **`exp`**, **`log`**, **`log10`**, **`sin`**,
  **`cos`**, **`tan`**, **`abs`**, **`pow`**, **`sqrt`**, **`sign`**,
  **`floor`**, **`ceil`**, **`round`**, **`atan`**, and **`atan2`**.
- [x] Curve and mapping helpers: **`sigmoid`**, **`logit`**, **`smoothstep`**,
  **`polar`**, **`polard`**, and **`rounder`**.
- [x] Color interpolation: **`interp`** and **`palette`**.
- [x] Two-dimensional vector arithmetic: **`add2`**, **`sub2`**, **`mul2`**,
  and **`div2`**; N-dimensional equivalents **`addn`**, **`subn`**, **`muln`**,
  and **`divn`**.
- [x] Complex arithmetic: **`addc`**, **`subc`**, **`mulc`**, **`divc`**,
  **`conjc`**, **`normc`**, and **`argc`**.
- [x] Seeded random helpers **`setSeed`**, **`random`**, **`uniform`**,
  **`normal`**, and **`integer`**.

The [math reference](../gum-jsx-docs/docs/guides/text/math_helpers.md) covers the helper
set and links to runnable examples. Generated arrays are bounded and frozen,
2D helpers return native points, and random streams belong to individual
evaluations. See [migration notes](./MIGRATION.md#numeric-helpers)
for the precise differences in range, singleton linspace, and integer endpoints.

## Inspection, rendering, and export

### Core and inspection

- [x] Pure SVG serialization from a completed layout, with no layout work in
  the renderer.
- [x] SVG title, background, escaped attributes/content, stable definition IDs,
  clips, transforms, and accessible labels.
- [x] Textual fragment-tree inspection and observable layout-pass statistics.
- [ ] Original fractional zoom/crop helpers **`validateZoom`**, **`zoomRect`**,
  and **`zoomSvg`**.
- [ ] Original element placement report **`layoutRows`** / **`layoutSvg`** with
  depth, text selection, zoom filtering, allocated boxes, realized boxes,
  rotation, IDs, and classes. **Partial:** `inspect_fragment` exposes the fresh
  result tree but has a different purpose and format.

### Browser package

- [ ] Load registered font bytes and install matching browser `FontFace`s.
- [ ] Embed selected font faces into standalone SVG as data-URL CSS.
- [ ] Rasterize an SVG element or markup to canvas, PNG `Blob`, or `ImageData`,
  with size, DPR, background, and font controls.
- [ ] Browser downloads and conversion helpers for blobs, base64, data URLs,
  blob URLs, SVG, and generic files.

### Node/Bun package

- [x] Rasterize SVG to PNG buffers or raw RGBA pixels through
  [`gum-jsx-png`](../gum-jsx-png/README.md), with raster size, sampling ratio,
  and background controls. Fresh-core text is outlined in SVG and needs no
  host-font registration.
- [x] Kitty graphics protocol encoding for PNG or RGBA pixels in
  `gum-jsx-cli`, including chunking, image/placement IDs, terminal cell
  dimensions, cursor movement, and virtual-placement controls.
- [x] Unicode placeholder text grids for kitty images under pagers and
  multiplexers.
- [x] ANSI text styling, PNG dimension reading, terminal cell-size queries, and
  stdin collection.

### Vector PDF package

- [x] Export one completed fragment as a vector PDF page, with embedded PNG images.
- [x] Transparent or colored page backgrounds, Unicode document title, physical
  scale, and configurable output precision.
- [x] Synchronous export in Bun and browser bundles.
- [x] Multipage documents from an ordered array of fragments with independent page sizes.
- [ ] Page labels/bookmarks and broader document metadata.
- [ ] Embedded fonts and searchable/selectable text. Current output uses outlines;
  live color-font text such as emoji is rejected.
- [x] Use unmodified `fast-png`, with the accepted limitation that one- and
  two-pixel RGB PNGs using a `tRNS` transparency key cannot be exported. RGBA
  images are unaffected; an upstream decoder fix can remove this limitation.

## React integration

- [x] `GUM` supplies core and math components; custom classes can be wrapped with
  `createGumComponent` or supplied in an element registry. There is no legacy Env.
- [x] `createGumRoot` supports rendering, updates, text nodes, unmount, and font loading.
- [x] `<Gum>` renders browser SVG with size, theme, and font resource props.
- [x] User-defined React components, fragments, arrays, conditionals, and mapped children.
- [x] `gum-react` renders a TSX default export with maximum size, theme, and a
  base directory for relative raw imports. The legacy unit-size option is retired.

## Command-line and authoring workflows

The basic rendering command lives in the separate
[`gum-jsx-cli` workspace package](../gum-jsx-cli/README.md), backed by the core's
public API. Run `bun run gum` from the workspace root.

- [x] Separate CLI package with a `gum` executable and workspace
  scripts; command-line I/O and rasterization are outside `gum-jsx-core` runtime.
- [x] Render a JSX file or stdin to SVG with explicit or content-sized viewport
  dimensions.
- [x] Emit a textual layout tree and JSON fragment data.
- [x] Rasterize CLI output to PNG through `gum-jsx-png` and node-canvas, with
  no external rasterizer command or font registration.
- [x] Default stdout to kitty graphics, as in the original gum command;
  explicit formats and output file extensions take precedence.
- [x] Single-page vector PDF output from `gum` and `gum-tex`, selected with
  `-f pdf` or a `.pdf` filename, with document title and background options.
- [x] `@gum-jsx/cli` includes the output backends, math, themes, backgrounds,
  raster ratios, and pixel selection. Original unit-size is retired; CLI seed,
  filtered/depth-limited inspection, and a legacy strict/fallback mode remain absent.
- [ ] Live `gum --dev` terminal refresh while a source file changes.
- [x] `gum-tex` command for standalone TeX to SVG, PNG, PDF, kitty, tree, or JSON;
  literal/file/stdin input, font size, padding, macros, and explicit fitting.
- [x] Multi-file and directory deck loading for PDF output with natural filename ordering.
- [x] Deck `index.json` for explicit slide order, shared prelude, and document
  title; automatically apply a neighboring deck prelude when rendering one
  slide.
- [x] Vector PDF deck output.
- [ ] Slide titles or filenames as PDF bookmarks.

## Markdown and documentation workflows

- [x] `gum-mark` / **`displayMarkdown`** terminal renderer for Markdown with ANSI
  text, fenced gum blocks, linked PNG/SVG/JSX images, inline and display TeX,
  image sizing options, and kitty placeholders under a pager.
- [x] Documentation package containing an API page and runnable example per
  element, gallery examples, generated model skill, and metadata usable by a
  documentation site.
- [x] Gallery/test runner that renders every docs, gallery, and regression
  example and produces a browsable comparison report.

## Suggested dependency order

Steps 1–5 now have basic implementations; [PLOTTING](PLOTTING.md) records the
slice and remaining limits. Grid/TextGrid now provide focused shared-column
layout; advanced unchecked details remain deferred. This sequence still records
dependencies rather than parity targets.

The exact milestones belong in `ROADMAP.md`; this order only records major
feature dependencies exposed by the original system.

1. Finish general composition: remaining placement, transforms, and coordinate
   mapping, and shared-column grids.
2. Complete geometry and reusable path primitives, then data-coordinate graphs.
3. Add text-aware composition, labels, and slide structure on the shared
   baseline/axis protocol.
4. Build scales, axes, meshes, legends, bars, and the `Plot` composition.
5. Build the common symbolic sampler and sampled lines, splines, fills, points,
   and fields.
6. Add network nodes, routed edges, and network-level defaults.
7. Add images, table loading, utilities, themes, environments, and plugins.
8. Add math metrics and primitives before TeX parsing; then restore parser
   breadth against the original strict corpus.
9. Rebuild host packages—web export, React, Node terminal/raster, PDF, Markdown,
   decks, and the batteries-included CLI—against the stabilized core.

## Save For Later

- Advanced grid tracks/spans and optional common-height figure allocation
