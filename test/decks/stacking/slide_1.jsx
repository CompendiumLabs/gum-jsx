// Stacking scenarios / 01. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack gap={1} {...rowStyle}>
  <Rect aspect={2} {...shapeStyle} />
  <Text {...textStyle}>Hi</Text>
</HStack>

const second = <HStack gap={1} {...rowStyle}>
  <Rect aspect={2} height={3} {...shapeStyle} />
  <Text {...textStyle}>Hi</Text>
</HStack>

return <Page n={1} title="A shape meets a text label." subtitle="Aspect describes a shape. Natural dimensions give it a size."
  footer={"Matching heights can be inferred. An explicit child size takes precedence."}>
  <Panel title="Shared height, inferred" stack={first} unit={1.35}
    code={"<HStack gap={1}>\n  <Rect aspect={2} />\n  <Text>Hi</Text>\n</HStack>"}
    note="The label is one em tall. The unsized 2:1 shape follows that height and becomes 2 × 1." />
  <Panel title="Different heights, explicit" stack={second} unit={1.35}
    code={"<HStack gap={1}>\n  <Rect aspect={2} height={3} />\n  <Text>Hi</Text>\n</HStack>"}
    note="The shape declares height 3, so its width is 6. Text keeps its one-em size; top alignment does not resize it." />
</Page>
