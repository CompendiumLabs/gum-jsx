# Geometry elements

<a id="Arc"></a>

## Arc

| Property | Default | Meaning |
|---|---|---|
| `center` | `[0.5, 0.5]` | Center of the ellipse |
| `radius` | `0.5` | Scalar radius or independent `{ x, y }` / `[x, y]` radii |
| `start` | `0` | Starting screen-space angle in degrees |
| `end` | `360` | Ending screen-space angle in degrees |
| `space` | Automatic | Use ambient data coordinates or local geometry |

An ellipse segment with center, scalar or paired radius, and start/end angles in degrees. Defaults: center {x:0.5,y:0.5}, radius 0.5, angles 0–360. The span may be at most one turn. In data space, numeric radii are data distances and flips affect orientation. Cubic pieces approximate the ellipse.

Center and paired radii accept `{x,y}` or `[x,y]`.

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="Arc-example"></a>

### Example

```jsx
// Arc in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Arc
      center={[1.5, 1.5]}
      radius={[1.4, 1]}
      start={20}
      end={320}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="Arrow"></a>

## Arrow

A shaft from from/to or through points. curve makes a spline; radius rounds a
polyline. Both heads follow the original route's endpoint directions.

| Property | Default | Meaning |
| --- | --- | --- |
| `from` | `[0, 0]` | Start point when `points` is omitted |
| `to` | `[1, 1]` | End point when `points` is omitted |
| `points` | `from`, `to` | Full shaft route; overrides `from` and `to` |
| `curve` | `false` | Connect the route with a spline |
| `tension` | `1` | Spline tangent strength when `curve` is true |
| `radius` | `0` | Rounded-corner radius for a non-curved route |
| `start-head` | `false` | Draw a head at the first point |
| `end-head` | `true` | Draw a head at the last point |
| `head-size` | `px(9)` | Head length, using layout units |
| `head-width` | `1.3` | Full head width divided by its length |
| `head-curve` | `0` | Barb curvature from `0` (straight) to `1` (tangent to the shaft at the tip) |
| `head-open` | `false` | Draw stroked barbs; the shaft reaches their tip |
| `head-barb` | `"both"` | Draw both barbs, or only `"left"` / `"right"` relative to each head's direction |
| `head-style` | — | Head shape and paint overrides: `open`, `curve`, `barb`, and style fields |
| `head-*` | — | Flat overrides for fields in `head-style` |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Use scoped props such as `head-fill={red}`, `head-stroke={none}`, or
`head-stroke-width={px(2)}` to set head styles directly. Head options are shared
with [ArrowHead](geometry.md#ArrowHead): `head-open` forwards `open`, `head-curve` forwards
`curve`, and paint options follow the same rule. Flat props override matching
fields in `head-style`, so `head-style={{open: true, curve: 0.7}}` can also set
the shape. `head-size` and `head-width` already have the same names on ArrowHead
and remain separate geometry props. Head lengths in em use the head's font size.
See [scoped props](../guides/style.md#scoped-component-props).

`head-curve={0.7}` gives LaTeX-like barbs. It is independent of `curve`, which
controls the shaft's spline. See [ArrowHead](geometry.md#ArrowHead) for the curvature scale.
For a harpoon, combine `head-open` with `head-barb="left"` or `head-barb="right"`.
Sides are relative to each head's direction, so start and end heads face opposite
ways. Single-barbed heads meet the shaft at the tip, whether open or filled.

Open heads default to the shaft's stroke color, width, caps, and joins; `head-*`
paint options can override them. They always have no fill. The shaft reaches
the tip to meet the barbs, including on short routes and curved shafts.

Closed heads default to a fill matching the shaft stroke and no outline.
Head tips stay at the requested endpoints. The shaft retreats at closed, two-sided heads so
its cap fits behind the tip. Clearance accounts for the resolved stroke width,
head width, head curvature, and butt/round/square cap style. It is computed in
pixels after coordinate mapping, so fixed pixel strokes keep the same clearance
when a graph resizes or flips.

Ends without heads keep their original shaft endpoints and caps. Setting
`head-size` to zero disables both heads and shortening. A zero-length route has
no heads. Very short terminal segments are consumed by the inset; if shortening
uses the entire route, only the heads remain. For a head narrower than the shaft,
the cap stops at the head's base to keep them connected.

Straight, rounded, and spline shafts use the shortened route. Original points
still determine inferred graph limits. The same clearance applies to the arrows
in [Field](plotting.md#Field) and [SymField](plotting.md#SymField).

Point inputs accept `{x,y}` or `[x,y]`; see [Point values](../guides/point_values.md).

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="Arrow-example"></a>

### Example

```jsx
// A curved Arrow with open barbs and separately scoped head paint.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Arrow
      points={[[0, 0], [1, 2.5], [3, 2]]}
      curve
      start_head
      head-size={px(12)}
      head-open
      head-curve={0.7}
      head-stroke={red}
      stroke={blue}
      stroke-width={px(3)}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Graph>
</Box>
```

---

<a id="ArrowHead"></a>

## ArrowHead

| Property | Default | Meaning |
|---|---|---|
| `tip` | `[1, 0.5]` | Tip position |
| `angle` | `0` | Screen-space direction in degrees, clockwise positive |
| `head-size` | `px(9)` | Head length |
| `head-width` | `0.65` | Full head width divided by its length |
| `curve` | `0` | Barb curvature from `0` (straight) to `1` (tangent to the shaft at the tip) |
| `open` | `false` | Draw stroked barbs instead of a closed head |
| `barb` | `"both"` | Draw both barbs, or only `"left"` / `"right"` relative to the arrow's direction |
| `space` | Automatic | Use ambient data coordinates or local geometry |

A standalone head at tip, with a screen-space angle in degrees (positive clockwise).
`head-size` defaults to `px(9)`, `head-width` to `0.65`. `open` draws two stroked barbs; a closed
head uses fill. `curve` bows both barbs toward the shaft while keeping the tip
and the two rear endpoints fixed. It accepts a finite number from `0` to `1`;
`0.7` gives a LaTeX-like shape. Both open and filled heads support curved barbs.

`barb="left"` or `barb="right"` selects one side for harpoons. Left and right are
relative to the direction of travel: a right-pointing arrow's left barb is above
the shaft. A closed single-barbed head fills the half-head between the selected
barb and the shaft. `head-width` still describes the full two-sided width.

On [Arrow](geometry.md#Arrow), the same shape and paint options use the `head-` scope:
`head-open`, `head-curve`, `head-barb`, `head-stroke`, and so on. `head-size` and `head-width`
keep their existing names. Head position and direction follow the arrow's route.

Point inputs accept `{x,y}` or `[x,y]`; see [Point values](../guides/point_values.md).

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="ArrowHead-example"></a>

### Example

```jsx
// Curvature on filled, open, and single-barbed heads, keeping their endpoints fixed.
<Box width="fill" padding={em(1.5)}>
  <HStack wrap gap={em(1.5)}>
    {[0, 0.35, 0.7, 1].map(curve =>
      <VStack gap={em(1)}>
        <Text align-self="center" font-family={mono}>curve={curve}</Text>
        <ArrowHead
          width={px(100)}
          height={px(70)}
          tip={[0.9, 0.5]}
          head-size={px(64)}
          head-width={1}
          curve={curve}
          fill={blue}
          stroke={none}
        />
        <ArrowHead
          width={px(100)}
          height={px(70)}
          tip={[0.9, 0.5]}
          head-size={px(64)}
          head-width={1}
          curve={curve}
          open
          stroke={blue}
          stroke-width={px(3)}
          stroke-linejoin="round"
        />
        <ArrowHead
          width={px(100)}
          height={px(70)}
          tip={[0.9, 0.5]}
          head-size={px(64)}
          head-width={1}
          curve={curve}
          open
          barb="left"
          stroke={blue}
          stroke-width={px(3)}
        />
      </VStack>
    )}
  </HStack>
</Box>
```

---

<a id="Circle"></a>

## Circle

| Property | Default | Meaning |
|---|---|---|
| `center` | `[0.5, 0.5]` | Center in the **Circle**'s local rectangle |
| `radius` | `0.5` | Radius relative to the shorter side, or a px/em length |

**Circle** has an intrinsic 1:1 aspect. Without a definite size its natural fallback
is 16 × 16px; specifying width alone normally produces a circle of that diameter.

`center` is an `{ x, y }` or `[x, y]` pair, defaulting to `[0.5, 0.5]` in the shape's
own rectangle. `radius` is a scalar length, defaulting to 0.5 of the shorter
side. Thus a default **Circle** remains circular and centered even inside a
nonsquare allocation.

```jsx
<Circle width={px(160)} height={px(80)}
  center={[0.25, 0.5]} radius={px(28)} fill={green} />
```

Coordinates and radius affect the drawing, not the allocated size. Moving the
center or enlarging the radius can put ink outside that rectangle. Radius must
be nonnegative; it is not automatically clamped to fit. A stroke also adds ink
outside the circular boundary. See [Group](layout.md#Group) for positioning the entire
element and [Ellipse](geometry.md#Ellipse) for unequal x/y radii.

**Circle** has no children. Compose a label with a stack or position it separately
in a **Group**; do not nest **Text** inside the shape.

<a id="Circle-example"></a>

### Example

```jsx
// Circle centers its geometry in an allocation; center and radius can be overridden.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1)}>
    <Circle grow={1} fill={blue} stroke={none} />
    <Frame grow={2} padding={em(0.5)} border-color={darkgray}>
      <Circle aspect={2} fill={red} stroke={none} />
    </Frame>
    <Frame grow={2} padding={em(0.5)} border-color={darkgray}>
      <Circle
        aspect={2}
        center={[0.25, 0.5]}
        radius={0.3}
        fill={green}
        stroke={none}
      />
    </Frame>
  </HStack>
</Box>
```

---

<a id="CoordLine"></a>

## CoordLine

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Ordered points; null and nonfinite values split the path |
| `closed` | `false` | Close each finite run |
| `space` | Automatic | Use ambient data coordinates or local geometry |

A piecewise linear path through `{x,y}` or `[x,y]` points. Null/nonfinite samples break the path. closed closes each finite run. Paint uses ordinary fill/stroke styles.

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="CoordLine-example"></a>

### Example

```jsx
// CoordLine in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <CoordLine
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="Dot"></a>

## Dot

| Property | Default | Meaning |
|---|---|---|
| `center` | `[0.5, 0.5]` | Center in the **Dot**'s local rectangle |
| `radius` | `0.5` | Radius relative to the shorter side, or a px/em length |

A filled **Circle** with a preferred 6px diameter and no stroke. Use width/height for other sizes, and x/y/anchor in **Group** or **Graph** for positioning. **Points** creates marker sets.

<a id="Dot-example"></a>

### Example

```jsx
// The Dot geometry convenience.
<Box width="fill" aspect={1.6} padding={em(2)}>
  <Dot
    width={px(30)}
    height={px(30)}
    fill={blue}
    stroke={blue}
    stroke-width={px(3)}
  />
</Box>
```

---

<a id="Ellipse"></a>

## Ellipse

| Property | Default | Meaning |
|---|---|---|
| `center` | `[0.5, 0.5]` | Center in the **Ellipse**'s local rectangle |
| `radius` | `[0.5, 0.5]` | Horizontal and vertical radii |

**Ellipse** draws an axis-aligned ellipse in its allocated rectangle. Unlike
[Circle](geometry.md#Circle), it has no intrinsic aspect ratio. Set both dimensions or
supply one dimension and an aspect to control its proportions.

`center` and `radius` accept `{ x, y }` or `[x, y]` pairs. `center` defaults to
`[0.5, 0.5]`. `radius` defaults to `[0.5, 0.5]`. Both pairs use the ellipse's own
width for x fractions and height for y fractions; px and em are also accepted.

```jsx
<Ellipse width={px(160)} height={px(96)}
  radius={[0.4, px(24)]} fill={green} />
```

Radii must be nonnegative. Explicit radii and centers do not change layout size,
and may extend outside it. **Ellipse** accepts shared sizing and paint props and
has no content children. There is no element-level rotation prop; a rotated
outline can instead be constructed with [Path](geometry.md#Path).

<a id="Ellipse-example"></a>

### Example

```jsx
// Ellipses use independent radii along the allocated width and height.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1.25)} align="center">
    <Ellipse grow={2} aspect={2} fill={blue} stroke={none} />
    <Ellipse grow={1} aspect={2 / 3} fill={red} stroke={none} />
    <Ellipse
      grow={2}
      aspect={5 / 3}
      radius={[0.4, 0.25]}
      fill={green}
      stroke={none}
    />
  </HStack>
</Box>
```

---

<a id="Fill"></a>

## Fill

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | First edge of the filled region |
| `boundary` | `0` | Second edge as points, or a scalar baseline |
| `direction` | `"vertical"` | Treat a scalar boundary as y or x |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Fill a region between points and boundary, arrays of `{x,y}` records or `[x,y]` tuples. boundary
may be a scalar baseline (default 0). Arrays must have matching lengths; a gap
in either boundary splits the whole region.

direction defaults to vertical (horizontal for **HFill**). For vertical fills a
scalar supplies y; for horizontal fills it supplies x. **VFill** is the vertical
convenience. Defaults: pale blue fill, no stroke.

Numeric geometry follows [Graph](plotting.md#Graph) and participates in limits, including
the baseline. [SymFill](plotting.md#SymFill) samples function boundaries.

<a id="Fill-example"></a>

### Example

```jsx
// Fill in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Fill
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      boundary={0}
      fill={blue}
    />
  </Graph>
</Box>
```

---

<a id="HFill"></a>

## HFill

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | First edge of the filled region |
| `boundary` | `0` | Second edge as points, or an x baseline |
| `direction` | `"horizontal"` | Fill horizontally; may be overridden |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Fill a region between points and boundary, arrays of `{x,y}` records or `[x,y]` tuples. boundary
may be a scalar baseline (default 0). Arrays must have matching lengths; a gap
in either boundary splits the whole region.

direction defaults to vertical (horizontal for **HFill**). For vertical fills a
scalar supplies y; for horizontal fills it supplies x. **VFill** is the vertical
convenience. Defaults: pale blue fill, no stroke.

Numeric geometry follows [Graph](plotting.md#Graph) and participates in limits, including
the baseline. [SymFill](plotting.md#SymFill) samples function boundaries.

<a id="HFill-example"></a>

### Example

```jsx
// HFill in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <HFill
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      boundary={0}
      fill={blue}
    />
  </Graph>
</Box>
```

---

<a id="HLine"></a>

## HLine

| Property | Default | Meaning |
|---|---|---|
| `from` | `[0, 0.5]` | Segment start in the local rectangle |
| `to` | `[1, 0.5]` | Segment end in the local rectangle |

**HLine** is a local **Line** convenience. **HLine** and **UnitLine** span `x=0` to `x=1` at `y=0.5`;
**VLine** spans `y=0` to `y=1` at `x=0.5`. `from/to` props can override these defaults. Use
**CoordLine** for data geometry.

<a id="HLine-example"></a>

### Example

```jsx
// The HLine geometry convenience.
<Box width="fill" aspect={1.6} padding={em(2)}>
  <HLine fill={blue} stroke={blue} stroke-width={px(3)} />
</Box>
```

---

<a id="Line"></a>

## Line

| Property | Default | Meaning |
|---|---|---|
| `from` | `[0, 0]` | Segment start in the selected coordinate space |
| `to` | `[1, 1]` | Segment end in the selected coordinate space |
| `space` | `"local"` | `"data"` uses the enclosing Graph, Plot, or GeoMap coordinate context |

**Line** draws one segment from `from` to `to`, each an `{ x, y }` or `[x, y]` pair of lengths.
The defaults are `[0, 0]` and `[1, 1]`: the diagonal of its own
allocated rectangle. Fractions use that rectangle's width and height, not the
parent's size. This local behavior remains the default inside a Graph or GeoMap.

```jsx
<Line width={px(200)} height={px(40)}
  from={[0, 0.5]} to={[1, 0.5]}
  stroke={green} stroke-width={px(4)} stroke-linecap="round" />
```

**Line** always disables fill. It otherwise inherits stroke color, width, and cap
style; caps may be butt, round, or square. Stroke width is px, em, or a fraction
of the shorter allocated side. An explicit px width is useful for very shallow
or zero-height lines.

Endpoints do not determine the element's layout size. A small diagonal in a
large allocation still takes up the full allocation, and points can extend
outside it. Set dimensions explicitly for a predictable rule or connector.
Use [Arrow](geometry.md#Arrow) for arrowheads or [Network](networks.md#Network) and
[Edge](networks.md#Edge) for connections between named elements.

Set `space="data"` to project both endpoint pairs through the enclosing
[Graph](plotting.md#Graph), Plot, or [GeoMap](maps.md#GeoMap):

```jsx
<GeoMap source={world_countries()}>
  <Line
    space="data"
    from={[-9.14, 38.72]} to={[23.73, 37.98]}
    stroke={blue} stroke-width={px(2)}
  />
</GeoMap>
```

These endpoints are longitude/latitude in degrees. The segment stays straight
between the projected endpoints; use a sampled [Polyline](geometry.md#Polyline) for a
curved route. If either endpoint is hidden by the projection, the line is omitted.
No coordinate context is an error for `space="data"`. Numeric endpoints contribute
to ordinary Graph/Plot limit inference; custom projections still need explicit
output limits. Tagged px/em/% pairs remain local, and a custom projection rejects
pairs mixing a data number with a tagged length. Stroke lengths retain their
ordinary layout meaning. See [Projections](../guides/projections.md).

<a id="Line-example"></a>

### Example

```jsx
// Stroke caps change the ends of otherwise identical horizontal line segments.
const Rule = ({ cap, color }) => (
  <HStack gap={em(1)} align="center">
    <Text width={px(64)}>{cap}</Text>
    <Line
      grow={1}
      height={px(24)}
      from={[0.05, 0.5]}
      to={[0.95, 0.5]}
      stroke={color}
      stroke-width={px(10)}
      stroke-linecap={cap}
    />
  </HStack>
)
return (
  <Box padding={em(1.25)} background={lightgray}>
    <VStack gap={em(1)}>
      <Rule cap="butt" color={blue} />
      <Rule cap="round" color={red} />
      <Rule cap="square" color={green} />
    </VStack>
  </Box>
)
```

---

<a id="Path"></a>

## Path

| Property | Default | Meaning |
|---|---|---|
| `commands` | `[]` | **Path** command records or arrays returned by the path helpers |

**Path** draws a sequence of explicit path commands. Supply `commands`, not an SVG
d string. The following helpers are available in JSX and exported by core:

| Helper | Meaning |
| --- | --- |
| `move_to(x, y)` | Start a subpath at a point |
| `line_to(x, y)` | Straight segment to a point |
| `quad_to(x1, y1, x, y)` | Quadratic Bézier with one control point |
| `curve_to(x1, y1, x2, y2, x, y)` | Cubic Bézier with two control points |
| `close_path()` | Close the current subpath |

The first command of a nonempty path must be move_to. Coordinates are absolute
within the **Path**'s own rectangle, not relative displacements. Fractions use its
width and height, including for control points. px and em work too. A new
move_to starts another subpath in the same drawing.

```jsx
<Path width={px(240)} height={px(100)}
  commands={[move_to(0, 0.8), curve_to(0.3, 0, 0.7, 1, 1, 0.2)]}
  fill={none} stroke={green} stroke-width={px(3)} />
```

Layout follows ordinary shape sizing, not the bounds of the commands. The
same normalized path can be stretched by choosing another allocation. For
aspect-preserving geometry, supply a size/aspect or set [fit](../guides/sizing.md#fitting) on a sized **Path**.
Paint is inherited; an open path with a fill still has SVG's implicitly closed
fill area. Set `fill={none}` for an unfilled curve.

Only move, line, quadratic, cubic, and close commands are implemented. SVG arc
commands, path-string parsing, and automatic spline construction are not part
of the current API.

<a id="Path-example"></a>

### Example

```jsx
// A cubic curve and a closed shape made from quadratic curves share normalized coordinates.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1.5)}>
    <Path
      grow={2.2}
      aspect={2.2}
      commands={[
        move_to(0.05, 0.8),
        curve_to(0.3, 0.05, 0.7, 0.95, 0.95, 0.2),
      ]}
      fill={none}
      stroke={blue}
      stroke-width={px(4)}
      stroke-linecap="round"
    />
    <Path
      grow={1.4}
      aspect={1.4}
      commands={[
        move_to(0.1, 0.5),
        quad_to(0.5, 0, 0.9, 0.5),
        quad_to(0.5, 1, 0.1, 0.5),
        close_path(),
      ]}
      fill={red}
      stroke={none}
    />
  </HStack>
</Box>
```

---

<a id="Points"></a>

## Points

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Marker positions; null and nonfinite values are omitted |
| `point-size` | `px(6)` | Marker size, pair, or `(point, index) => size` callback |
| `shape` | `Circle` | Marker **Element** or `(point, index) => Element` callback |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Repeat a marker at each `{x,y}` or `[x,y]` in points. The forms can be mixed.
Null/nonfinite entries are omitted
without changing callback indices. Positions use ambient [Graph](plotting.md#Graph)
coordinates or local fractions outside it.

`point-size` is full marker diameter/size, default `px(6)`. Scalar fractions use the
shorter frame side; `{x,y}` or `[x,y]` sizes resolve per axis. It may be a (point,index)
function returning a scalar or pair. shape is an **Element** or (point,index) function;
the default is **Circle**.

Callbacks always receive `{x,y}` records, including for tuple inputs, and execute
once at construction. Shapes receive exact marker dimensions
and a cleared data context, then are centered on their points. The same immutable
shape can be reused everywhere. **Rotate** and **TransformBox** pass those dimensions
through to their wrapped shape before transforming it. Defaults: black fill, no
stroke. Return styled shapes for individual colors. Marker sizes do not contribute
to data limits.

<a id="Points-example"></a>

### Example

```jsx
// Mixed point forms; callbacks always receive named coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Points
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      point-size={p => px(8 + p.x * 3)}
      shape={<Square fill={blue} />}
    />
  </Graph>
</Box>
```

---

<a id="Polygon"></a>

## Polygon

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Ordered local vertices joined and closed into a polygon |

**Polygon** connects `points` in order and closes the path back to the first point.
Points are `{ x, y }` objects or `[x, y]` tuples containing fractions, px, or em. Fractions use the
polygon's own rectangle; the point list does not establish its layout size.

```jsx
<Polygon width={px(120)} height={px(100)}
  points={[[0.5, 0], [1, 1], [0, 1]]}
  fill={green} stroke={none} />
```

Shared sizing and paint props work as on [Rect](geometry.md#Rect). There is no default
fill; set one explicitly for a solid silhouette. `stroke-linejoin` and
`stroke-miterlimit` control stroked corners. Empty points produce no drawing.
Vertices outside the allocated rectangle remain outside; clipping belongs to a
container or the root viewport.

The example uses `linspace(-90,270,count,false)` and `polard` to generate a regular
polygon without duplicating its closing vertex. See [Arrays](../guides/arrays.md) and
[Vectors](../guides/vectors.md) for these helpers. There is no point-list
bounding-box fit. Use [Polyline](geometry.md#Polyline) for an open outline or [Path](geometry.md#Path)
for curved edges.

<a id="Polygon-example"></a>

### Example

```jsx
// Evenly spaced angles and polar coordinates generate regular polygons.
const regular = (count) =>
  linspace(-90, 270, count, false).map((angle) => polard(angle, 0.45, [0.5, 0.5]))
return (
  <Box padding={em(1.25)} background={lightgray}>
    <HStack gap={em(1.25)}>
      <Polygon
        grow={1}
        aspect={1}
        points={regular(3)}
        fill={blue}
        stroke={none}
      />
      <Polygon
        grow={1}
        aspect={1}
        points={regular(5)}
        fill={red}
        stroke={none}
      />
      <Polygon
        grow={1}
        aspect={1}
        points={regular(6)}
        fill={green}
        stroke={none}
      />
    </HStack>
  </Box>
)
```

---

<a id="Polyline"></a>

## Polyline

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Ordered points in the selected coordinate space |
| `space` | `"local"` | `"data"` uses the enclosing Graph, Plot, or GeoMap coordinate context |

**Polyline** connects `points` in order with straight segments. Each point is an
object `{ x, y }` or tuple `[x, y]`; both forms can be mixed. An empty list draws nothing. The path remains
open; use [Polygon](geometry.md#Polygon) to close the final edge.

```jsx
<Polyline width={px(240)} height={px(100)}
  points={[[0, 0.8], [0.4, 0.2], [1, 0.6]]}
  fill={none} stroke={green} stroke-width={px(3)} />
```

By default, fractions map to the polyline's own allocated axes, with y increasing
downward. Pixels and em are also accepted. Point bounds do not set its layout
size or aspect. This local behavior remains the default inside Graph or GeoMap.

Set `space="data"` to project each supplied vertex through the enclosing
[Graph](plotting.md#Graph), Plot, or [GeoMap](maps.md#GeoMap). A coordinate context is
required. Numeric vertices contribute to ordinary Graph/Plot limit inference;
custom projections still require explicit output limits. Tagged px/em/% pairs
bypass data mapping, while a custom projection rejects mixed data/length pairs.

```jsx
<Graph
  aspect={1} xlim={[-1, 1]} ylim={[-1, 1]}
  projection={([theta, r]) => [r * cos(theta), r * sin(theta)]}
>
  <Polyline
    space="data"
    points={linspace(0, tau, 121).map(theta => [theta, 0.8])}
    fill={none} stroke={blue} stroke-width={px(2)}
  />
</Graph>
```

Only supplied vertices are projected; add enough samples for curved routes.
A projection returning `null` breaks the path, so visible vertices on opposite
sides of a hidden point are not joined. Stroke widths remain ordinary layout
lengths. See [Projections](../guides/projections.md).
[CoordLine](geometry.md#CoordLine) uses ambient data coordinates by default and also
accepts explicit null gaps; [SymLine](plotting.md#SymLine) supplies function sampling.

Paint is inherited. Set `fill={none}` for a line chart: if you supply a fill,
SVG fills the area as though the last point were connected to the first even
though the stroked path stays open. `stroke-linejoin` controls the joins, and
`stroke-linecap` controls the two open ends. There is no smoothing option; use
[Path](geometry.md#Path) for Bézier curves.

<a id="Polyline-example"></a>

### Example

```jsx
// Map a sequence of values into a polyline's own rectangle, with y increasing down.
const values = [0.25, 0.4, 0.3, 0.7, 0.55, 0.9, 0.8]
const points = values.map((value, index) => [
  0.05 + (0.9 * index) / (values.length - 1),
  0.95 - 0.9 * value,
])
return (
  <Frame padding={em(1.25)} border-color={gray} background={lightgray}>
    <Polyline
      width="fill"
      aspect={16 / 7}
      points={points}
      fill={none}
      stroke={blue}
      stroke-width={px(4)}
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </Frame>
)
```

---

<a id="Ray"></a>

## Ray

| Property | Default | Meaning |
|---|---|---|
| `origin` | `[0.5, 0.5]` | **Ray** origin |
| `angle` | `0` | Screen-space direction in degrees, clockwise positive |
| `length` | `0.5` | Distance relative to the shorter side, or a px/em length |
| `space` | Automatic | Use ambient data coordinates or local geometry |

A finite ray from origin at a screen-space angle in degrees (positive clockwise).
Defaults: center origin, angle 0, length 0.5 of the shorter frame side. length is
a layout length; only the origin contributes data bounds. Use **Arrow** with from/to
for a data-vector endpoint.

Point inputs accept `{x,y}` or `[x,y]`; see [Point values](../guides/point_values.md).

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="Ray-example"></a>

### Example

```jsx
// Ray in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Ray
      origin={[1, 1]}
      angle={-30}
      length={px(150)}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="Rect"></a>

## Rect

| Property | Default | Meaning |
|---|---|---|
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |

**Rect** paints its allocated rectangle. It is a leaf: it has no content children.
Use a [Box](layout.md#Box) when the rectangle should surround text or another element.

<a id="Rect-size-and-paint"></a>

### Size and paint

**Rect** accepts the shared [sizing](../guides/sizing.md) and [style](../guides/style.md) props. With no
aspect, each axis is resolved independently. A finite offer can size the shape;
an otherwise unconstrained axis falls back to 16px. A stack's main-axis
allocation still follows [explicit flex](../guides/stack.md), not automatic filling.

`aspect` is width divided by height. For example, `width={px(160)}` `aspect={2}`
gives a preferred height of 80px. Exact allocations take precedence over this
preference. Set both dimensions when you need a specific rectangle.

The default paint is no fill and a black 1px stroke. Strokes are centered on the
rectangle's boundary, so visible ink can extend beyond its layout rectangle.
Use `stroke={none}` for a fill-only swatch.

<a id="Rect-rounded-corners"></a>

### Rounded corners

`border-radius` defaults to zero. A scalar rounds both axes equally; a pair sets
elliptical corners. Pairs accept `{x, y}` or `[x, y]`:

```jsx
<Rect width={px(160)} height={px(80)} border-radius={[px(24), px(12)]} />
```

Select sides or corners with `t`, `b`, `l`, `r`, `tl`, `tr`, `bl`, and `br`:
`border-radius={{ t: px(12), br: [px(6), px(3)] }}` rounds both top corners and
the bottom-right corner. Unspecified corners are square; explicit corners
override sides. See [Box](layout.md#Box) for the shared precedence rules.

Fractional scalar radii use the shorter side. A pair's x/y fractions use width
and height respectively. Radii must be nonnegative and are capped at half the
corresponding side. [RoundedRect](geometry.md#RoundedRect) is the same geometry with a
nonzero default radius.

<a id="Rect-example"></a>

### Example

```jsx
// Flexible rectangles with different aspect ratios and elliptical corners.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1)}>
    <Rect grow={3} aspect={1.5} fill={blue} stroke={none} />
    <Rect grow={4} aspect={2} fill={red} stroke={none} />
    <Rect
      grow={3}
      aspect={1.5}
      border-radius={[px(24), px(12)]}
      fill={green}
      stroke={none}
    />
  </HStack>
</Box>
```

---

<a id="RoundedLine"></a>

## RoundedLine

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Ordered points; null and nonfinite values split the path |
| `radius` | `px(8)` | Quadratic corner radius, clamped to adjacent segments |
| `space` | Automatic | Use ambient data coordinates or local geometry |

A polyline with quadratic rounded corners. radius defaults to `px(8)`, resolves in layout units, and clamps to half each adjacent segment. Rounding stays stable under data scaling. These are quadratic corners, not an exact circular-arc router.

Point inputs accept `{x,y}` or `[x,y]`; see [Point values](../guides/point_values.md).

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="RoundedLine-example"></a>

### Example

```jsx
// RoundedLine in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <RoundedLine
      points={[[0, 0], [0, 2], [2, 2], [2, 3]]}
      radius={em(1.2)}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="RoundedRect"></a>

## RoundedRect

| Property | Default | Meaning |
|---|---|---|
| `border-radius` | `0.125` of the shorter side | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |

**RoundedRect** is [Rect](geometry.md#Rect) with a default corner radius of 0.125 of its
shorter side. It accepts the same sizing and paint props, has no children, and
does not imply a particular aspect ratio.

Override `border-radius` with px, em, a fraction, or an `{ x, y }` / `[x, y]` pair. A scalar keeps
the corners circular; a pair permits elliptical corners. `border-radius={0}` removes
the rounding. A large radius is capped at half each side, which is convenient
for a pill shape.

A side/corner object selects which corners to round, replacing the uniform
default. For example, `border-radius={{ t: px(12) }}` leaves the bottom corners square.
See [Rect](geometry.md#Rect) for all radius forms.

```jsx
<RoundedRect width={px(160)} height={px(64)} border-radius={px(32)}
  fill={green} stroke={none} />
```

Rounding changes the geometry, not the layout size. For a rounded container
with text, padding, or clipping, use [Box](layout.md#Box) or [Frame](layout.md#Frame) with a
`border-radius` instead. Shapes cannot wrap children.

<a id="RoundedRect-example"></a>

### Example

```jsx
// Default rounding, fixed-radius corners, and a pill use the same rectangle primitive.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1)}>
    <RoundedRect grow={1} aspect={2} fill={blue} stroke={none} />
    <RoundedRect
      grow={1}
      aspect={2}
      border-radius={px(16)}
      fill={red}
      stroke={none}
    />
    <RoundedRect
      grow={1}
      aspect={2}
      border-radius={px(32)}
      fill={green}
      stroke={none}
    />
  </HStack>
</Box>
```

---

<a id="Segments"></a>

## Segments

| Property | Default | Meaning |
|---|---|---|
| `segments` | `[]` | Independent pairs of segment endpoints |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Independent segments in one drawing. segments is an array of pairs of `{x,y}` or `[x,y]` endpoints. Pairs never connect to one another; fill is ignored.

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="Segments-example"></a>

### Example

```jsx
// Segments in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Segments
      segments={range(3).map(x => [[x, 0], [x + 1, 3]])}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="Spline"></a>

## Spline

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | Ordered points; null and nonfinite values split the path |
| `tension` | `1` | Catmull–Rom tangent strength; 0 makes straight segments |
| `closed` | `false` | Close each finite run |
| `space` | Automatic | Use ambient data coordinates or local geometry |

A cubic spline through points. tension defaults to 1; zero makes straight segments. closed joins the final point to the first. Null/nonfinite samples separate runs. Uniform Catmull–Rom tangents may overshoot sample extrema; inference covers samples. Custom endpoint directions and monotone interpolation are deferred.

Point inputs accept `{x,y}` or `[x,y]`; see [Point values](../guides/point_values.md).

Inside [Graph](plotting.md#Graph), numeric geometry uses data coordinates; outside it,
geometry uses local fractions/px/em. `space="local"` opts out of an ambient graph,
and `space="data"` requires one. Pixel strokes keep their size.

<a id="Spline-example"></a>

### Example

```jsx
// Spline in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <Spline
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      stroke={blue}
      stroke-width={px(3)}
    />
  </Graph>
</Box>
```

---

<a id="Square"></a>

## Square

| Property | Default | Meaning |
|---|---|---|
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |

**Square** is a rectangle with an intrinsic 1:1 aspect and square drawing geometry.
Setting just width or height normally determines the other dimension:

```jsx
<Square width={px(80)} fill={green} stroke={none} />
```

If an allocation is not square, **Square** draws the largest centered square that
fits inside it. Its layout rectangle still has the allocated dimensions. This
differs from [Rect](geometry.md#Rect) `aspect={1}`: **Rect** expresses an aspect preference but
paints its entire final rectangle, even if that preference is overridden.

`border-radius` works as on **Rect**, relative to the drawn square's sides. Paint comes from
the shared [style](../guides/style.md). The natural fallback is 16 × 16px.

An intrinsic aspect is local to this leaf. A [VStack](layout.md#VStack) containing a
**Square** does not inherit a square aspect, infer a shared width from its total
height, or automatically grow the **Square**. Give the stack a width or choose
explicit child flex allocation when that relationship matters.

The example allocates a 2:1 rectangle to each shape at the offered width. **Square** remains
square; **Rect** paints the full allocation. The enclosing **Frame**s reveal the sizes.

<a id="Square-example"></a>

### Example

```jsx
// Square preserves square geometry inside a nonsquare allocation; Rect fills it.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1.25)}>
    <VStack grow={1} gap={em(0.5)}>
      <Text>Square</Text>
      <Frame padding={em(0.5)} border-color={darkgray}>
        <Square aspect={2} fill={blue} stroke={none} />
      </Frame>
    </VStack>
    <VStack grow={1} gap={em(0.5)}>
      <Text>Rect</Text>
      <Frame padding={em(0.5)} border-color={darkgray}>
        <Rect
          aspect={2}
          fill={red}
          stroke={none}
        />
      </Frame>
    </VStack>
  </HStack>
</Box>
```

---

<a id="Triangle"></a>

## Triangle

| Property | Default | Meaning |
|---|---|---|
| `points` | `[{x:0.5,y:0}, {x:1,y:1}, {x:0,y:1}]` | Ordered local vertices joined and closed |

A **Polygon** with vertices at top center and both bottom corners. Uses local fractional geometry and accepts **Polygon** props, including a points override.

<a id="Triangle-example"></a>

### Example

```jsx
// The Triangle geometry convenience.
<Box width="fill" aspect={1.6} padding={em(2)}>
  <Triangle fill={blue} stroke={blue} stroke-width={px(3)} />
</Box>
```

---

<a id="UnitLine"></a>

## UnitLine

| Property | Default | Meaning |
|---|---|---|
| `from` | `[0, 0.5]` | Segment start in the local rectangle |
| `to` | `[1, 0.5]` | Segment end in the local rectangle |

**UnitLine** is a local **Line** convenience. **HLine** and **UnitLine** span `x=0` to `x=1` at `y=0.5`;
**VLine** spans `y=0` to `y=1` at `x=0.5`. `from/to` props can override these defaults. Use
**CoordLine** for data geometry.

<a id="UnitLine-example"></a>

### Example

```jsx
// The UnitLine geometry convenience.
<Box width="fill" aspect={1.6} padding={em(2)}>
  <UnitLine fill={blue} stroke={blue} stroke-width={px(3)} />
</Box>
```

---

<a id="VFill"></a>

## VFill

| Property | Default | Meaning |
|---|---|---|
| `points` | `[]` | First edge of the filled region |
| `boundary` | `0` | Second edge as points, or a y baseline |
| `direction` | `"vertical"` | Fill vertically; may be overridden |
| `space` | Automatic | Use ambient data coordinates or local geometry |

Fill a region between points and boundary, arrays of `{x,y}` records or `[x,y]` tuples. boundary
may be a scalar baseline (default 0). Arrays must have matching lengths; a gap
in either boundary splits the whole region.

direction defaults to vertical (horizontal for **HFill**). For vertical fills a
scalar supplies y; for horizontal fills it supplies x. **VFill** is the vertical
convenience. Defaults: pale blue fill, no stroke.

Numeric geometry follows [Graph](plotting.md#Graph) and participates in limits, including
the baseline. [SymFill](plotting.md#SymFill) samples function boundaries.

<a id="VFill-example"></a>

### Example

```jsx
// VFill in data coordinates.
<Box padding={em(2)}>
  <Graph xlim={[-0.5, 3.5]} ylim={[-0.5, 3.5]}>
    <VFill
      points={[[0, 0], [1, 2], [2, 1], [3, 3]]}
      boundary={0}
      fill={blue}
    />
  </Graph>
</Box>
```

---

<a id="VLine"></a>

## VLine

| Property | Default | Meaning |
|---|---|---|
| `from` | `[0.5, 0]` | Segment start in the local rectangle |
| `to` | `[0.5, 1]` | Segment end in the local rectangle |

**VLine** is a local **Line** convenience. **HLine** and **UnitLine** span `x=0` to `x=1` at `y=0.5`;
**VLine** spans `y=0` to `y=1` at `x=0.5`. `from/to` props can override these defaults. Use
**CoordLine** for data geometry.

<a id="VLine-example"></a>

### Example

```jsx
// The VLine geometry convenience.
<Box width="fill" aspect={1.6} padding={em(2)}>
  <VLine fill={blue} stroke={blue} stroke-width={px(3)} />
</Box>
```
