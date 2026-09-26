# Units

Lengths accept numbers, helper calls, and unit strings. Normalization preserves
their units until layout has the reference needed to turn them into pixels.

| Source | Meaning |
|---|---|
| `px(24)` or `"24px"` | 24 pixels, independent of font and parent size |
| `em(2)` or `"2em"` | Twice the local font size |
| `0.5` or `"50%"` | Half the relevant reference dimension |

Quoted JSX attributes work directly: `font-size="24px"`, `padding="1em"`, and
`width="50%"`. Helpers remain useful for computed values such as `em(scale * 2)`.
Both forms use the same measurement functions and references.

Strings accept finite decimal numbers, optional signs and scientific notation,
followed by lowercase `px`, `em`, or `%`. Surrounding whitespace is
ignored. Zero is valid in every unit and needs no reference; the unitless string
`"0"` is also accepted. Other unitless strings, unsupported units, and expressions
such as `calc(...)` are rejected with the source property path.

Bare numbers retain their existing meaning. In length props, `width={100}`
means 100 times the reference width; use `width="100px"` for pixels. In graph
positions, numbers are data coordinates, while strings such as `"50%"` resolve
as local lengths. See [Coordinates](coordinates.md).

## Which reference?

| Property | Fraction reference |
|---|---|
| `width`, `min-width`, `max-width` | Established parent content width |
| `height`, `min-height`, `max-height` | Established parent content height |
| Horizontal / vertical `padding` | Corresponding established parent axis |
| Stack `basis` and `gap` | Established main-axis length of the stack |
| **Group** child's `x` / `y` | Whole **Group** width / height |
| Shape point `x` / `y` | Shape's own resolved width / height |
| Scalar shape `radius`, `border-radius`, and `stroke-width` | Shorter side of the shape |
| **Box** `border-width` | Shorter established parent side; both axes must be known |
| `font-size` | Inherited font size |
| `line-height` | Resolved local font size |

The default font size is 16px. For `font-size`, `em(1.5)`, `"1.5em"`, `1.5`, and
`"150%"` multiply the inherited size. Other em lengths use the element's newly resolved
font size. Thus `font-size={px(20)} padding={em(1)}` gives 20px padding.

## A budget is not a percentage reference

A hugging container can receive a width offer without committing to that width.
Its descendants cannot use that offer as a percentage reference. Set the
container's width explicitly when you need fractional descendants:
`HStack width={1}` under a fixed-width **Svg** establishes a full-width row.
`width="fill"` instead establishes the actual offered width, without requiring
a fraction reference. Width and height are content-sized when omitted; see
[Sizing](sizing.md). `"fill"` is not a length unit, so it cannot be used for
padding, gaps, or min/max limits.

Fractions refer to the established content area, not the space left after
siblings. A stack deducts its gaps from that area along its main axis, so two
half-width children tile a row with any gap. Use [explicit flex](stack.md)
to divide the space that fixed siblings leave.

An unresolved nonzero fraction throws an error with the source property path.
The engine does not guess a reference or solve percentage cycles.

Aspect ratios, grow/shrink weights, alignment fractions, and anchor fractions
are dimensionless numbers, not lengths.

## Example

```jsx
// Compare pixel, em, and fractional lengths under the offered content width.
<TextBox width="fill" font-size={px(20)} padding={em(1)} background={lightgray}>
  <TextCol gap={em(0.5)}>
    <Text font-size={em(0.7)}>px(120): 120 pixels</Text>
    <Rect width={px(120)} height={px(24)} fill={blue} stroke={none} />
    <Text font-size={em(0.7)}>em(8): 160 pixels at a 20px font</Text>
    <Rect width={em(8)} height={px(24)} fill={red} stroke={none} />
    <Text font-size={em(0.7)}>0.5: half of the content width</Text>
    <Rect width={0.5} height={px(24)} fill={green} stroke={none} />
  </TextCol>
</TextBox>
```
