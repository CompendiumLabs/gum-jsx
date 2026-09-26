# Layout gallery

<a id="box_clip"></a>

## Rounded box clipping
A 280px **Square** deliberately overflows a 220×100 **Box**. The **Box** centers the child
and clips its paint inside the rounded 6px border. The surrounding padding leaves
room to see the complete border.

Tree output retains the child's full allocation and overflow even though that
ink is hidden. See [Box](../elements/layout.md#Box) for sizing and clipping props,
or compare [Group clipping](layout.md#group_clip) on a positioned canvas.

<a id="box_clip-example"></a>

### Example

```jsx
// This child deliberately overflows. Clip keeps its ink inside the rounded
// border; the tree still records the child's full size and overflow.
<Box padding={em(0.75)}>
  <Box width={px(220)} height={px(100)} padding={em(0.75)}
    border-width={px(6)} border-color={blue} background={lightgray}
    border-radius={em(1.75)} align="center" clip>
    <Square width={px(280)} fill={red} stroke={green} stroke-width={px(2)} />
  </Box>
</Box>
```

---

<a id="flex_grow"></a>

## Flex grow

A bordered card holds a heading, a line of text, and a row of three shapes that
takes up whatever room is left.

The row sets `grow={1}` inside the **VStack**, so it receives the height remaining
after both text lines and their gaps. Its `align="stretch"` gives every child
that height. The **Circle** reserves an `em(6)` width and draws circular geometry
inside its allocation, so a tall preview does not make it consume the entire row
width. The two **RoundedRect** children use `grow={1}` to split the rest equally.

Try resizing the outer **Box** or changing one grow factor to 2. The emoji in the
heading needs no setup; see [Fonts](../guides/fonts.md).

See [Stack](../guides/stack.md) for the allocation rules and
[Layout choices](layout.md#layout_choices) for fixed, equal, and weighted rows.

<a id="flex_grow-example"></a>

### Example

```jsx
// The shape row grows into the height left under the text; the rounded
// rectangles then split the width the circle leaves.
<Box
  font-size={px(18)}
  padding={em(1.5)}
  border-width={px(2)}
  border-color={blue}
  border-radius={em(1)}
>
  <VStack gap={em(1)}>
    <Text font-size={em(1.6)} font-weight={bold}>Make something 😊</Text>
    <Text line-height={em(1.45)}>
      Edit this gum JSX and the SVG updates as you type.
    </Text>
    <HStack height={em(8)} gap={em(1)}>
      <RoundedRect grow={1} border-radius={em(1)} fill={blue} stroke={none} />
      <Circle fill={red} stroke={none} />
      <RoundedRect grow={1} border-radius={em(1)} fill={green} stroke={none} />
    </HStack>
  </VStack>
</Box>
```

---

<a id="group_anchors"></a>

## Anchors in nested canvases
Each nested **Group** has its own local reference rectangle. All three boxes use
the same fractional position, `(0.5, 0.5)`, marked by a dark dot. Their anchors
place the start, center, or end of the allocated box at that point.

The three panels stay side by side. Their measured sizes and gaps determine the
outer size; `fit` on the root preserves the comparison in smaller viewports.

The child box includes its inside border when determining its anchor. See
[Group](../elements/layout.md#Group) for positioning and reference rules and
[Point values](../guides/point_values.md) for coordinate and anchor forms.

<a id="group_anchors-example"></a>

### Example

```jsx
// Each nested Group has its own local 0–1 reference rectangle. The same position
// meets a different point of the Box: its top-left, center, or bottom-right.
<Box fit padding={em(1)}>
  <HStack gap={em(2)}>
    {['start', 'center', 'end'].map(anchor =>
      <VStack align="center" gap={em(1.5)}>
        <Text font-weight={bold}>{anchor}</Text>
        <Group width={em(10)} height={em(10)}>
          <Mesh2D xticks={10} yticks={10} />
          <HLine />
          <VLine />
          <Rect x={0.5} y={0.5} anchor={anchor} width={0.4} height={0.3}
            fill={blue} stroke={none} opacity={0.75} border-radius={em(0.3)} />
          <Circle x={0.5} y={0.5} anchor="center" width={em(0.5)}
            fill={black} stroke={white} />
        </Group>
        <Text font-size={em(0.9)}>x = 0.5, y = 0.5</Text>
      </VStack>
    )}
  </HStack>
</Box>
```

---

<a id="group_clip"></a>

## Clipped and unclipped canvases
Both canvases use an `em(11.25)` width and a `1.8` aspect ratio, and query the same
immutable artwork with fractional positions and dimensions. The left canvas retains
all paint; the right clips it to the canvas rectangle. Clipping changes visible
ink while the fragment tree still records the full positioned allocations and
overflow.

The root's `fit` prop hugs both panels and keeps them side by side at smaller sizes,
including the padding that protects the intentionally unclipped artwork.

Use tree output with `--stats` to inspect reuse of the shared child fragments.
See [Group](../elements/layout.md#Group) for canvas clipping,
[Box clipping](layout.md#box_clip) for rounded borders, and
[Reusing fragments](api.md#repeated) for explicit placement reuse.

<a id="group_clip-example"></a>

### Example

```jsx
// Both canvases query the same immutable artwork. The second clips painted ink;
// its fragment tree still records the full positioned allocations and overflow.
const artwork = [
  <Rect fill={lightgray} stroke={none} />,
  <Rect x={-0.1} y={0.3} width={0.45} height={0.45} fill={blue} stroke={none} />,
  <Circle x={0.9} y={0.5} anchor="center" width={0.5} fill={red} stroke={none} />,
]

return <Box fit color={slate} padding={em(2)}>
  <HStack gap={em(2.5)}>
    {[false, true].map(clip => <VStack gap={em(0.5)}>
      <Text font-weight={bold}>{`clip = ${clip}`}</Text>
      <Box border-width={px(2)} border-color={slate}>
        <Group width={em(10)} aspect={1.6} clip={clip}>
          {artwork}
        </Group>
      </Box>
    </VStack> )}
  </HStack>
</Box>
```

---

<a id="layout_choices"></a>

## Layout choices

Three identical-width rows show three explicit allocation policies. Each row
owns a definite width; its border makes unused space visible. Every rectangle
uses the row's known height, but only rows two and three opt into main-axis
growth.

**TextBox**, **TextCol**, and **TextFrame** pass the available width down through
the document. The row still sets its height and its children's flex policy explicitly.

| Row | Child props | Result |
| --- | --- | --- |
| Fixed bases | `width={px(60)}`, default `grow=0` | Two 60px rectangles, then unused space |
| Equal shares | `grow={1}` on both unsized children | Each gets half the space after the gap |
| Weighted shares | `grow={2}` and `grow={1}` on unsized children | A 2:1 division after the gap |

A grow factor distributes extra space after bases, bounds, and gaps have been
accounted for. Unsized growing children default to zero bases under the row's
finite budget, making these examples simple ratios of the available space.
Explicit dimensions or bases are preserved before surplus is added. Use
`basis="auto"` to start from content measurements; see [Growth bases](layout.md#stack_basis).

This is not automatic shape filling or composite aspect inference. The parent
supplies a budget and the direct children state their flex policy. For
aspect-sensitive vertical stacks, a known shared width is often clearer than
trying to derive it from a total height.

Try changing both grow factors in the last row to 1, or give one child a
`max-width` to see space redistribute after its limit is reached.

<a id="layout_choices-example"></a>

### Example

```jsx
// A known row width supports fixed bases, equal flexible shares, or weighted shares.
const Band = ({ title, children }) => (
  <TextCol gap={em(0.5)}>
    <Text font-weight={bold}>{title}</Text>
    <TextFrame
      height={px(82)}
      padding={em(0.75)}
      border-color={gray}
      background={white}
    >
      <HStack height={1} gap={em(0.75)}>
        {children}
      </HStack>
    </TextFrame>
  </TextCol>
)
return (
  <TextBox width="fill" padding={em(1.5)} background={lightgray} color={slate}>
    <TextCol gap={em(1.2)}>
      <Text font-size={em(0.9)} font-family={mono} color={blue}>ALLOCATION / 05</Text>
      <Text font-size={em(1.9)} font-weight={bold}>Allocation is a choice</Text>
      <Band title="Fixed bases: two 60px children">
        <Rect width={px(60)} fill={blue} stroke={none} />
        <Rect width={px(60)} fill={red} stroke={none} />
      </Band>
      <Band title="Zero bases, equal growth: 1 + 1">
        <Rect grow={1} fill={blue} stroke={none} />
        <Rect grow={1} fill={red} stroke={none} />
      </Band>
      <Band title="Zero bases, weighted growth: 2 + 1">
        <Rect grow={2} fill={blue} stroke={none} />
        <Rect grow={1} fill={red} stroke={none} />
      </Band>
      <Text font-size={em(0.9)} color={slate}>The row owns the width. Its direct children state how to use it.</Text>
    </TextCol>
  </TextBox>
)
```

---

<a id="positioned_diagram"></a>

## Positioned diagram

An **HStack** arranges three labeled **Frame** nodes and two connectors inside a
**Slide**. Nodes use `grow={1}` and connectors use `grow={0.65}`. The row itself
uses 90% of the slide's content width and is centered; none of its parts need a
pixel width.

The slide paints the background and passes its body allocation to **TextCol**.
The column's two **Spacer** children distribute spare vertical space around the
diagram. A base font size sets the scale for the title, node labels, padding,
connector height, and gaps. The outer aspect ratio determines the canvas shape;
`fit` shrinks the completed slide into a smaller host.

Each connector is a **Group** containing an **Arrow** and a **Text** label. The arrow
runs from `[0, 0.5]` to `[1, 0.5]` in that group's local rectangle, and the label is
anchored below it. Nodes stretch to the row's height and center their text inside
their frames.

Try changing the diagram's relative width or the node and connector grow weights. The row
allocates each part directly; the connectors do not query node bounds or route
automatically.

<a id="positioned_diagram-example"></a>

### Example

```jsx
// Flex weights allocate the pipeline; each connector uses its own relative coordinates.
const Node = ({ title, detail, color, ...attr }) => (
  <Frame
    align="center"
    align-self="stretch"
    border-width={px(1.5)}
    border-color={color}
    border-radius={em(0.75)}
    background={black}
    padding={[em(0.5), em(1.5)]}
    {...attr}
  >
    <VStack gap={em(0.5)} align="center">
      <Text font-size={em(1.4)} font-weight={bold} color={white}>{title}</Text>
      <Text font-size={em(0.9)} color={white}>{detail}</Text>
    </VStack>
  </Frame>
)

const ArrowBox = ({ text = "", color = white, ...attr }) => <Group {...attr}>
  <Arrow stroke={color} from={[0, 0.5]} to={[1, 0.5]} />
  <Text x={0.5} y={1} anchor="center" color={color}>{text}</Text>
</Group>

const Diagram = ({ ...attr }) => <HStack align="center" {...attr}>
  <Node title="Source" detail="JSX + data" color={blue} grow={1} />
  <ArrowBox text="measure" grow={0.65} height={em(2)} />
  <Node title="Layout" detail="pixel fragments" color={red} grow={1} />
  <ArrowBox text="serialize" grow={0.65} height={em(2)} />
  <Node title="Render" detail="SVG paths" color={green} grow={1} />
</HStack>

return <Slide fit font-size={px(12)} background={slate} padding={em(2)}>
  <Text font-family={mono} font-size={em(0.9)} color={blue}>POSITIONING / 03</Text>
  <Text font-size={em(2)} font-weight={bold} color={white}>A tiny processing pipeline</Text>
  <Spacer />
  <Diagram width={0.9} align-self="center" />
  <Spacer />
  <Text color={white}>Positions are explicit. Text remains text-sized. The renderer receives finished geometry.</Text>
</Slide>
```

---

<a id="stack_alignment"></a>

## Baselines, packing, and stretch
The first row aligns mixed-size text on a common baseline; the **Square** uses its
bottom edge because it has no baseline guide. The second distributes free space
between fixed-size items. In the last row, the blue bar stretches to the height
of the paragraph after its width is allocated and its words reflow.

**TextBox** and **TextCol** carry the available width through the surrounding
document. The final row explicitly uses `align="stretch"` to demonstrate its
separate vertical allocation policy.

Try a narrower SVG width to inspect the stretch behavior. Cross-axis alignment
and main-axis packing are independent; see [HStack](../elements/layout.md#HStack)
and [Stack](../guides/stack.md) for their props.

<a id="stack_alignment-example"></a>

### Example

```jsx
// Rows align their children's first baselines; children without guides use their
// bottom edge. The last row instead stretches every allocation to the text height.
<TextBox color={slate} padding={em(1.25)}>
  <TextCol gap={em(1.5)}>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)} color={slate}>BASELINES / independent font sizes</Text>
      <HStack wrap gap={em(0.9)} align="baseline">
        <Text font-size={em(1)}>Small</Text>
        <Text font-size={em(2)} font-weight={bold}>Large</Text>
        <Text font-size={em(1.4)} font-style="italic" color={blue}>Aligned</Text>
        <Square width={em(2)} fill={red} stroke={none} />
      </HStack>
    </TextCol>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)} color={slate}>PACKING / equal space between fixed items</Text>
      <HStack justify="space-between" align="center">
        <Circle width={em(2)} fill={blue} stroke={none} />
        <Text>Space between</Text>
        <Square width={em(2)} fill={red} stroke={none} />
      </HStack>
    </TextCol>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)} color={slate}>STRETCH / the reflowed text sets the height</Text>
      <HStack gap={em(0.9)} align="stretch">
        <Box width={em(0.5)} background={blue} border-radius={px(4)} />
        <Text grow={1} line-height={em(1.4)}>
          The blue bar stretches to the height of this paragraph after its width is allocated. Resize the SVG and both follow the words onto new lines.
        </Text>
      </HStack>
    </TextCol>
  </TextCol>
</TextBox>
```

---

<a id="stack_basis"></a>

## Growth bases

Both rows contain the same two labels with `grow={1}`. The first row divides
the space after the gap equally: unsized growing children default to a zero
basis when the row has a finite width budget.

The second row sets `basis="auto"`. Each panel starts at its measured content
width, including padding, and receives half the remaining space. The longer
label therefore keeps a wider allocation. An explicit width would supply its
auto basis instead of a content measurement.

An explicit `basis` takes precedence over the main-axis dimension. Otherwise,
an explicit width in a row or height in a column supplies the basis. With neither
specified, positive growth uses zero under an available or exact main-axis
request. Natural measurement, omitted or zero growth, and `basis="auto"`
retain content-based starting sizes. `width="fill"`
does not supply a fixed basis.

`basis="auto"` preserves a measured starting width; `grow` can still enlarge the
final allocation. An explicit `basis={0}` also applies without a finite budget,
where it can produce a zero allocation with overflowing content.

Try changing the second panel's grow factor to 2 or adding a max-width.
Growth weights distribute surplus around the chosen bases, subject to bounds.
See [Stack](../guides/stack.md) for the full allocation rules and
[Flex limits and shrinkage](layout.md#stack_flex) for capped growth and shrinking.

<a id="stack_basis-example"></a>

### Example

```jsx
// Unsized growth divides space equally; auto bases preserve different content widths first.
const Pair = ({ title, basis }) => (
  <TextCol gap={em(0.4)}>
    <Text font-size={em(0.8)}>{title}</Text>
    <HStack gap={em(0.75)}>
      <TextBox grow={1} shrink={1} basis={basis} align="center" background={blue} color={white}>
        Short
      </TextBox>
      <TextBox grow={1} shrink={1} basis={basis} align="center" background={red} color={white}>
        A longer label
      </TextBox>
    </HStack>
  </TextCol>
)
return <TextBox width="fill" color={slate} padding={em(1.25)}>
  <TextCol gap={em(1.2)}>
    <Text font-size={em(1.5)} font-weight={bold}>Choose the starting size</Text>
    <Pair title="grow={1}: equal shares from zero" />
    <Pair title={'basis="auto": content widths plus equal growth'} basis="auto" />
    <Text font-size={em(0.9)}>Both rows use the same labels, gap, and growth weights.</Text>
  </TextCol>
</TextBox>
```

---

<a id="stack_flex"></a>

## Flex limits and shrinkage
The first row divides free space with growth weights of 1:2:1. The next row caps
the middle item at 120px and redistributes the remaining space to its neighbors.
The third row shrinks two 300px bases to fit the available width and gap.
The final row uses **Spacer** to push a fixed-size item to the end.

The outer **TextBox** and nested **TextCol** components supply a shared width
without repeating width declarations. Each **HStack** still allocates its bars
using their grow, shrink, and limit props. The unsized growing bars start from
zero automatically; the shrinking bars explicitly supply their 300px bases.

These are allocations of ordinary **Box** children; their label fonts stay fixed.
See [Stack](../guides/stack.md) for basis, grow, shrink, and min/max rules, or
[Layout choices](layout.md#layout_choices) for a simpler comparison of growth weights.

<a id="stack_flex-example"></a>

### Example

```jsx
// Main-axis allocation and cross-axis alignment are separate. Each bar is a Box
// with ordinary child flex metadata; the stack only allocates its border box.
function Bar({ label, color, ...props }) {
  return <Box height={em(2.5)} align="center" background={color} border-radius={em(0.3)} {...props}>
    <Text color={white} font-size={em(0.9)} font-weight={bold}>{label}</Text>
  </Box>
}

return <TextBox width="fill" color={slate} padding={em(1.25)}>
  <TextCol gap={em(1.25)}>
    <Text font-size={em(1.5)} font-weight={bold}>Where the space goes</Text>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)}>Zero bases, growth weights 1 : 2 : 1</Text>
      <HStack gap={em(0.5)}>
        <Bar grow={1} color={blue} label="1" />
        <Bar grow={2} color={red} label="2" />
        <Bar grow={1} color={green} label="1" />
      </HStack>
    </TextCol>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)}>The middle bar stops at 120px; its neighbors share the rest</Text>
      <HStack gap={em(0.5)}>
        <Bar grow={1} color={blue} label="grow" />
        <Bar grow={2} max-width={px(120)} color={red} label="capped" />
        <Bar grow={1} color={green} label="grow" />
      </HStack>
    </TextCol>
    <TextCol gap={em(0.5)}>
      <Text font-size={em(0.8)}>300px bases shrink equally to fit, including the 8px gap</Text>
      <HStack gap={em(0.5)}>
        <Bar basis={px(300)} shrink={1} color={blue} label="shrink" />
        <Bar basis={px(300)} shrink={1} color={red} label="shrink" />
      </HStack>
    </TextCol>
    <HStack gap={em(0.5)} align="center">
      <Text shrink={1} font-size={em(0.8)}>A Spacer takes the remainder</Text>
      <Spacer />
      <Bar width={px(100)} color={blue} label="At the end" />
    </HStack>
  </TextCol>
</TextBox>
```

---

<a id="two_column"></a>

## Two Columns

A damped-oscillation plot sits beside a paragraph and a short list containing inline math.

The slide supplies a definite body width. Its figure column uses `grow={1.15}`
and the prose uses `grow={1}`, so the plot gets a little more of the space after
the gap. No column widths or flex bases are needed. The plot's aspect ratio
determines its height, and its caption wraps at the column width.

One base font size controls the relative typography, gaps, dashes, and strokes.
SymLine samples both envelopes and the signal over the entire domain. The root's
`fit` prop scales the completed slide down when necessary, preserving both columns.

See [HStack](../elements/layout.md#HStack).

<a id="two_column-example"></a>

### Example

```jsx
// A damped oscillation beside explanatory prose and a formula-bearing list.
const envelope = (t) => exp(-0.3 * t)
return (
  <Slide fit font-size={px(14)} aspect={1.65} padding={em(1.6)} title="Damped Oscillation">
    <HStack gap={em(1.6)} align="center">
      <VStack grow={1.15} gap={em(0.6)} align="fill">
        <Plot aspect={1.5} xlim={[0, 8]} ylim={[-1.2, 1.2]} font-size={em(0.8)}>
          <SymLine
            fy={envelope}
            xlim={[0, 8]}
            stroke={darkgray}
            stroke-dasharray={[em(0.3), em(0.25)]}
          />
          <SymLine
            fy={(t) => -envelope(t)}
            xlim={[0, 8]}
            stroke={darkgray}
            stroke-dasharray={[em(0.3), em(0.25)]}
          />
          <SymLine
            fy={(t) => envelope(t) * cos(2 * t)}
            xlim={[0, 8]}
            samples={301}
            stroke={blue}
            stroke-width={em(0.16)}
          />
        </Plot>
        <Text font-size={em(0.8)}>A damped oscillation and its envelope</Text>
      </VStack>
      <TextCol grow={1} gap={em(1)}>
        <Text font-size={em(1.25)} font-weight={bold}>
          What the plot shows
        </Text>
        <Text>
          The oscillation loses energy to friction, so each swing is smaller than the last while
          the period stays the same.
        </Text>
        <Bullets gap={em(0.7)}>
          <Text>
            The envelope <Tex>{String.raw`e^{-0.3t}`}</Tex> bounds every peak.
          </Text>
          <Text>Zero crossings stay evenly spaced.</Text>
        </Bullets>
      </TextCol>
    </HStack>
  </Slide>
)
```

---

<a id="two_columns"></a>

## Two columns

A small figure and its explanation share a definite row width. Both direct
children of **HStack** use `grow={1}`, so they split
the space remaining after the gap equally. The figure's **TextFrame** includes its padding and border in
that allocation. The text column wraps at its allocated width without changing
font size.

The row does not wrap: keeping the diagram beside its explanation is part of
the composition. **Slide** supplies the body allocation without an authored
pixel width. One base font size, an outer aspect ratio, and relative gaps describe
the layout; the root's `fit` prop reduces the whole figure when the host is smaller.

The little bar diagram uses an **HStack** with an `em(10)` height and end alignment.
Its three bar heights are fractions of that shared reference: `0.4`, `0.7`, and `1`.
Equal flexible widths keep the bars balanced. It
is ordinary geometry, not a **Plot** component or an automatic data scale.

Try changing the host width with `gum example.jsx -W 640` or `-W 320`: both
columns remain side by side. Change their grow weights to adjust the layout and paragraph
line breaks before fitting. The final transform scales fonts, padding, and bars
together. Flex belongs on the direct children; putting grow only on the nested
bar stack would not affect the outer row.

**TextFrame** and **TextCol** pass their established content width to automatically
sized children. The bar stack establishes its own height independently.

<a id="two_columns-example"></a>

### Example

```jsx
// Equal flexible columns give a figure and a wrapping explanation the same allocation.
<Slide fit font-size={px(13)} aspect={1.3} padding={em(1.75)} background={lightgray} color={slate}>
  <TextCol gap={em(1.25)}>
    <Text font-family={mono} font-size={em(0.9)} color={blue}>LAYOUT / 01</Text>
    <Text font-size={em(1.75)} font-weight={bold}>A figure beside its explanation</Text>
    <HStack grow={1} gap={em(1.5)} align="center">
      <TextFrame
        grow={1}
        padding={em(1.25)}
        border-radius={em(0.75)}
        border-color={gray}
        background={white}
      >
        <TextCol gap={em(1)}>
          <Text font-size={em(0.9)} font-weight={bold}>ONE SHARED WIDTH</Text>
          <HStack height={em(10)} gap={em(0.75)} align="end">
            <Rect
              grow={1}
              height={0.4}
              fill={blue}
              stroke={none}
            />
            <Rect
              grow={1}
              height={0.7}
              fill={red}
              stroke={none}
            />
            <Rect
              grow={1}
              height={1}
              fill={green}
              stroke={none}
            />
          </HStack>
          <Text font-size={em(0.9)} color={slate}>Relative heights, flexible widths.</Text>
        </TextCol>
      </TextFrame>
      <TextCol grow={1} gap={em(0.9)}>
        <Text font-size={em(1.2)} font-weight={bold}>Two columns, one allocation</Text>
        <Text line-height={em(1.4)}>Both columns grow equally into the available width. The figure and its explanation stay side by side.</Text>
        <Text line-height={em(1.4)}>The paragraph reflows. The bars share one height reference. Nothing needs to infer a combined aspect ratio.</Text>
      </TextCol>
    </HStack>
  </TextCol>
</Slide>
```

---

<a id="ui_mockup"></a>

## UI Mockup

Overlapping desktop-style windows combine a live plot, a fine background grid, and wrapped message text.

Window is a reusable single-content Frame containing a vertical stack. Window
positions and widths are fractions of the desktop canvas; their text determines
natural height. The plot uses an aspect ratio instead of a pixel height. Source
order controls the overlapping layers.

A fitted Slide supplies the canvas. Its base font size is the only pixel value;
padding, gaps, corners, and typography use relative sizes.

See [Frame](../elements/layout.md#Frame).

<a id="ui_mockup-example"></a>

### Example

```jsx
// Overlapping windows combine clipped frames, wrapped text, and a live plot.
const messages = [
  {
    title: "Message Alert!",
    body: "There is a new message waiting in your inbox. You probably want to see it. But I'm gonna make that really difficult for no reason.",
  },
  { title: "Testing, Testing", body: "What are we doing here?" },
]
const Window = ({ title, children, padding = em(0.5), ...props }) => (
  <Frame border-radius={em(0.45)} background={white} border-color={darkgray} clip {...props}>
    <VStack>
      <TextBox width="fill" padding={em(0.5)} background={gray} font-weight={bold}>
        {title}
      </TextBox>
      <HLine height={0} stroke={darkgray} />
      <Box padding={padding}>
        {children}
      </Box>
    </VStack>
  </Frame>
)
return <Slide fit font-size={px(10)} aspect={1.5} padding={em(1.1)}>
  <Frame border-radius={em(0.85)} clip border-width={em(0.1)} background={lightgray}>
    <Group>
      <Window title="Data Viz" x={0.06} y={0.31} width={0.67} padding={0}>
        <Plot aspect={1.9} xlim={[0, tau]} ylim={[-1.2, 1.2]}>
          <SymLine fy={sin} xlim={[0, tau]} stroke={blue} stroke-width={em(0.15)} />
        </Plot>
      </Window>
      <VStack x={0.64} y={0.05} width={0.33} gap={em(0.75)}>
        {messages.map(({ title, body }) => (
          <Window title={title}>
            <Text>{body}</Text>
          </Window>
        ))}
      </VStack>
    </Group>
  </Frame>
</Slide>
```
