# Layout elements

<a id="Anchor"></a>

## Anchor

A zero-size point or line frame around a naturally measured child. With no
dimensions it measures 0×0; width/height or exact requests can establish a
line or rectangle. align defaults to center and accepts a single alignment
value, an `{x,y}` object, or an `[x,y]` tuple. Ink and overflow retain the
visible child.

| Property | Default | Meaning |
|---|---|---|
| `align` | `"center"` | Position the child within the **Anchor** frame on both axes |

Use parent-owned x/y/anchor props to position the **Anchor** itself in **Group** or
**Graph**. `anchor` selects the wrapper's own attachment point; `align` positions
its child within the wrapper's frame. Positioning and child sizes remain separate.

<a id="Anchor-example"></a>

### Example

```jsx
// A zero-sized anchor positions text.
<Box width="fill" aspect={1.65} padding={em(2)}>
  <Group>
    <Anchor x={0.5} y={0.5} align={["center", "start"]}>
      <TextBox font-size={em(1.1)} border-width={px(1)}>
        Hanging on a point
      </TextBox>
    </Anchor>
    <Anchor x={0.5} y={0.5}>
      <Dot />
    </Anchor>
  </Group>
</Box>
```

---

<a id="Attach"></a>

## Attach

Attach an **Element** outside one content child. Supply attachment and children;
side defaults to bottom. offset is a layout length (0); at selects a fractional
location on the content edge (0.5), and `child-anchor` selects the attachment's
own point along that edge (0.5).

| Property | Default | Meaning |
|---|---|---|
| `attachment` | — | **Element** placed outside the content frame |
| `side` | `"bottom"` | Content edge used for the attachment |
| `offset` | `0` | Distance between the content and attachment |
| `at` | `0.5` | Fractional position along the content edge |
| `child-anchor` | `0.5` | Attachment point aligned with `at` |

Both `at` and `child-anchor` are scalar numbers: 0 selects the start of the
edge, 0.5 its center, and 1 its end. For top/bottom attachments they act
horizontally; for left/right attachments they act vertically. For example,
`side="bottom" at={1} child-anchor={1}` aligns the caption's right edge
with the content's right edge.

The wrapper's own `anchor` still controls its placement in **Group**/**Graph**/**Overlay**,
independently of `child-anchor`. Use `child-anchor` in JSX and
`child_anchor` in host property objects.
This replaces the earlier `Attach.align` prop.

The main child determines the frame. The attachment reports ink/overflow
without reserving space. Use outer **Box** padding when needed; **Plot** measures and
reserves its own labels automatically.

<a id="Attach-example"></a>

### Example

```jsx
// The wrapper's anchor and its caption's attachment anchor are independent.
<Box width="fill" aspect={1.65} padding={em(2)}>
  <Group>
    <Attach
      width={0.7}
      x={0.5} y={0.5} anchor={[0.5, 0.5]}
      side="bottom" at={1} child-anchor={1}
      offset={em(0.625)}
      attachment={<Text>Attached caption</Text>}
    >
      <Rect width="fill" aspect={2.2} fill={blue} stroke={none} />
    </Attach>
  </Group>
</Box>
```

---

<a id="Box"></a>

## Box

Add padding, a background, an inside border, optional rounded clipping, and
alignment around one content element. To contain siblings, wrap them in a
stack or **Group** first. Plain strings must be inside **Text**.

**Box** hugs its content plus padding and border unless an explicit size or parent
allocation fixes the frame. Width and height describe the **outer** frame.
The inner content area subtracts padding and the border on each side.

| Property | Default | Meaning |
|---|---|---|
| `aspect` | — | Preferred outer-frame width/height ratio |
| `padding` | `0` | Length, side/axis object, or `[h, v]` / `[t, b, l, r]` |
| `border-width` | `px(0)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | This **Box**'s background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or side/corner object |
| `align` | `"start"` | Content alignment on both axes, or { x, y } / [x, y] |
| `clip` | `false` | Clip content inside the rounded border |

An explicit `aspect` derives an omitted dimension from an established width or
height, including `width="fill"`. For example, `<Box width={px(200)} aspect={1}>`
has a 200×200 outer frame; padding and border are subtracted inside it. The derived
dimension is available to child percentage sizing and alignment before layout.
Two fixed dimensions and min/max limits take precedence over the ratio.
With neither axis established, the box hugs its content and adds space to reach
the requested ratio, without scaling the content or filling advisory offers.

Padding accepts full side names (`top`, `bottom`, `left`, `right`), short names
(`t`, `b`, `l`, `r`), or horizontal/vertical defaults (`h`, `v`). These forms are
equivalent:

```jsx
<Box padding={{ h: em(1), v: em(0.5) }} />
<Box padding={[em(1), em(0.5)]} />
<Box padding={{ t: em(0.5), b: em(0.5), l: em(1), r: em(1) }} />
<Box padding={[em(0.5), em(0.5), em(1), em(1)]} />
```

Array order is `[h, v]` or `[t, b, l, r]`, not CSS order; other array lengths are rejected.
Object forms may be mixed: full side names override short names, which override
`h`/`v`. For example, `padding={{ h: em(1), l: 0 }}` leaves only right padding.
Unspecified sides are zero. Each value accepts px/em lengths or raw fractions.
Boolean padding and a margin prop are not supported. Use another outer **Box** when
you need outside spacing.

Border radius accepts a single length, an elliptical `{ x, y }` / `[x, y]` pair, or
Tailwind-style sides and corners: `t`, `b`, `l`, `r`, `tl`, `tr`, `bl`, `br`.
Each entry can itself be a length or pair. Unspecified corners are square.
Explicit corners override sides; `t`/`b` override `l`/`r` at shared corners,
regardless of object order. Zero explicitly removes rounding at that corner.

```jsx
<Box border-radius={{ t: px(12) }} />
<Box border-radius={{ t: [px(16), px(8)], tr: 0, br: px(4) }} />
```

Scalar fractions use the final box's shorter side; pairs use its width and
height independently. px/em lengths work in every form. Each radius is capped
at half its corresponding dimension. Background, inside border, and content
clipping all follow these corners; the inner clip subtracts the border width.

Alignment accepts "start", "center", "end", "fill", "stretch", or a fraction from 0 to 1.
In an object or two-entry tuple, x and y can be set independently:
`align={['stretch', 'end']}` stretches horizontally and aligns at the bottom.
Stretch sends exact child
requests only on axes established before child measurement. It does not
uniformly scale content.

Fill uses the established content area too, but allocates only unspecified or
`width="fill"` dimensions, respecting the child's explicit sizes
and min/max limits. `align={{ x: "fill" }}` fills automatic child widths while
retaining natural heights. Remaining space stays at the end of a fill-aligned axis.
The child's `align-self` overrides the box's alignment: a scalar or tuple replaces
both axes, while an object such as `align-self={{ x: "start" }}` overrides only
that axis. This is separate from the child's own `align`. The box itself is
content-sized unless a width, height, or parent allocation establishes its size;
see [Sizing](../guides/sizing.md).

Background and border paint are local decoration. `fill` and `stroke` still inherit
to child shapes; they do not paint the **Box** itself. The border is drawn last.
Clipping hides paint but does not erase reported overflow.

Percentage padding uses the established parent's axes, not a guessed final box.
Prefer px/em padding for naturally sized boxes. See [Units](../guides/units.md).

**Box** does not relay child grow/shrink props through to a stack parent. Put flex
props on the **Box** itself when it is the item being allocated.
**Box** also does not infer an aspect from its content.

<a id="Box-example"></a>

### Example

```jsx
// A padded content box with independent background and inside border paint.
<Box
  width="fill"
  padding={{ left: em(1.5), right: em(1.5), top: em(1), bottom: em(1) }}
  background={lightgray}
  border-width={px(2)}
  border-color={blue}
  border-radius={em(0.75)}
>
  <VStack gap={em(0.5)}>
    <Text font-size={em(1.375)} font-weight={bold} color={blue}>A content box</Text>
    <Text>The width includes its padding and border. This paragraph wraps inside the remaining content area.</Text>
  </VStack>
</Box>
```

---

<a id="Frame"></a>

## Frame

**Frame** is [Box](layout.md#Box) with a default `border-width={px(1)}`. It has the same
single-content rule, sizing, padding, background, border radius, alignment, and clipping.

| Property | Default | Meaning |
|---|---|---|
| `aspect` | — | Preferred outer-frame width/height ratio |
| `padding` | `0` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(1)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | This **Frame**'s background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `"start"` | Content alignment on both axes, or `{ x, y }` / `[x, y]` |
| `clip` | `false` | Clip content inside the rounded border |

The default border color comes from inherited color. Supplying `border-width`
overrides the default; setting it to zero removes the border.
There is no default padding or default background.

Use `width={px(240)} aspect={1}` for a 240×240 square frame. The ratio includes
the border and padding; it does not stretch the content. Height can also derive
width. Two fixed dimensions and min/max limits override the preferred ratio.

Use `border-radius={{ t: em(0.4) }}` to round only the top corners. The keys are
`t`, `b`, `l`, `r`, `tl`, `tr`, `bl`, and `br` (bottom-right). Corner values
override side values, and each value accepts a scalar or elliptical pair:

```jsx
<Frame border-radius={{ t: [em(0.75), em(0.4)], tr: 0 }} background={white}>
  <Text>Rounded top-left corner</Text>
</Frame>
```

Unspecified corners stay square. See [Box](layout.md#Box) for units, precedence,
clamping, and clipping behavior. Single numbers and pairs retain their meaning.

**Frame**'s border occupies space inside its outer dimensions. A naturally sized
frame adds two border widths to each content dimension, plus any padding.
The example uses em padding so the space around the label follows its font size.

In a stack, put basis/grow/shrink on the **Frame** if the frame is the allocated item.
Neither a border nor an unsized shape inside it makes a **Frame** automatically flexible.

<a id="Frame-example"></a>

### Example

```jsx
// A naturally sized label with rounded top corners and the default one-pixel border.
<Box font-size={px(20)} padding={em(0.8)} background={lightgray}>
  <Frame
    padding={em(0.75)}
    border-radius={{ t: em(0.4) }}
    color={blue}
    background={white}
  >
    <Text>Ready to <Span font-weight={bold}>render</Span></Text>
  </Frame>
</Box>
```

---

<a id="Grid"></a>

## Grid

Arrange children row by row with column widths shared across every row.
Rows hug their tallest cell after text has wrapped at the chosen column widths.

| Property | Default | Meaning |
|---|---|---|
| `columns` | `1` | Positive column count for equal widths, or an array of lengths and `"auto"` tracks |
| `gap` | `0` | Space between both columns and rows |
| `column-gap` | `gap` | Override horizontal spacing |
| `row-gap` | `gap` | Override vertical spacing |
| `align` | `{ x: "fill", y: "start" }` | Cell alignment on both axes: start, center, end, fill, stretch, or a fraction from zero to one |

| Direct child prop | Default | Meaning |
|---|---|---|
| `align-self` | Grid's `align` | Override cell alignment; an object can override just one axis |

Use `columns={3}` for three equal columns. A finite width offer is divided equally
after gaps. Without one, all columns use the widest cell's natural width, enlarged
if needed by the Grid's `min-width`. The last row keeps the same columns even when
it is incomplete. An empty Grid hugs zero unless its own sizing reserves space.

An array sets the number and widths of the columns:

```jsx
<Grid columns={[em(6), "auto", em(12)]} gap={em(0.75)}>
  <Text>Label</Text>
  <Text>Value</Text>
  <Text>A description that wraps inside the last column.</Text>
</Grid>
```

Each `"auto"` column uses the widest natural cell in that column. Explicit lengths
and auto tracks do not grow or shrink to fill the Grid. Unsized grids with these
tracks hug their combined width, even under a larger offer. Use a length column
when text should wrap at a particular width. Numeric tracks are ordinary fractional
lengths, not weights: `columns={[0.25, 0.75]}` divides the width remaining after
column gaps. Nonzero fractions need a finite Grid width or width offer.

<a id="Grid-cell-sizing-and-alignment"></a>

### Cell sizing and alignment

The default fills automatic child widths, respecting explicit widths and min/max
limits. Children sit at the top of their row. Use `align="center"` for compact,
centered children, `align="fill"` to fill automatic sizes on both axes, or
`align="stretch"` to impose the cell allocation even on explicitly sized children.
These use the same alignment rules as [Box](layout.md#Box). A child's own
`height="fill"` fills the selected row height while respecting its limits.

Rows always hug their content. Giving the Grid extra height leaves space below
the rows; it does not stretch or redistribute the rows themselves. Vertical
fill/stretch preserves each child's measured width. Oversized children keep their
overflow; use a clipping Box around the Grid when needed.

Child percentage widths refer to their column width. Percentage heights and
vertical percentage padding cannot determine a content-sized row; use `em` or `px`
there, and use fill/stretch for equal cell heights. A cell that determines a natural
column cannot also use that unknown column width as a percentage reference.
These dependencies report the offending property rather than iterating.

Fractional column gaps refer to the Grid's selected width before subtracting gaps.
Fractional row gaps require an established Grid height. Prefer `em` or `px` gaps
for content-sized layouts. Selected tracks are not recomputed if Grid's own
`aspect` or sizing limits subsequently change its frame.

Children are flattened in ordinary JSX order; null, booleans, and blank JSX
whitespace are skipped. Use `<Box />` for an intentional empty cell. Nested arrays
do not mark row boundaries. Column counts are limited to 100000.

Grid has no spans, automatic column counts, flex track weights, baseline groups,
or inferred overall aspect. Child `grow`, `shrink`, and `basis` are stack metadata
and do not size Grid tracks. [TextGrid](text.md#TextGrid) adds string/number conversion
and text spacing. Use [HStack wrap](layout.md#HStack) when the number of items per row
should change with the available width.

<a id="Grid-example"></a>

### Example

```jsx
// Five cards share three columns, with content-sized rows and an incomplete final row.
const cards = [
  ["Flow", "Follow a path through the diagram.", blue],
  ["Orbit", "Arrange the parts around a common center.", purple],
  ["Signal", "Compare the changes over time.", green],
  ["Field", "Show how direction varies across a region.", red],
  ["Form", "Build a figure from simple shapes.", slate],
]
return (
  <Grid
    columns={3}
    width={em(28)}
    font-size={px(18)}
    gap={em(0.8)}
    align="fill"
    fit
  >
    {cards.map(([title, description, color]) => (
      <Frame
        padding={em(0.7)}
        border-color={color}
        border-radius={em(0.35)}
      >
        <TextCol gap={em(0.5)}>
          <Rect aspect={4} fill={color} stroke={none} />
          <Text font-weight={bold} color={color}>{title}</Text>
          <Text font-size={em(0.85)}>{description}</Text>
        </TextCol>
      </Frame>
    ))}
  </Grid>
)
```

---

<a id="Group"></a>

## Group

A finite canvas for independently positioned children. **Group** establishes its
size before measuring content; it does not hug the bounds of positioned children.
It fills finite offers, accepts its own dimensions, and can derive one missing
dimension from aspect.

Both axes need finite sizing information. One dimension plus an aspect is enough;
aspect alone is not. For example, a **Group** in a naturally measured stack often
needs its own width/height or a dimension plus aspect.

The coordinate origin is top left, with positive x right and positive y down.
Children paint in source order, so put backgrounds and connectors before labels.

| Property | Default | Meaning |
|---|---|---|
| `clip` | `false` | Clip child paint to the **Group** rectangle |

| Direct child prop | Default | Meaning |
|---|---|---|
| `x` / `y` | `0` | **Anchor** location; fractions use the whole **Group** |
| `anchor` | `"start"` | Point on the child's allocated rectangle placed at x/y |
| `width` / `height` | — | Child's preferred size; fractions use the whole **Group** |

**Anchor** accepts start, center, end, a fraction from 0 to 1, or independent x/y
choices in an object or two-entry tuple. `anchor={[1, 0.5]}` and
`anchor={['end', 'center']}` both place
the right-edge midpoint at x/y. A missing object axis defaults to start.
**Anchor** values are dimensionless; px/em and stretch are not anchor values.

**Anchor** describes the element's attachment point for its parent. Its own
`align` or `justify` describes how it arranges its children. For example, a
**Box** can use `anchor={[0.5, 0.5]}` to center itself at x/y and `align="end"`
to place its content at the **Box**'s bottom-right corner.

Every child receives an offer for the whole canvas, not only the space to the
right/below its position. Give positioned shapes a width or height when they
should be smaller than the canvas. A shape's internal points still refer to that
shape's own rectangle; **Group** does not provide arbitrary data-coordinate ranges.

**Text** without its own dimensions sizes to its content, wrapping at the canvas
width if needed. Give it a width for a narrower label or region. Position lengths
in em use the child's font size.
Nested **Group**s establish new local canvases.

Set `clip` on **Group** to hide content outside its rectangle. Clipping defaults to
false and does not erase reported overflow. **Svg** still clips at the outer viewport.

**Group** uses local fractional x/y/anchor positions; **Graph** uses data positions and
**Overlay** places decorations relative to a measured base. **Box** and stacks use their
own placement rules. Use [Graph](plotting.md#Graph) for data limits and [Rotate](layout.md#Rotate)
or [TransformBox](layout.md#TransformBox) for explicit transforms. **Group** does not infer
data limits or perform node/edge lookup.

<a id="Group-example"></a>

### Example

```jsx
// Place two nodes and labels in a canvas sized by its host; the connector paints behind them.
<Group aspect={1.75}>
  <Rect fill={lightgray} stroke={none} />
  <Line
    from={[0.3, 0.45]}
    to={[0.7, 0.45]}
    stroke={darkgray}
    stroke-width={px(3)}
  />
  <Circle
    x={0.2}
    y={0.45}
    anchor="center"
    width={px(64)}
    fill={blue}
    stroke={none}
  />
  <Square
    x={0.8}
    y={0.45}
    anchor="center"
    width={px(64)}
    fill={red}
    stroke={none}
  />
  <Text x={0.2} y={0.72} anchor={[0.5, 0.5]}>Source</Text>
  <Text x={0.8} y={0.72} anchor={['center', 'center']}>Result</Text>
</Group>
```

---

<a id="HStack"></a>

## HStack

Arrange elements left to right. Width is the main axis and height is the cross
axis. See [Stack](../guides/stack.md) for all props and allocation rules.

| Property | Default | Meaning |
|---|---|---|
| `aspect` | — | Preferred width/height ratio of the whole stack |
| `gap` | `0` | Space between adjacent children |
| `wrap` | `false` | Start a new row when the next child's flex basis would exceed the offered width |
| `line-gap` | `gap` | Vertical space between wrapped rows |
| `align` | `"start"` | Cross-axis (vertical) alignment, including `"baseline"` |
| `justify` | `"start"` | Main-axis (horizontal) packing and distributed spacing |

| Direct child prop | Default | Meaning |
|---|---|---|
| `align-self` | `Stack's align` | Override this child's vertical alignment |

An **HStack** without explicit flex uses each child's preferred or measured natural
width. An available height can determine aspect figures' widths locally.
A width budget alone does not infer a common height for a group of figures.
An explicit `aspect` on the stack can establish that height: `width={px(240)}
aspect={2}` allocates a 240×120 row before flex and child alignment. This sets
the stack's box, not its children's proportions; see [Sizing](../guides/sizing.md).

To make an unsized paragraph take remaining width, give it `grow={1}`. Under a
finite row budget, its omitted basis starts from zero. To share leftover width
between wrapped columns, put grow on the columns themselves.

Use `basis="auto" grow={1} shrink={1}` to start from the explicit or measured
width, adding surplus or shrinking when necessary. Explicit length bases take
precedence over width; alignment does not select a basis.

<a id="HStack-alignment"></a>

### Alignment

- align controls vertical positioning: start, center, end, fill, stretch, or 0–1.
- `align-self` on a direct child overrides that default using the same values.
- `align="baseline"` aligns the first text baselines; a child without a baseline
  uses its bottom edge. Only children whose effective alignment is baseline
  participate; the row includes their ascent and descent extents.
- justify controls horizontal positioning or distributed spacing.

Stretch allocates the row's selected height only to stretching children; it can override
preferred cross-axis sizes. It does not scale glyphs. **Text**.`justify` only affects
the placement of lines within that **Text**'s own width.
Child containers' own align values continue to position their contents.
Fill follows the same measurement order but respects explicit child heights and
min/max height limits. It allocates height only to automatically sized children.

If child widths and gaps exceed the budget, nothing shrinks unless shrink was
enabled. Fixed-width text may overflow internally even when its frame is small.
Wrap the row in a clipping **Box** if clipping is intended.

<a id="HStack-wrapping-rows"></a>

### Wrapping rows

`wrap` uses the offered width to choose line breaks, then hugs the widest row
and the combined row heights. It does not reserve unused space to the right.
Explicit width/fill sizing and growing children can still occupy the full offer.
Each row distributes its own growth and shrinkage; justification uses the final
shared width of the wrapped stack.
Without a finite width offer it remains a single natural row.
Give flexible cards a `basis` or `min-width` to set when they wrap; unsized growing
children otherwise start at zero. A single oversized child still needs `shrink`
to reduce its allocation.

```jsx
<HStack wrap gap={em(1)}>
  <TextFrame basis={em(16)} grow={1} shrink={1}>
    First card
  </TextFrame>
  <TextFrame basis={em(16)} grow={1} shrink={1}>
    Second card
  </TextFrame>
</HStack>
```

<a id="HStack-example"></a>

### Example

```jsx
// Align a fixed label and icon independently while a paragraph receives the remaining width.
<TextFrame width="fill" padding={em(1.25)} background={lightgray} border-color={gray}>
  <HStack gap={em(0.75)} align="center">
    <Text width={px(64)} font-weight={bold} align-self="start">Note</Text>
    <Text grow={1}>
      This paragraph receives the remaining width and wraps without changing its font size.
    </Text>
    <Square width={px(40)} fill={blue} stroke={none} align-self="end" />
  </HStack>
</TextFrame>
```

---

<a id="Overlay"></a>

## Overlay

The first child determines natural size. Other children are decorations:
they receive that established canvas and use **Group**-style x/y/anchor placement.
They contribute ink and overflow without enlarging the allocation. Source order
is paint order; clip hides outside ink. Unlike **Group**, **Overlay** can hug its base.

| Property | Default | Meaning |
|---|---|---|
| `clip` | `false` | Clip every layer to the base child's frame |

<a id="Overlay-example"></a>

### Example

```jsx
// The first child sizes the overlay.
<Box padding={em(2)}>
  <Overlay>
    <Rect width="fill" aspect={28 / 13} fill={blue} stroke={none} />
    <Text x={0.5} y={0.5} anchor={[0.5, 0.5]} font-weight={bold}>Measured overlay</Text>
  </Overlay>
</Box>
```

---

<a id="Rotate"></a>

## Rotate

Rotate a completed child by angle degrees (positive clockwise). origin defaults
to center and accepts an alignment value or `{x,y}` / `[x,y]` pair. The child is measured
naturally; give finite canvases their own dimensions.

| Property | Default | Meaning |
|---|---|---|
| `angle` | `0` | Clockwise rotation in degrees |
| `origin` | `"center"` | Point in the child used as the rotation origin |
| `resize` | `true` | Resize and translate the wrapper to the rotated bounds |

resize defaults to true: the rotated allocation sets natural size and shifts
into positive coordinates. `resize=false` retains the original frame and reports
overflow. Exact outer allocations still win and keep the transformed bounds
centered in that frame. Rotation transforms geometry,
strokes, and text; it does not reflow content. Horizontal guides survive zero
and half turns. Other rotations tilt the baseline, which has no single vertical
coordinate; the wrapper omits it while the original child's guides remain intact.

<a id="Rotate-example"></a>

### Example

```jsx
// Rotation includes transformed bounds.
<Box padding={em(2)}>
  <Rotate angle={-25}>
    <Text font-size={em(2)} font-weight={bold}>Rotated text</Text>
  </Rotate>
</Box>
```

---

<a id="Spacer"></a>

## Spacer

An empty stack child with explicit defaults `basis={0} grow={1}`. It has no
drawing and no content children. Naturally it is zero-sized.

Inside an **HStack** it absorbs spare width; inside a **VStack** it absorbs spare height.
Multiple spacers divide surplus according to their grow weights, alongside other
flexible children.

For a fixed spacer use `<Spacer basis={px(20)} grow={0} />`. A width or height
alone does not replace its default basis: basis takes precedence in stack
allocation. Use gap on the stack when you want the same space between every pair.
Set `basis="auto"` to use an explicit width or height as the spacer's starting size.

**Spacer** does not make a naturally sized parent acquire extra space. Supply a
finite budget or frame size when there should be space to absorb.
In the example, **TextFrame** fills the SVG's available width and allocates its
content width to the row, leaving space for **Spacer** between the two labels.
It is an ordinary element with ordinary flex props, not a special allocator case.

<a id="Spacer-example"></a>

### Example

```jsx
// A flexible spacer separates two natural labels in a definite-width row.
<TextFrame padding={em(1)} background={lightgray} border-color={gray}>
  <HStack align="center">
    <Text font-weight={bold}>Left</Text>
    <Spacer />
    <Text color={blue}>Right</Text>
  </HStack>
</TextFrame>
```

---

<a id="Svg"></a>

## Svg

The document viewport. **Svg** accepts zero or one content element, along with the
common [sizing](../guides/sizing.md) and inherited [style](../guides/style.md) props. Put multiple
elements inside a stack or **Group**.

An explicit width or height establishes that viewport axis. Unspecified axes
hug the child's measured size. There is no implicit 500px or 1000px canvas:
a completely natural **Square** produces a small natural viewport.

Some elements reserve an outset outside their own box, such as a
[Plot](plotting.md#Plot) with `bounds="frame"`. A hugging axis grows to include it; an
established axis keeps its size and clips it like any other overflow.

**Svg** gives its content advisory offers on its established axes, rather than
forcing every child to occupy the whole viewport. Consequently, a tall **Svg**
does not make a **VStack**'s children grow. Use explicit [stack sizing](../guides/stack.md).

The viewport establishes percentage references for its direct content. Its
fragment has a rectangular clip, and serialized SVG hides viewport overflow.
Overflow is still retained in the fragment for inspection.

| Property | Default | Meaning |
|---|---|---|
| `children` | — | One content element, optionally absent |
| `theme` | Inherited, initially `"light"` | Palette inherited by all content |
| `background` | `none` | Explicit viewport paint; independent of the theme |
| `width` / `height` | Natural | Preferred viewport dimensions in pixels: `px(800)` or `"800px"` |
| `aspect` | — | Preferred viewport width/height ratio |
| `min-width` / `min-height` | — | Minimum viewport dimensions |
| `max-width` / `max-height` | — | Maximum viewport dimensions; uniformly shrink overflowing content on hugging axes |
| Typography and paint | Inherited | Style inherited by content |

On an unspecified axis, a maximum first provides a layout offer. Text reflows at
the offered width; if the resulting figure exceeds either maximum, **Svg** scales
the complete figure down uniformly. Width and height shrink together, including
fonts, strokes, and reserved outsets. Smaller figures keep their natural sizes.
Max props on ordinary elements retain their allocation-only meaning.

An explicit width or height, including an exact parent request, keeps that axis's
allocation and clipping behavior. Advisory `available(...)` requests without max
props do not scale anything. A width-only document therefore reflows and grows
naturally in height.

An explicit `aspect` uses the common sizing rules. `width={px(320)} aspect={2}`
creates a 320×160 viewport before laying out its content. With neither dimension
established, the viewport grows its measured size to the ratio without scaling
the drawing. Two fixed dimensions and min/max limits take precedence.

Set `theme="dark"` for foregrounds suited to a dark surface. Descendants use the
palette for text, strokes, grids, plot borders, and legend badges and borders.
Explicit paint props override the defaults. See [Themes](../guides/themes.md).

Title remains a [render_svg option](../guides/rendering.md). Its background
option paints behind the entire fragment. Themes do not paint backgrounds;
**Svg**'s `background` prop can supply an explicit viewport background in source.
The CLI wraps a bare non-**Svg** root automatically; `evaluate` does not.

<a id="Svg-example"></a>

### Example

```jsx
// A definite viewport contains a centered, naturally sized frame.
<Svg width={px(320)} height={px(180)} font-size={px(16)}>
  <Box width={1} height={1} background={lightgray} align="center">
    <Frame padding={em(1)} border-color={blue}>
      <Text font-size={em(1.25)}>320 by 180</Text>
    </Frame>
  </Box>
</Svg>
```

---

<a id="TransformBox"></a>

## TransformBox

Transform a naturally measured child using an affine matrix [a,b,c,d,e,f]:
x′=ax+cy+e, y′=bx+dy+f. Default is identity. A canvas child needs its own finite
dimensions.

| Property | Default | Meaning |
|---|---|---|
| `matrix` | `[1, 0, 0, 1, 0, 0]` | Affine transform `[a,b,c,d,e,f]` |
| `resize` | `true` | Resize and translate the wrapper to the transformed bounds |

resize defaults to true: transformed bounds set natural size, translated to
the local origin. `resize=false` keeps the original frame and reports overflow.
Exact allocations override wrapper size and center the transformed bounds in
that frame. The finished geometry, including
fonts and strokes, is transformed. [Rotate](layout.md#Rotate) provides angles and
[fitting](../guides/sizing.md#fitting) fits content into an offer.

Named vertical guides, including baseline and math axis, transform when `b` is
zero and a horizontal line stays horizontal. A transform that tilts those lines
omits the wrapper's guides; the placed child's original guides remain available.

<a id="TransformBox-example"></a>

### Example

```jsx
// An explicit affine transform.
<Box padding={em(2)}>
  <TransformBox fit matrix={[1, 0.2, 0.3, 1, 0, 0]}>
    <Rect width={px(240)} height={px(110)} fill={white} stroke={blue} />
  </TransformBox>
</Box>
```

---

<a id="VStack"></a>

## VStack

Arrange elements top to bottom. Height is the main axis and width is the cross
axis. See [Stack](../guides/stack.md) for all props and allocation rules.

| Property | Default | Meaning |
|---|---|---|
| `aspect` | — | Preferred width/height ratio of the whole stack |
| `gap` | `0` | Space between adjacent children |
| `align` | `"start"` | Cross-axis (horizontal) alignment |
| `justify` | `"start"` | Main-axis (vertical) packing and distributed spacing |

| Direct child prop | Default | Meaning |
|---|---|---|
| `align-self` | `Stack's align` | Override this child's horizontal alignment |

A supplied width passes inward: paragraphs wrap at that width and unsized aspect
figures derive their heights from it. The stack then adds the resulting child
heights and gaps.

Height alone does not reverse that process. An unsized **Square** in a height-only
column retains its 16×16 natural size unless given an explicit allocation.
Two different aspect figures do not automatically infer one shared width.
An explicit `aspect` on the stack can derive its width from height, or vice versa:
`width={px(240)} aspect={1}` allocates a 240×240 column before flex and child
alignment. This sizes the column's box without scaling its children;
see [Sizing](../guides/sizing.md).

<a id="VStack-choose-the-sizing-information"></a>

### Choose the sizing information

The attached example fills the offered width. Both **Rect** figures receive that
width and their heights follow their aspects, 1 and 2. With no gap,
H = W/1 + W/2. For a desired total height of 500px, the host can offer a width
of 1000/3; the source needs no fixed pixel dimensions.

Alternatively, `grow={2}` and `grow={1}` on children without explicit heights
divide a 500px height budget into the needed 2:1 proportions. Those weights are a
decision by the author; they are not inferred from the aspects.

With a finite height budget, unsized growing children start from zero. An explicit
height supplies their basis instead, and `basis="auto"` measures natural heights
when none are specified. Without a height budget, grow retains natural measurement.

**Text** does not grow its font to occupy a height allocation. Exact height can
leave space around its normal-sized lines or report overflow if they do not fit.
Use `fit` on the stack only when scaling the whole result is the goal.

<a id="VStack-alignment"></a>

### Alignment

Align controls horizontal position; justify controls vertical packing. Defaults
are start. A direct child's `align-self` overrides the stack's align, accepting
start, center, end, fill, stretch, or 0–1. Omitted values use the parent's align.
Stretch imposes the selected shared width, which can trigger text reflow.
Fill allocates that width only to unspecified or fill-width children, respecting
explicit widths, child alignment overrides, and min/max limits.
Child containers' own align values continue to position their
contents. **VStack** does not accept baseline alignment, including via `align-self`.

[TextCol](text.md#TextCol) supplies document defaults: `width="fill"` and `align="fill"`.

<a id="VStack-example"></a>

### Example

```jsx
// The offered width determines the heights of two aspect figures.
<VStack>
  <Rect aspect={1} fill={blue} stroke={none} />
  <Rect aspect={2} fill={red} stroke={none} />
</VStack>
```
