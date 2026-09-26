# Stacks

[HStack](../elements/layout.md#HStack) places children left to right. [VStack](../elements/layout.md#VStack) places them
top to bottom. There is no separate Stack constructor; this page documents their
shared rules.

The stacking direction is the **main axis**; the perpendicular direction is the
**cross axis**. Stack children are elements, arrays, fragments, or conditional
elements, not bare strings.

| Stack prop | Default | Meaning |
|---|---|---|
| `gap` | `0` | Length between adjacent children, with no outside gap |
| `wrap` | `false` | HStack only: break into rows at the offered width |
| `line-gap` | `gap` | Vertical space between wrapped rows |
| `align` | `"start"` | Cross-axis positioning; "start", "center", "end", "fill", "stretch", or 0–1 |
| `justify` | `"start"` | Main-axis positioning; "start", "center", "end", or 0–1 |
| `justify` | — | Also "space-between", "space-around", or "space-evenly" |
| `width` / `height` and limits | — | Common sizing of the stack's frame |

**HStack** additionally supports `align="baseline"`. Use a single alignment value
for a stack's `align`. A child's `align-self` may also use an object or tuple;
the stack reads only the cross axis, inheriting omitted axes from its own alignment.

## Per-child alignment

Set `align-self` on a direct child to override the stack's cross-axis `align`:
vertical in **HStack**, horizontal in **VStack**. Values are `"start"`, `"center"`,
`"end"`, `"fill"`, `"stretch"`, or a number from 0 to 1; horizontal stacks also accept
`"baseline"`. Omitted or `undefined` uses the parent's `align`.

```jsx
<VStack width={px(240)} align="stretch">
  <Text>This child receives the column width.</Text>
  <Text align-self="end">Right-aligned, at its natural width.</Text>
</VStack>
```

A child's own `align` still controls its contents, not its placement in the
parent stack. `align-self` does not inherit or pass through wrappers: put it on
the wrapping **Box**, **Frame**, or nested stack when that is the direct child. **TextRow**,
**TextCol**, and **TextStack** use the same rules for their element children.

`align="fill"` allocates the shared cross-axis size only to automatically sized
children. It respects explicit dimensions, child alignment overrides, and min/max limits;
any remaining cross-axis space stays at the end. `align="stretch"` imposes the
shared size even on explicitly sized or bounded children. **TextCol** defaults
to fill alignment, but measures its own width from content. A child's own `width="fill"`
still occupies an available width even when `align-self` opts out of the parent's
allocation; omit that width and use `align-self="end"` for a compact panel.

## Explicit flex

The immediate stack parent reads these props from each **direct child**:

| Child prop | Meaning |
|---|---|
| `basis` | Starting main-axis length, or `"auto"` for the explicit dimension/content basis; omitted uses the rules below |
| `grow` | Share of surplus; default `0` |
| `shrink` | Shortage weight, multiplied by original `basis`; default `0` |
| `align-self` | Cross-axis alignment override; defaults to the stack's `align` |
| `min-width` / `max-width`, etc. | Limits on the main-axis allocation |

The allocator reserves gaps, clamps bases, and distributes surplus or shortage.
Items at limits freeze while the rest receive the remaining allocation.
Insufficient shrinkage leaves overflow; a stack does not clip itself.

The basis is selected before distribution:

1. An explicit length basis wins, including `basis={0}`.
2. Otherwise, use the child's explicit width in a row or height in a column.
3. If still unsized, positive `grow` starts from zero when the stack has an
   available or exact main-axis budget.
4. Without such a budget, or with omitted/zero growth, measure the child's content.

`basis="auto"` skips the zero fallback: use the explicit main-axis dimension or
measure content. `width="fill"` supplies no fixed basis. Explicit length bases
take precedence; alignment does not choose a basis. Grow can enlarge a child's
final allocation beyond its measured starting width.

`grow={1}` alone therefore gives unsized children equal shares of the space after
gaps and fixed items, subject to limits. With `basis="auto"`, equal grow weights
add equal surplus to potentially different content widths. See
[Growth bases](../gallery/layout.md#stack_basis) for a comparison using the same labels.

An explicit `basis={0}` remains zero even during natural measurement, where content
can overflow a zero allocation. A maximum on the stack can supply an available
budget; a minimum alone retains natural bases before adding surplus space.

A stack reserves its gaps the way a **Box** reserves padding. Along the main axis,
a child's fractional width, basis, or limit refers to the stack length left after
gaps, so `width={0.5}` twice tiles a row exactly whatever the gap. A fractional
`gap` still refers to the full stack length, and cross-axis fractions are unchanged.
Fractional widths/bases/gaps require definite references.

With `wrap`, **HStack** uses the offered width as a percentage reference and chooses row breaks
using these same bases and limits. Each row reserves its own gaps and distributes
flex space independently. Supply a `basis` or `min-width` for growing cards to
control where they wrap. The stack's height follows the resulting rows; with
no finite width offer, wrapping leaves one natural row. Without explicit fill or
growth, its width hugs the widest row instead of retaining the entire offer.
**TextRow** and horizontal
**TextStack** support the same options.

Put flex on a wrapping **Box**, **Frame**, or nested stack when that wrapper is the
direct child. Flex props do not inherit or pass through wrappers.
[Spacer](../elements/layout.md#Spacer) has explicit zero-basis/grow-one defaults.

## Measurement and placement

The stack passes cross-axis offers inward and measures content only when a basis
or cross-axis allocation requires it. Finite main-axis offers supply a flex budget,
but the stack hugs what is used unless its own size or an exact allocation
establishes a larger frame.
On an entirely natural axis, children simply pack; an own minimum can also
provide room for explicit growth.

**Text** reflows at its allocated width. Stretch can require another child query:
a column selects its shared width before packing heights; a row selects height
after width allocation and text reflow. Selected sizes never become speculative
percentage references. Stretching children receive the exact cross-axis size;
eligible fill children receive that size clamped to their own limits.
Other children keep their usual sizing behavior.
A stretching column keeps its selected width if a non-stretch child later grows
wider during height allocation, reporting overflow instead of reflowing again.

Only baseline-aligned children contribute to the row's baseline group. The row
also accommodates non-baseline children's heights, and stretching siblings
receive a height that includes the baseline group's ascent and descent.

`justify`, `align`, and `align-self` position completed allocations. **Text**'s own `justify` is
separate. Distributed spacing only adds positive free space; center/end may
position overflowing content outside the frame.

There is no automatic grow/shrink for unsized graphics, no derived composite
aspect, and no common-cross-axis fitting search. Give a column of aspect figures
a width, give a row a height, or choose explicit flex allocations. See [Sizing](sizing.md).

## Example

```jsx
// Compare equal flex shares with a naturally sized item and a flexible Spacer.
<TextBox width="fill" padding={em(1.25)} background={lightgray}>
  <TextCol gap={em(0.75)}>
    <Text font-weight={bold}>Equal shares after the gap</Text>
    <HStack height={px(64)} gap={em(0.75)}>
      <Rect grow={1} fill={blue} stroke={none} />
      <Rect grow={1} fill={red} stroke={none} />
    </HStack>
    <Text font-weight={bold}>Content plus remaining space</Text>
    <HStack align="center">
      <Square width={px(48)} fill={blue} stroke={none} />
      <Spacer />
      <Text>At the far edge</Text>
    </HStack>
  </TextCol>
</TextBox>
```
