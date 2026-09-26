# Point values

Point inputs accept either `[x, y]` or `{x, y}` in JSX and host code. You can mix
both forms in one list. Each tuple must contain exactly two coordinates.

```jsx
<Line from={[0, 0.5]} to={[1, 0.5]} />
<Polygon points={[[0.5, 0], [1, 1], [0, 1]]} />
<Ellipse center={[0.5, 0.5]} radius={[px(30), em(1)]} />
```

| Input | Where it works |
| --- | --- |
| `from`, `to`, `center`, `origin`, `tip` | **Line**, **Circle**/**Ellipse**, **Arc**, **Arrow**, **Ray**, **ArrowHead**, and their conveniences |
| `points` and `fill` boundary lists | **Polyline**/**Polygon**, **CoordLine**, **Spline**, **RoundedLine**, **Points**, **Arrow**, **Fill**/**HFill**/**VFill** |
| Segment endpoints | `segments={[[[0, 0], [1, 1]], [[0, 1], [1, 0]]]}` |
| Paired `border-radius`, `radius`, or `point-size` | **Rect**/**Box** corners, **Ellipse**/**Arc** radii, and **Points** marker dimensions |
| **Field** samples | `vectors={[{point: [0, 0], vector: [1, 2]}]}` |
| **Anchor** and alignment pairs | `anchor={[1, 0.5]}`, **Box**/**Anchor** `align`, `fit-align`, and **Rotate** `origin` |
| Numeric helper inputs | Vector arithmetic, `spline2d` and path builders, `point_bounds`, `map_point`/`unmap_point`, drawing centers/radii, and placement offsets |

The representation does not change coordinate units. Primitive shapes use local
fractions, px, and em. Numeric points in graph marks use data coordinates inside
[Graph](../elements/plotting.md#Graph) or [Plot](../elements/plotting.md#Plot). Tuple coordinates can mix lengths, such as
`[px(12), 0.5]`. **Circle**'s radius remains scalar; **Ellipse** accepts separate radii.

**Anchor** and alignment pairs instead use dimensionless fractions from 0 to 1 or
the keywords start/center/end: `anchor={['end', 0.5]}`. **Box** alignment also allows
fill and stretch. Stack align/justify remain single-axis values. See [Group](../elements/layout.md#Group)
for the distinction between placing an element and arranging its contents.

[Array helpers](arrays.md) can feed point lists directly:

```jsx
const xs = linspace(0, tau, 33)
return <Plot>
  <CoordLine points={zip(xs, xs.map(sin))} />
  <Points points={xs.map(x => [x, cos(x)])} />
</Plot>
```

Null and nonfinite coordinates keep their existing gap behavior: lines and fills
split their paths, and **Points** omits missing markers. Inferred limits ignore these
gaps. Malformed tuples raise an error.

**Points** callbacks always receive an `{x, y}` record, even for tuple inputs.
**Field** shape callbacks likewise receive records in `sample.point` and
`sample.vector`. Callbacks keep original input indices and execute once at
construction. Generated points from polar, vector arithmetic, sampling, splines,
and coordinate mapping also remain `{x, y}` records.

In TypeScript, `PointValue` is the numeric input union and `PositionValue` also
allows px/em coordinates. For a separately declared array, annotate its point
type or use `as const` to retain tuple lengths:

```ts
import { Points, Line, px } from '@gum-jsx/core'
import type { PointValue, PositionValue } from '@gum-jsx/core'

const data: PointValue[] = [[0, 1], [2, 3]]
const endpoint: PositionValue = [px(12), 0.5]
const markers = new Points({ points: data })
const line = new Line({ from: endpoint, to: [1, 0.5] })
```

## Example

```jsx
// Zipped tuples and marker tuples share a plot and the same marker callbacks.
const xs = linspace(-pi, pi, 33)
const points = zip(xs, xs.map(sin))
const markers = [[-pi, 0], [-pi / 2, -1], [0, 0], [pi / 2, 1], [pi, 0]]
const shape = point => <Square border-radius={px(2)} fill={point.y < 0 ? red : blue} />
return <TextBox width="fill" font-size={px(20)} padding={em(1.5)} background={lightgray}>
  <TextCol gap={em(0.75)}>
    <Text font-size={em(1.625)} font-weight={bold}>Points as coordinate pairs</Text>
    <Plot font-size={em(0.75)} aspect={2} xlabel="x" ylabel="sin(x)">
      <CoordLine points={points} stroke={blue} stroke-width={px(2)} />
      <Points points={markers} point-size={px(10)} shape={shape} />
    </Plot>
    <Text font-size={em(0.75)}>
      zip(xs, ys) supplies the curve. Marker callbacks receive named x and y coordinates.
    </Text>
  </TextCol>
</TextBox>
```
