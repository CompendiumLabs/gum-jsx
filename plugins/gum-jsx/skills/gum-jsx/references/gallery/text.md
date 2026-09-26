# Text gallery

<a id="paragraph"></a>

## One paragraph, two widths
Both columns query the same styled **Text** description at different fractions
of the host's width. Below 600px they stack vertically. The font remains 18px
while line breaks and measured heights change.
The layout pass reuses prepared glyph measurements across those allocations.

The custom parent draws outlines around the measured paragraph boxes. Compare
the allocations with tree output. See [Text](../elements/text.md#Text),
[Span](../elements/text.md#Span), and [Custom elements](../guides/custom_elements.md).

<a id="paragraph-example"></a>

### Example

```jsx
// Both columns query the same Text description; only the offered width changes.
const Compare = ({ children }) =>
  <HStack gap={em(1)}>
    <VStack width={em(25)}>
      <Text font-size={em(0.8)} font-weight={bold} color={blue}>Wider allocation</Text>
      {children}
    </VStack>
    <VStack width={em(15)}>
      <Text font-size={em(0.8)} font-weight={bold} color={blue}>Narrower allocation</Text>
      {children}
    </VStack>
  </HStack>

return <Box padding={em(1)} font-size={px(18)}>
  <VStack gap={em(1)}>
    <Text font-size={em(1.65)} font-weight={bold}>One paragraph, two widths</Text>
    <Text font-size={em(0.8)} color={slate}>Same source and prepared glyphs. Both columns use an 18px font.</Text>
    <Compare>
      <Text line-height={em(1.4)}>
        A paragraph now answers a width offer with <Span font-weight={bold}>real glyph measurements.</Span> The words reflow, while the font size stays at 18 pixels. <Span font-style="italic" color={blue}>Styled runs share the same baseline,</Span> and the prepared text is reused for each allocation.
      </Text>
    </Compare>
  </VStack>
</Box>
```

---

<a id="punk_rock"></a>

## Punk Rock

Three colored text frames form a tilted badge with rounded outer corners.

Rotate wraps the completed row. The surrounding Box measures the rotated bounds,
so neither the badge nor its canvas needs an explicit width. Padding and gaps use
`em()`, and per-side radii round only the exposed ends. The base font size is the
only pixel value. `fit` shrinks the completed badge when the host is smaller.

See [Rotate](../elements/layout.md#Rotate).

<a id="punk_rock-example"></a>

### Example

```jsx
// A rotated strip of three colored text frames with rounded outer corners.
<Box fit font-size={px(38)} padding={em(0.8)}>
  <Rotate angle={-25}>
    <Frame width={em(12)}  padding={em(0.3)} border-radius={em(0.5)} background={gray} border-color={darkgray}>
      <HStack gap={em(0.3)}>
        <TextFrame padding={em(0.3)} border-radius={{ l: em(0.3) }} background={red} color={white} border-color={darkgray}>Punk</TextFrame>
        <TextFrame padding={em(0.3)} background={blue} color={white} border-color={darkgray}>Rock</TextFrame>
        <TextFrame padding={em(0.3)} border-radius={{ r: em(0.3) }} background={green} color={white} border-color={darkgray}>→</TextFrame>
      </HStack>
    </Frame>
  </Rotate>
</Box>
```

---

<a id="typography"></a>

## Type, ink, and line boxes
Gray rectangles show allocated line boxes and blue rules show measured baselines.
The samples compare font weights, mixed font sizes on one baseline, tight line
height, preserved whitespace, and centered lines.

The tight-leading sample puts 28px glyphs in a 12px line box. Its ink may overflow
that allocation without shrinking the glyphs. The custom parent reads baseline
guides from completed fragments to draw the diagnostic rules.

See [Text](../elements/text.md#Text) for line-height and whitespace options,
and the [typography card](text.md#typography_card) for ordinary text composition.

<a id="typography-example"></a>

### Example

```jsx
// Inspect line boxes and baseline guides using plain drawing/placement records.
class Specimen extends Element {
  static layout(props, query) {
    const width = query.request.width.kind === 'natural' ? 680 : query.request.width.value
    const inner = maximum(0, width - 48)
    const reference = make_size(width, 0)
    const children = [], draw = []
    let y = 20
    element_children(props.children).forEach((element, index) => {
      const fragment = query.child(element, make_request({ width: exact(inner) }), reference, index)
      children.push(place_fragment(fragment, make_point(24, y)))
      if (index > 0 && index % 2 === 0) {
        draw.push(draw_rect(make_rect(24, y, inner, fragment.size.height),
          { fill: lightgray, stroke: none, stroke_width: 0 }))
        for (const line of fragment.children) {
          const baseline = y + line.offset.y + line.fragment.guides.baseline
          draw.push(draw_rect(make_rect(24, baseline, inner, 0.5),
            { fill: blue, stroke: none, stroke_width: 0 }))
        }
      }
      y += fragment.size.height + (index % 2 === 0 ? 24 : 8)
    })
    const size = finish_size(make_size(width, y + 12), query.request, query.sizing)
    return make_fragment({ size, draw, children })
  }
}

return <Specimen color={slate}>
  <Text font-size={em(1.75)} font-weight={bold}>Type, ink, and line boxes</Text>
  <Text font-size={em(0.8)} color={slate}>Light, regular, bold, and synthesized italic</Text>
  <Text font-size={em(1.5)}>
    <Span font-weight={light}>Light </Span>{' Regular '}
    <Span font-weight={bold}>Bold </Span><Span font-style="italic">Italic</Span>
  </Text>
  <Text font-size={em(0.8)} color={slate}>Mixed sizes share one measured baseline</Text>
  <Text font-size={em(1.1)}>
    Small <Span font-size={em(2)} font-weight={bold} color={blue}>Big</Span> and small again.
  </Text>
  <Text font-size={em(0.8)} color={slate}>28px glyphs in a 12px line box: ink is allowed to overflow</Text>
  <Text font-size={em(1.75)} line-height={em(3 / 7)}>Jolly glyphs: Agjpy</Text>
  <Text font-size={em(0.8)} color={slate}>Preserved whitespace, tab stops, and explicit newlines</Text>
  <Text font-family={mono} whitespace="pre" wrap={false}>
    name    value
    size    16px
    line    1.2em
  </Text>
  <Text font-size={em(0.8)} color={slate}>Center-aligned lines in an exact allocation</Text>
  <Text font-size={em(1.25)} justify="center">{'A centered first line\nwith a shorter second'}</Text>
</Specimen>
```

---

<a id="typography_card"></a>

## Typography card

A text-focused card combines IBM Plex Sans and Mono, mixed weights, inline
styles, baseline alignment, and a short preformatted block. All faces come
from core's bundled font provider. No browser font stylesheet or rasterizer
font registration is needed.

The outer **Box** establishes the base font size and padding; descendant font
sizes and gaps use ems. **TextCol** passes its content width to the rows and text
blocks. **Span** changes selected runs inside a paragraph. A **TextRow** aligns
three text elements by their baselines and wraps them onto additional rows when
needed.

The code-style **TextBox** sets `text-whitespace="pre"` on its generated **Text**
child. Preserving spaces does not disable wrapping. The box supplies its
background, padding, and rounded corners; the child lays out the glyphs.

Try narrowing the host viewport to change paragraph wrapping. Prose keeps its
font size during reflow; a host-supplied maximum height may subsequently scale
the whole card to fit a bounded preview. SVG text is emitted as paths
with accessible labels, not as selectable native text.

<a id="typography_card-example"></a>

### Example

```jsx
// Mixed text styles and aligned baselines reflow; a preformatted block fits narrow cards.
<Box width={em(30)} font-size={px(14)} padding={em(1.2)} border-radius={em(0.75)}>
  <TextCol gap={em(1)}>
    <TextRow font-family={mono} font-size={em(0.7)}>
      <Text color={blue}>SPECIMEN / 01</Text>
      <Spacer />
      <Text>IBM PLEX</Text>
    </TextRow>
    <Text font-size={em(1.9)} font-weight={bold} line-height={em(1.15)}>Words are elements too.</Text>
    <Text line-height={em(1.4)}>
      A paragraph wraps to the width it is given, so a narrower box changes the <Span font-weight={bold} color={blue}>line breaks</Span> and never the font size. <Span font-style="italic">Emphasis</Span>, <Span font-family={mono} color={red}>code names</Span>, shapes like <Square width={em(0.7)} border-radius={em(0.15)} fill={blue} stroke={none} />, math like <Tex>{String.raw`e^{i\pi} + 1 = 0`}</Tex>, and even emoji 🚀 all ride along on the same baseline.
    </Text>
    <TextRow wrap gap={em(1.5)}>
      <Text font-size={em(2)} font-weight={bold}>Aa</Text>
      <Text font-size={em(1.5)} font-family={mono} color={red}>0123</Text>
      <Text font-style="italic" color={blue}>one shared baseline</Text>
    </TextRow>
    <TextBox font-family={mono} font-size={em(0.8)} line-height={em(1.5)} text-whitespace="pre" background={lightgray} padding={em(0.5)} border-radius={em(0.3)}>
      measure real glyph metrics
      wrap at the allocated width
      output plain SVG paths
    </TextBox>
    <Text font-style="italic" font-size={em(0.8)}>Glyph outlines travel with the SVG; font files stay at layout time.</Text>
  </TextCol>
</Box>
```
