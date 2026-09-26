# Making maps

`@gum-jsx/maps` provides one element, [GeoMap](../elements/maps.md#GeoMap),
plus helpers for sources and projections. A map combines three choices:
which geography to draw, how to project it, and how to style its features.
Ordinary Gum elements then supply titles, markers, labels, and legends.

The CLI and editor include the maps bindings. This is a complete starting point:

```jsx
<GeoMap
  source={world_countries()}
  width={px(640)}
  background={interp(white, blue, 0.15)}
  fill={interp(white, green, 0.25)}
/>
```

It draws the bundled countries in the default Natural Earth I projection.
No file loading, imports, or network requests are needed in evaluated JSX.

## Start with a source

| Helper | When to use it |
|---|---|
| `world_countries()` | A bundled world map; country IDs include `"840"` for the US and `"392"` for Japan |
| `us_states()` | Bundled US states and territories; use `projection="albersUsa"` for Alaska and Hawaii insets |
| `geojson(data, options?)` | Your own longitude/latitude geometry, feature, or feature collection |
| `topojson(data, objectName, options?)` | A named Topology object with shared boundary arcs |

Coordinates are always `[longitude, latitude]` in degrees. Load external files
in the host before constructing the figure. GeoJSON defaults to RFC 7946 polygon
winding; see [GeoJSON edge cases](../gallery/maps.md#geojson_edges) for holes
and antimeridian cuts.

Keep stable feature IDs when preparing data. `styles` uses those IDs, including
leading zeros such as Brazil's `"076"` and California's `"06"`. If IDs live in
feature properties, use `geojson(data, { id_property: 'code' })` or the equivalent
`topojson` option. Every feature needs an explicit, unique ID when styles are used.

Pass `ids` to a source helper to draw only selected features:
`world_countries({ ids: ['276', '040'] })` keeps Germany and Austria;
`us_states({ ids: ['06', '32'] })` keeps California and Nevada. `geojson` and
`topojson` accept the same option for your own data, including `id_property`
matching. Source order and shared borders are preserved; unknown IDs are errors.
Omitting `ids` retains everything, while `ids: []` selects nothing.

## Style features and water separately

`fill` is the default land color. `styles` can be an ID-to-style dictionary:

```jsx
<GeoMap
  source={world_countries()}
  fill={lightgray}
  styles={{
    '840': { fill: green },
    '392': { fill: purple, stroke: slate, stroke_width: px(1) },
  }}
/>
```

For data-driven colors, use a callback such as
`styles={id => ({ fill: colors[id] })}`. Missing fields and undefined results
inherit the map's style. Callbacks run once at construction, so resizing does
not resample your data. With `source-resource`, use the dictionary form.
The [world countries](../gallery/maps.md#world_choropleth) and
[US states](../gallery/maps.md#us_states) examples demonstrate both forms.

`background` paints the projected sphere behind the features. It supplies the
water color while the area outside the projection remains transparent. An outer
[Box](../elements/layout.md#Box) can give the surrounding page a different color.
Lakes show the background only where the source represents them as holes.

Use `border-color` and `border-width` for the shared borders. TopoJSON draws
those borders once; `border-mode="interior"` keeps only shared boundaries.
Per-feature strokes draw afterward, which is useful for a selected-country
outline. Use `border-mode="none"` if you want only those feature strokes.

## Choose the view

Start with `naturalEarth1` for a world illustration, `equalEarth` for an
equal-area world map, `orthographic` for a globe, or `albersUsa` for US states.
The [projection gallery](../gallery/maps.md#projection_gallery) compares
world-map outlines.

| Control | What it changes |
|---|---|
| `fit-to="sphere"` | Fits the whole projected globe; the default except for Albers USA |
| `fit-to="data"` | Fits all source geometry; useful for a regional source |
| `fit-to={['276', '040']}` | Fits selected features from a larger source; surrounding geography still draws |
| `bounds={[5, 45, 18, 56]}` | Fits and clips to a longitude/latitude box, overriding `fit-to` |
| `center={[30, 20]}` | Pans 30° east, 20° north to the viewport midpoint after fitting the scale |
| `rotate={[-30, -20, 0]}` | Turns the globe toward 30° east, 20° north before projection |

`center` and `rotate` solve different problems. Panning moves the finished
projection and can crop its edges. It does not reveal the far side of an
orthographic globe; use rotation to change which hemisphere faces the viewer.
Omit `center` to keep the fit target centered automatically. Albers USA has fixed
center and rotation and uses data fitting rather than sphere fitting.

`padding` defaults to `0`; set it to leave space around the fitted geography. It is independent of
padding on an outer Box. Try [selected-region fit](../gallery/maps.md#selected_region)
for a regional map and route.

Source filtering chooses what to draw; fitting chooses the view. Combine the two:

```jsx
<GeoMap
  source={world_countries({ ids: ['276', '040'] })}
  bounds={[5, 45, 18, 56]}
  fill={green} background={lightgray}
/>
```

Bounds are `[west, south, east, north]` in degrees and take precedence over
`fit-to`, including when measuring the map's natural size. They fit a geographic
rectangle and clip land, water, borders, and overlays to its projected edges.
The projection keeps its proportions; if the region is narrower or shorter than
the allocation, the extra space stays transparent. West greater than east
means the box crosses the antimeridian; rotate the view if you want the region
away from the projection seam. Bounds do not change globe visibility. See
[Filtering and bounds](../gallery/maps.md#filtered_region) for matching views
with different sources, and [GeoMap](../elements/maps.md#GeoMap) for validation rules.

GeoMap derives its natural proportions from the projected fit target. For a
tall, narrow region, set `height` and let it choose the width. For a horizontal
map, set `width` and let it choose the height. Map padding is included in that
measurement, so a surrounding Box or Frame hugs the result. An explicit `aspect`
overrides the natural ratio; specifying both dimensions keeps that fixed box.
See [Natural map sizes](../gallery/maps.md#map_aspect) for framed examples.

## Add markers and labels

Nest [Points](../elements/geometry.md#Points), [Arrow](../elements/geometry.md#Arrow),
or other marks inside GeoMap. Their numeric pairs are longitude/latitude in
degrees. For labels or individual shapes, put longitude in the direct child's
`x` and latitude in `y`:

```jsx
<GeoMap source={world_countries()}>
  <Points points={[[-122.42, 37.77]]} point-size={px(8)} fill={red} />
  <Text x={-122.42} y={37.77} anchor={['start', 'end']}>San Francisco</Text>
</GeoMap>
```

The map projects children using its current allocated size and view settings,
including fitting, padding, center, rotation, and point visibility. Markers on
the far side of an orthographic globe disappear automatically. Text stays upright,
and marker sizes, fonts, and arrowheads use ordinary layout lengths.

For a curved route, provide sampled longitude/latitude pairs to Arrow. A
projection maps existing points without adding samples, so a two-point Arrow
remains straight between the projected endpoints. Set its stroke explicitly,
since children inherit the map's style. See [Map routes](../gallery/maps.md#map_routes)
and [Projections](projections.md) for examples and seam-handling limitations.

For overlays outside the GeoMap subtree,
`project_geo_point(source, view, width, height, [longitude, latitude])` still
returns local pixels or `null` for a hidden point. Use the same source, view, and
actual size, and wrap returned coordinates in `px(...)`. Helper `padding`
is a number of pixels. See [projected city markers](../gallery/maps.md#globe_markers)
for that pattern. Prepare a reused source with `prepare_geo_source` once;
`create_geo_projection` returns a fitted D3 projection for lower-level work,
but directly calling it does not check visibility.

The runnable example below draws the same source and two cities in a world map
and a Pacific-facing globe. Both panels share country styles and marker data;
each panel projects its marker children with its own view. Only the geographic canvas
has fixed dimensions. Text, gaps, and panel placement use ordinary layout.

## Example

```jsx
// One source and style dictionary; each GeoMap projects its own marker children.
const world = world_countries()
const mapWidth = 400
const mapHeight = 280
const styles = {
  '840': { fill: green }, // United States
  '392': { fill: purple }, // Japan
}
const cities = [
  { name: 'San Francisco', coordinates: [-122.42, 37.77], color: green },
  { name: 'Tokyo', coordinates: [139.69, 35.68], color: purple },
]
const views = [
  {
    title: 'World overview',
    note: 'Natural Earth I fits the whole world.',
    projection: 'naturalEarth1',
  },
  {
    title: 'Across the Pacific',
    note: 'Rotation turns the globe toward 170° east, 25° north.',
    projection: 'orthographic',
    rotate: [-170, -25, 0],
  },
]

return (
  <TextBox
    width={em(46)} font-size={px(20)} color={slate} fit
    padding={em(1.2)} background={white}
  >
    <TextCol gap={em(1)}>
      <Text font-size={em(1.5)} font-weight={bold}>One map, two views</Text>
      <Text font-size={em(0.8)}>
        Country styles follow IDs. City markers follow each panel's projection.
      </Text>
      <Grid columns={2} gap={em(1.2)}>
        {views.map(({ title, note, ...options }) => {
          const view = { ...options, fit_to: 'sphere', padding: 12 }

          return (
            <TextCol gap={em(0.6)}>
              <Text font-weight={bold}>{title}</Text>
              <GeoMap
                width={px(mapWidth)} height={px(mapHeight)} fit source={world}
                projection={view.projection} rotate={view.rotate}
                fit-to={view.fit_to} padding={px(view.padding)}
                background={interp(white, blue, 0.15)}
                fill={lightgray} styles={styles}
                border-color={white} border-width={em(0.035)}
              >
                {cities.map(city => (
                  <Circle
                    x={city.coordinates[0]} y={city.coordinates[1]}
                    anchor="center" width={em(0.55)}
                    fill={city.color} stroke={white} stroke-width={em(0.1)}
                  />
                ))}
              </GeoMap>
              <Text font-size={em(0.75)}>{note}</Text>
            </TextCol>
          )
        })}
      </Grid>
      <HStack gap={em(1.5)}>
        {cities.map(city => (
          <HStack gap={em(0.4)} align="center">
            <Circle width={em(0.45)} fill={city.color} stroke={none} />
            <Text font-size={em(0.75)}>{city.name}</Text>
          </HStack>
        ))}
      </HStack>
    </TextCol>
  </TextBox>
)
```
