# Positioning

`pos` chooses a point in the parent. `anchor` chooses the point on the child
that meets it. These props position labels, shapes, or whole containers in
[Group](../elements/layout.md#Group), [Overlay](../elements/layout.md#Overlay),
[Graph](../elements/plotting.md#Graph), [Plot](../elements/plotting.md#Plot),
[Network](../elements/networks.md#Network), and [GeoMap](../elements/maps.md#GeoMap).

For rows, columns, and grids, use their layout controls. See
[Stacks](stack.md) and [Grid](../elements/layout.md#Grid).

## Place an element

In a **Group**, fractional positions refer to the whole canvas. This circle's
center is at `(160, 80)` pixels:

```jsx
<Group width={px(320)} height={px(160)}>
  <Rect fill={lightgray} stroke={none} />
  <Circle pos={[0.5, 0.5]} width={px(48)} fill={blue} stroke={none} />
</Group>
```

Supplying `pos` defaults to `anchor="center"`. The background **Rect** has no
`pos`, so it starts at the local origin and fills the canvas.

Cartesian positions accept `[x, y]` or `{x, y}` and require both components.
For example, `pos={[em(2), px(30)]}` and `pos={{x: em(2), y: px(30)}}` are
equivalent. Each em uses the positioned child's font size. See [Units](units.md)
and [Point values](point_values.md) for the input forms.

## Choose the attachment point

An anchor refers to the child's allocated rectangle, including its padding and
inside border. It uses dimensionless fractions, with `(0, 0)` at the child's
top-left and `(1, 1)` at its bottom-right.

| `anchor` | Point on the child placed at `pos` |
|---|---|
| `"start"` or `0` | Top-left corner |
| `"center"` or `0.5` | Center |
| `"end"` or `1` | Bottom-right corner |
| `["start", "center"]` or `[0, 0.5]` | Left-edge midpoint |
| `["center", "end"]` or `[0.5, 1]` | Bottom-edge midpoint |

A single value applies to both axes. Tuples and objects choose each axis
independently: `anchor={['end', 0.5]}` and `anchor={{x: 'end', y: 0.5}}` both
attach the right-edge midpoint. Missing object axes default to start, so
`anchor={{y: 'center'}}` attaches the left-edge midpoint.

Anchor fractions range from 0 to 1. They do not accept px/em lengths, percentage
strings, fill, or stretch. Changing the anchor moves the child without changing
its size. The runnable example compares three anchors at the same `pos`.

## Defaults and omitted positions

| Child props | Default placement |
|---|---|
| `pos` supplied, `anchor` omitted | Center the child at `pos` |
| Both omitted | Place the child's top-left corner at the local origin |
| Explicit `anchor` | Use that attachment point, whether or not `pos` is supplied |

`pos={undefined}` behaves like an omitted position. In **Graph**, **Plot**, and
**Network**, `pos={[0, 0]}` means data zero, which can be anywhere in the canvas;
omitting `pos` uses the canvas's local top-left origin. `pos={[px(0), px(0)]}`
explicitly selects that local origin and centers the child there by default.

Element defaults still apply. [Node](../elements/networks.md#Node) supplies both
`pos={[0, 0]}` and `anchor="center"` for a conventional network node.

## The parent chooses the coordinates

| Parent | Meaning of numeric `pos` components |
|---|---|
| **Group** | Fractions of the canvas; x right, y down from the top-left |
| **Overlay** decorations | Fractions of the first child's established box; x right, y down |
| **Graph**, **Plot**, **Network** | Data coordinates mapped through the limits; x right, y up by default |
| **GeoMap** | Geographic coordinates projected into the map; use `{lon, lat}` or `[longitude, latitude]` |

Unit strings and px/em values select local layout lengths. For example,
`pos={['50%', em(1)]}` places a child halfway across the canvas and one local
font size below its top. Its width, height, and font size always use layout
units, including inside a graph or map.

An anchor always refers to the child's own rectangle: `"start"` remains its
top-left corner even when data coordinates have y pointing up.

Projected graphs can also accept named numeric positions such as `{theta, r}`
or `{x, y, z}`. To bypass a projection, provide local lengths for both axes;
do not mix a data number with a local length in a projected position. See
[Projections](projections.md), [Making maps](maps.md), and
[Coordinates](coordinates.md) for the mappings and APIs.

## Placement and content alignment

| Prop | What it controls |
|---|---|
| `pos`, `anchor` | Placement of the element by a positioning parent |
| `align`, `justify` | Arrangement of content inside the element; the exact axes depend on the element |
| `align-self` | The child's alignment within a box, stack, or grid |

Here the **Box** is centered in the canvas. Its `align="end"` puts the text at
the box's bottom-right corner:

```jsx
<Group width={px(320)} height={px(180)}>
  <Box
    pos={[0.5, 0.5]}
    width={px(160)}
    height={px(70)}
    padding={em(0.5)}
    align="end"
    background={lightgray}
  >
    <Text>Inside the box</Text>
  </Box>
</Group>
```

The immediate parent reads positioning props from its direct children. Put `pos`
and `anchor` on an outer **Box**, **Rotate**, or stack to position the complete
object. A **Box** or stack does not use its children's `pos` and `anchor` for
placement. Reusable components should forward these props to their outer element.

## Sizing and overflow

Positioning happens after the child is measured. Each positioned child receives
an offer for the whole canvas; moving it toward an edge does not reduce that
offer. Give shapes a width or height when they should be smaller than the canvas.
Text sizes to its content and can wrap at the offered width; set its width to
choose a narrower label region. See [Sizing](sizing.md).

**Group** needs finite dimensions, finite offers, or one dimension plus an aspect.
It establishes its size before placing children. **Overlay** instead uses its
first child to establish the box for its decorations. Nested canvases establish
their own local references.

Positions may lie outside the canvas, and centered objects can extend beyond an
edge. Children paint in source order, so put backgrounds and connectors before
labels. Use the parent's `clip` option when outside paint should be hidden.
The outer **Svg** also clips at its viewport.

## Example

```jsx
// The same position meets three different points on an equally sized rectangle.
const Panel = ({ title, anchor, note }) => (
  <VStack align="center" gap={em(0.65)}>
    <Text font-weight={bold}>{title}</Text>
    <Group width={em(9)} height={em(7)}>
      <Rect fill={lightgray} stroke={none} border-radius={em(0.4)} />
      <Line from={[0, 0.5]} to={[1, 0.5]} stroke={gray} stroke-dasharray={em(0.2)} />
      <Line from={[0.5, 0]} to={[0.5, 1]} stroke={gray} stroke-dasharray={em(0.2)} />
      <Rect
        pos={[0.5, 0.5]}
        anchor={anchor}
        width={0.44}
        height={0.34}
        fill={blue}
        stroke={none}
        opacity={0.7}
        border-radius={em(0.2)}
      />
      <Dot pos={[0.5, 0.5]} width={em(0.5)} fill={black} stroke={white} />
    </Group>
    <Text font-size={em(0.8)}>{note}</Text>
  </VStack>
)

return (
  <Box fit font-size={px(18)} padding={em(1.25)}>
    <VStack gap={em(1)}>
      <Text font-size={em(1.4)} font-weight={bold}>One position, three anchors</Text>
      <Text>The dot marks the same position in each canvas.</Text>
      <HStack gap={em(1)}>
        <Panel title="start" anchor="start" note="Top-left at pos" />
        <Panel title="center (default)" note="Center at pos" />
        <Panel title="end" anchor="end" note="Bottom-right at pos" />
      </HStack>
      <Text font-family={mono} font-size={em(0.85)}>{'pos={[0.5, 0.5]}'}</Text>
    </VStack>
  </Box>
)
```
