# Networks elements

<a id="Edge"></a>

## Edge

| Property | Default | Meaning |
|---|---|---|
| `start` / `end` | Required | Element IDs, or elements with IDs |
| `start-side` / `end-side` | Automatic | `"top"`, `"right"`, `"bottom"`, or `"left"` in each node's local frame |
| `start-loc` / `end-loc` | `0.5` | Position along the chosen side, from zero to one |
| `points` | `[]` | Intermediate route points in graph coordinates |
| `space` | `"data"` | `"local"` makes numeric waypoints fractional layout lengths |
| `curve` | `true` unless radius is set | Smooth route with endpoint tangents normal to the node boundaries |
| `radius` | `0` | Rounded polyline corners in px/em/fractional lengths |
| `gap` | `0` | Distance from each boundary to the arrow endpoint |
| `start-head` / `end-head` | `false` / `true` | Arrowheads at the respective endpoints |
| `head-size` | `px(9)` | Arrowhead length |

A connection rendered with [Arrow](geometry.md#Arrow)'s shaft, heads, and paint options.
It must be a direct child of [Network](networks.md#Network), where `start` and `end` resolve
against the completed placements of identified elements, whether [Node](networks.md#Node)
or anything else. Passing an element uses its ID; it does not add that element to
the diagram.

Automatic sides face the other node, or the nearest intermediate waypoint when
one is provided. Side names are local to each node, so a rotated node's `"top"`
rotates with its frame. Locations run left-to-right for top/bottom and top-to-bottom
for left/right. Near a rounded corner, the attachment follows the visible ellipse.
`gap` moves the endpoint outward along the boundary's normal.

The default curve leaves and enters the boundaries perpendicularly. `curve={false}`
connects the endpoints and waypoints with straight segments. Setting `radius`
selects a rounded polyline and adds short outward segments at its endpoints;
an explicit `curve` takes precedence. **Edge** inherits Arrow's `tension`,
`head-width`, `head-open`, `head-curve`, `head-barb`, and scoped head paint options.

An edge with equal start/end IDs draws a self loop, by default from the right
side to the top. Use side/location overrides and waypoints to choose another
route. Ordinary routes do not perform obstacle avoidance.

Numeric waypoints use Network's data mapping, including axis reversal. px/em
waypoints stay in network-local pixels. The endpoints always come from the
placed node boundaries, regardless of the waypoint coordinate space.

<a id="Edge-example"></a>

### Example

```jsx
// Curved, rounded, and self-loop routes share Arrow's head styling.
<Box font-size={px(18)} padding={em(1)}>
  <Network aspect={1.5} xlim={[-0.6, 3.4]} ylim={[-0.6, 2.2]} stroke-width={px(2)}>
    <Edge start="a" end="b" stroke={blue} start-head head-open head-size={px(12)} />
    <Edge
      start="a" end="b" start-side="top" end-side="top"
      points={[[0, 1.8], [2.8, 1.8]]}
      radius={em(0.5)} gap={px(3)} stroke={red} head-size={px(12)}
    />
    <Edge
      start="loop" end="loop" stroke={blue} head-curve={0.7}
      points={[[1.9, 0.1], [1.8, 0.5], [1.5, 0.5]]}
    />
    <Node id="a" x={0} y={1} background={white}>
      Start
    </Node>
    <Node id="b" x={2.8} y={1} background={white}>
      Finish
    </Node>
    <Node id="loop" x={1.4} y={0} background={white}>
      Retry
    </Node>
  </Network>
</Box>
```

---

<a id="Network"></a>

## Network

| Property | Default | Meaning |
|---|---|---|
| `children` | — | Identified elements, direct **Edge** children, and ordinary graph content |
| `coord` | Inferred | `[xmin, ymin, xmax, ymax]` shorthand for both limits |
| `xlim` / `ylim` | Inferred | Directed data limits, as in **Graph** |
| `flip-x` / `flip-y` | `false` / `true` | Horizontal reversal and Cartesian y-up mapping |
| `padding` | `0.2` | Fraction of each inferred span added on either side |
| `clip` | `false` | Clip painting to the network canvas |

**Network** lays out and places its nodes before connecting them with
[Edge](networks.md#Edge). Any element with an `id` is a node: a [Node](networks.md#Node) label,
a [Circle](geometry.md#Circle), an image, a stack, or a whole nested Network. Give each
one a unique `id`, and use that ID in an edge's `start` and `end`. Edges may
appear before their nodes in the source. Source order remains paint order; put
edges first to paint them behind nodes.

Edges meet the visible outline of boxes, frames, rectangles, squares, circles,
and ellipses, including rounded corners. Every other element connects at the
rectangle of its allocation. A [TitleFrame](text.md#TitleFrame)'s outline spans its
overhanging title, so an edge from above meets a centered title. Only Node defaults to a centered anchor, so set
`anchor="center"` on other elements to position them by their centers.

Node positions use data coordinates. Fonts, frame padding, borders, and arrowheads
use ordinary px/em/fractional layout lengths. Changing the canvas size moves the
nodes while their labels retain their font size; an explicit node width can wrap
its label. Edges attach to the resulting frame after that wrapping finishes.

Sizing and coordinate options follow [Graph](plotting.md#Graph): a natural network is
480×320, finite offers establish the canvas, and an aspect derives a missing axis.
Inference includes the numeric x/y of each child, intermediate edge points, and graphable marks.
Inferred padding is a fraction of the data span, so it does not reserve a measured
margin for every label. Use explicit limits or surrounding **Box** padding when
you need a particular margin. Use explicit limits for nodes inside nested layouts.

Nodes can be inside **Box**, **Rotate**, stacks, or other ordinary layout
elements. Network finds their completed connection boundaries through the
placement tree, including all offsets and transforms. See
[Connections through layout](../gallery/networks.md#network_connections).
An identified container stays transparent, so edges can reach both a group and
the identified elements inside it. Each nested Network has its own ID scope: its
own `id` makes it a single node of the outer network, while its members stay
private. Duplicate IDs within one scope and unknown edge endpoints are errors.

Ordinary children work as they do in Graph. Clipping hides paint while retaining
overflow and the nodes' connection geometry. Network connects the positions you
provide; it does not automatically arrange nodes or avoid intervening obstacles.

<a id="Network-example"></a>

### Example

```jsx
// A small workflow with content-sized nodes and a wrapped label.
<Box min-width={em(17)} font-size={px(18)} padding={em(1)}>
  <Network aspect={1.8} xlim={[-0.6, 3.4]} ylim={[-0.45, 1.55]} stroke={blue} stroke-width={px(2)}>
    <Edge start="source" end="parse" />
    <Edge start="parse" end="output" />
    <Edge start="parse" end="errors" />
    <Edge start="errors" end="source" start-side="left" end-side="bottom" />
    <Node id="source" x={0} y={1} border-color={blue} background={white}>
      Source
    </Node>
    <Node id="parse" x={1.4} y={1} width={em(7)} border-color={blue} background={white}>
      Build syntax tree
    </Node>
    <Node id="output" x={2.8} y={1} border-color={blue} background={white}>
      Output
    </Node>
    <Node id="errors" x={1.4} y={0} border-color={red} color={red} background={white}>
      Report errors
    </Node>
  </Network>
</Box>
```

---

<a id="Node"></a>

## Node

| Property | Default | Meaning |
|---|---|---|
| `id` | — | Nonempty identifier used by edges, as on any other element |
| `x` / `y` | `0` / `0` | Position in the parent coordinate system |
| `anchor` | `"center"` | Point of the allocated node placed at x/y |
| `width` | Content-sized | Measure the label; a length sets a wrapping width |
| `children` | — | Text, inline content, or one existing layout element |
| `padding` | `em(0.6)` | Space between the label and inside border |
| `border-width` | `px(1)` | Border thickness inside the frame |
| `border-radius` | `em(0.3)` | Corner radius, including **Box** side/corner forms |
| `align` | `"center"` | Align the label within the frame |
| `text-justify` | `"start"` | start, center, end, or a fraction from 0 to 1 for lines inside a generated label |
| `background` | `none` | Frame background paint |
| `clip` | `false` | Clip content inside the frame's border |

A compact [TextFrame](text.md#TextFrame) with a centered placement anchor: the
conventional labeled node. Any element with an `id` can be a node, so **Node** adds
convenient defaults rather than a special capability. Other frame and style
options follow [Box](layout.md#Box). Text retains its
font size and reflows when given an explicit width. Existing element children,
including math and text stacks, keep their ordinary layout behavior.
`text-*` props configure the generated [Text](text.md#Text) label through prefix
piping: `text-justify` sets `justify`, and `text-font-size` sets `font-size`.

The `id` is optional for a standalone node, and required to reference it from an
[Edge](networks.md#Edge). IDs must be unique within the enclosing [Network](networks.md#Network).
In Network, x/y are graph data coordinates; in **Group** they are layout lengths.
When wrapping a Node in **Rotate** or another container, put x/y/anchor
on the wrapper to position the whole result.

Connections meet the outer frame, including padding and the inside border.
Label ink and the inner `content` rectangle do not determine attachment points.
Rounded corners use the same radii for drawing and attachment. A frame with
`border-radius={[0.5, 0.5]}` has an elliptical outline.

<a id="Node-example"></a>

### Example

```jsx
// Compact, wrapping, and elliptical nodes retain the same text size.
<HStack wrap gap={em(1)} align="center" font-size={px(18)}>
  <Node border-color={blue}>
    Ready
  </Node>
  <Node width={em(9)} border-color={blue}>
    A longer label wraps inside its frame
  </Node>
  <Node width={em(6)} height={em(4)} border-radius={[0.5, 0.5]} border-color={red}>
    Done
  </Node>
</HStack>
```
