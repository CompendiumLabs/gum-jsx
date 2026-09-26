# Text elements

<a id="Bullets"></a>

## Bullets

| Property | Default | Meaning |
|---|---|---|
| `children` | Empty | One text or element child per bullet |
| `marker` | `"•"` | Marker text prepended to each item |
| `gap` | `em(0.5)` | Vertical space between items |
| `indent` | `em(1.2)` | Width reserved for each marker |

A vertical list with baseline-aligned markers. Supply one child per item. Wrap
mixed inline content in **Text** so it remains one bullet. marker defaults to •,
indent to 1.2em, and gap to 0.5em. Each row
reserves marker width before allocating flexible content, so paragraphs keep
a hanging indent. A nested **Bullets** **Element** can be an item.

<a id="Bullets-example"></a>

### Example

```jsx
// A list with wrapping items.
<Box padding={em(2)}>
  <Bullets>
    <Text>Measured markers</Text>
    <Text>Wrapped list items keep a hanging indent when they span several lines.</Text>
    <Text>Figures can also be items</Text>
  </Bullets>
</Box>
```

---

<a id="Slide"></a>

## Slide

| Property | Default | Meaning |
|---|---|---|
| `title` | — | String or **Element** placed above the body |
| `title-style` / `title-*` | `em(1.6)`, `bold` | Nested or flat text options for a generated title |
| `font-size` | Inherited | Base font size for body text, title scale, padding, and gaps |
| `padding` | `em(1.5)` | Slide-edge lengths; accepts [Box padding forms](layout.md#Box) |
| `gap` | `em(0.8)` | Space between the title and body |
| `background` | `none` | Explicit **Slide** background paint |
| `clip` | `false` | Clip content to the 16:9 slide frame |

A 16:9 canvas with a measured title and flexible content area. `title` is a string
or **Element**; `title-style` overrides default 1.6em bold text. The base font
inherits from **Svg** or another parent (16px without a parent override). Set
`font-size` on **Slide** only when it should differ from its parent. Defaults:
1.5em padding, 0.8em gap, transparent background. `clip` optionally hides paint outside
the slide (false by default).

Scoped `title-` props accept generated text options, including `title-color`,
`title-font-size`, and `title-wrap`. They override matching fields in `title-style`.
Supplied title **Element**s retain their own props.

Explicit dimensions or parent offers determine the viewport; natural width is
480px with a 16:9 height. A single child fills the area below the title, respecting
its explicit dimensions, `align-self` overrides, and min/max limits. A plain **Plot** needs
no height calculation; a supplied **TextCol** or **HStack** receives the body
allocation directly, so its own flex layout can use the remaining space.

Multiple children use **TextCol** and ordinary stack rules, with 0.6em gaps.
Use `grow={1}` on figures that should share the remaining height with text:

```jsx
<Slide fit font-size={px(15)} title="Results">
  <Plot grow={1} />
  <Text>A caption below the plot.</Text>
</Slide>
```

For a **TextFigure**, put `grow={1}` on its figure child to leave room for the
caption. Explicitly oversized content or too much text can still overflow.
Resizing does not multiply the type scale; use `fit` for a scaled copy of a
finished slide.

For side-by-side content, place an **HStack** in the body and give its direct
children grow weights. Use `aspect` on plots, relative font sizes on labels, and
`em()` padding and gaps. The [math slide](../gallery/math.md#math_slides) uses
this pattern with only one pixel value: its base font size.

<a id="Slide-example"></a>

### Example

```jsx
// A slide composes a measured title, figure, and caption at a stable type scale.
return (
  <Slide fit font-size={px(15)} aspect={1.5} title="From samples to a figure">
    <TextFigure
      caption="A common sampler supports scalar functions and parametric curves."
      caption-style={{ color: blue, font_size: em(0.8) }}
    >
      <Plot
        font-size={em(2 / 3)}
        grow={1}
        title="Sine and cosine"
        xlabel="Phase (rad)"
        ylabel="Value"
        xlim={[0, tau]}
        ylim={[-1.2, 1.2]}
      >
        <SymLine
          fy={sin}
          xlim={[0, tau]}
          stroke={blue}
          stroke-width={em(0.2)}
        />
        <SymSpline
          fy={cos}
          xlim={[0, tau]}
          samples={17}
          stroke={red}
          stroke-width={em(0.2)}
        />
      </Plot>
    </TextFigure>
  </Slide>
)
```

---

<a id="Span"></a>

## Span

**Span** changes inherited style for part of a [Text](text.md#Text) element. Its children
may be strings, numbers, nested **Span**s, inline elements, and arrays. It has no independent box
during inline layout: padding, width, and flex allocation do not create an
inline badge or a separately positioned run.

```jsx
<Text>
  {"One "}<Span font-weight={bold}>important</Span>{" word."}
</Text>
```

Font family, size, weight, style, color, and line height may be overridden. em or
fractional `font-size` is relative to the surrounding font size. Nested **Span**s
inherit the resolved style of their containing **Span**. Use `color`, not fill,
for glyph color.

Styled runs share line breaking and baselines. A **Span** boundary inside a word
does not create a new break opportunity, and a style-equivalent **Span** does not
break kerning. Larger runs contribute their own font metrics to the shared line
box. An embedded element receives the span's resolved style and contributes its
own logical baseline extents. A formula inherits font size and color while
retaining its math faces. **Span** itself provides no superscript, subscript,
or arbitrary baseline shift.

Keep literal text on one source line, use text expressions, or include newlines
intentionally: **Text** retains explicit newlines. The example mixes styles within
one paragraph and highlights the middle of an otherwise unbroken word.

<a id="Span-example"></a>

### Example

```jsx
// Inline styles share paragraph wrapping and do not introduce word breaks.
<TextBox padding={em(1.5)} background={lightgray}>
  <TextCol gap={em(1)}>
    <Text font-size={em(1.5)}>A <Span font-weight={bold} color={blue}>small</Span> style change</Text>
    <Text font-size={em(1.1)} line-height={em(1.4)}>Use <Span font-style="italic">emphasis</Span>, a <Span font-family={mono} color={red}>code name</Span>, or a different <Span color={green}>color</Span> without splitting the paragraph.</Text>
    <Text font-size={em(1.1)}>un<Span font-weight={bold} color={blue}>break</Span>able</Text>
  </TextCol>
</TextBox>
```

---

<a id="Text"></a>

## Text

**Text** lays out shaped glyphs at a fixed font size. It wraps into lines when given
a finite width; changing that width reflows the paragraph instead of scaling
the font. Use [fitting](../guides/sizing.md#fitting) only when you intentionally want to scale a finished
text fragment.

<a id="Text-content-and-formatting"></a>

### Content and formatting

Supply text as children. Children may be strings,
numbers, [Spans](text.md#Span), other elements, or nested arrays of those values.
Null and boolean children are ignored. Each embedded element is an indivisible
inline item, aligned by its baseline or bottom edge. Give figures concrete sizes.

| Property | Default | Meaning |
| --- | --- | --- |
| `font-family` | `sans` | Registered family name |
| `font-size` | `px(16)` | Glyph size; em/fractions use the inherited font size |
| `font-weight` | `regular` | Numeric 1–1000, or `"light"`, `"regular"`/`"normal"`, `"bold"` (300, 400, 700) |
| `font-style` | `"normal"` | normal or italic |
| `color` | `black` | Glyph fill; the shape fill prop does not color text |
| `line-height` | `em(1.2)` | Prose line strut; inline elements may enlarge the line |
| `wrap` | `true` | Permit wrapping at legal word-break positions |
| `whitespace` | `"normal"` | normal or pre |
| `tab-size` | `4` | Positive integer tab-stop interval in pre mode |
| `justify` | `"start"` | start, center, end, or a fraction from 0 to 1 within the allocated text width |

Font and color props inherit through containers. wrap, whitespace, `tab-size`,
and `justify` are local **Text** options. See [Fonts](../guides/fonts.md) for the bundled
families, weight matching, and host font loading.

<a id="Text-wrapping-and-whitespace"></a>

### Wrapping and whitespace

Literal JSX text strips outer blank lines and common source indentation by default,
so the following label measures exactly like `<Text>Revenue</Text>`:

```jsx
<Text>
  Revenue
</Text>
```

Internal text line breaks and spaces beside inline spans remain. Formatting-only
multiline children between tags are ignored. See [JSX whitespace](../guides/jsx.md#jsx-whitespace)
for the full rules and examples.

In normal mode, horizontal spaces/tabs collapse and hard-line edges are trimmed.
Both normal and pre retain explicit newlines. pre preserves spaces and expands
tabs; it does not turn wrapping off. For literal code or a small aligned table,
use `whitespace="pre"` together with `wrap={false}` and a monospaced font. Use a string
expression child to bypass JSX source cleanup; pre alone does not
preserve source indentation or outer blank lines.

```jsx
<Text font-family={mono} whitespace="pre" wrap={false}>
  {"name\tcount\nalpha\t12"}
</Text>
```

Wrap happens at legal Unicode break positions, not at every character. An
unbreakable word wider than its budget overflows; it is not shrunk or silently
ellipsized. A trailing newline adds a blank line. Empty text has no natural size
or ink. Line height controls spacing, not glyph scaling: very tight lines can
overlap or extend beyond their line boxes.

Inline elements enlarge a line using their logical above/below-baseline extents;
ink overhang alone does not enlarge it. A formula stays at its natural size and
overflows if it cannot fit. [Tex](math.md#Tex) is the usual inline math choice;
[Latex](math.md#Latex) retains its display-style default. See
[math inside prose](../gallery/math.md#inline_math) for examples.

In an [HStack](layout.md#HStack), use `grow={1}` on an unsized paragraph to give it the
remaining width. Its basis defaults to zero under a finite row budget; use
`basis="auto"` to start from its measured width. A fixed-height text frame does not
automatically fit its text vertically. Align the **Text** element using its parent; `justify` only aligns
lines inside the **Text** rectangle.

SVG output contains glyph paths and an accessible text label, not native SVG
text. This makes font rendering self-contained, but the paths are not ordinary
selectable text.

<a id="Text-example"></a>

### Example

```jsx
// The same fixed-size paragraph reflows at two explicit widths.
const paragraph =
  "A paragraph keeps its font size while the available width changes its line breaks."
const Column = ({ width, color }) => (
  <VStack shrink={1} basis={px(width)} gap={em(0.625)}>
    <Text font-weight={bold} color={color}>{width} px</Text>
    <Frame
      width="fill"
      padding={em(0.75)}
      border-color={color}
      background={white}
    >
      <Text font-size={em(1.2)} line-height={em(1.4)}>{paragraph}</Text>
    </Frame>
  </VStack>
)
return (
  <Box padding={em(1.25)} background={lightgray}>
    <HStack wrap gap={em(1.25)}>
      <Column width={200} color={blue} />
      <Column width={300} color={red} />
    </HStack>
  </Box>
)
```

---

<a id="TextBox"></a>

## TextBox

| Property | Default | Meaning |
|---|---|---|
| `width` | Content-sized | `"fill"` occupies available width; lengths set an explicit width |
| `children` | — | Text, inline content, or one existing layout element |
| `padding` | `em(0.6)` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(0)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | **Box** background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `{ x: "fill" }` | Fill the child's automatic width; start vertically |
| `text-justify` | `"start"` | start, center, end, or a fraction from 0 to 1 for lines inside generated text |
| `clip` | `false` | Clip content inside the rounded border |

**TextBox** accepts string/**Span**/**Element** children, with 0.6em padding.
Other props follow [Box](layout.md#Box). **TextFrame** adds a 1px border. **Text** reflows at
the allocated width while font size remains fixed; existing **Element**s are
retained.
`text-*` props configure generated [Text](text.md#Text) children through prefix
piping, for example `text-justify="center"` or `text-wrap={false}`.

The panel measures its content, including padding and border. Use `width="fill"`
when it should occupy the offered width. Within an established content area,
its child's unspecified width fills by default. Explicit child widths and min/max
limits are respected; `align-self="start"` keeps a child compact. Height remains
content-sized.

Use **TextCol** for multiple block children. A single element inside JSX fragments
or conditional children is preserved. Mixed strings, **Span**s, and formulas
form one paragraph. Wrap several elements without prose in **Text** to request
inline layout explicitly.
An explicit `align` replaces the default. See [Sizing](../guides/sizing.md).

<a id="TextBox-example"></a>

### Example

```jsx
// A document panel carries its offered width through a column, row, and frame.
<TextBox padding={em(1)} background={lightgray}>
  <TextCol gap={em(0.75)}>
    <HStack>
      <Text>Left</Text>
      <Spacer />
      <Text>Right</Text>
    </HStack>
    <Frame padding={em(0.5)}>
      <Text>Content fills the column without repeating its width.</Text>
    </Frame>
  </TextCol>
</TextBox>
```

---

<a id="TextCol"></a>

## TextCol

| Property | Default | Meaning |
|---|---|---|
| `width` | Content-sized | `"fill"` occupies available width; lengths set an explicit width |
| `gap` | `em(0.6)` | Space between adjacent children |
| `align` | `"fill"` | Fill automatic child widths while respecting explicit sizes and limits |
| `justify` | `"start"` | Vertical packing and distributed spacing |

A text-aware stack: strings/numbers become **Text** elements at construction.
Existing figures retain their identities and flex metadata. **TextStack** uses
`direction="vertical"` by default, or "horizontal"; **TextRow** is horizontal with
baseline alignment, **TextCol** vertical with fill alignment.

Other props follow [Stack](../guides/stack.md). gap defaults to 0.6em. Width allocation
reflows text while preserving glyph measurements and baselines. These wrappers
do not add automatic flex weights, scaling, or a separate text scale. Specify
grow/shrink/basis for flexible content.
**Element** children can override horizontal alignment with `align-self`; for example,
`align-self="end"` opts out of the default fill allocation and aligns at the right edge.
A child with its own `width="fill"` still fills the offer; omit that width
for a compact document component aligned at the edge.

The column measures its content and selects a shared width, reflowing text within
available offers. Set `width="fill"` to occupy the offer explicitly.
Explicit child widths and `align-self` opt out of fill alignment; child min/max
limits constrain fill allocations. Use `align="stretch"` for hard allocations
that override child widths and limits. Heights retain ordinary stack and flex rules.

<a id="TextCol-example"></a>

### Example

```jsx
// A column fills automatic widths while keeping explicit and content-sized frames.
<TextBox width="fill" padding={em(1.25)}>
  <TextCol>
    <Text font-size={em(1.375)} font-weight={bold}>A shared width</Text>
    <TextFrame>Automatic width fills the column.</TextFrame>
    <TextFrame width={px(220)}>An explicit 220px width.</TextFrame>
    <TextFrame align-self="end">Content-sized</TextFrame>
  </TextCol>
</TextBox>
```

---

<a id="TextFigure"></a>

## TextFigure

| Property | Default | Meaning |
|---|---|---|
| `caption` | — | String or **Element** placed after the figure children |
| `caption-style` / `caption-*` | — | Nested or flat text options for a generated caption |
| `gap` | `em(0.5)` | Space between the figure and caption |
| `padding` | `0` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(0)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | **Box** background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `"start"` | Content alignment on both axes |
| `clip` | `false` | Clip content inside the rounded border |

A figure followed by an optional caption (string or **Element**). `caption-style`
styles generated text, gap defaults to 0.5em, and **Box** props control outer
decoration. Children must be figure **Element**s. Give a figure an em/px height,
or use `grow={1}` on it when **TextFigure** receives a finite height (for example,
as the body of a **Slide**). The figure then takes the space left by the caption,
which reflows at the shared column width.

Scoped `caption-` props accept generated text options, including `caption-color`,
`caption-font-size`, and `caption-wrap`. They override matching fields in
`caption-style`. Supplied caption **Element**s retain their own props.

<a id="TextFigure-example"></a>

### Example

```jsx
// A slide composes a measured title, figure, and caption at a stable type scale.
return (
  <Slide width="fill" min-height={em(22)} title="From samples to a figure">
    <TextFigure
      caption="A common sampler supports scalar functions and parametric curves."
      caption-color={blue}
      caption-font-size={em(7 / 9)}
    >
      <Plot
        grow={1}
        title="Sine and cosine"
        xlabel="Phase (rad)"
        ylabel="Value"
        xlim={[0, tau]}
        ylim={[-1.2, 1.2]}
      >
        <SymLine
          fy={sin}
          xlim={[0, tau]}
          stroke={blue}
          stroke-width={px(2.5)}
        />
        <SymSpline
          fy={cos}
          xlim={[0, tau]}
          samples={17}
          stroke={red}
          stroke-width={px(2.5)}
        />
      </Plot>
    </TextFigure>
  </Slide>
)
```

---

<a id="TextFrame"></a>

## TextFrame

| Property | Default | Meaning |
|---|---|---|
| `width` | Content-sized | `"fill"` occupies available width; lengths set an explicit width |
| `children` | — | Text, inline content, or one existing layout element |
| `padding` | `em(0.6)` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(1)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | **Box** background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `{ x: "fill" }` | Fill the child's automatic width; start vertically |
| `text-justify` | `"start"` | start, center, end, or a fraction from 0 to 1 for lines inside generated text |
| `clip` | `false` | Clip content inside the rounded border |

**TextFrame** accepts string/**Span**/**Element** children, with 0.6em padding.
Other props follow [Box](layout.md#Box). **TextFrame** adds a 1px border. **Text** reflows at
the allocated width while font size remains fixed; existing **Element**s are
retained.
`text-*` props configure generated [Text](text.md#Text) children through prefix
piping, for example `text-justify="center"` or `text-wrap={false}`.

Like [TextBox](text.md#TextBox), the frame measures its content by default. Set
`width="fill"` to occupy an offered width. It passes an established content width
through padding and border to automatically sized children, respecting their
explicit widths and min/max limits. `align-self="start"` keeps a child compact.

<a id="TextFrame-example"></a>

### Example

```jsx
// A bordered document panel fills available width and preserves compact children.
<TextBox width="fill" padding={em(1)}>
  <TextFrame padding={em(1)} border-color={blue}>
    <TextCol>
      <Text>A wrapping paragraph in a frame that follows the available width.</Text>
      <TextBox align-self="start" padding={em(0.4)} background={lightgray}>Compact label</TextBox>
    </TextCol>
  </TextFrame>
</TextBox>
```

---

<a id="TextGrid"></a>

## TextGrid

A [Grid](layout.md#Grid) that converts strings and numbers to **Text** elements at
construction. Existing elements retain their identity and alignment settings.

| Property | Default | Meaning |
|---|---|---|
| `columns` | `1` | Equal-width column count, or an array of lengths and `"auto"` tracks |
| `gap` | `em(0.6)` | Space between rows and columns |
| `column-gap` | `gap` | Override horizontal spacing |
| `row-gap` | `gap` | Override vertical spacing |
| `align` | `{ x: "fill", y: "start" }` | Fill automatic child widths and align cells at the top of each row |

Each string, number, or element is one cell, filled row by row. Nested arrays
flatten; null and boolean children are skipped. Use an empty **Box** to retain a
blank cell. Wrap mixed inline content in **Text** to keep it in a single cell.

Equal columns share an offered width; without an offer they use the widest natural
cell. Text wraps before the row heights are measured. An array such as
`columns={["auto", em(16)]}` keeps a compact label column beside wrapped prose.
It does not grow to fill spare width. Typography inherits normally, without a
separate text scale or extra layout wrapper.

Cell alignment, fill/stretch, percentage references, and overflow follow Grid's
rules. Use `align-self` on an element child to override its alignment. Rows remain
content-sized even when the Grid has an explicit height.

<a id="TextGrid-example"></a>

### Example

```jsx
// A natural label column stays aligned beside a fixed-width column of wrapped prose.
<TextGrid
  columns={["auto", em(16)]}
  font-size={px(18)}
  column-gap={em(1.2)}
  row-gap={em(0.8)}
  fit
>
  <Text font-weight={bold} color={blue}>Columns</Text>
  {"Shared widths keep labels and descriptions aligned across every row."}
  <Text font-weight={bold} color={purple}>Rows</Text>
  {"Each row grows to fit its tallest cell after the text has wrapped."}
  <Text font-weight={bold} color={green}>Gaps</Text>
  {"Horizontal and vertical spacing can be set independently."}
</TextGrid>
```

---

<a id="TextRow"></a>

## TextRow

| Property | Default | Meaning |
|---|---|---|
| `gap` | `em(0.6)` | Space between adjacent children |
| `wrap` | `false` | Start a new row when the next child's basis would exceed the offered width |
| `line-gap` | `gap` | Vertical space between wrapped rows |
| `align` | `"baseline"` | Vertical alignment, including first-baseline alignment |
| `justify` | `"start"` | Horizontal packing and distributed spacing |

A text-aware stack: strings/numbers become **Text** elements at construction.
Existing figures retain their identities and flex metadata. **TextStack** uses
`direction="vertical"` by default, or "horizontal"; **TextRow** is horizontal with
baseline alignment, **TextCol** vertical with fill alignment and `width="fill"`.

Other props follow [Stack](../guides/stack.md). gap defaults to 0.6em. Width allocation
reflows text while preserving glyph measurements and baselines. These wrappers
do not add automatic flex weights, fitting, or a separate text scale. Specify
grow/shrink/basis for flexible content.
**Element** children can override vertical alignment with `align-self`, including
opting into or out of the baseline group.

<a id="TextRow-example"></a>

### Example

```jsx
// Text uses the shared baseline protocol.
<Box padding={em(2)}>
  <TextRow wrap>
    <Text font-size={em(1.375)} font-weight={bold}>Measured type</Text>
    <Text color={blue}>A shared layout.</Text>
  </TextRow>
</Box>
```

---

<a id="TextStack"></a>

## TextStack

| Property | Default | Meaning |
|---|---|---|
| `direction` | `"vertical"` | Stack converted text horizontally or vertically |
| `gap` | `em(0.6)` | Space between adjacent children |
| `align` | `"start"` | Cross-axis alignment |
| `justify` | `"start"` | Main-axis packing and distributed spacing |

A text-aware stack: strings/numbers become **Text** elements at construction.
Existing figures retain their identities and flex metadata. **TextStack** uses
`direction="vertical"` by default, or "horizontal"; **TextRow** is horizontal with
baseline alignment, **TextCol** vertical with fill alignment and `width="fill"`.

Other props follow [Stack](../guides/stack.md). gap defaults to 0.6em. Width allocation
reflows text while preserving glyph measurements and baselines. These wrappers
do not add automatic flex weights, fitting, or a separate text scale. Specify
grow/shrink/basis for flexible content.
**Element** children can override the cross-axis alignment with `align-self`.

<a id="TextStack-example"></a>

### Example

```jsx
// Text uses the shared baseline protocol.
<Box padding={em(2)}>
  <TextStack>
    <Text font-size={em(1.375)} font-weight={bold}>Measured type</Text>
    <Text color={blue}>A shared layout.</Text>
  </TextStack>
</Box>
```

---

<a id="TitleBox"></a>

## TitleBox

| Property | Default | Meaning |
|---|---|---|
| `title` | — | String or **Element** placed before the content |
| `title-style` / `title-*` | `bold` | Nested or flat text options for a generated title |
| `gap` | `em(0.6)` | Space between the title and content |
| `padding` | `em(0.75)` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(0)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | **Box** background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `"start"` | Content alignment on both axes |
| `clip` | `false` | Clip content inside the rounded border |

**TitleBox** composes an optional title above text or figure children inside a **Box**.
title is a string or **Element**; `title-style` overrides default bold text.
Scoped `title-` props accept text options, including `title-color`, `title-font-size`,
and `title-wrap`. They override matching fields in `title-style`. Supplied title
**Element**s retain their own props.
gap defaults to 0.6em, padding to 0.75em.
Other props follow [Box](layout.md#Box). Titles are measured content inside the box.
For a boxed title centered across the top border, use [TitleFrame](text.md#TitleFrame).

<a id="TitleBox-example"></a>

### Example

```jsx
// A title and measured content.
<Box padding={em(2)}>
  <TitleBox title="A titled figure" title-color={blue} title-wrap={false}>
    <Text>Text and graphics share a layout protocol.</Text>
  </TitleBox>
</Box>
```

---

<a id="TitleFrame"></a>

## TitleFrame

| Property | Default | Meaning |
|---|---|---|
| `aspect` | — | Preferred ratio of the complete element, including the raised title |
| `frame-aspect` | — | Preferred ratio of the bordered body, excluding the raised title |
| `bounds` | `"outer"` | `"frame"` makes the allocation the bordered body, leaving the raised title outside |
| `title` | — | String or **Element** in a box straddling the top border |
| `title-position` | `"center"` | `"start"`, `"center"`, `"end"`, or numeric horizontal alignment |
| `title-style` / `title-*` | Inherited text style | Nested or flat title text and box options |
| `title-font-weight` | Inherited, initially `400` | Title font weight; no automatic bold styling |
| `title-padding` | `[em(0.6), em(0.3)]` | Horizontal and vertical padding inside the title box |
| `title-border-width` | Frame border width | Title box border thickness |
| `title-border-color` | Frame border color | Title box border paint |
| `title-background` | Frame background | Title box background |
| `title-border-radius` | `em(0.3)` | Title box corner radius |
| `gap` | `em(0.6)` | Space between content children |
| `padding` | `em(0.75)` | Length or [Box padding shorthand](layout.md#Box) |
| `border-width` | `px(1)` | Border thickness inside the frame |
| `border-color` | Resolved color | Border paint |
| `background` | `none` | **Box** background |
| `border-radius` | `0` | Scalar, `{ x, y }` / `[x, y]` pair, or [side/corner object](layout.md#Box) |
| `align` | `"start"` | Content alignment on both axes |
| `clip` | `false` | Clip content inside the rounded border |

**TitleFrame** draws a border around its content, with an optional boxed title
centered across the top border. Half of the title box sits above that border;
its full height is included in the layout. The border is cut away behind the
title, so transparent backgrounds work too. The title reserves no room inside
the body: content starts at the ordinary `padding`, so a plot can sit flush with
the border. Even padding keeps content visually aligned within the frame, so when
content should clear the lower half of the title box, prefer a smaller
`title-font-size` or larger `padding` all around over extra top padding. `clip`
clips the body content without clipping the raised title.

For a square border, use `width={px(480)} frame-aspect={1}`. The bordered body will be
480×480, and the title's overhang is added to the total layout height automatically.
Changing the title font or padding does not change the body's ratio. An explicit
`height` still describes the total height including the title. Generic `aspect`
also describes that complete element: `width={px(480)} aspect={1}` gives a
480×480 total allocation, with the border shorter by the title's overhang.
Outer allocations, including dimensions derived from `aspect`, and min/max limits
take precedence over the body's `frame-aspect` preference.

With `bounds="frame"`, the layout box is the bordered body alone. `width`, `height`,
and `aspect` then describe the border, alignment and connections use it, and the
raised half of the title overhangs the top edge as a reserved outset. Leave room
for that overhang in the surrounding `gap` or `padding`.

Scoped `title-` props accept text options such as `title-color`, `title-font-size`,
and `title-wrap`, plus title box padding, border, background, border radius, and alignment.
They override matching fields in `title-style`. Supplied title **Element**s retain
their own props and inherit the title box's font size.
Generated titles inherit the surrounding font weight, which is normal by default.
Use `title-font-weight={bold}` when a bold title is desired.

Without a title, this is an ordinary padded frame. Other props follow
[Box](layout.md#Box). For an unboxed heading inside the content area, use
[TitleBox](text.md#TitleBox).

<a id="TitleFrame-example"></a>

### Example

```jsx
// A boxed title centered across the top border.
<Box background={white} padding={em(2)}>
  <TitleFrame
    title="A titled figure"
    border-color={blue}
    title-background={lightgray}
    title-font-size={em(0.75)}
    border-radius={em(0.5)}
  >
    <Text>Text and graphics share a layout protocol.</Text>
  </TitleFrame>
</Box>
```
