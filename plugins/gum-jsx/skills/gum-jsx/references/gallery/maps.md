# Maps gallery

<a id="filtered_region"></a>

## Filtering and bounds

The two [GeoMap](../elements/maps.md#GeoMap) panels share
`bounds={[4, 44, 25, 56]}`. The first draws the whole source; the
second uses `world_countries({ ids })` to keep Germany, Poland, Czechia, Austria,
and Switzerland. Their scale and placement agree because bounds fitting does
not depend on source geometry.

`ids` filters features before borders are built. It keeps the shared TopoJSON
arc table, so internal borders still work. The same option is available on
`us_states`, `geojson`, and `topojson`. Preserve leading zeros in string IDs.

Bounds mean `[west, south, east, north]` in degrees. They fit the region and
clip all map content to its projected outline, preserving the projection's
proportions and leaving unused allocation transparent. Within the bounds, the
water background also shows wherever countries have been omitted. Bounds override
`fit-to`; omit them to use `fit-to="data"` for the selected countries themselves,
or `fit-to={ids}` to fit a subset while still drawing the full source.

Both panels nest the same geographic Polyline and Points for a
Berlin–Prague–Vienna route. Each map supplies its projection to those children.
See [Making maps](../guides/maps.md) for the full workflow.

<a id="filtered_region-example"></a>

### Example

```jsx
// Keep the same coordinate box while changing which countries are drawn.
const ids = ['276', '616', '203', '040', '756'] // Germany, Poland, Czechia, Austria, Switzerland
const bounds = [4, 44, 25, 56]
const panels = [
  { title: 'All countries', source: world_countries() },
  { title: 'Five selected IDs', source: world_countries({ ids }) },
]
const route = [[13.405, 52.52], [14.421, 50.088], [16.374, 48.208]]

return (
  <TextBox width={em(46)} font-size={px(20)} color={slate} padding={em(1.3)} background={white} fit>
    <TextCol gap={em(0.9)}>
      <Text font-size={em(1.5)} font-weight={bold}>Choose geography, then frame it</Text>
      <Text font-size={em(0.8)}>Both panels fit the same longitude/latitude bounds.</Text>
      <Grid columns={2} gap={em(1)}>
        {panels.map(panel => (
          <TextCol gap={em(0.6)}>
            <Text font-weight={bold}>{panel.title}</Text>
            <GeoMap
              source={panel.source} bounds={bounds}
              width={px(380)} height={px(280)} fit padding={px(12)}
              background={interp(white, blue, 0.12)} fill={interp(white, green, 0.3)}
              border-color={white} border-width={px(0.8)}
            >
              <Polyline space="data" points={route} fill={none} stroke={red} stroke-width={px(2.5)} />
              <Points points={route} point-size={px(7)} fill={red} stroke={white} stroke-width={px(1)} />
            </GeoMap>
          </TextCol>
        ))}
      </Grid>
      <Text font-size={em(0.75)}>
        The Berlin–Prague–Vienna route stays in place. Source IDs change the geography; bounds keep the view fixed.
      </Text>
    </TextCol>
  </TextBox>
)
```

---

<a id="geojson_edges"></a>

## GeoJSON edge cases

Both small GeoJSON fixtures are defined directly in the example. `geojson()`
accepts RFC 7946 coordinates and winding by default, then normalizes them for
the spherical projection pipeline. The left polygon has an outer ring and an
inner ring; the inner ring leaves a visible hole.

The right source contains two polygons meeting at ±180° longitude. Rotating the
equirectangular view by 180° puts their shared edge in the center. Both panels
use `fit-to="data"` to fit their small sources instead of the whole sphere.
See [GeoMap](../elements/maps.md#GeoMap) for the source and projection options.

The panels share a two-column **Grid**. Each **Frame** contains a **TextCol**
with a measured title and an aspect-sized map; **TextFigure** places the caption
after the grid. No page coordinates are needed for this comparison.

These are synthetic teaching shapes. For bundled geographic sources, see
[world countries](maps.md#world_choropleth) and [US states](maps.md#us_states).

<a id="geojson_edges-example"></a>

### Example

```jsx
// RFC 7946 polygon winding keeps the lake empty; split antimeridian parts stay local.
const donut = geojson({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'ring',
      properties: { name: 'Island with a lake' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-30, -20], [30, -20], [30, 20], [-30, 20], [-30, -20]],
          [[-11, -8], [-11, 8], [11, 8], [11, -8], [-11, -8]],
        ],
      },
    },
  ],
})
const dateline = geojson({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'east',
      properties: { name: 'East of the antimeridian' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[170, -18], [180, -18], [180, 18], [170, 18], [170, -18]],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'west',
      properties: { name: 'West of the antimeridian' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-180, -18], [-170, -18], [-170, 18], [-180, 18], [-180, -18]],
        ],
      },
    },
  ],
})
const panels = [
  {
    title: 'Polygon with a hole',
    source: donut,
    fill: interp(blue, green, 0.7),
    border_color: interp(slate, green, 0.3),
  },
  {
    title: 'Antimeridian split',
    source: dateline,
    rotate: [180, 0, 0],
    fill: interp(red, yellow, 0.4),
    border_color: interp(slate, red, 0.45),
  },
]

return (
  <TextFigure
    width={em(48)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={white} gap={em(1)}
    caption="The left ring uses RFC outer/inner winding; the right source cuts the shape at ±180°."
    caption-font-size={em(0.75)} caption-color={interp(slate, white, 0.35)}
  >
    <TextCol gap={em(0.3)}>
      <Text font-size={em(1.5)} font-weight={bold}>
        GeoJSON edge cases
      </Text>
      <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
        Local RFC 7946 fixtures · winding normalization · data fitting
      </Text>
    </TextCol>
    <Grid columns={2} gap={em(1)} align="fill">
      {panels.map(({ title, ...mapProps }) => (
        <Frame padding={em(0.9)} background={interp(white, green, 0.06)} border-color={gray}>
          <TextCol gap={em(0.6)}>
            <Text font-weight={bold} color={interp(slate, green, 0.3)}>{title}</Text>
            <GeoMap
              aspect={1.4}
              projection="equirectangular"
              fit-to="data"
              padding={em(0.8)}
              border-width={em(0.075)}
              {...mapProps}
            />
          </TextCol>
        </Frame>
      ))}
    </Grid>
  </TextFigure>
)
```

---

<a id="globe_markers"></a>

## Projected city markers

The map and marker helper share the same source, projection, rotation, fit
target, and viewport. `project_geo_point(source, view, width, height, [lon, lat])`
returns coordinates in the map's local pixel space, or `null` when the point is
clipped. Filtering those null results keeps the markers and visible-city list
in agreement.

The shared `view.padding` value is a number of pixels for the helper. The
[GeoMap](../elements/maps.md#GeoMap) receives the same value through `padding={px(view.padding)}`.
The map and its marker circles live in one fitted **Group**, with `mapSize` shared
by the group and projection helper. Scaling the group keeps the geography and
markers together. The map's `background` fills the projected globe with an ocean
color while leaving the surrounding canvas visible outside its circular outline.

An **HStack** allocates space between that canvas and a **TextCol**. **Bullets**
lays out the visible-city list, and the explanatory note follows it naturally;
adding a city or wrapping its name requires no new text coordinates.

The orthographic view faces the Americas. Tokyo is on the far side and is omitted
from the markers. See [selected-region fit](maps.md#selected_region) for drawing a
route with a shared projection.

<a id="globe_markers-example"></a>

### Example

```jsx
// Use the same view for GeoMap and project_geo_point, so overlays match the map exactly.
const world = world_countries()
// Only the geographic canvas needs a fixed size; the surrounding text is measured.
const mapSize = 500
const view = {
  projection: 'orthographic',
  rotate: [95, -20, 0],
  fit_to: 'sphere',
  padding: 14,
}
const places = [
  ['San Francisco', -122.42, 37.77],
  ['New York', -74.01, 40.71],
  ['São Paulo', -46.63, -23.55],
  ['Tokyo (back side)', 139.69, 35.68],
]
const visible = places
  .map(([name, lon, lat]) => ({ name, xy: project_geo_point(world, view, mapSize, mapSize, [lon, lat]) }))
  .filter(place => place.xy !== null)

return (
  <TextBox
    width={em(44)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={interp(white, blue, 0.06)}
  >
    <TextCol gap={em(1)}>
      <TextCol gap={em(0.3)}>
        <Text font-size={em(1.5)} font-weight={bold}>
          Projected city markers
        </Text>
        <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
          Orthographic globe · shared view settings · back-side clipping
        </Text>
      </TextCol>
      <HStack gap={em(1.5)} align="center">
        <Group width={px(mapSize)} height={px(mapSize)} grow={1.6} basis={0} fit>
          <GeoMap
            width={1} height={1}
            source={world}
            projection={view.projection}
            rotate={view.rotate}
            fit-to={view.fit_to}
            padding={px(view.padding)}
            background={interp(white, blue, 0.15)}
            fill={interp(blue, green, 0.6)}
            border-color={interp(white, blue, 0.06)}
            border-width={em(0.035)}
          />
          {visible.map(place => (
            <Circle
              x={px(place.xy[0])} y={px(place.xy[1])}
              anchor="center"
              width={em(0.6)}
              fill={red} stroke={white} stroke-width={em(0.1)}
            />
          ))}
        </Group>
        <TextCol grow={1} gap={em(1)}>
          <Text font-weight={bold}>Visible locations</Text>
          <Bullets font-size={em(0.85)} gap={em(0.6)}>
            {visible.map(place => <Text>{place.name}</Text>)}
          </Bullets>
          <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
            Tokyo is on the far side. The helper returns null, so no marker is drawn.
          </Text>
        </TextCol>
      </HStack>
    </TextCol>
  </TextBox>
)
```

---

<a id="map_aspect"></a>

## Natural map sizes

These [GeoMap](../elements/maps.md#GeoMap) elements all specify
`height={px(240)}` and omit width and aspect. Each derives its width from the
projected fit target, including map padding. The surrounding
[Frame](../elements/layout.md#Frame) hugs that measured size.

The globe is square. The regional view uses its projected longitude/latitude
box, and the narrow longitude band produces a slender frame. Bounds also clip
land, water, and overlays to their projected outline.

Natural sizing works with sphere, data, selected-ID, and bounds fits. Rotation
and spherical clipping affect the ratio; the raw ratio of longitude span to
latitude span generally differs from the projected ratio. An explicit `aspect`
overrides the preferred outer ratio. If both dimensions are fixed, the map
preserves that allocation and fits the geography inside it.

<a id="map_aspect-example"></a>

### Example

```jsx
// A shared height lets each projection and fit target determine its framed width.
const source = world_countries()
const views = [
  { label: 'Globe', projection: 'orthographic', fit_to: 'sphere' },
  { label: 'Region', bounds: [4, 44, 25, 56] },
  { label: 'Sliver', bounds: [9, 40, 11, 60] },
]

return (
  <TextBox padding={px(24)} background={white} color={slate} font-size={px(18)} fit>
    <TextCol gap={px(18)}>
      <Text font-size={px(28)} font-weight={bold}>Let the map set its shape</Text>
      <Text>Each map sets only its height. Frames hug the resulting widths.</Text>
      <HStack gap={px(24)} align="start">
        {views.map(view => (
          <TextCol gap={px(10)}>
            <Text font-weight={bold}>{view.label}</Text>
            <Frame padding={px(6)} border-color={gray} border-width={px(1)}>
              <GeoMap
                source={source} projection={view.projection} fit-to={view.fit_to}
                bounds={view.bounds}
                height={px(240)} padding={px(8)}
                fill={interp(white, green, 0.4)} background={interp(white, blue, 0.15)}
                border-color={white} border-width={px(0.7)}
              />
            </Frame>
          </TextCol>
        ))}
      </HStack>
    </TextCol>
  </TextBox>
)
```

---

<a id="map_routes"></a>

## Map routes

The Arrow receives 81 longitude/latitude samples for an illustrative route from
Lisbon to Athens. [GeoMap](../elements/maps.md#GeoMap) projects those pairs
with the same fitted view as the geography. Points and direct-child Text anchors
use the same coordinate context, so no separate pixel projection is necessary.

The route is a deliberately chosen curve in longitude/latitude, not a calculated
great-circle or travel itinerary. Elements own their geometry: a two-point Arrow
would draw a straight segment between its projected endpoints. Supply enough
samples for the desired curve, and split routes at projection seams as needed.
See [Projections](../guides/projections.md) for the core contract and a
polar Graph example.

<a id="map_routes-example"></a>

### Example

```jsx
// An illustrative route: sample in longitude/latitude before projection.
const lisbon = [-9.14, 38.72]
const athens = [23.73, 37.98]
const route = linspace(0, 1, 81).map(t => [
  lisbon[0] + (athens[0] - lisbon[0]) * t,
  lisbon[1] + (athens[1] - lisbon[1]) * t + 9 * sin(pi * t),
])

return (
  <TextBox width={em(38)} font-size={px(20)} padding={em(1.3)} background={white} fit>
    <TextCol gap={em(0.8)}>
      <Text font-size={em(1.5)} font-weight={bold}>A route in geographic coordinates</Text>
      <Text font-size={em(0.8)} color={slate}>
        The map projects each arrow sample and positions the city labels.
      </Text>
      <GeoMap
        source={world_countries()} aspect={1.65}
        fit-to={['620', '724', '276', '380', '300']}
        padding={em(1.8)}
        background={interp(white, blue, 0.12)}
        fill={interp(white, green, 0.2)} border-color={white}
      >
        <Arrow points={route} stroke={blue} stroke-width={px(3)} head-size={px(12)} />
        <Points points={[lisbon, athens]} point-size={px(9)} fill={blue} stroke={white} stroke-width={px(1.5)} />
        <Text x={lisbon[0]} y={lisbon[1] - 1.4} anchor={['center', 'start']} font-weight={bold}>Lisbon</Text>
        <Text x={athens[0]} y={athens[1] - 1.4} anchor={['center', 'start']} font-weight={bold}>Athens</Text>
      </GeoMap>
      <Text font-size={em(0.75)} color={slate}>
        An illustrative sampled route, with ordinary layout sizes for points, labels, and arrowheads.
      </Text>
    </TextCol>
  </TextBox>
)
```

---

<a id="projection_gallery"></a>

## Projection gallery

The four [GeoMap](../elements/maps.md#GeoMap) panels share one `world_countries()` source, equal column
widths, and a common map aspect. Only `projection` changes, making the different shapes and
distributions of area easy to compare. Each map fits the sphere within its panel
using `padding`.

The card list generates **Frame** panels in a two-column **Grid**. Each panel's
**TextCol** measures the title above its map. Adding a projection creates another
cell, and longer titles determine the row height. Country fills and borders use
the same shared palette in every panel. A pale blue `background` fills each
projection's outline, leaving the white frame visible outside it.

For a clipped globe view, see [projected city markers](maps.md#globe_markers).
For fitting to a subset of countries, see [selected-region fit](maps.md#selected_region).

<a id="projection_gallery-example"></a>

### Example

```jsx
// A shared grid and map aspect make projection differences easy to compare.
const world = world_countries()
const cards = [
  { name: 'Equal Earth', projection: 'equalEarth' },
  { name: 'Natural Earth', projection: 'naturalEarth1' },
  { name: 'Equirectangular', projection: 'equirectangular' },
  { name: 'Mercator', projection: 'mercator' },
]

return (
  <TextBox
    width={em(50)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={lightgray}
  >
    <TextCol gap={em(1)}>
      <TextCol gap={em(0.3)}>
        <Text font-size={em(1.5)} font-weight={bold}>
          Projection gallery
        </Text>
        <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
          One source · one viewport · {cards.length} projection presets
        </Text>
      </TextCol>
      <Grid columns={2} gap={em(1)} align="fill">
        {cards.map(card => (
          <Frame padding={em(0.75)} background={white} border-color={gray}>
            <TextCol gap={em(0.6)}>
              <Text font-weight={bold}>{card.name}</Text>
              <GeoMap
                aspect={2.1}
                source={world}
                projection={card.projection}
                fit-to="sphere"
                padding={em(0.2)}
                background={interp(white, blue, 0.15)}
                fill={interp(blue, green, 0.5)}
                border-color={white}
                border-width={em(0.02)}
              />
            </TextCol>
          </Frame>
        ))}
      </Grid>
    </TextCol>
  </TextBox>
)
```

---

<a id="selected_region"></a>

## Selected-region fit

Set `fit_to: [...]` to fit a stable set of features. This example fits
Germany, Poland, Czechia, Austria, and Switzerland by their atlas IDs. Fitting
sets the view; the map still draws the surrounding geography within its viewport.

`prepare_geo_source()` prepares the atlas for the projection helper.
`create_geo_projection(prepared, view, width, height)` returns the D3 projection
used to transform the route's longitude/latitude positions into local pixels.
The [GeoMap](../elements/maps.md#GeoMap) receives matching projection, fit, padding, and viewport settings.

Only the geographic **Group** has fixed pixel dimensions, shared through
`mapWidth` and `mapHeight`. Its `fit` scales the map, route, and markers together.
**TextFigure** measures the heading, geographic canvas, and caption in order;
changing the prose does not require shifting the map or moving the footer.

A polyline and circles connect Berlin, Prague, and Vienna. For a point helper
that also checks visibility on a globe, see [projected city markers](maps.md#globe_markers).

<a id="selected_region-example"></a>

### Example

```jsx
// Fit to stable IDs, then use the exact same projection to place a custom route.
const world = world_countries()
const prepared = prepare_geo_source(world)
// Keep the projection and overlays in one local canvas, then fit it as a unit.
const mapWidth = 850
const mapHeight = 480
const view = {
  projection: 'equalEarth',
  fit_to: ['276', '616', '203', '040', '756'], // DE, PL, CZ, AT, CH
  padding: 25,
}
const projection = create_geo_projection(prepared, view, mapWidth, mapHeight)
const route = [
  ['Berlin', 13.405, 52.52],
  ['Prague', 14.421, 50.088],
  ['Vienna', 16.374, 48.208],
].map(([name, lon, lat]) => ({ name, xy: projection([lon, lat]) }))

return (
  <TextFigure
    width={em(44)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={white} gap={em(1)}
    caption="A selected fit is stable even if unrelated countries are later added to the source."
    caption-font-size={em(0.75)} caption-color={interp(slate, white, 0.35)}
  >
    <TextCol gap={em(0.3)}>
      <Text font-size={em(1.5)} font-weight={bold}>
        Selected-region fit
      </Text>
      <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
        Fit five country IDs · reuse the projection for a Berlin–Prague–Vienna route
      </Text>
    </TextCol>
    <Group width={px(mapWidth)} height={px(mapHeight)} fit>
      <GeoMap
        width={1} height={1}
        source={world}
        projection={view.projection}
        fit-to={view.fit_to}
        padding={px(view.padding)}
        fill={interp(white, green, 0.3)}
        border-color={white}
        border-width={em(0.06)}
      />
      <Polyline
        width={1} height={1}
        points={route.map(place => [px(place.xy[0]), px(place.xy[1])])}
        fill={none} stroke={red} stroke-width={em(0.15)}
      />
      {route.map(place => (
        <Circle
          x={px(place.xy[0])} y={px(place.xy[1])}
          anchor="center"
          width={em(0.6)}
          fill={red} stroke={white} stroke-width={em(0.1)}
        />
      ))}
    </Group>
  </TextFigure>
)
```

---

<a id="us_states"></a>

## US states

`us_states()` supplies the bundled 1:10m state atlas. Its feature IDs are
two-digit FIPS strings, so California is `06`, not `6`. Use these IDs in
the `styles` dictionary to highlight states independently of the feature order,
for example `styles={{ '06': { fill: red } }}`.

The `albersUsa` projection places Alaska and Hawaii in insets and clips other
territories. It fits the data by default. `border-mode="interior"` draws only
shared state boundaries; the filled shapes supply the coastlines. Interior
borders require a TopoJSON source such as this atlas.

**TextFigure** composes a measured heading, an aspect-sized [GeoMap](../elements/maps.md#GeoMap), and a
wrapping caption. The outer width and base typography set the design scale;
padding, gaps, and map details use ems, and the content determines the height.

See [world countries](maps.md#world_choropleth) for country-level fills and
[GeoJSON edge cases](maps.md#geojson_edges) for small sources defined directly in JSX.

<a id="us_states-example"></a>

### Example

```jsx
// Albers USA supplies the familiar Alaska and Hawaii insets; shared arcs draw interior lines once.
const usStates = us_states()
const regions = {
  '06': { fill: red }, // California
  '48': { fill: yellow }, // Texas
  '36': { fill: green }, // New York
  '12': { fill: blue }, // Florida
  '53': { fill: purple }, // Washington
}

return (
  <TextFigure
    width={em(44)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={white} gap={em(1)}
    caption="The preset places Alaska and Hawaii as insets; other territories are clipped."
    caption-font-size={em(0.75)} caption-color={interp(slate, white, 0.35)}
  >
    <TextCol gap={em(0.3)}>
      <Text font-size={em(1.5)} font-weight={bold}>
        US states
      </Text>
      <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
        Albers USA · state FIPS IDs · interior TopoJSON borders
      </Text>
    </TextCol>
    <GeoMap
      aspect={1.85}
      source={usStates}
      projection="albersUsa"
      fit-to="data"
      padding={em(0.8)}
      fill={interp(white, green, 0.3)}
      styles={regions}
      border-mode="interior"
      border-color={white}
      border-width={em(0.055)}
    />
  </TextFigure>
)
```

---

<a id="world_choropleth"></a>

## World countries

`world_countries()` supplies the bundled 1:110m world atlas as a TopoJSON source.
Pass it to [GeoMap](../elements/maps.md#GeoMap) and use
`styles={id => ({ fill: highlights[id] })}` to highlight individual countries;
an undefined fill inherits the map's `fill`. IDs are strings, including leading zeros
such as `076` for Brazil and `036` for Australia.

Every feature needs an explicit ID for this callback. The accessor supplies stable
local IDs for the three atlas features that lack numeric IDs. It returns a fresh
copy with the atlas version and URL recorded in `provenance`.

The `equalEarth` projection fits the whole sphere. Shared TopoJSON borders are
drawn once, after the country fills. The CLI includes the map elements and data
accessors by default, so this example runs without imports or plugin flags.

**TextFigure** places the heading, aspect-sized map, and measured caption in a
column. Only the outer design width and base typography are specified; text and
spacing determine the remaining layout. `fit` scales the finished composition
for a smaller preview without changing the map's proportions.

Compare the [projection gallery](maps.md#projection_gallery), try
[US states](maps.md#us_states), or zoom with a [selected-region fit](maps.md#selected_region).

<a id="world_choropleth-example"></a>

### Example

```jsx
// TopoJSON countries, stable numeric IDs, an equal-area projection, and one-pass borders.
const world = world_countries()
const highlights = {
  '840': blue, // United States
  '124': interp(blue, green, 0.5), // Canada
  '076': green, // Brazil
  '356': interp(red, yellow, 0.65), // India
  '036': red, // Australia
}

return (
  <TextFigure
    width={em(44)} font-size={px(20)} color={slate} fit
    padding={em(1.5)} background={white} gap={em(1)}
    caption="Country colors are keyed by the atlas IDs, independent of feature order."
    caption-font-size={em(0.75)} caption-color={interp(slate, white, 0.35)}
  >
    <TextCol gap={em(0.3)}>
      <Text font-size={em(1.5)} font-weight={bold}>
        World countries
      </Text>
      <Text font-size={em(0.75)} color={interp(slate, white, 0.35)}>
        Equal Earth · 110m topology · country ID fills
      </Text>
    </TextCol>
    <GeoMap
      aspect={2.2}
      source={world}
      projection="equalEarth"
      fit-to="sphere"
      padding={em(0.4)}
      fill={interp(white, green, 0.25)}
      styles={id => ({ fill: highlights[id] })}
      border-color={white}
      border-width={em(0.03)}
    />
  </TextFigure>
)
```
