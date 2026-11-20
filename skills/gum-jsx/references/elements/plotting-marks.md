# Additional plot marks

These marks belong inside [Plot](plotting.md#Plot) or a custom
[Graph](graph.md#Graph). Prefer
[BarPlot](plotting.md#BarPlot) when you need a complete bar chart.
Mark sizes use layout units; their positions use the enclosing data coordinates.

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
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](graph.md#Graph) or
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
  <Plot aspect={1.5} xlim={[-0.75, 3.75]} ygrid>
    <Bars
      values={[2, 4, -1, 3]}
      border-radius={em(0.35)}
      styles={(v) => ({
        border_radius: v < 0 ? {b: em(0.25)} : {t: em(0.25)}
      })}
    />
    <HLine y={0} lim={[-0.75, 3.75]} />
  </Plot>
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
Other geometry and paint follow [Bars](plotting-marks.md#Bars), including border radius. Compose
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
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](graph.md#Graph) or
[Plot](plotting.md#Plot) for data coordinates.

Use `border-radius={{ r: em(0.5) }}` for rounded right ends and square left ends, or
specify individual `tl`, `tr`, `bl`, and `br` corners. Each entry accepts a length
or elliptical pair. See [Bars](plotting-marks.md#Bars) for all forms and screen-edge semantics.
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
Other geometry and paint follow [Bars](plotting-marks.md#Bars), including border radius. Compose
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
`border-radius` rounds corners in layout units such as `em(0.25)`. Use [Graph](graph.md#Graph) or
[Plot](plotting.md#Plot) for data coordinates.

Use `border-radius={{ t: em(0.5) }}` for rounded tops and square bottoms, or specify
individual `tl`, `tr`, `bl`, and `br` corners. Each entry accepts a length or
elliptical pair. See [Bars](plotting-marks.md#Bars) for all forms and screen-edge semantics.
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
Other geometry and paint follow [Bars](plotting-marks.md#Bars), including border radius. Compose
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
Points and vectors require exactly two Cartesian coordinates; named or additional
dimensions are rejected. The computed origins and endpoints can then pass
through the graph's projection.

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

Sample `f(x,y)` on a rectangular grid and draw it with [Field](plotting-marks.md#Field).
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

<a id="SymArrow"></a>

## SymArrow

| Property | Default | Meaning |
| --- | --- | --- |
| `f` | — | Parametric function returning a numeric coordinate record, `[x, y]`, or null |
| `fx` / `fy` | — | Cartesian coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `start-head` | `false` | Draw a head at the first sample |
| `end-head` | `true` | Draw a head at the last sample |
| `head-size` | `px(9)` | Head length, using layout units |
| `curve` | `false` | Connect projected samples with a spline |
| `tension` | `1` | Spline tangent strength when `curve` is true |
| `radius` | `0` | Rounded-corner radius for a non-curved route |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with
[Arrow](geometry.md#Arrow). All Arrow styling and `head-*` options are available.
Sampling supplies the path, so `points`, `from`, and `to` are not inputs.
Set `start-head` for heads at both ends, or `end-head={false}` to omit the end head.

`f(t)` can return named numeric records such as `{theta, r}`, `{lon, lat}`, or
`{x, y, z}`. Every dimension reaches the enclosing projection; only the projected
samples determine shaft geometry and head directions. Head sizes remain layout
lengths. See [Projections](../guides/projections.md) for a polar spiral.
`tlim` controls the parameter range; Graph limits describe the projected view.
`fx`, `fy`, `xvals`, and `yvals` keep their Cartesian meanings.

Null/nonfinite samples and hidden projected points split the shaft. Heads appear
only at visible original endpoints with a usable segment; cuts do not acquire
heads. Construction stores immutable sampled data, so resizing never executes
the sampling callbacks again.

<a id="SymArrow-example"></a>

### Example

```jsx
// SymArrow samples a polar spiral and projects its path before drawing the heads.
<Box padding={em(1.5)}>
  <Graph
    aspect={1}
    xlim={[-1.2, 1.2]}
    ylim={[-1.2, 1.2]}
    projection={polar_projection()}
  >
    <SymArrow
      f={t => ({theta: 3 * pi * t, r: 0.2 + 0.8 * t})}
      tlim={[0, 1]}
      samples={151}
      start-head
      head-size={px(12)}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="SymPoly"></a>

## SymPoly

| Property | Default | Meaning |
|---|---|---|
| `f` | — | Parametric function returning a numeric coordinate record, `[x,y]`, or null |
| `fx` / `fy` | — | Coordinate functions or constants |
| `xlim` / `ylim` / `tlim` | `[0, 1]` | Sampling ranges when corresponding arrays are absent |
| `xvals` / `yvals` / `tvals` | — | Explicit coordinate or parameter arrays |
| `samples` | `101` | Number of generated samples |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Use the sampling options described by [SymLine](plotting.md#SymLine) and draw with [Polyline](geometry.md#Polyline).
Each finite run closes into a polygon.
Use fy for y=`f(x)`, fx for x=`f(y)`, or `f(t)` for parametric points. Limits here
control sampling; enclosing **Graph**/**Plot** limits control the view.
Named records such as `{theta, r}` retain every dimension until the enclosing
Graph projects them. Any nonfinite dimension creates a gap. `fx`, `fy`,
`xvals`, and `yvals` retain their Cartesian meanings.

All **Polyline** styling options are available.
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
| `f` | — | Parametric function returning a numeric coordinate record, `[x,y]`, or null |
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
Named records such as `{theta, r}` retain every dimension until the enclosing
Graph projects them. Any nonfinite dimension creates a gap. `fx`, `fy`,
`xvals`, and `yvals` retain their Cartesian meanings.

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
