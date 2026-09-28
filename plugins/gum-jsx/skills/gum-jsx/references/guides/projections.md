# Projections

Layout gives an element a rectangular drawing area. A projection maps its data
points into that area. The same [Arrow](../elements/geometry.md#Arrow),
[CoordLine](../elements/geometry.md#CoordLine), and [Points](../elements/geometry.md#Points)
can use Cartesian, polar, or geographic coordinates.

## Polar coordinates in Graph

Give [Graph](../elements/plotting.md#Graph) a `polar_projection()` to map named
angle/radius records into Cartesian coordinates:

```jsx
<Graph
  aspect={1}
  xlim={[-1.2, 1.2]} ylim={[-1.2, 1.2]}
  projection={polar_projection()}
>
  <SymLine
    f={theta => ({theta, r: 0.8})}
    tlim={[0, tau]} samples={121}
    stroke={blue} fill={none}
  />
  <Points points={[{theta: pi / 4, r: 0.8}]} point-size={px(8)} fill={red} />
  <Text pos={{theta: pi / 4, r: 1}} anchor="center">45°</Text>
</Graph>
```

Each record supplies `theta` in radians and `r` as its radius. The helper
returns `{x: r * cos(theta), y: r * sin(theta)}` by default.
Graph maps those through its limits and flips into pixels.
Limits describe the projection's output space. Both limits must be explicit, or
provided with `coord`; inferring nonlinear bounds would require additional
sampling. Equal axis spans and a square frame preserve the polar disk's shape.

`polar_projection({degrees, offset, clockwise})` defaults to radians, an offset
of `0`, and counterclockwise angles from positive x. `degrees: true` makes both
`theta` and `offset` use degrees. The angle is `offset + theta`, or
`offset - theta` with `clockwise: true`. For compass bearings, use
`polar_projection({degrees: true, offset: 90, clockwise: true})`: zero points up
and 90° points right with Graph's default flips. Signed radii are supported.

Inputs require finite `theta` and `r`; extra finite numeric dimensions are
allowed. Tuples always expand to `{x, y}`, so use named records for polar input.
Custom projections can still be supplied as pure coordinate-record functions.

## Parametric paths in source coordinates

[SymLine](../elements/plotting.md#SymLine),
[SymSpline](../elements/plotting.md#SymSpline),
[SymPoly](../elements/plotting.md#SymPoly),
[SymPoints](../elements/plotting.md#SymPoints), and
[SymArrow](../elements/plotting.md#SymArrow) accept `f(t)` returning any numeric
coordinate record. Sampling produces source coordinates; the enclosing Graph
projects them into its Cartesian view. For example, put this spiral inside the
polar Graph above:

```jsx
<SymArrow
  f={t => ({theta: (0.15 + 2.2 * t) * pi, r: 0.2 + 0.65 * t})}
  tlim={[0, 1]}
  samples={100}
  stroke={blue}
  stroke-width={px(3)}
  head-size={px(12)}
/>
```

`tlim` sets the parameter range, while Graph's `xlim` and `ylim` describe the
projected output. Use `tvals` for explicit parameter samples. `fx` and `fy` remain
Cartesian conveniences; `f` lets the curve use the projection's own dimension
names, including `{lon, lat}` or `{x, y, z}`.

SymArrow uses the same sampling options as SymLine and the head controls of
[Arrow](../elements/geometry.md#Arrow). It draws an end head by default; add
`start-head` for both ends or set `end-head={false}` to omit the end head.
Directions follow the projected path, while `head-size` stays in layout units.

The runnable example uses SymLine for the polar rings and SymArrow for the spiral,
alongside ordinary lines, points, and labels sharing the same projection. Samples
are stored at construction; resizing does not call `f` again. Projection does not
add samples, so increase `samples` when a curve needs more detail. Null/nonfinite
samples and hidden projected points break the path, without adding heads at cuts.

## Logarithmic coordinates and manual axes

`log_projection({axes, base})` takes `{x, y}` records and returns logarithms on
the selected axes. Defaults are `axes: 'both'` and `base: 10`. Use `axes: 'x'`
or `axes: 'y'` for a semilog view; the other coordinate passes through unchanged.
The base must be finite, positive, and different from `1`. Bases below `1`
reverse the logarithmic direction. Extra finite numeric dimensions are allowed;
mark inputs can also use `[x, y]` tuples.

On a logged axis, values at or below zero return `null`, hiding the point and
splitting paths. An unlogged axis can still contain zero or negative values.
Nonfinite samples follow the usual gap rules.

Graph limits are **projected values**: `[0, 3]` covers data values from `1` to
`1000` at base 10. [HAxis](../elements/plotting.md#HAxis),
[VAxis](../elements/plotting.md#VAxis), and meshes already use output coordinates
and do not apply the projection again. Supply explicit `[position, label]` ticks
to display the original data values:

```jsx
const ticks = [[0, '1'], [1, '10'], [2, '100'], [3, '1000']]
return (
  <Box padding={em(2)}>
    <Graph
      aspect={1}
      xlim={[0, 3]} ylim={[0, 3]}
      projection={log_projection()}
    >
      <HMesh lim={[0, 3]} ticks={ticks} />
      <VMesh lim={[0, 3]} ticks={ticks} />
      <SymLine
        f={t => ({x: 10 ** t, y: 10 ** t})}
        tlim={[0, 3]} stroke={blue}
      />
      <HAxis lim={[0, 3]} ticks={ticks} />
      <VAxis lim={[0, 3]} ticks={ticks} />
    </Graph>
  </Box>
)
```

Equal data ratios now occupy equal distances. You choose the tick labels and
positions; the projection carries no axis or tick metadata. Minor ticks can use
`log10(value)` positions between decades. The
[logarithmic projection example](../gallery/plotting.md#log_projection) includes
minor grid lines, two curves, and markers. Its `f(t)` samples uniformly in the
exponent, giving even detail across decades.

Both 2D helpers return immutable `Projection` objects and are available in JSX
and as imports from `@gum-jsx/core`. Their exported option types are
`PolarProjectionOptions` and `LogProjectionOptions`. Options are captured when
the helper is created. Use Graph for these views; Plot keeps its existing
Cartesian axes and does not accept a projection prop.

## More than two input dimensions

Source records can carry any number of numeric dimensions. The
[three-dimensional helix](../gallery/plotting.md#projection_3d) uses `{x, y, z}`
for a sampled curve, marker callbacks, axes, and label positions. Its Graph
maps every source position with one helper:

```jsx
projection={isometric_projection()}
```

Only the final output used by Graph needs Cartesian `x` and `y`. Named records
also let intermediate projections use other names before that final mapping.

## Standard 3D projections

These core helpers are available directly in JSX and as named imports from
`@gum-jsx/core`. Each returns an immutable `Projection` that can be shared among
Graphs. Inputs require finite numeric `x`, `y`, and `z`; extra numeric dimensions
are allowed. Camera positions and vectors use the exported `Point3` record type.
Tuples keep their two-dimensional `{x, y}` meaning and cannot supply `z`.

| Helper | Options and defaults |
| --- | --- |
| `isometric_projection()` | Fixed isometric view; each source unit axis projects to length `1`, with `120°` between axes. |
| `orthographic_projection({azimuth, elevation})` | Defaults to `azimuth: 45`, `elevation: 30`, in degrees. Projects onto a plane through the origin; depth does not change size. |
| `perspective_projection({eye, target, up, focal_length, near})` | Requires `eye`. Defaults to `target: {x: 0, y: 0, z: 0}`, `up: {x: 0, y: 0, z: 1}`, `focal_length: 1`, `near: 0.01`. |

### Isometric and orthographic views

`isometric_projection()` uses `x′ = (x − y) √3 / 2` and
`y′ = z − (x + y) / 2`. It is a uniformly scaled orthographic view with equal
foreshortening of the three axes.

For `orthographic_projection`, angles describe the **direction of sight**.
Azimuth turns from positive x toward positive y; elevation tilts the sight
direction toward positive z and must be between `-90` and `90` degrees.
For example, `azimuth: 90, elevation: 0` looks along positive y, displaying x
horizontally and z vertically. At either pole, azimuth still selects the page's
horizontal orientation. Projected x points right and projected y points up
with Graph's default flips. Distances within the projection plane retain their
source scale.

### Perspective cameras

```jsx
<Graph
  aspect={1} xlim={[-1, 1]} ylim={[-1, 1]}
  projection={perspective_projection({
    eye: {x: 4, y: 4, z: 3},
    target: {x: 0, y: 0, z: 0},
    focal_length: 1,
    near: 0.01,
  })}
>
  <CoordLine
    points={[
      {x: 1, y: 0, z: 0},
      {x: 0, y: 1, z: 0},
      {x: 0, y: 0, z: 1},
    ]}
    stroke={blue}
  />
</Graph>
```

`eye` looks toward `target`; the camera uses `up` to orient the page. The default
is z-up. The eye and target must differ, and `up` must be nonzero and not parallel
to the direction of sight. A camera looking straight along z can use
`up: {x: 0, y: 1, z: 0}`. Camera options are copied when the helper is created;
later changes to the input objects do not affect it.

In the camera frame, output is `{x: focal_length * horizontal / depth,
y: focal_length * vertical / depth}`. Depth is distance along the direction of
sight from the eye. `focal_length` and `near` must be positive finite numbers in
source coordinate units. Points with `depth <= near` return `null`, including
points behind the camera. This omits markers and annotations and splits sampled
paths using the existing visibility rules. Segments crossing the near plane
are not geometrically clipped; supply suitable samples or split them explicitly.

All three helpers return output coordinates for Graph's explicit limits. To
preserve their proportions, match the Graph aspect to the ratio of its x and y
limit spans. Projection affects positions; marker dimensions, stroke widths,
text orientation, and child drawing order follow the usual rules. Depth sorting
and surface visibility require separate handling.

## Annotations inside GeoMap

[GeoMap](../elements/maps.md#GeoMap) supplies its fitted projection to children:

```jsx
<GeoMap source={world_countries()} background={lightgray}>
  <Points
    points={[{lon: -74.01, lat: 40.71}, {lon: 2.35, lat: 48.86}]}
    point-size={px(8)} fill={red}
  />
  <Text pos={{lon: 2.35, lat: 48.86}} anchor={['start', 'end']}>Paris</Text>
</GeoMap>
```

Geographic records use `{lon, lat}` in degrees. `[longitude, latitude]` and
`{x: longitude, y: latitude}` are aliases; complete pairs are required, and
mixing the two naming schemes in one record is an error. Children share the map's
size, fitting, padding, center, rotation, and visibility. A point on the back of
an orthographic globe is omitted. Direct-child `pos` values project as a whole;
the placed element retains its normal size and orientation.
See [Map routes](../gallery/maps.md#map_routes) for a sampled arrow.

## Geometry stays with the element

Projection changes points. It does not warp completed fragments or automatically
add path samples. An Arrow with two endpoints stays straight between their
projected positions; supply more points for a curved route. Spline controls are
computed from projected samples. Arrowheads, marker sizes, line widths, and text
use ordinary layout lengths.

A projection can return `null` for an unavailable point. Markers and annotations
are omitted; line-like marks split into runs. Arrowheads stay on visible original
endpoints and are not added at cuts. This is point visibility, not geometric
clipping of a path: callers must sample and split routes appropriately at seams,
such as the antimeridian. GeoMap's geographic source geometry continues to use
its own spherical path renderer.

`space="local"` opts marks out of data mapping. A pair of tagged lengths such as
`[px(20), px(30)]` also stays local. A projected pair cannot mix one bare data
number with one tagged length. Line and Polyline default to local geometry;
set `space="data"` to project their endpoints or vertices. A Line is omitted if
either endpoint is hidden; Polyline breaks into visible runs. Path retains its
local geometry. Bars retain their rectangle
construction from projected opposite corners. Arc can project its center with
local px/em radii; use sampled CoordLine points for a data-space arc.
Fill accepts named records on both explicit boundary arrays, splitting the
whole region when either side is missing or hidden. A scalar boundary requires
exactly `{x, y}` because it replaces one axis. Field and SymField also keep
Cartesian point and vector arithmetic before projection.
Plot axes and Network retain their existing Cartesian behavior.

## The core contract

`Projection` wraps a pure `(point: Coordinate) => Coordinate | null` function,
where `Coordinate` is a readonly record of named numeric dimensions.
Graph accepts either this object or
the callback directly. Coordinates can carry a `projection` alongside
`xlim`, `ylim`, `flip_x`, and `flip_y`.

Custom elements use `map_point(value, query.coordinates, size)` for numeric
points, or `coordinate_point(value, size, query.measure, query.coordinates)` for
data and length-valued positions. Both return `{x, y}` in local pixels or `null`.
Pass coordinates through `query.child` to establish or inherit a frame; see
[Coordinates](coordinates.md). `graph_children` provides the same child
placement policy used by Graph and GeoMap.

These core helpers accept arbitrary numeric records, including `{theta, r}` and
`{x, y, z}`, and preserve every dimension until projection. Only the final result
used for viewport mapping needs `x` and `y`. Direct `Projection.project` calls
take records; `read_coordinate` expands source tuple shorthand to `{x, y}`.
`copy_coordinate` validates and snapshots a finite numeric record. A standalone
Projection may produce another named space for a later projection to consume.
Manual composition must pass through `null` results.

Annotation placement uses `pos`, accepting tuple shorthand or named numeric
records. Omitted positions stay at the local origin; an explicit position goes
through the projection. Projected marks preserve the same records in `points`,
`from`, `to`, `segments`, `tip`, `origin`, and Arc's `center`. Parametric `f(t)`
sampling also accepts arbitrary numeric records. For example,
`<SymLine f={theta => ({theta, r: 0.8})} tlim={[0, tau]} />` draws a polar ring
inside the Graph above. Null samples and any nonfinite dimension create gaps.

Projection callbacks run during layout and must not depend on mutable captured
state. The immutable Projection object retains behavior by identity, and that
identity participates in layout caching. Construct a new projection when its
behavior changes. Arbitrary functions remain disallowed in source props.
Inputs and non-null outputs must be nonempty records of finite numbers.
Local lengths require Cartesian `x` and `y`; arbitrary named dimensions must be
numeric. No inverse, path transformer,
or automatic sampling is required; `unmap_point` supports linear frames only.

## Example

```jsx
// Symbolic curves supply angle and radius; Graph projects them into Cartesian output.
const spiral = t => ({theta: (0.15 + 2.2 * t) * pi, r: 0.2 + 0.65 * t})
return (
  <TextBox width={em(32)} font-size={px(20)}
    padding={em(1.3)} background={white} fit>
    <TextCol gap={em(0.8)}>
      <Text font-size={em(1.5)} font-weight={bold}>
        A polar coordinate frame
      </Text>
      <Text font-size={em(0.8)} color={slate}>
        Sample in polar coordinates, then share one projection.
      </Text>
      <Graph aspect={1} projection={polar_projection()}
        xlim={[-1.25, 1.25]} ylim={[-1.25, 1.25]}>
        {[0.25, 0.5, 0.75, 1].map(r => (
          <SymLine f={theta => ({ theta, r })} tlim={[0, tau]}
            stroke={gray} />
        ))}
        {linspace(0, tau, 9).slice(0, -1).map(theta => (
          <Line space="data" from={{ theta, r: 0 }} to={{ theta, r: 1 }}
            stroke={gray} />
        ))}
        <SymArrow f={spiral} tlim={[0, 1]} stroke={blue}
          stroke-width={em(0.15)} head-size={em(0.6)} />
        <Points points={[spiral(0)]} point-size={em(0.5)} fill={blue} />
        {[0, 90, 180, 270].map(degrees => (
          <Text pos={{ theta: degrees * d2r, r: 1.13 }}
            font-size={em(0.75)} color={slate}>
            {degrees + '°'}
          </Text>
        ))}
      </Graph>
      <Text font-size={em(0.75)} color={slate}>
        SymArrow samples f(t) into angle and radius. Its arrowhead keeps its pixel size.
      </Text>
    </TextCol>
  </TextBox>
)
```
