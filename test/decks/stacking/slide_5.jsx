// Stacking scenarios / 05. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack width={12} gap={1} {...rowStyle}>
  <Rect aspect={2} height={1} {...shapeStyle} />
  <Text {...textStyle}>Words wrap into lines.</Text>
</HStack>

const second = <HStack width={8} gap={1} {...rowStyle}>
  <Rect aspect={2} height={1} {...shapeStyle} />
  <Text {...textStyle}>Words wrap into lines.</Text>
</HStack>

return <Page n={5} title="Text wraps when the width changes." subtitle="A fixed 2 × 1 figure keeps its size while the paragraph uses the remaining width."
  footer={"Width is chosen first; then text wraps. A row does not resize fixed siblings to the final text height."}>
  <Panel title="Row width 12: text gets 9" stack={first} unit={1.1}
    code={"<HStack width={12} gap={1}>\n  <Rect aspect={2} height={1} />\n  <Text>Words wrap into lines.</Text>\n</HStack>"}
    note="The natural paragraph is too wide, so it reflows into the 9 units left after the figure and gap. Its em stays 1." />
  <Panel title="Row width 8: text gets 5" stack={second} unit={1.1}
    code={"<HStack width={8} gap={1}>\n  <Rect aspect={2} height={1} />\n  <Text>Words wrap into lines.</Text>\n</HStack>"}
    note="Five units produce more lines. The row grows taller. The figure stays 2 × 1 because its height is explicit." />
</Page>
