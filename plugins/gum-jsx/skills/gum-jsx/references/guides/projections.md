# Projections

Layout gives an element a rectangular drawing area. A projection maps its data
points into that area. The same [Arrow](../elements/geometry.md#Arrow),
[CoordLine](../elements/geometry.md#CoordLine), and [Points](../elements/geometry.md#Points)
can use Cartesian, polar, or geographic coordinates.

## Polar coordinates in Graph

Give [Graph](../elements/plotting.md#Graph) a pure function that maps coordinate
records. Tuple inputs expand to `{x, y}` before reaching the callback:

```jsx
<Graph
  aspect={1}
  xlim={[-1.2, 1.2]} ylim={[-1.2, 1.2]}
  projection={({theta, r}) => ({x: r * cos(theta), y: r * sin(theta)})}
>
  <CoordLine
    points={linspace(0, tau, 121).map(theta => ({theta, r: 0.8}))}
    stroke={blue} fill={none}
  />
  <Points points={[{theta: pi / 4, r: 0.8}]} point-size={px(8)} fill={red} />
  <Text pos={{theta: pi / 4, r: 1}} anchor="center">45°</Text>
</Graph>
```

Each record supplies `theta` in radians and `r` as its radius. The callback
receives those names and returns Cartesian coordinates.
Graph maps those through its limits and flips into pixels.
Limits describe the callback's output space. Both limits must be explicit, or
provided with `coord`; inferring nonlinear bounds would require additional
sampling. Equal axis spans and a square frame preserve the polar disk's shape.

The runnable example draws its rings, spokes, and spiral with ordinary marks.
The arrow's supplied samples follow the same projection as the points.

## More than two input dimensions

Source records can carry any number of numeric dimensions. The
[three-dimensional helix](../gallery/plotting.md#projection_3d) uses `{x, y, z}`
for a sampled curve, marker callbacks, axes, and label positions. Its Graph
maps every source position with one orthographic projection:

```jsx
projection={({x, y, z}) => ({
  x: (x - y) * sqrt(3) / 2,
  y: z - (x + y) / 2,
})}
```

Only the final output used by Graph needs Cartesian `x` and `y`. Named records
also let intermediate projections use other names before that final mapping.

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
// Input records name angle and radius; Graph fits Cartesian output.
const polar = ({theta, r}) => ({x: r * cos(theta), y: r * sin(theta)})
const angles = linspace(0, tau, 121)
const route = linspace(0.15 * pi, 2.35 * pi, 100).map((theta, i) => ({theta, r: 0.2 + 0.65 * i / 99}))

return (
  <TextBox width={em(32)} font-size={px(20)} padding={em(1.3)} background={white} fit>
    <TextCol gap={em(0.8)}>
      <Text font-size={em(1.5)} font-weight={bold}>A polar coordinate frame</Text>
      <Text font-size={em(0.8)} color={slate}>
        Ordinary lines, points, and arrows share one projection.
      </Text>
      <Graph
        aspect={1} projection={polar}
        xlim={[-1.25, 1.25]} ylim={[-1.25, 1.25]}
      >
        {[0.25, 0.5, 0.75, 1].map(r => (
          <Polyline
            space="data" points={angles.map(theta => ({theta, r}))}
            stroke={lightgray} fill={none}
          />
        ))}
        {linspace(0, tau, 9).slice(0, -1).map(theta => (
          <Line
            space="data" from={{theta, r: 0}} to={{theta, r: 1}}
            stroke={lightgray}
          />
        ))}
        <Arrow points={route} stroke={blue} stroke-width={px(3)} head-size={px(12)} />
        <Points points={[route[0]]} point-size={px(9)} fill={blue} />
        {[0, 90, 180, 270].map(degrees => (
          <Text
            pos={{theta: degrees * d2r, r: 1.13}} anchor="center"
            font-size={em(0.75)} color={slate}
          >
            {degrees + '°'}
          </Text>
        ))}
      </Graph>
      <Text font-size={em(0.75)} color={slate}>
        The spiral supplies 100 point pairs. Its arrowhead stays the same size.
      </Text>
    </TextCol>
  </TextBox>
)
```
