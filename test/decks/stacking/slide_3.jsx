// Stacking scenarios / 03. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack width={12} gap={1} {...rowStyle}>
  <Rect aspect={2} {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

const second = <HStack width={12} gap={1} {...rowStyle}>
  <Rect {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

return <Page n={3} title="An aspect changes the allocation." subtitle="The same text and row budget, with one property removed from the shape."
  footer={"A ratio alone does not request growth. Geometry without a main size or aspect is flexible."}>
  <Panel title="Aspect set: pack naturally" stack={first} unit={1.35}
    code={"<HStack width={12} gap={1}>\n  <Rect aspect={2} />\n  <Text width={4}>Hi</Text>\n</HStack>"}
    note="Text supplies height 1. The 2:1 shape takes width 2. Five units of the row stay empty without a growth request." />
  <Panel title="No aspect: fill the remainder" stack={second} unit={1.35}
    code={"<HStack width={12} gap={1}>\n  <Rect />\n  <Text width={4}>Hi</Text>\n</HStack>"}
    note="The unsized, aspect-free Rect is flexible. It receives 12 − 4 − 1 = 7 units and fills that 7 × 1 box." />
</Page>
