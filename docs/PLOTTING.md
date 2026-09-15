# Basic plotting

The first plotting slice covers the main capabilities in dependency steps 1–5
of [FEATURES](FEATURES.md). It uses the original gum-jsx-core as a semantic
reference while keeping the fresh immutable source/layout/fragment model.

```jsx
<Svg width={px(640)} height={px(400)}>
  <Plot title="A sampled function" xlabel="x" ylabel="sin(x)"
    xlim={[0, tau]} ylim={[-1.2, 1.2]} background="white">
    <SymLine fy={sin} xlim={[0, tau]}
      stroke="#2563eb" stroke_width={px(2)} />
  </Plot>
</Svg>
```

Run examples from the workspace root:

```sh
bun run gum gum-jsx-docs/topics/code/plot_wave.jsx -o /tmp/plot.png
bun run gum gum-jsx-docs/topics/code/plot_bars.jsx -f tree
```

## Implemented slices

| Step | Basic implementation |
|---|---|
| 1. Composition and coordinates | Content-sized Overlay, Anchor, Attach, Rotate, TransformBox; explicit data context and forward/inverse mapping. |
| 2. Geometry and graphs | Points, CoordLine, Segments, Arc, Spline, RoundedLine, fills, rays, arrows, shape conveniences, and Graph with inferred or explicit directed limits. |
| 3. Text and slides | TextStack/Row/Col, TextBox/Frame, TextFigure, Bullets, TitleBox/Frame, and Slide on ordinary text baselines and layout units. |
| 4. Plot composition | Linear ticks, axes and independent scale/label/mesh parts, measured margins, titles, legend, bars, BarPlot, and Plot. |
| 5. Symbolic geometry | Shared scalar/parametric/array sampler; sampled lines, splines, polygons, points, bands, and vector fields. |

The [plotting reference](../gum-jsx-docs/elements/text/Plot.md),
[coordinate reference](../gum-jsx-docs/topics/text/Coordinates.md), and
[sampling reference](../gum-jsx-docs/topics/text/Sampling.md) describe the APIs.
Every public element has a runnable page. The editor's Plotting category exposes
plots and their parts.

[Math and array helpers](../gum-jsx-docs/topics/text/MathHelpers.md), including
range, linspace, sin/cos, polar, and seeded random sampling, are available directly
in JSX and as named imports. Examples use the shared helpers for their data.

[Point inputs](../gum-jsx-docs/topics/text/PointValues.md) accept `[x,y]` or `{x,y}`,
including mixed lists and length-valued pairs. For example,
`<CoordLine points={zip(xs, xs.map(sin))} />` uses array helpers directly.
Marker/field callbacks and generated points retain named coordinates.

## Deliberate choices

- Numeric points in new graph marks are data coordinates inside Graph/Plot.
  Ordinary Line/Polyline/Path keep their local-fraction meaning; use CoordLine
  for graph paths. New marks support `space="local"` or `space="data"`.
- Widths, fonts, strokes, marker sizes, and arrowheads use layout lengths.
  Resizing remaps data and reflows text without scaling completed drawings.
- Arrow shafts retreat at headed ends after mapping. Clearance accounts for
  stroke width, cap style, and the triangular head's width; head tips and inferred
  data bounds retain the original endpoints. Field arrows share this behavior.
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
  to reserve margins, then lays out data. Scoped props such as `axis_stroke`,
  `xaxis_label_color`, and `title_wrap` route at construction. Nested part objects
  remain supported; specific scopes override shared settings per property.
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

The core suite includes plotting, sampling, geometry, composition, numeric helper,
and point representation checks. These cover coordinate cache separation,
reversed axes, singleton/empty data, immutable callback expansion, resize reuse,
measured margins, clipping, negative bars, path gaps, fixed-size markers and
heads, transforms, and text baselines. A counting font provider verifies that
resizing does not reshape prepared labels.

From the workspace root:

```sh
bun run test
bun run typecheck
bun --cwd gum-jsx-docs run check
bun run build
```

From gum-jsx-core, also check public declaration emission:

```sh
bun tsc --noEmit false --declaration --emitDeclarationOnly --outDir /tmp/gum-jsx-types
```

The [docs showcases](../gum-jsx-docs/README.md#showcases) include a curve with an
uncertainty band, negative categorical bars, custom markers on a reversed axis,
a field, and a slide. Use the CLI to render at different widths or inspect SVG,
PNG, and numerical trees; generated previews are not checked in.
