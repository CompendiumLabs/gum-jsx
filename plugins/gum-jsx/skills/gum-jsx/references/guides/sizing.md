# Sizing

Gum separates a parent's request, an element's preferred dimensions, and the
size of the rendered content. This is a local allocation protocol, not a
general constraint solver.

## Element dimensions

Common sizing props are width, height, `min-width`, `max-width`, `min-height`, and
`max-height`. All accept [lengths](units.md); width and height also accept `"fill"`.
Omitted dimensions use ordinary content measurement. Minima default to zero and maxima
are unbounded. A preferred width or height is clamped to the element's own limits.
An exact allocation from the parent takes precedence.

In the example, each gray track offers the same width. Only the blue box's width
prop changes; its text, font size, and padding stay the same.

| Sizing policy | Meaning |
|---|---|
| Omitted width | Measure content, including text wrapping at the offered width |
| `width={px(180)}` | Prefer a fixed width of 180 pixels |
| `width={0.5}` | Use half the established parent content width; requires a definite fraction reference |
| `width="fill"` | Occupy the offered width, clamped to own limits; measure content when no width is offered |

Omitted height measures content; `height="fill"` occupies a finite offered height.
These do not add flex weights. Use `align-self="start"` (or center/end) to opt out
of a parent's fill alignment, and `basis="auto"` for content-based flex growth.

Fill resolves from the actual offer. Fractions continue to use the established
parent content box, which can differ from the current offer. An own maximum
limits natural measurement without forcing a short paragraph to occupy that maximum.
Omitting dimensions does not scale an ordinary drawing or supply intrinsic
dimensions to a canvas; the element still uses its usual measurement rules.

## Design sizes

For a standalone chart, diagram, or slide, set a design height and base font size
on the outer figure. An aspect ratio determines the width:

```jsx
<BarPlot
  height={px(550)}
  aspect={1.3}
  font-size={px(18)}
  values={[2, 5, 8]}
/>
```

This figure lays out at 715 × 550 pixels with 18px text. Gum Studio scales the
completed SVG to the preview panel, preserving the relative sizes of labels,
bars, margins, and strokes. Set both width and height when the design needs
independent dimensions. Descendants can use `em()` for typography and spacing,
and fractions for positions and sizes within established boxes.

Changing the display size preserves the layout. Changing the authored dimensions
performs a new layout. The CLI's `-W` and `-H` also request a new layout; use
display scaling or explicit fitting to resize the complete drawing uniformly.

## Adaptive figures

When a figure should adapt to its available space, distinguish a content-sized
figure from a layout that deliberately fills its container. Boxes, stacks, **TextBox**,
**TextFrame**, and **TextCol** are all content-sized by default.
Do not add `width="fill"` merely to replace a fixed pixel width: that
can reserve a large blank strip beside otherwise compact content.

Use fill and `grow` when the content should actually occupy that width, and
leave document height content-sized. Text then reflows at its normal font size.
Use `aspect` on diagrams whose height follows their width. Wrapping cards may
use `wrap` with an explicit `basis` on [HStack](../elements/layout.md#HStack).
Comparisons and two-column figures should keep their intended row composition.

Standalone formulas shrink to their offered space automatically; they do not
enlarge. Inline formulas and nested math keep their normal font scale.
An entire fixed scene can put `fit` on its existing root box, stack, or canvas. It measures that
element naturally and shrinks the whole drawing only when necessary; no wrapper
is needed. Relative internal dimensions or flex bases can describe the composition
without fixing the outer viewport in pixels.

The CLI and docs previews offer 640 × 480 pixels by default. This is a budget,
so a tall document can grow beyond it. `gum example.jsx -W 320` gives an exact
width with natural height. Supplying both `-W` and `-H` establishes a fixed
viewport; content needs flex allocation or explicit fitting to stay within it.

Hosts can also set `max_width` and `max_height` on the generated **Svg** to bound
the SVG output. The figure reflows within the offers, then scales down
uniformly if it is still too wide or too tall. A height limit can therefore reduce
the rendered width, and a width limit can reduce the height. No height maximum
means natural height remains available. The [rendering API](rendering.md)
accepts these bounds through `wrap` without adding sizing boilerplate to examples.

### Relative compositions

Set one base font size, then use `em()` for local dimensions, fractions for
positions inside established boxes, and `aspect` for figure shape. On a slide,
grow weights divide the body allocation without repeating column widths:

```jsx
<Slide fit font-size={px(15)} title="Results">
  <HStack gap={em(1)} align="center">
    <Text grow={1}>A plot beside its explanation.</Text>
    <Plot grow={1.1} aspect={1.3} font-size={em(0.7)} xlim={[0, tau]} ylim={[-1, 1]}>
      <SymLine fy={sin} xlim={[0, tau]} stroke={blue} />
    </Plot>
  </HStack>
</Slide>
```

Grow weights need a finite budget: **Slide** supplies one to its body. A
content-sized row can instead use `em()` bases to establish a natural composition
before fitting. Small figures inside math likewise need intrinsic dimensions,
such as an em width plus aspect. An ordinary content-sized box can simply measure
its children, including rotated bounds, without becoming a fixed canvas.

See [math slides](../gallery/math.md#math_slides), [two columns](../gallery/layout.md#two_column), and
[Punk Rock](../gallery/text.md#punk_rock) for these variants.

## Fitting

Allocation and scaling answer different questions:

| Intent | Props |
|---|---|
| A compact panel that still reflows text | Omit width and height |
| A document that occupies the offered width | `width="fill"` |
| A standalone formula that shrinks when needed | Automatic; no flag |
| A composed diagram that keeps its layout and shrinks when needed | `fit` |
| Scale up or down inside the offered rectangle | `fit="contain"` |
| Fill the offered rectangle, cropping excess | `fit="cover"` |

`fit` works on every layout element, including
custom elements. It scales the completed drawing, including its frame, typography,
padding, guides, and connection geometry. It is not inherited. Omit it for normal
layout: text reflows and whole formulas shrink. `fit={false}` explicitly disables
automatic formula fitting. Math spacing, rules, and stretch primitives retain
their allocation behavior; use explicit `fit` to scale their complete drawing.

With fitting enabled, authored dimensions describe the natural drawing, while
parent offers and own maxima bound the scaled result. Minima reserve final space.
Shrink-only fitting hugs the result unless fill sizing or an exact parent allocation
reserves a larger box. `fit-align` positions the drawing inside that box and defaults
to center; the element's ordinary `align` still arranges its children. See
[Fitting](fitting.md) for examples and the full contract.

Migration: omit former content-sizing keywords (`width="hug"` or `width="fit"`).
Move parent-fill opt-outs to `align-self`, and content-based growth to `basis="auto"`.
Former `Fit` wrappers put `fit` on their content; `fit="shrink"` becomes bare `fit`.
These old APIs have been removed, without compatibility aliases.

## Aspect ratio

Every **Element** accepts a positive, finite `aspect`: the preferred width divided
by height of its complete allocated box. This includes **Text**, **Svg**, stacks,
frames, math elements, and custom elements—not just shapes.

With one established dimension, aspect derives the other before content layout.
For example, `<VStack width={px(240)} aspect={1}>` allocates 240×240, and
`<Text height={px(100)} aspect={2}>` wraps within a 200px-wide box. `width="fill"`
can establish the width too. Two exact dimensions and conflicting size limits
take precedence over the preferred ratio.

When neither dimension is established, content-sized elements measure normally
and add space to reach the ratio. Available offers remain advisory; an aspect
does not implicitly fill them or invent a percentage reference from measured
content. Fonts, strokes, and child drawings are not scaled. Use
[fitting](sizing.md#fitting) when uniform scaling is actually intended.

Shapes retain their own natural-size and offered-space measurement rules.
**Square** and **Circle** supply an intrinsic ratio of 1 and still draw
square/circular geometry inside non-square allocations. A container never
infers a composite ratio from its children.

For [TitleFrame](../elements/text.md#TitleFrame), `aspect` includes the raised
title. To make just its border square, use `frame-aspect={1}`; the title overhang
is then added automatically. Outer allocations take precedence over `frame-aspect`.

## Document layouts

[TextBox](../elements/text.md#TextBox), [TextFrame](../elements/text.md#TextFrame),
and [TextCol](../elements/text.md#TextCol) are content-sized by default.
Set `width="fill"` at the document boundary when it should occupy the offered width.
Their horizontal fill alignment allocates content width to children with an
unspecified or fill width, respecting explicit widths and min/max limits.
Use a child's `align-self="start"` for a compact panel or label within a fill-aligned
container. Heights remain content-sized.

```jsx
<Svg width={px(400)}>
  <TextBox width="fill" padding={em(1)}>
    <TextCol gap={0}>
      <HStack>
        <Text>Left</Text><Spacer /><Text>Right</Text>
      </HStack>
      <Frame><Text>Content</Text></Frame>
    </TextCol>
  </TextBox>
</Svg>
```

**Box**, **Frame**, **VStack**, and **HStack** retain their content-sized defaults.
Fill width adds no main-axis grow/shrink weights; flexible rows still need explicit
flex props. See [Stack](stack.md) for fill versus hard stretch alignment.

An unsized child with positive grow starts from a zero basis when its stack has
a finite main-axis budget. Explicit dimensions still supply a basis, and
`basis="auto"` requests a content-based fallback. Alignment does not select a
flex basis. See [Growth bases](../gallery/layout.md#stack_basis).

## Layout requests

| Request | Meaning |
|---|---|
| natural | Measure without a finite offer on that axis |
| `available(value)` | Advisory pixel budget; content may exceed it |
| `exact(value)` | Report this allocated dimension; retain overflow separately |

Length dimensions normally turn natural/available requests into exact local
dimensions. An exact parent request wins even over source dimensions.
The [rendering API](rendering.md) exposes these requests; the CLI's -W/-H flags
send exact viewport overrides.

Unsized aspectless shapes fill offered axes independently. With no offer, a shape
uses a 16px natural height, and either a 16px width or its aspect-derived width.
**Text** measures its glyphs and line breaks. Containers normally hug the resulting
content unless their own dimensions or allocations establish a frame.

## The stack boundary

A **VStack** passes available width inward and measures natural child heights
when a basis requires content measurement. An **HStack** does the same with
available height and child widths.
Growth and shrinkage along the stacking direction require explicit flex props.

A height-only **Svg** containing an unsized **VStack** does **not** make its shapes share
that height or infer a common width. Supply the column width, or allocate child
heights explicitly. For **Rect** aspects 1 and 2, a common width W gives a total height
of W + W/2. To obtain 500px with no gaps, the author can choose W = 1000/3.

Likewise, independently growing aspect figures need not have the same cross-axis
size. Fill alignment supplies a shared cross-axis allocation; it does not infer
a composite aspect or add main-axis growth. See [Stack](stack.md) for the allocation controls.

## Example

```jsx
// Each track offers the same space; only the blue box's width changes.
const WidthExample = ({ label, width }) => (
  <TextCol gap={em(0.35)}>
    <Text font-family={mono} font-size={em(0.8)}>{label}</Text>
    <Box width="fill" padding={em(0.5)} background={lightgray} align="start">
      <TextBox
        width={width}
        padding={em(0.6)}
        background={blue}
        color={white}
        border-radius={em(0.2)}
      >
        Hello, Gum
      </TextBox>
    </Box>
  </TextCol>
)

return (
  <TextBox
    height={px(450)}
    aspect={1.4}
    font-size={px(16)}
    padding={em(1.5)}
    background={white}
    color={slate}
  >
    <TextCol gap={em(0.9)}>
      <Text font-size={em(1.5)} font-weight={bold}>Four ways to set a width</Text>
      <WidthExample label="Content: width omitted" />
      <WidthExample label="Fixed: width={px(180)}" width={px(180)} />
      <WidthExample label="Fraction: width={0.5}" width={0.5} />
      <WidthExample label={'Fill: width="fill"'} width="fill" />
    </TextCol>
  </TextBox>
)
```
