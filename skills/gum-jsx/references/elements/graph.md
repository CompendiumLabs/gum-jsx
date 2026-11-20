# Graph and manual axes

Use [Plot](plotting.md#Plot) for ordinary Cartesian charts.
Graph supplies a coordinate canvas without constructing axes, grids, titles, or
legends. It is useful for custom projections and compositions that need direct
control of those parts. The components below are the pieces Plot normally
assembles and measures for you.

When composing them manually, supply matching axis and mesh domains and reserve
space for labels in the surrounding layout.

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
| `projection` | None | Pure record-to-record callback returning `{x, y}` or `null`, or a core `Projection` |

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

[Polyline](geometry.md#Polyline), [Points](geometry.md#Points), new geometry marks, bars, and
symbolic marks use data coordinates. **Line**, **HLine**, **VLine**, and
**Polygon** also use the graph's coordinate mapping automatically.
**Path** retains local geometry; **UnitLine** and **Triangle** default to local. For marks that use data coordinates by default,
`space="local"` opts out; `space="data"` requires a coordinate context.
px/em geometry stays local.

Direct-child numeric `pos` values are data coordinates. Children with `pos`
default to `anchor="center"`; without `pos`, they default to `anchor="start"`
at the local origin. Use `anchor="start"` for a positioned child's top-left corner.
Use `pos` and `anchor` with **Text** for upright annotations, and px/em sizes
for fixed geometry. Annotations do not affect inferred limits. Strokes, markers,
and fonts keep their layout sizes on resize.

See [Positioning](../guides/positioning.md) for the shared `pos` and
`anchor` rules, including local lengths and placement of wrapped content.

With `projection`, numeric records retain every dimension and tuples expand to
`{x, y}` before the usual limits and flips map them to pixels. For `{theta, r}`
polar data, use `projection={({theta, r}) => ({x: r * cos(theta), y: r * sin(theta)})}`. Supply both
`xlim` and `ylim` (or `coord`) in the **output** coordinate space; custom
projections do not infer limits. A square canvas with limits `[-1, 1]` on both
axes displays a unit polar disk.

Numeric child `pos` annotations use the same projection. Tuples expand to
`{x, y}`; named records such as `{theta, r}` or `{x, y, z}` reach the callback
with every dimension intact. Cartesian positions require both components.
Omitting `pos` keeps the child at the local origin; `pos={[0, 0]}` maps data zero.
Two tagged lengths bypass projection; mixing
a data number with a tagged length is an error. `space="local"` still opts marks
out. A callback may return `null` to hide a point or break a sampled path.

For a custom annotation space, for example:

```jsx
<Graph
  xlim={[-1, 1]} ylim={[-1, 1]}
  projection={({theta, r}) => ({x: r * cos(theta), y: r * sin(theta)})}
>
  <Text pos={{theta: pi / 4, r: 0.8}} anchor="center">45°</Text>
</Graph>
```

Built-in marks and parametric `f(t)` samples accept the same named records.
Points callbacks receive the complete source record before projection; any
nonfinite dimension creates a gap. Scalar Fill boundaries and Field vector
arithmetic stay Cartesian.

Callbacks must be pure and stable for the lifetime of the element. They run
during layout, unlike construction-time style callbacks. Elements project only
the points they already have: supply a sampled route to **Arrow** or **Polyline**
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
  <Box padding={em(3)}>
    <Graph aspect={1.5} xlim={[10, 0]} ylim={[0, 8]}>
      <Mesh2D xlim={[0, 10]} ylim={[0, 8]} />
      <Spline points={samples} stroke={blue} stroke-width={px(2)} />
      <Points
        points={samples}
        point-size={(p, i) => px(8 + i * 2)}
        shape={<Square fill={blue} stroke={white} stroke-width={px(1)} />}
      />
      <Text pos={[8, 7.25]} anchor={['center', 'end']} font-size={em(0.9)} color={blue}>Peak</Text>
      <HAxis lim={[10, 0]} />
      <VAxis lim={[0, 8]} />
    </Graph>
  </Box>
)
```

---

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
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, or an explicit side |
| `label-offset` | `em(1/4)` | Gap between ticks and labels |
| `label-anchor` | Side-dependent | Point on each label attached to its tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `em(7/16)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `stroke-width` | `em(1/16)` | Shared baseline and tick thickness |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

Stroke width, tick length, label offset, and arrowhead length scale with the axis's
inherited `font-size`. At the default 16px font they measure 1px, 5px, 4px, and 7px.
A `label-font-size` override affects the labels independently. Use explicit
`px(...)` values to keep a dimension fixed when the font changes.

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

<a id="HAxis"></a>

## HAxis

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Axis edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"top"`, or `"bottom"` |
| `label-offset` | `em(1/4)` | Gap between ticks and labels |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `em(7/16)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `stroke-width` | `em(1/16)` | Shared baseline and tick thickness |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

**HAxis** draws a baseline, ticks, and labels. It defaults to `side="bottom"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="VAxis"></a>

## VAxis

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Axis edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"left"`, or `"right"` |
| `label-offset` | `em(1/4)` | Gap between ticks and labels |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `labels` | `true` | Draw tick labels |
| `line` | `true` | Draw the baseline |
| `arrow` | `false` | Draw a head at the directed endpoint |
| `arrow-size` | `em(7/16)` | Arrowhead length |
| `arrow-width` | `1.3` | Full arrowhead width divided by its length |
| `arrow-style` / `arrow-*` | — | Arrowhead shape and paint options |
| `stroke-width` | `em(1/16)` | Shared baseline and tick thickness |
| `line-style` / `tick-style` / `label-style` | — | Nested styles for generated parts |
| `line-*` / `tick-*` / `label-*` | — | Flat overrides for generated-part styles |

**VAxis** draws a baseline, ticks, and labels. It defaults to `side="left"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="Mesh2D"></a>

## Mesh2D

| Property | Default | Meaning |
|---|---|---|
| `xlim` | `[0, 1]` | Domain for vertical grid lines |
| `ylim` | `[0, 1]` | Domain for horizontal grid lines |
| `xticks` | `5` | Target count or explicit x values / labeled pairs |
| `yticks` | `5` | Target count or explicit y values / labeled pairs |
| `stroke-width` | `em(1/16)` | Grid thickness, relative to inherited font size |

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

<a id="Mesh"></a>

## Mesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `direction` | `"x"` | `"x"` draws vertical lines; `"y"` draws horizontal lines |
| `stroke-width` | `em(1/16)` | Grid thickness, relative to inherited font size |

Grid lines at ticks using the count/explicit/interval rules of [Axis](graph.md#Axis).
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

<a id="HMesh"></a>

## HMesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `stroke-width` | `em(1/16)` | Grid thickness, relative to inherited font size |
| `direction` | `"x"` | Draw vertical lines; may be overridden |

Grid lines at ticks using the count/explicit/interval rules of [Axis](graph.md#Axis).
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

<a id="VMesh"></a>

## VMesh

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed domain used to place grid lines |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `stroke-width` | `em(1/16)` | Grid thickness, relative to inherited font size |
| `direction` | `"y"` | Draw horizontal lines; may be overridden |

Grid lines at ticks using the count/explicit/interval rules of [Axis](graph.md#Axis).
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

<a id="Scale"></a>

## Scale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, or an explicit side |
| `stroke-width` | `em(1/16)` | Tick thickness |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**Scale** draws ticks only, without a baseline or labels. It defaults to `side="bottom"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="HScale"></a>

## HScale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"top"`, or `"bottom"` |
| `stroke-width` | `em(1/16)` | Tick thickness |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**HScale** draws ticks only, without a baseline or labels. It defaults to `side="bottom"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="VScale"></a>

## VScale

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / labeled pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Tick length |
| `tick-side` | `"outer"` | `"inner"`, `"outer"`, `"left"`, or `"right"` |
| `stroke-width` | `em(1/16)` | Tick thickness |
| `tick-style` / `tick-*` | — | Nested or flat styles for ticks |

**VScale** draws ticks only, without a baseline or labels. It defaults to `side="left"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**Labels** draws labels only, without a baseline or ticks. It defaults to `side="bottom"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="HLabels"></a>

## HLabels

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**HLabels** draws labels only, without a baseline or ticks. It defaults to `side="bottom"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="VLabels"></a>

## VLabels

| Property | Default | Meaning |
|---|---|---|
| `lim` | `[0, 1]` | Directed tick domain |
| `ticks` | `5` | Target count or explicit values / `[value, label]` pairs |
| `interval` | Automatic | Positive fixed tick step |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position labels |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `format` | `format_tick` | `(value, index) => string` for numeric ticks |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated labels |

**VLabels** draws labels only, without a baseline or ticks. It defaults to `side="left"`.
It accepts the [Axis](graph.md#Axis) props, including lim, ticks, interval, side, at,
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

<a id="Label"></a>

## Label

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](graph.md#Axis), including
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

<a id="HLabel"></a>

## HLabel

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"bottom"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](graph.md#Axis), including
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

<a id="VLabel"></a>

## VLabel

| Property | Default | Meaning |
|---|---|---|
| `value` | `0` | Tick value and position |
| `children` | Formatted `value` | String, number, or **Element** used as the label |
| `lim` | `[0, 1]` | Directed domain used to place the value |
| `side` | `"left"` | Edge and orientation |
| `at` | Frame edge | Data location on the perpendicular axis |
| `tick-size` | `em(5/16)` | Invisible tick length included in label placement |
| `tick-side` | `"outer"` | Tick direction used to position the label |
| `label-offset` | `em(1/4)` | Gap after the tick position |
| `rotate` | `0` | Label rotation in degrees |
| `label-style` / `label-*` | — | Nested or flat styles for generated text |

One tick label. value defaults to 0; children can be a string, number, or **Element**
(omitted text formats the value). Other props follow [Axis](graph.md#Axis), including
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
