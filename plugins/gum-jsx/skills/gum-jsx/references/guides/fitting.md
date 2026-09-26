# Fitting

Put `fit` on a composition that should scale as a complete drawing. It works on
text, math, frames, stacks, graphs, and custom elements without a wrapper.
Glyphs, strokes, padding, guides, and network connections scale together.

```jsx
<Group fit width={em(20)} height={em(10)}>
  <Text x={em(1)} y={em(1)}>A fixed composition</Text>
  <Circle x={em(10)} y={em(5)} width={em(3)} />
</Group>
```

| Property | Default | Meaning |
|---|---|---|
| `fit` | Automatic for whole formulas; otherwise off | `true` measures naturally, then shrinks uniformly only when necessary; `false` disables fitting |
| `fit="contain"` | — | Scale up or down to fit inside the offer |
| `fit="cover"` | — | Scale to cover the offer and clip the excess |
| `fit-align` | `"center"` | Position the drawing when the allocated rectangle has spare space |

Shrink-only fitting hugs the scaled drawing under available offers. `width="fill"`,
`height="fill"`, or exact parent allocations explicitly reserve space. Contain
and cover occupy the finite offered axes; unoffered axes follow the scaled drawing.
Fitting is local, not inherited: a fitted diagram can contain ordinary wrapping
paragraphs and independently sized graphics.

Authored width, height, and aspect describe the drawing's natural layout.
Parent offers and `max-width`/`max-height` bound its fitted size; minima reserve
space in the final allocation. For example, a `Group fit width={em(20)}
height={em(10)}` keeps that internal coordinate rectangle while shrinking into
a smaller host. A `Text fit max-width={em(10)}` shrinks a naturally measured line.
For a paragraph that wraps before its whole panel scales, set the paragraph's
width inside the fitted panel.

`fit-align` accepts start/center/end, a number from 0 to 1, or a two-axis object
or tuple. It is separate from a container's `align`, which still arranges its
children. Fitting uses layout bounds, not a crop of painted pixels. Reserved
outsets, such as plot labels, follow the transform. Zero-sized targets are valid.

Whole standalone formulas fit automatically when ordinary layout offers a finite
width or height, or the formula has a maximum size. Nested atoms retain their
TeX sizes, and inline formulas remain at their paragraph's font scale. Set
`fit={false}` for an intentionally unscaled formula. MathSpacer, MathRule, and
MathStretch are allocation primitives, not automatically fitted formulas.

A formula containing percentage-sized Gum operands needs authored design
dimensions to measure naturally, or `fit={false}` to use the parent's allocation.
Custom MathElement subclasses retain automatic fitting, including when adopted
by a named component.

Omit width/height for ordinary content sizing; text still reflows. Use
`align-self` to override a parent's fill alignment. See [Sizing](sizing.md).

## Example

```jsx
// Compare a title enlarged by contain with the same title kept at its original size.
<Box padding={em(1.25)} background={lightgray}>
  <HStack gap={em(1.25)}>
    <VStack grow={1} gap={em(0.5)}>
      <Text font-size={em(0.9)}>contain</Text>
      <Frame
        height={px(100)}
        padding={em(0.75)}
        border-color={blue}
      >
        <Text fit="contain" color={blue}>Size by fitting</Text>
      </Frame>
    </VStack>
    <VStack grow={1} gap={em(0.5)}>
      <Text font-size={em(0.9)}>shrink only</Text>
      <Frame
        width="fill"
        height={px(100)}
        padding={em(0.75)}
        border-color={red}
      >
        <Text fit color={red}>Size by fitting</Text>
      </Frame>
    </VStack>
  </HStack>
</Box>
```
