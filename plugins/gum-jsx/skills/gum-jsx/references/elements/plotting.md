# Plotting elements

<a id="Axis"></a>

## Axis

An axis occupies the graph frame; ticks and labels extend outside it. **Plot**
measures that overflow to reserve margins. Use an axis inside **Graph** to compose
your own frame.

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain; explicit outside **Plot** |
| `ticks` | `5` | Target count or explicit numbers / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed step instead of automatic 1/2/5 intervals |
| `side` | `"bottom"` | Axis edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, or an explicit side |
| `label-offset` | `px(4)` | Gap between ticks and labels |
| `label-anchor` | Side-dependent | Point on each label attached to its tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `px(7)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

Pair labels may be strings, numbers, or **Element**s. Out-of-domain ticks are omitted.
Use `tick-side="inner"` for inward ticks. `"outer"` follows `side`; explicit
cardinal values such as `side="bottom"` with `tick-side="top"` are also accepted.
Labels remain on `side`; when ticks point the other way, `label-offset` is measured
from the baseline.
Label anchors use the standard point forms. For example, a rotated bottom-axis
label can hang from its top-right corner with
`label-anchor={['end', 'start']}`. The default centers labels along the axis and
selects the edge facing the axis.
Arrowhead options follow [ArrowHead](geometry.md#ArrowHead): for example, `arrow-open`,
`arrow-curve`, `arrow-barb`, and `arrow-stroke` control the head drawn by `arrow`.
Scopes configure generated labels; supplied **Element**s keep their own props.
Flat props override matching fields of nested objects. `tick-size`, `tick-side`,
`label-offset`, `arrow-size`, `arrow-width`, and ordinary `line-height` remain owner props.
These scopes also work on **Axis**'s
directional, labels-only, and scale-only variants. See
[scoped props](../guides/style.md#scoped-component-props).

Automatic 1/2/5 intervals need not include every endpoint; public linear_ticks
and format_tick expose the helpers. Work is bounded to 10000 ticks.

Ticks and label descriptions are fixed at construction. A standalone **Axis** uses
lim for generation and the ambient graph for mapping; provide matching limits,
or let [Plot](plotting.md#Plot) construct it. Minor ticks and collision avoidance are
deferred.

<a id="Axis-example"></a>

### Example

```jsx
// Explicit labels and a directed axis with scoped line, tick, and text styles.
<Box padding={em(3)}>
  <Graph xlim={[0, 4]} ylim={[0, 1]}>
    <HAxis
      at={0.5}
      lim={[0, 4]}
      ticks={[
        [1, "Start"],
        [2, "Middle"],
        [3, "End"],
      ]}
      arrow
      arrow-open
      arrow-curve={0.5}
    />
    <VAxis
      lim={[0, 1]}
      ticks={[0, 0.25, 0.5, 0.75, 1]}
    />
  </Graph>
</Box>
```

---

<a id="Bar"></a>

## Bar

| Property | Default | Meaning |
|---|---|---|
| `value` | `1` | Bar endpoint |
| `position` | `0` | Bar center |
| `base` | `0` | Bar baseline |
| `bar-width` | `0.8` | Width in data units |
| `direction` | `"vertical"` | Vertical or horizontal bar |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `space` | Automatic | Use ambient data coordinates or local geometry |

One bar with value (default 1), position (0), base (0), and `bar-width`
(0.8 data units). Direction defaults to vertical, or horizontal for **HBar**.
Other geometry and paint follow [Bars](plotting.md#Bars), including border radius. Compose
multiple bars as children or use **Bars** for arrays.

<a id="Bar-example"></a>

### Example

```jsx
// One Bar with an explicit baseline.
<Box padding={em(2)}>
  <Plot>
    <Bar
      value={3}
      position={1}
      base={-1}
      bar-width={0.6}
      fill={blue}
      border-radius={em(0.5)}
    />
  </Plot>
</Box>
```

---

<a id="BarPlot"></a>

## BarPlot

| Property | Default | Meaning |
|---|---|---|
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` / `ylim` | Inferred | Directed data limits |
| `flip-x` / `flip-y` | `false` / `true` | Reverse horizontal or vertical screen mapping |
| `padding` | `0.05` | Inferred-limit fractions: scalar, side/axis object, `[h, v]`, or `[t, b, l, r]` |
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
| `grid` | `true` | Draw grid lines at axis ticks |
| `title` / `xlabel` / `ylabel` | — | String or **Element**; the y title rotates −90° |
| `legend` | — | **Legend** **Element** or array of **Legend** entries |
| `margin` | `px(12)` | Extra outer space; accepts [Box padding forms](layout.md#Box) |
| `label-gap` | `px(8)` | Space between titles and measured axis extents |
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

Compose [Bars](plotting.md#Bars) and [Plot](plotting.md#Plot). Accepts values, positions, bases,
`bar-width`, direction, border radius, and styles along with **Plot** props. Additional
children overlay bars and participate in limit inference.

For rounded tops with square baselines on positive vertical bars, use
`border-radius={{ t: em(0.5) }}`. Horizontal bars can use `border-radius={{ r: em(0.5) }}`.
Sides refer to screen edges, so negative bars may need `b` or `l` instead.
Scalar, paired, and individual corner radii follow [Bars](plotting.md#Bars).

Padding follows [Graph](plotting.md#Graph): values are fractions of inferred data spans.
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
<Svg width={px(640)} height={px(380)} font-size={px(16)}>
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
    <CoordLine points={[[-1, 0], [5, 0]]} stroke={darkgray} />
  </BarPlot>
</Svg>
```

---

<a id="Bars"></a>

## Bars

| Property | Default | Meaning |
|---|---|---|
| `values` | `[]` | Bar endpoints |
| `positions` | Indices | Bar centers; must match `values` |
| `bases` | `0` | Scalar, array, or callback for bar baselines |
| `bar-width` | `0.8` | Scalar, array, or callback for widths in data units |
| `direction` | `"vertical"` | Vertical or horizontal bars |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `styles` | — | Per-bar style array or `(value, index) => style` callback; may override `border-radius` |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Draw bars from values. positions supplies centers (default indices starting at
zero), bases defaults to zero, and `bar-width` to 0.8 data units. bases and
`bar-width` accept a scalar, a same-length array, or (value,index) function.
Values are endpoints, not lengths relative to a base.

direction defaults to vertical, or horizontal for **HBars**. Negative values work
in either direction. Widths and bases contribute to inferred limits. Nonfinite
values are omitted without shifting category indices.

styles accepts a same-length array or (value,index) function returning style
objects, evaluated once at construction. Defaults: blue fill, no stroke.
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](plotting.md#Graph) or
[Plot](plotting.md#Plot) for data coordinates.

Return `border_radius` in a style entry to override the shared radius for that bar:
`styles={(value) => ({ border_radius: px(abs(value) / 4) })}`. Style arrays support the
same field. An omitted radius inherits the shared value; `border_radius: 0` keeps that
bar square. Callbacks receive the original value and index, skipping nonfinite
values, and are not rerun during resizing. Per-bar radii accept all forms below;
their `em` lengths use the bar's resolved font size.

Radius also accepts an elliptical `[x, y]` / `{ x, y }` pair or a side/corner
object using `t`, `b`, `l`, `r`, `tl`, `tr`, `bl`, and `br`, as on [Box](layout.md#Box).
Each entry can be a scalar or pair. For positive vertical bars, round only the
top with `border-radius={{ t: em(0.5) }}` to keep the baseline square. For positive
horizontal bars, use `border-radius={{ r: em(0.5) }}`.

Sides refer to screen edges, including for negative values and flipped axes.
Use `b` for the exposed end of a negative vertical bar and `l` for a negative
horizontal bar under the default axes. Scalar fractions use the mark allocation's
shorter side; pairs use its width and height. Each bar then caps the resolved
radii at half its own dimensions. px/em radii keep the same size across bars.

<a id="Bars-example"></a>

### Example

```jsx
// Bars with positive and negative values.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <Bars
      values={[2, 4, -1, 3]}
      border-radius={em(0.35)}
      styles={(v) => ({ fill: v < 0 ? red : blue })}
    />
  </Plot>
</Box>
```

---

<a id="Field"></a>

## Field

| Property | Default | Meaning |
|---|---|---|
| `vectors` | `[]` | `{ point, vector }` samples |
| `scale` | `1` | Multiplier applied to every vector |
| `normalize` | `false` | Normalize vectors before applying `scale` |
| `head-size` | `px(5)` | Arrowhead length for built-in arrows |
| `head-width` | `1.3` | Full arrowhead width divided by its length |
| `head-curve` | `0` | Barb curvature from `0` to `1`, as in [Arrow](geometry.md#Arrow) |
| `head-open` | `false` | Draw stroked barbs connected to the shaft tip |
| `head-barb` | `"both"` | Draw both barbs, or only `"left"` / `"right"` relative to each vector |
| `head-style` / `head-*` | — | Shared ArrowHead shape and paint options, as in [Arrow](geometry.md#Arrow) |
| `shape` | — | Replacement **Element** or `(sample, index) => Element` callback |
| `shape-height` | `px(8)` | Height allocated to replacement shapes |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Draw `vectors=[{point,vector},...]`, with either `{x,y}` or `[x,y]` for each
point and vector. Each endpoint is point + scale ×
vector. scale defaults to 1; normalize divides by magnitude before scaling.
Zero/nonfinite vectors are omitted. Origins and endpoints both affect limits.

Default glyphs are arrows, with `head-size` `px(5)`, `head-width` 1.3, and ordinary
stroke style. Directions are computed after mapping, so flips and unequal axis
scales orient heads correctly. Shafts stop inside their heads using the same
stroke/cap clearance as [Arrow](geometry.md#Arrow); head tips remain at the mapped endpoints.
With `head-open`, the shaft reaches the tip and the barbs inherit its stroke.

shape accepts an **Element** or (sample,index) function. A custom shape's local x
axis runs from origin to endpoint: width is the mapped vector length;
`shape-height` defaults to `px(8)`. It receives a cleared data context before
rotation. Callbacks execute once at construction and always receive `{x,y}`
records in sample.point and sample.vector, including for tuple inputs.

<a id="Field-example"></a>

### Example

```jsx
// Explicit vector samples.
<Box padding={em(2)}>
  <Plot>
    <Field
      vectors={[
        { point: [0, 0], vector: [1, 2] },
        { point: [1, 0], vector: [2, 1] },
      ]}
      stroke={blue}
      stroke-width={px(2)}
      head-size={em(1)}
    />
  </Plot>
</Box>
```

---

<a id="Graph"></a>

## Graph

| Property | Default | Meaning |
|---|---|---|
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` | Inferred or `[0, 1]` | Directed horizontal data limits |
| `ylim` | Inferred or `[0, 1]` | Directed vertical data limits |
| `flip-x` | `false` | Reverse horizontal screen mapping |
| `flip-y` | `true` | Reverse vertical screen mapping for Cartesian y-up coordinates |
| `padding` | `0` | Inferred-limit fractions: scalar, side/axis object, `[h, v]`, or `[t, b, l, r]` |
| `clip` | `false` | Clip children to the graph frame |
| `projection` | None | Pure `([x, y]) => [u, v]` callback, or a core `Projection` |

A finite canvas with a linear data coordinate system by default. **Graph** infers limits from
graphable children or accepts `xlim={[min,max]}`, `ylim={[min,max]}`, or
`coord={[xmin,ymin,xmax,ymax]}`. Individual limits override coord.

The default is Cartesian: x right, y up. `flip-x` defaults to false and `flip-y` to
true. Descending limits also reverse an axis. padding is a dimensionless fraction
of each inferred data span; explicit limits stay exact.
Empty axes use [0,1]. A singleton expands by `max(0.5, 5% of its magnitude)`;
explicit equal endpoints are errors.

Padding uses the same side and axis shorthands as [Box](layout.md#Box): a scalar,
`[h, v]`, `[t, b, l, r]`, or an object with `h`/`v`, `t`/`b`/`l`/`r`, or full
side names. Full names override short names, which override axis defaults;
missing sides are zero. The earlier `{x, y}` form remains an alias for `{h, v}`.
Values are nonnegative fractions of the inferred span, with no px/em units.
For example, `padding={[0.12, 0.1]}` adds 12% on each horizontal side and 10% on
each vertical side. Side names refer to displayed edges, including flipped axes.
These forms also work in **Plot**, **BarPlot**, and `infer_coordinates`.

**Graph** naturally measures 480×320, fills finite offers, and uses a 1.5 aspect to
derive a missing axis. An explicit aspect applies the ordinary shape sizing policy.
Nested **Graph**/**Plot** limits are independent and do not affect outer inference.

[CoordLine](geometry.md#CoordLine), [Points](geometry.md#Points), new geometry marks, bars, and
symbolic marks use data coordinates. **Line** and **Polyline** default to local
fractional geometry; set `space="data"` to use the graph's coordinate mapping.
**Path** retains local geometry. For marks that use data coordinates by default,
`space="local"` opts out; `space="data"` requires a coordinate context.
px/em geometry stays local.

Direct-child x/y positions are data coordinates; omitted positions are at the
local origin. Use x/y/anchor with **Text** for upright annotations, and px/em sizes
for fixed geometry. Annotations do not affect inferred limits. Strokes, markers,
and fonts keep their layout sizes on resize.

With `projection`, each numeric pair is transformed before the usual limits and
flips map it to pixels. For polar data, use
`projection={([theta, r]) => [r * cos(theta), r * sin(theta)]}`. Supply both
`xlim` and `ylim` (or `coord`) in the **output** coordinate space; custom
projections do not infer limits. A square canvas with limits `[-1, 1]` on both
axes displays a unit polar disk.

Numeric child `x`/`y` annotations use the same projection. If only one numeric
position is given, the other defaults to data zero; if both are omitted, the
child stays at the local origin. Two tagged lengths bypass projection; mixing
a data number with a tagged length is an error. `space="local"` still opts marks
out. A callback may return `null` to hide a point or break a sampled path.

Callbacks must be pure and stable for the lifetime of the element. They run
during layout, unlike construction-time style callbacks. Elements project only
the points they already have: supply a sampled route to **Arrow** or **CoordLine**
when a nonlinear projection should bend it. Text and marker shapes stay upright;
paths are not automatically resampled. See [Projections](../guides/projections.md)
for a polar plot, the core API, and geometry limitations.

clip defaults to false. Clipping hides paint but retains reported overflow.
Use [Plot](plotting.md#Plot) for measured axes and margins, and [Coordinates](../guides/coordinates.md)
for custom graphable elements.

<a id="Graph-example"></a>

### Example

```jsx
// Directed limits reverse x while annotations and custom markers remain upright.
const samples = [
  [1, 2],
  [3, 4],
  [6, 3],
  [8, 7],
]
return (
  <Box padding={em(1.75)}>
    <Graph xlim={[10, 0]} ylim={[0, 8]}>
      <Mesh2D xlim={[0, 10]} ylim={[0, 8]} />
      <Spline points={samples} stroke={blue} stroke-width={px(2)} />
      <Points
        points={samples}
        point-size={(p, i) => px(8 + i * 2)}
        shape={<Square fill={blue} stroke={white} stroke-width={px(1)} />}
      />
      <Text x={8} y={7.25} anchor={['center', 'end']} font-size={em(0.9)} color={blue}>Peak</Text>
      <HAxis lim={[10, 0]} />
      <VAxis lim={[0, 8]} />
    </Graph>
  </Box>
)
```

---

<a id="HAxis"></a>

## HAxis

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Axis edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"top"`, or `"bottom"` |
| `label-offset` | `px(4)` | Gap between ticks and labels |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `px(7)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

**HAxis** draws a baseline, ticks, and labels. It defaults to `side="bottom"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="HAxis-example"></a>

### Example

```jsx
// HAxis as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <HAxis lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="HBar"></a>

## HBar

| Property | Default | Meaning |
|---|---|---|
| `value` | `1` | Bar endpoint |
| `position` | `0` | Bar center |
| `base` | `0` | Bar baseline |
| `bar-width` | `0.8` | Width in data units |
| `direction` | `"horizontal"` | Vertical or horizontal bar |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `space` | Automatic | Use ambient data coordinates or local geometry |

One bar with value (default 1), position (0), base (0), and `bar-width`
(0.8 data units). Direction defaults to vertical, or horizontal for **HBar**.
Other geometry and paint follow [Bars](plotting.md#Bars), including border radius. Compose
multiple bars as children or use **Bars** for arrays.

<a id="HBar-example"></a>

### Example

```jsx
// One HBar with an explicit baseline.
<Box padding={em(2)}>
  <Plot>
    <HBar
      value={3}
      position={1}
      base={-1}
      bar-width={0.6}
      fill={blue}
      border-radius={em(0.5)}
    />
  </Plot>
</Box>
```

---

<a id="HBars"></a>

## HBars

| Property | Default | Meaning |
|---|---|---|
| `values` | `[]` | Bar endpoints |
| `positions` | Indices | Bar centers; must match `values` |
| `bases` | `0` | Scalar, array, or callback for bar baselines |
| `bar-width` | `0.8` | Scalar, array, or callback for widths in data units |
| `direction` | `"horizontal"` | Vertical or horizontal bars |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `styles` | — | Per-bar style array or `(value, index) => style` callback; may override `border-radius` |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Draw bars from values. positions supplies centers (default indices starting at
zero), bases defaults to zero, and `bar-width` to 0.8 data units. bases and
`bar-width` accept a scalar, a same-length array, or (value,index) function.
Values are endpoints, not lengths relative to a base.

direction defaults to vertical, or horizontal for **HBars**. Negative values work
in either direction. Widths and bases contribute to inferred limits. Nonfinite
values are omitted without shifting category indices.

styles accepts a same-length array or (value,index) function returning style
objects, evaluated once at construction. Defaults: blue fill, no stroke.
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](plotting.md#Graph) or
[Plot](plotting.md#Plot) for data coordinates.

Use `border-radius={{ r: em(0.5) }}` for rounded right ends and square left ends, or
specify individual `tl`, `tr`, `bl`, and `br` corners. Each entry accepts a length
or elliptical pair. See [Bars](plotting.md#Bars) for all forms and screen-edge semantics.
For value-dependent rounding, return `border_radius` from `styles`, for example
`styles={(v) => ({ border_radius: v < 0 ? { l: em(0.5) } : { r: em(0.5) } })}`.

<a id="HBars-example"></a>

### Example

```jsx
// Positive horizontal bars with rounded right ends and square baselines.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <HBars
      values={[2, 4, 1, 3]}
      border-radius={{ r: em(0.5) }}
      fill={blue}
    />
  </Plot>
</Box>
```

---

<a id="HLabel"></a>

## HLabel

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `px(4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](plotting.md#Axis), including
lim, side, at, `tick-size`, `tick-side`, `label-offset`, rotate, and `label-style`. The value must
lie in lim. **VLabel** defaults to the left side, **Label** and **HLabel** to the bottom.

<a id="HLabel-example"></a>

### Example

```jsx
// One explicit tick label.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <HLabel lim={[0, 4]} value={2}>Midpoint</HLabel>
  </Graph>
</Box>
```

---

<a id="HLabels"></a>

## HLabels

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `px(4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**HLabels** draws labels only, without a baseline or ticks. It defaults to `side="bottom"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="HLabels-example"></a>

### Example

```jsx
// HLabels as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <HLabels lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="HMesh"></a>

## HMesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `direction` | `"x"` | Draw vertical lines; may be overridden |

Grid lines at ticks using the count/explicit/interval rules of [Axis](plotting.md#Axis).
lim supplies the generation domain (default [0,1]).

`direction="x"` draws vertical lines at x values; `direction="y"` draws horizontal
lines at y values. **Mesh**/**HMesh** default to x, **VMesh** to y: H/V names the scale
direction. Ambient **Graph** limits map values. Style lines with stroke,
`stroke-width`, `stroke-dasharray`, and opacity.

<a id="HMesh-example"></a>

### Example

```jsx
// HMesh from a linear scale.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <HMesh lim={[0, 4]} ticks={5} />
  </Graph>
</Box>
```

---

<a id="HScale"></a>

## HScale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"top"`, or `"bottom"` |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**HScale** draws ticks only, without a baseline or labels. It defaults to `side="bottom"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="HScale-example"></a>

### Example

```jsx
// HScale as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <HScale lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="Label"></a>

## Label

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `px(4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](plotting.md#Axis), including
lim, side, at, `tick-size`, `tick-side`, `label-offset`, rotate, and `label-style`. The value must
lie in lim. **VLabel** defaults to the left side, **Label** and **HLabel** to the bottom.

<a id="Label-example"></a>

### Example

```jsx
// One explicit tick label.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <Label lim={[0, 4]} value={2}>Midpoint</Label>
  </Graph>
</Box>
```

---

<a id="Labels"></a>

## Labels

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `px(4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**Labels** draws labels only, without a baseline or ticks. It defaults to `side="bottom"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="Labels-example"></a>

### Example

```jsx
// Labels as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <Labels lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

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

---

<a id="Mesh"></a>

## Mesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `direction` | `"x"` | `"x"` draws vertical lines; `"y"` draws horizontal lines |

Grid lines at ticks using the count/explicit/interval rules of [Axis](plotting.md#Axis).
lim supplies the generation domain (default [0,1]).

`direction="x"` draws vertical lines at x values; `direction="y"` draws horizontal
lines at y values. **Mesh**/**HMesh** default to x, **VMesh** to y: H/V names the scale
direction. Ambient **Graph** limits map values. Style lines with stroke,
`stroke-width`, `stroke-dasharray`, and opacity.

<a id="Mesh-example"></a>

### Example

```jsx
// Mesh from a linear scale.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <Mesh lim={[0, 4]} ticks={5} />
  </Graph>
</Box>
```

---

<a id="Mesh2D"></a>

## Mesh2D

| Property | Default | Meaning |
|---|---|---|
| `xlim` | `[0, 1]` | Domain for vertical grid lines |
| `ylim` | `[0, 1]` | Domain for horizontal grid lines |
| `xticks` | `5` | Target count or explicit x values / labeled pairs |
| `yticks` | `5` | Target count or explicit y values / labeled pairs |

Combine **HMesh** and **VMesh**. Supply xlim, ylim, xticks, and yticks; each domain
defaults to [0,1] and each count to 5. The graph provides mapping; these props
provide tick values. **Plot** automatically synchronizes grids and axes.

<a id="Mesh2D-example"></a>

### Example

```jsx
// A grid from two scales.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <Mesh2D xlim={[0, 4]} ylim={[0, 4]} />
  </Graph>
</Box>
```

---

<a id="OuterLabel"></a>

## OuterLabel

| Property | Default | Meaning |
|---|---|---|
| `children` | Empty | String or **Element** placed outside the frame |
| `side` | `"bottom"` | Frame edge used for the label |
| `offset` | `em(1)` | Distance outside that edge |
| `rotate` | `0` | Label rotation in degrees |

Attach child content outside a frame edge. side defaults to bottom;
offset to 1em. rotate applies a degree rotation. The label centers along the
selected side and reports overflow without reserving space. **Plot** measures and
reserves its own titles; use **OuterLabel** for manually composed figures.

<a id="OuterLabel-example"></a>

### Example

```jsx
// An outside frame label.
<Box padding={em(2)}>
  <Graph>
    <Rect stroke={blue} />
    <OuterLabel offset={em(0.5)}>Outside the frame</OuterLabel>
  </Graph>
</Box>
```

---

<a id="Plot"></a>

## Plot

Compose graphable children with linear axes, grid lines, measured tick labels,
axis titles, an optional legend, and an optional background. Limits follow
[Graph](plotting.md#Graph); inferred limits receive 5% padding by default.

| Property | Default | Meaning |
|---|---|---|
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` / `ylim` | Inferred | Directed data limits |
| `flip-x` / `flip-y` | `false` / `true` | Reverse horizontal or vertical screen mapping |
| `padding` | `0.05` | Inferred-limit fractions: scalar, side/axis object, `[h, v]`, or `[t, b, l, r]` |
| `axis` | `true` | Enable or disable both axes by default |
| `xaxis` / `yaxis` | `axis` | Boolean or **Axis** props for one axis |
| `xticks` / `yticks` | `5` | Target count or explicit values / labeled pairs |
| `grid` | `true` | Draw grid lines at axis ticks |
| `title` / `xlabel` / `ylabel` | — | String or **Element**; the y title rotates −90° |
| `legend` | — | **Legend** **Element** or array of **Legend** entries |
| `margin` | `px(12)` | Extra outer space; accepts [Box padding forms](layout.md#Box) |
| `label-gap` | `px(8)` | Space between titles and measured axis extents |
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

Padding uses [Graph's side and axis forms](plotting.md#Graph), with numeric fractions
of inferred data spans. Explicit limits stay exact.

Fonts inherit from the parent (16px at the root). Margins come from measured axis
overflow and title sizes.
Text uses `theme:text`, axes use `theme:muted`, and grid lines use `theme:grid`.
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
[Svg](layout.md#Svg) viewport grows to include it.

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

<a id="Scale"></a>

## Scale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, or an explicit side |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**Scale** draws ticks only, without a baseline or labels. It defaults to `side="bottom"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="Scale-example"></a>

### Example

```jsx
// Scale as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <Scale lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="SymField"></a>

## SymField

| Property | Default | Meaning |
|---|---|---|
| `f` | — | `(x, y) => vector` sampling function |
| `xlim` | `[-1, 1]` | Horizontal sampling range |
| `ylim` | `[-1, 1]` | Vertical sampling range |
| `xvals` / `yvals` | `Generated` | Explicit grid coordinates |
| `samples` | `11` | Scalar count or `{ x, y }` counts |
| `scale` | `1` | Multiplier applied to every vector |
| `normalize` | `false` | Normalize vectors before applying `scale` |
| `head-size` | `px(5)` | Arrowhead length for built-in arrows |
| `head-width` | `1.3` | Full arrowhead width divided by its length |
| `head-curve` | `0` | Barb curvature from `0` to `1`, as in [Arrow](geometry.md#Arrow) |
| `head-open` | `false` | Draw stroked barbs connected to the shaft tip |
| `head-barb` | `"both"` | Draw both barbs, or only `"left"` / `"right"` relative to each vector |
| `head-style` / `head-*` | — | Shared ArrowHead shape and paint options, as in [Arrow](geometry.md#Arrow) |
| `shape` | — | Replacement **Element** or callback |
| `shape-height` | `px(8)` | Height allocated to replacement shapes |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Sample `f(x,y)` on a rectangular grid and draw it with [Field](plotting.md#Field).
The result may be {x,y}, [x,y], or null. xlim/ylim default to [-1,1];
xvals/yvals provide explicit grid coordinates. samples defaults to 11 per axis
or accepts {x,y} counts. All **Field** options are supported.

The grid has at most 100000 points, with generated counts at most 1000 per axis.
Callbacks run once; zero/nonfinite vectors are omitted. Choose scale to keep
arrows near their cells, and explicit **Plot** limits when arrow endpoints should
not expand the viewport.

<a id="SymField-example"></a>

### Example

```jsx
// Vector direction is mapped through the graph before fixed-size arrowheads are drawn.
return <Plot
  title="Rotation field"
  xlim={[-2.4, 2.4]}
  ylim={[-2.4, 2.4]}
  aspect={1.}
  margin={em(2)}
>
  <SymField
    f={(x, y) => [-y, x]}
    xlim={[-2, 2]}
    ylim={[-2, 2]}
    samples={11}
    scale={0.14}
    stroke-width={px(1.5)}
    head-size={px(5)}
    head-open
  />
  <SymLine
    f={(t) => polar(t, 1.25)}
    tlim={[0, tau]}
    stroke={blue}
    stroke-width={px(2.5)}
  />
</Plot>
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

<a id="SymLine"></a>

## SymLine

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric `t => {x,y}` function |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |
| `closed` | `false` | Close each finite run |

Sample a function at the specified values and draw with [CoordLine](geometry.md#CoordLine).
Null/nonfinite samples split paths or omit markers.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.

All **CoordLine** styling options are available.
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
| `f` | — | Parametric `t => {x,y}` function |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |
| `point-size` | `px(6)` | Marker size, pair, or callback |
| `shape` | `Circle` | Marker **Element** or callback |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with [Points](geometry.md#Points).
Null/nonfinite samples split paths or omit markers.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.

All **Points** styling options are available. shape and `point-size` functions run once per finite sample.
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

<a id="SymPoly"></a>

## SymPoly

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric `t => {x,y}` function |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with [CoordLine](geometry.md#CoordLine).
Each finite run closes into a polygon.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.

All **CoordLine** styling options are available.
Construction stores immutable sampled data; resizing never executes callbacks.

<a id="SymPoly-example"></a>

### Example

```jsx
// SymPoly uses the shared sampler.
<Box padding={em(2)}>
  <Plot>
    <SymPoly
      f={polar}
      tvals={linspace(0, tau, 100, false)}
      fill={blue}
      stroke={blue}
    />
  </Plot>
</Box>
```

---

<a id="SymSpline"></a>

## SymSpline

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric `t => {x,y}` function |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |
| `tension` | `1` | Catmull–Rom tangent strength; 0 makes straight segments |
| `closed` | `false` | Close each finite run |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with [Spline](geometry.md#Spline).
Null/nonfinite samples split paths or omit markers.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.

All **Spline** styling options are available.
Construction stores immutable sampled data; resizing never executes callbacks.
**Spline** interpolation can overshoot its data points.

<a id="SymSpline-example"></a>

### Example

```jsx
// SymSpline uses the shared sampler.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <SymSpline
      fy={sin}
      xlim={[0, tau]}
      samples={13}
      stroke={blue}
      stroke-width={px(2)}
    />
  </Plot>
</Box>
```

---

<a id="VAxis"></a>

## VAxis

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Axis edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"left"`, or `"right"` |
| `label-offset` | `px(4)` | Gap between ticks and labels |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `px(7)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

**VAxis** draws a baseline, ticks, and labels. It defaults to `side="left"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="VAxis-example"></a>

### Example

```jsx
// VAxis as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <VAxis lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="VBar"></a>

## VBar

| Property | Default | Meaning |
|---|---|---|
| `value` | `1` | Bar endpoint |
| `position` | `0` | Bar center |
| `base` | `0` | Bar baseline |
| `bar-width` | `0.8` | Width in data units |
| `direction` | `"vertical"` | Vertical or horizontal bar |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `space` | Automatic | Use ambient data coordinates or local geometry |

One bar with value (default 1), position (0), base (0), and `bar-width`
(0.8 data units). Direction defaults to vertical, or horizontal for **HBar**.
Other geometry and paint follow [Bars](plotting.md#Bars), including border radius. Compose
multiple bars as children or use **Bars** for arrays.

<a id="VBar-example"></a>

### Example

```jsx
// One VBar with an explicit baseline.
<Box padding={em(2)}>
  <Plot padding={[0.1, 0.25]}>
    <VBar
      value={3}
      position={1}
      base={-1}
      bar-width={0.6}
      fill={blue}
      border-radius={em(0.5)}
    />
  </Plot>
</Box>
```

---

<a id="VBars"></a>

## VBars

| Property | Default | Meaning |
|---|---|---|
| `values` | `[]` | Bar endpoints |
| `positions` | Indices | Bar centers; must match `values` |
| `bases` | `0` | Scalar, array, or callback for bar baselines |
| `bar-width` | `0.8` | Scalar, array, or callback for widths in data units |
| `direction` | `"vertical"` | Vertical or horizontal bars |
| `border-radius` | `0` | Scalar, elliptical pair, or [side/corner object](layout.md#Box) in layout units |
| `styles` | — | Per-bar style array or `(value, index) => style` callback; may override `border-radius` |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Draw bars from values. positions supplies centers (default indices starting at
zero), bases defaults to zero, and `bar-width` to 0.8 data units. bases and
`bar-width` accept a scalar, a same-length array, or (value,index) function.
Values are endpoints, not lengths relative to a base.

direction defaults to vertical, or horizontal for **HBars**. Negative values work
in either direction. Widths and bases contribute to inferred limits. Nonfinite
values are omitted without shifting category indices.

styles accepts a same-length array or (value,index) function returning style
objects, evaluated once at construction. Defaults: blue fill, no stroke.
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](plotting.md#Graph) or
[Plot](plotting.md#Plot) for data coordinates.

Use `border-radius={{ t: em(0.5) }}` for rounded tops and square bottoms, or specify
individual `tl`, `tr`, `bl`, and `br` corners. Each entry accepts a length or
elliptical pair. See [Bars](plotting.md#Bars) for all forms and screen-edge semantics.
For value-dependent rounding, return `border_radius` from `styles`, for example
`styles={(v) => ({ border_radius: v < 0 ? { b: em(0.5) } : { t: em(0.5) } })}`.

<a id="VBars-example"></a>

### Example

```jsx
// Positive vertical bars with rounded tops and square baselines.
<Box padding={em(2)}>
  <Plot aspect={1.5}>
    <VBars
      values={[2, 4, 1, 3]}
      border-radius={{ t: em(0.5) }}
      fill={blue}
    />
  </Plot>
</Box>
```

---

<a id="VLabel"></a>

## VLabel

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `px(4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](plotting.md#Axis), including
lim, side, at, `tick-size`, `tick-side`, `label-offset`, rotate, and `label-style`. The value must
lie in lim. **VLabel** defaults to the left side, **Label** and **HLabel** to the bottom.

<a id="VLabel-example"></a>

### Example

```jsx
// One explicit tick label.
<Box padding={{ left: em(5), right: em(1), top: em(1), bottom: em(1) }}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <VLabel lim={[0, 4]} value={2}>Midpoint</VLabel>
  </Graph>
</Box>
```

---

<a id="VLabels"></a>

## VLabels

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `px(4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**VLabels** draws labels only, without a baseline or ticks. It defaults to `side="left"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="VLabels-example"></a>

### Example

```jsx
// VLabels as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <VLabels lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```

---

<a id="VMesh"></a>

## VMesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `direction` | `"y"` | Draw horizontal lines; may be overridden |

Grid lines at ticks using the count/explicit/interval rules of [Axis](plotting.md#Axis).
lim supplies the generation domain (default [0,1]).

`direction="x"` draws vertical lines at x values; `direction="y"` draws horizontal
lines at y values. **Mesh**/**HMesh** default to x, **VMesh** to y: H/V names the scale
direction. Ambient **Graph** limits map values. Style lines with stroke,
`stroke-width`, `stroke-dasharray`, and opacity.

<a id="VMesh-example"></a>

### Example

```jsx
// VMesh from a linear scale.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <VMesh lim={[0, 4]} ticks={5} />
  </Graph>
</Box>
```

---

<a id="VScale"></a>

## VScale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `px(5)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"left"`, or `"right"` |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**VScale** draws ticks only, without a baseline or labels. It defaults to `side="left"`.
It accepts the [Axis](plotting.md#Axis) props, including lim, ticks, interval, side, at,
format, rotate, and nested styles. **Labels**-only elements account for `tick-size`
when `tick-side` is outer, so they align with a separate **Scale**.

lim defaults to [0,1]; specify the desired tick domain inside **Graph**. **Plot**
supplies matching limits automatically.

<a id="VScale-example"></a>

### Example

```jsx
// VScale as an independent axis part.
<Box padding={em(2)}>
  <Graph xlim={[0, 4]} ylim={[0, 4]}>
    <VScale lim={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
  </Graph>
</Box>
```
