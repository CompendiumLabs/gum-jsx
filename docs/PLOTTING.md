# Basic plotting

The first plotting slice covers the main capabilities in dependency steps 1–5
of [FEATURES](FEATURES.md). It uses the original gum-jsx-core as a semantic
reference while keeping the fresh immutable source/layout/fragment model.

```jsx
<Svg width={px(640)} height={px(400)}>
  <Plot title="A sampled function" xlabel="x" ylabel="sin(x)"
    xlim={[0, 2 * pi]} ylim={[-1.2, 1.2]} background="white">
    <SymLine fy={Math.sin} xlim={[0, 2 * pi]}
      stroke="#2563eb" stroke_width={px(2)} />
  </Plot>
</Svg>
```

Run examples from the workspace root:

```sh
bun run gum gum-next-core/examples/plot_wave.jsx -o /tmp/plot.png
bun run gum gum-next-core/examples/plot_bars.jsx -f tree
```

## Implemented slices

| Step | Basic implementation |
|---|---|
| 1. Composition and coordinates | Content-sized Overlay, Anchor, Attach, Rotate, TransformBox; explicit data context and forward/inverse mapping. |
| 2. Geometry and graphs | Points, CoordLine, Segments, Arc, Spline, RoundedLine, fills, rays, arrows, shape conveniences, and Graph with inferred or explicit directed limits. |
| 3. Text and slides | TextStack/Row/Col, TextBox/Frame, TextFigure, Bullets, TitleBox/Frame, and Slide on ordinary text baselines and layout units. |
| 4. Plot composition | Linear ticks, axes and independent scale/label/mesh parts, measured margins, titles, legend, bars, BarPlot, and Plot. |
| 5. Symbolic geometry | Shared scalar/parametric/array sampler; sampled lines, splines, polygons, points, bands, and vector fields. |

The [plotting reference](../gum-next-docs/docs/text/Plot.md),
[coordinate reference](../gum-next-docs/docs/text/Coordinates.md), and
[sampling reference](../gum-next-docs/docs/text/Sampling.md) describe the APIs.
Every public element has a runnable page. The editor's Plotting category exposes
plots and their parts.

## Deliberate choices

- Numeric points in new graph marks are data coordinates inside Graph/Plot.
  Ordinary Line/Polyline/Path keep their local-fraction meaning; use CoordLine
  for graph paths. New marks support `space="local"` or `space="data"`.
- Widths, fonts, strokes, marker sizes, and arrowheads use layout lengths.
  Resizing remaps data and reflows text without scaling completed drawings.
- Graphs infer limits from an element-type `data_bounds` capability, without
  measuring or cloning children. Nested graphs form independent boundaries.
  Empty axes use [0,1], singleton data expands, and explicit limits stay exact.
- Coordinate contexts are immutable cache inputs, separate from percentage
  references. The pass transports context; elements own its interpretation.
- `define_element` can normalize input at construction. `define_component`
  adopts another element's immutable description and protocol without a layout
  wrapper. Samplers, marker functions, bar styles, and tick formatters retain
  no callbacks. Create a new element to resample.
- Plot builds axes and label descriptions once. Layout measures axis overflow
  to reserve margins, then lays out data. Parts use nested style objects
  rather than prefixed prop routing.
- Null/nonfinite samples create gaps. Lines and fills split there rather than
  joining the remaining samples across them.
- Transforms are explicit wrappers. TitleBox/Frame put measured titles above
  content. Slide uses ordinary pixel/em typography and the existing baselines.

## Current limits

Scales are linear. Log/date scales, minor ticks, tick collision avoidance,
adaptive sampling, automatic series legends, stacked/grouped bars, and advanced
arrowheads remain future work. A finite sampler cannot detect an asymptote
between finite samples; split the domain or provide a missing sample. Uniform
splines can overshoot; inferred bounds cover samples. RoundedLine uses quadratic
corners, and Arc uses cubic ellipse approximations.

Standalone axes/meshes need their own `lim` for generation; Plot supplies matching
domains. Long categorical labels may need fewer ticks or rotation. Tiny plots
can have zero-sized data areas and retain overflow. Legends occupy the top-right
data corner and can cover marks.

Wrapping rows, Grid/TextGrid, arbitrary element-level transform shorthand,
edge-attached titles, and other unchecked details in FEATURES remain deferred.
Pixel sizing already covers the old Absolute use case.

## Verification and examples

The core suite has 106 named checks, including 25 new plotting, sampling,
geometry, and composition checks. These cover coordinate cache separation,
reversed axes, singleton/empty data, immutable callback expansion, resize reuse,
measured margins, clipping, negative bars, path gaps, fixed-size markers and
heads, transforms, and text baselines. A counting font provider verifies that
resizing does not reshape prepared labels.

From the workspace root:

```sh
bun run test
bun run typecheck
bun --cwd gum-next-docs run check
bun --cwd gum-next-core run gallery
bun run build
```

From gum-next-core, also check public declaration emission:

```sh
bun tsc --noEmit false --declaration --emitDeclarationOnly --outDir /tmp/gum-next-types
```

The [gallery](../gum-next-core/examples/README.md) includes a curve with an
uncertainty band at two widths, negative categorical bars, custom markers on a
reversed axis, a field, and a slide. SVG, PNG, and numerical trees are checked in.
