// Stacking scenarios / 02. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack width={12} gap={1} {...rowStyle}>
  <Rect aspect={2} {...shapeStyle} />
  <Rect aspect={2} {...secondShapeStyle} />
</HStack>

const second = <HStack width={12} gap={1} {...rowStyle}>
  <Rect aspect={2} {...shapeStyle} />
  <Rect aspect={0.5} {...secondShapeStyle} />
</HStack>

return <Page n={2} title="Two shapes, equal or unequal aspects." subtitle="With a width budget, aspect-only siblings solve for a common height."
  footer={"Both panels use the same diagram scale. Width = aspect × common height."}>
  <Panel title="Matching aspects: 2 and 2" stack={first} unit={1.1}
    code={"<HStack width={12} gap={1}>\n  <Rect aspect={2} />\n  <Rect aspect={2} />\n</HStack>"}
    note="After the gap, 11 units remain. Common height = 11 / (2 + 2) = 2.75. Each shape gets width 5.5." />
  <Panel title="Different aspects: 2 and 0.5" stack={second} unit={1.1}
    code={"<HStack width={12} gap={1}>\n  <Rect aspect={2} />\n  <Rect aspect={0.5} />\n</HStack>"}
    note="Common height = 11 / (2 + 0.5) = 4.4. Widths become 8.8 and 2.2. Different aspects still share a height." />
</Page>
