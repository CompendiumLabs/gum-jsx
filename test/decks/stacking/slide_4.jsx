// Stacking scenarios / 04. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack gap={1} {...rowStyle}>
  <Rect width={6} height={3}
    aspect={2} {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

const second = <HStack gap={1} {...rowStyle}>
  <Rect width={6} height={3}
    aspect={1} {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

return <Page n={4} title="Match the shape to its slot." subtitle="The reserved rectangle and the visible drawing have separate dimensions."
  footer={"Dashed child outlines show allocations. Filled geometry shows what actually draws."}>
  <Panel title="6 × 3 slot, 2:1 drawing" stack={first} unit={1.35}
    code={"<HStack gap={1}>\n  <Rect width={6} height={3}\n    aspect={2} />\n  <Text width={4}>Hi</Text>\n</HStack>"}
    note="The drawing matches its slot aspect and fills all 6 × 3 units. The label starts after the full slot and gap." />
  <Panel title="6 × 3 slot, 1:1 drawing" stack={second} unit={1.35}
    code={"<HStack gap={1}>\n  <Rect width={6} height={3}\n    aspect={1} />\n  <Text width={4}>Hi</Text>\n</HStack>"}
    note="The square draws at 3 × 3 inside the same 6 × 3 slot. The empty room remains reserved; the label does not move." />
</Page>
