# Plots and charts

Start with [Plot](plotting.md#Plot) for a Cartesian chart with
axes, ticks, grid lines, titles, or a legend. It measures these decorations and
keeps their domains synchronized. Curves, points, fills, and annotations are
children of the plot; they do not require rebuilding its frame.
Grid lines are off by default: set `grid` for both directions, or use `xgrid`
or `ygrid` alone for one direction.

Axes can cross inside the data area: use `xaxis-at={0}` and `yaxis-at={0}` for
axes through the origin. Axis scopes also accept arrowheads, line styles, tick
formatting, and label options; see [Axis](graph.md#Axis).

Use [Graph and manual axes](graph.md) for a custom coordinate canvas or projection.
[Additional plot marks](plotting-marks.md) covers individual bars, vector fields,
and parametric shapes.

<a id="Plot"></a>

## Plot

Compose graphable children with linear axes, grid lines, measured tick labels,
axis titles, an optional legend, and an optional background. Limits follow
[Graph](graph.md#Graph); inferred limits have no padding unless `padding` is supplied.

| Property | Default | Meaning |
|---|---|---|
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` / `ylim` | Inferred | Directed data limits |
| `flip-x` / `flip-y` | `false` / `true` | Reverse horizontal or vertical screen mapping |
| `padding` | `0` | Inferred-limit fractions: scalar, side/axis object, `[h, v]`, or `[t, b, l, r]` |
| `axis` | `true` | Enable or disable both axes by default |
| `xaxis` / `yaxis` | `axis` | Boolean or **Axis** props for one axis |
| `xticks` / `yticks` | `5` | Target count or explicit values / labeled pairs |
| `grid` | Unset | Enable or disable both grid directions; overrides `xgrid` / `ygrid` |
| `xgrid` / `ygrid` | `false` | Draw lines at x / y ticks when `grid` is unset |
| `title` / `xlabel` / `ylabel` | — | String or **Element**; the y title rotates −90° |
| `legend` | — | **Legend** **Element** or array of **Legend** entries |
| `margin` | `em(3/4)` | Extra outer space; accepts [Box padding forms](layout.md#Box) |
| `label-gap` | `em(1/2)` | Space between titles and measured axis extents |
| `bounds` | `"outer"` | `"frame"` makes the allocation the data area alone; see below |
| `background` | — | Full-frame background paint |
| `plot-background` | — | Data-area background paint |
| `border-width` | `px(0)` | Data-area border thickness |
| `border-color` | `"theme:border"` | Data-area border paint |
| `clip` | `true` | Clip data marks to the data area |
| `axis-*` / `xaxis-*` / `yaxis-*` | — | Flat **Axis** option overrides |
| `tick-*` / `label-*` | — | Shared generated tick and label styles |
| `title-*` / `xlabel-*` / `ylabel-*` | — | Generated title text options |
| `grid-*` / `xgrid-*` / `ygrid-*` | — | Grid options and styles |
| `legend-*` | — | Generated **Legend** options |
| `*-style` | — | Nested options for the corresponding scopes |

Grid lines are off by default. Set `grid` (or `grid={true}`) for both
directions, `xgrid` for vertical lines, or `ygrid` for horizontal lines. Leave
`grid` unset when choosing directions separately; an explicit `grid` value
controls both. Grid style props such as `grid-stroke` do not enable the grid.

Padding uses [Graph's side and axis forms](graph.md#Graph), with numeric fractions
of inferred data spans. Explicit limits stay exact.

Fonts inherit from the parent (16px at the root). Axis and grid strokes default to
`em(1/16)`, tick lengths to `em(5/16)`, and tick-label offsets to `em(1/4)`.
These details, `margin`, and `label-gap` scale with `font-size`; changing only the
plot's width or height keeps them the same size. Label-specific font overrides
leave axis geometry unchanged. Use `axis-stroke-width`, `tick-stroke-width`, or
`grid-stroke-width` with `px(...)` for fixed thicknesses.
Margins come from measured axis overflow and title sizes.
Text uses `theme:text`, axes use `theme:muted`, and grid lines use `theme:neutral`.
These paints follow the inherited [theme](../guides/themes.md).
Title and x title wrap at the usable width. Explicit margin adds space to those
measurements. The fragment's content rectangle identifies the data area.

For example, `axis-stroke={slate}` affects both axes and
`xaxis-label-color={blue}` changes only the x tick labels. Use
`axis-tick-side="inner"` to point both axes' ticks into the data area. Common tick/label
settings precede common axis settings, then xaxis/yaxis option objects, then
flat `xaxis-`/`yaxis-` props. Part option records merge per field. At the same scope,
flat props override matching nested settings. `title-wrap={false}` disables title
wrapping. See [scoped props](../guides/style.md#scoped-component-props).

Scopes preserve `label-gap` and do not enable an explicitly disabled axis. **Plot**
supplies axis/grid domains; explicit xticks/yticks override scoped axis tick
options. Callback props such as `xaxis-format` run when the axes are constructed.
Supplied title, label, and legend **Element**s retain their own descriptions.

**Plot** fills finite offers, naturally measures 480×320, and derives a missing axis
at 1.5 unless aspect is supplied. In a stack, give it a preferred height or an
explicit flex allocation. Small frames can exhaust the data area and report
overflow; they never shrink text to fit.

With `bounds="frame"`, the allocation is the data area itself: `width`, `height`,
and `aspect` size the graph frame, and ticks, labels, and titles sit outside it.
Stacked plots then align their data areas whatever their tick labels measure, and
an identified plot connects at its frame. Containers do not make room for those
decorations, so leave a large enough `gap` or `padding` around the plot. The space
they need, including `margin`, is reported as the fragment's outset, and a hugging
[Page](layout.md#Page) viewport grows to include it.

This first version has linear scales. Log/date scales, minor ticks, label
collision avoidance, automatic legend extraction, and legend placement
optimization are deferred. Use fewer ticks, shorter labels, or an axis rotate
option for crowded categories.

<a id="Plot-example"></a>

### Example

```jsx
// A sampled curve, uncertainty band, observations, and a measured legend.
const wave = (x) => sin(x) * exp(-x / 9)
const observations = linspace(0.4, 11.8, 15).map((x, i) => [
  x,
  wave(x) + 0.08 * cos(i * 3),
])
return (
  <Plot
    aspect={1.5}
    title="A damped oscillation"
    xlabel="Time (s)"
    ylabel="Amplitude"
    xlim={[0, 12]}
    ylim={[-1.3, 1.3]}
    grid
    legend={[
      { label: "Model", color: blue },
      { label: "Observations", kind: "point", color: red },
    ]}
  >
    <SymFill
      xlim={[0, 12]}
      upper={(x) => wave(x) + 0.16}
      lower={(x) => wave(x) - 0.16}
      fill={blue}
      opacity={0.25}
    />
    <SymLine
      xlim={[0, 12]}
      fy={wave}
      samples={241}
      stroke={blue}
      stroke-width={px(2.5)}
    />
    <Points points={observations} fill={red} point-size={px(7)} />
  </Plot>
)
```

---

For a complete bar chart, use BarPlot. For a curve defined by a function, put
SymLine inside Plot; sampled data can use
[Polyline](geometry.md#Polyline) or
[Points](geometry.md#Points).

<a id="BarPlot"></a>

## BarPlot

| Property | Default | Meaning |
|---|---|---|
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` / `ylim` | Inferred | Directed data limits |
| `flip-x` / `flip-y` | `false` / `true` | Reverse horizontal or vertical screen mapping |
| `padding` | `0` | Inferred-limit fractions: scalar, side/axis object, `[h, v]`, or `[t, b, l, r]` |
| `values` | `[]` | Bar endpoints |
| `positions` | Indices | Bar centers |
| `bases` | `0` | Scalar, array, or callback for bar baselines |
| `bar-width` | `0.8` | Scalar, array, or callback for widths in data units |
| `direction` | `"vertical"` | Vertical or horizontal bars |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `styles` | — | Per-bar style array or `(value, index) => style` callback; may override `border-radius` |
| `axis` | `true` | Enable or disable both axes by default |
| `xaxis` / `yaxis` | `axis` | Boolean or **Axis** props for one axis |
| `xticks` / `yticks` | `5` | Target count or explicit values / labeled pairs |
| `grid` | Unset | Enable or disable both grid directions; overrides `xgrid` / `ygrid` |
| `xgrid` / `ygrid` | `false` | Draw lines at x / y ticks when `grid` is unset |
| `title` / `xlabel` / `ylabel` | — | String or **Element**; the y title rotates −90° |
| `legend` | — | **Legend** **Element** or array of **Legend** entries |
| `margin` | `em(3/4)` | Extra outer space; accepts [Box padding forms](layout.md#Box) |
| `label-gap` | `em(1/2)` | Space between titles and measured axis extents |
| `bounds` | `"outer"` | `"frame"` makes the allocation the data area alone; see below |
| `background` | — | Full-frame background paint |
| `plot-background` | — | Data-area background paint |
| `border-width` | `px(0)` | Data-area border thickness |
| `border-color` | `"theme:border"` | Data-area border paint |
| `clip` | `true` | Clip data marks to the data area |
| `axis-*` / `xaxis-*` / `yaxis-*` | — | Flat **Axis** option overrides |
| `tick-*` / `label-*` | — | Shared generated tick and label styles |
| `title-*` / `xlabel-*` / `ylabel-*` | — | Generated title text options |
| `grid-*` / `xgrid-*` / `ygrid-*` | — | Grid options and styles |
| `legend-*` | — | Generated **Legend** options |
| `*-style` | — | Nested options for the corresponding scopes |

Compose [Bars](plotting-marks.md#Bars) and [Plot](plotting.md#Plot). Accepts values, positions, bases,
`bar-width`, direction, border radius, and styles along with **Plot** props. Additional
children overlay bars and participate in limit inference.

Grid lines are off by default. Set `grid` for both directions, or use
`xgrid` / `ygrid` with `grid` unset to choose directions separately, as on
[Plot](plotting.md#Plot). Grid style props alone do not enable grid lines.

For rounded tops with square baselines on positive vertical bars, use
`border-radius={{ t: em(0.5) }}`. Horizontal bars can use `border-radius={{ r: em(0.5) }}`.
Sides refer to screen edges, so negative bars may need `b` or `l` instead.
Scalar, paired, and individual corner radii follow [Bars](plotting-marks.md#Bars).

Padding follows [Graph](graph.md#Graph): values are fractions of inferred data spans.
Use `padding={[0.12, 0.1]}` for horizontal/vertical padding, or **Box**-style side
shorthands for individual edges. `margin` adds layout space around the plot.

`fill` and `border-radius` set shared bar defaults; entries returned by `styles` can
override either. For a value-dependent radius, return it from `styles`:

```jsx
<BarPlot
  values={[28, -17, 43]}
  styles={(value) => ({
    fill: value < 0 ? red : green,
    border_radius: value < 0 ? { b: em(0.5) } : { t: em(0.5) },
  })}
/>
```

This rounds the exposed ends under the default vertical axes. `border_radius: 0`
keeps an individual bar square; an omitted radius uses the shared default.
Callbacks receive the endpoint value and original index, and run once at
construction. Use `styles` for per-bar callbacks; `border-radius` itself takes a shared
radius value.

Positions are numeric data coordinates. Supply [value,label] ticks for categories:
xticks for vertical bars, yticks for horizontal. Limits include baselines and
widths. Grouping and automatic stacking are deferred.

<a id="BarPlot-example"></a>

### Example

```jsx
// Categorical ticks, positive and negative bars, and functional bar colors.
<Page width={px(640)} height={px(380)} font-size={px(16)}>
  <BarPlot ygrid
    values={[28, 43, -17, 56, 34]}
    title="Change by region"
    xlabel="Region"
    ylabel="Change (%)"
    xlim={[-1, 5]}
    ylim={[-20, 60]}
    bar-width={0.7}
    xticks={enumerate(["North", "East", "Central", "South", "West"])}
    styles={(value) => ({
      fill: value < 0 ? red : blue,
      border_radius: value < 0 ? {b: em(0.3)} : {t: em(0.3)},
    })}
  >
    <Polyline points={[[-1, 0], [5, 0]]} stroke={darkgray} />
  </BarPlot>
</Page>
```

---

<a id="SymLine"></a>

## SymLine

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric function returning a numeric coordinate record, `[x,y]`, or null |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |
| `closed` | `false` | Close each finite run |

Sample a function at the specified values and draw with [Polyline](geometry.md#Polyline).
Null/nonfinite samples split paths or omit markers.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.
Named records such as `{theta, r}` retain every dimension until the enclosing
Graph projects them. Any nonfinite dimension creates a gap. `fx`, `fy`,
`xvals`, and `yvals` retain their Cartesian meanings.

All **Polyline** styling options are available.
Use [SymArrow](plotting-marks.md#SymArrow) for the same sampling options with optional arrowheads.
Construction stores immutable sampled data; resizing never executes callbacks.

<a id="SymLine-example"></a>

### Example

```jsx
// SymLine uses the shared sampler.
<Plot aspect={1.5} margin={em(2)}>
  <SymLine
    fy={sin}
    xlim={[0, tau]}
    samples={101}
    stroke={blue}
    stroke-width={px(2)}
  />
</Plot>
```

---

<a id="SymPoints"></a>

## SymPoints

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric function returning a numeric coordinate record, `[x,y]`, or null |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |
| `point-size` | `px(6)` | Marker size, pair, or callback |
| `shape` | `Circle` | Marker **Element** or callback |
| `children` | — | Single marker **Element**, as an alternative to `shape` |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with [Points](geometry.md#Points).
Null/nonfinite samples split paths or omit markers.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.
Named records such as `{theta, r}` retain every dimension until the enclosing
Graph projects them. Any nonfinite dimension creates a gap. `fx`, `fy`,
`xvals`, and `yvals` retain their Cartesian meanings.

All **Points** styling options are available. shape and `point-size` functions run once per finite sample.
Pass one marker element as a child or use `shape`; supplying both or multiple
marker children is an error. Use a `shape` callback for per-sample markers.

```jsx
<SymPoints fy={sin} samples={12}>
  <Rect fill="red" />
</SymPoints>
```

The default circle uses the theme foreground fill and no stroke. Custom shapes
use normal style inheritance and their own styling, including explicit fill and
stroke passed through **SymPoints**.
Construction stores immutable sampled data; resizing never executes callbacks.

<a id="SymPoints-example"></a>

### Example

```jsx
// SymPoints uses the shared sampler.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <SymPoints
      fy={sin}
      xlim={[0, tau]}
      samples={17}
      fill={blue}
      point-size={px(7)}
    />
  </Plot>
</Box>
```

---

<a id="SymFill"></a>

## SymFill

| Property | Default | Meaning |
|---|---|---|
| `upper` | `1` | Upper function or constant |
| `lower` | `0` | Lower function or constant |
| `xlim` / `ylim` | `[0, 1]` | Sampling range for vertical / horizontal fills |
| `xvals` / `yvals` | `Generated` | Explicit sample coordinates |
| `samples` | `101` | Number of generated samples |
| `direction` | `"vertical"` | Fill vertically or horizontally |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Sample a band between upper and lower functions or numbers (defaults 1 and 0).
Vertical fills use xvals/xlim (default [0,1]); horizontal fills use yvals/ylim.
samples defaults to 101. Other options follow [Fill](geometry.md#Fill), including
direction, fill, stroke, and space.

A missing/nonfinite value in either boundary splits the whole band. Both
boundaries contribute to limits. Callbacks execute once at construction.

<a id="SymFill-example"></a>

### Example

```jsx
// A sampled function band.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <SymFill
      xlim={[0, 6]}
      upper={(x) => sin(x) + 0.3}
      lower={(x) => sin(x) - 0.3}
      fill={blue}
    />
  </Plot>
</Box>
```

---

Pass a Legend or an array of entries through Plot's `legend` prop to include it
in the measured layout. Use a standalone Legend when the surrounding composition
owns its placement.

<a id="Legend"></a>

## Legend

| Property | Default | Meaning |
|---|---|---|
| `children` | Empty | [LegendItem](plotting.md#LegendItem) rows or custom elements |
| `gap` | `em(0.4)` | Vertical space between entries |
| `badge-width` | `em(1.8)` | Width of generated line, point, or bar badges |
| `label-style` / `label-*` | — | Nested or flat text options for generated labels |
| `padding` | `em(0.6)` | Space inside the legend box; accepts [Box padding forms](layout.md#Box) |
| `border-width` | `px(1)` | Border thickness inside the frame |
| `border-color` | `"theme:border"` | Border paint |
| `background` | `none` | Explicit **Legend** background |
| `border-radius` | `px(4)` | **Box** corner radius |
| `align` | `"start"` | Content alignment inside the box |
| `clip` | `false` | Clip content inside the rounded border |

A measured box of badge/label rows. Supply [LegendItem](plotting.md#LegendItem) children
for generated badges and labels, or custom elements for complete rows.

**Box** props control decoration and sizing. Defaults: transparent background, 1px theme
border, 0.6em padding. Badges use `theme:accent` unless an item supplies `badge-color`.
gap is row spacing (0.4em); `badge-width` defaults to 1.8em;
`label-style` supplies generated text options, also available as scoped props such
as `label-color`, `label-font-size`, or `label-wrap`. Flat props override matching
nested fields. Supplied label/badge **Element**s retain their own props.
**Legend** hugs its rows. **Plot**'s legend prop
places it inside top right and still accepts legend records for that separate slot;
layout containers can place a **Legend** elsewhere.

<a id="Legend-example"></a>

### Example

```jsx
// Legend badges and labels.
<Box padding={em(2)}>
  <Legend>
    <LegendItem badge-color={blue}>Prediction</LegendItem>
    <LegendItem badge-color={red} kind="point">Sample</LegendItem>
    <LegendItem badge-color={green} kind="bar">Total</LegendItem>
  </Legend>
</Box>
```

---

<a id="LegendItem"></a>

## LegendItem

One badge and label row inside [Legend](plotting.md#Legend). Supply the label as children.

| Property | Default | Meaning |
|---|---|---|
| `children` | Empty | Label text or an **Element** |
| `badge-color` | `"theme:accent"` | Generated badge color |
| `kind` | `"line"` | Generated line, point, or bar badge |
| `badge` | Generated | Custom badge **Element** |
| `badge-width` | Inherited from **Legend** or `em(1.8)` | Width of a generated badge |
| `label-style` | Inherited from **Legend** | Text options for a generated label |

A supplied label **Element** keeps its own style. **Legend** applies its
`label-style` and `label-*` options to generated text labels.

<a id="LegendItem-example"></a>

### Example

```jsx
// Individual legend rows take their labels from children.
<Box padding={em(2)}>
  <Legend>
    <LegendItem badge-color={blue}>Prediction</LegendItem>
    <LegendItem badge-color={red} kind="point">Sample</LegendItem>
  </Legend>
</Box>
```
