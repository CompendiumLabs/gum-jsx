# Gum

Gum describes diagrams with JSX and renders them as SVG. The reference pages
describe the elements, layout rules, and rendering APIs.

## Start here

1. Use [TextBox](../elements/text.md#TextBox) or [TextFrame](../elements/text.md#TextFrame) for padded document content.
2. Set its `width`, `height`, and `font-size` directly; hosts add the [Svg](../elements/layout.md#Svg) viewport around a bare root.
3. Arrange content with [TextCol](../elements/text.md#TextCol), [HStack](../elements/layout.md#HStack), or [Group](../elements/layout.md#Group).
4. Add [shapes](../elements/geometry.md#Rect) and [Text](../elements/text.md#Text).

**TextBox**, **TextFrame**, and **TextCol** are content-sized by default. Use
`width="fill"` when a document should occupy the available width; established
widths pass to automatically sized content, respecting explicit child sizes.
[Box](../elements/layout.md#Box),
[Frame](../elements/layout.md#Frame), and [VStack](../elements/layout.md#VStack)
provide primitives that size to their content by default.

Each page has a matching executable example. Download or edit the linked JSX;
it needs no imports when evaluated by the Gum CLI.

## Three rules worth learning

- Raw **length** numbers are fractions. Write `px(100)` for 100 pixels or
  `em(2)` for two local font sizes. A raw `width={100}` means 100 times the
  established parent width, not 100 pixels. See [Units](units.md).
- Stack growth and shrinkage are explicit. A column can measure aspect figures
  from a supplied width, but does not infer a shared width from their combined
  height. See [Sizing](sizing.md) and [Stack](stack.md).
- **Text** keeps its font size during layout. Standalone formulas shrink when
  needed. Put [fit](sizing.md#fitting) on a composed drawing to scale it as a
  whole, including its glyphs and strokes.

There is no browser DOM or React runtime behind these elements. JSX constructs
immutable descriptions; a layout pass creates geometry; SVG rendering serializes
that result. The [rendering API](rendering.md) exposes each stage separately.

## Run the example

With `@gum-jsx/cli` installed globally, save the example below as `hello.jsx`:

```sh
gum hello.jsx
gum hello.jsx -o hello.svg
```

The first command uses kitty graphics. See [CLI](cli.md) for PNG, tree, JSON,
viewport overrides, and other terminal options.

## Example

```jsx
// A first diagram: a heading, two shapes, and a paragraph in a padded box.
<TextBox width={em(20)} padding={em(1.25)} background={lightgray}>
  <TextCol gap={em(0.75)}>
    <Text font-size={em(1.5)} font-weight={bold}>Hello, Gum.</Text>
    <HStack gap={em(0.75)}>
      <Square width={px(56)} fill={blue} stroke={none} />
      <Circle width={px(56)} fill={red} stroke={none} />
    </HStack>
    <Text>Shapes resize. Text keeps its font size. Stacks arrange the result.</Text>
  </TextCol>
</TextBox>
```
