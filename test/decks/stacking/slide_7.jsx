// Stacking scenarios / 07. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <VStack width={8} gap={1} justify="left">
  <Rect aspect={2} {...shapeStyle} />
  <Text {...textStyle}>Words wrap into lines.</Text>
</VStack>

const second = <VStack width={8} gap={1} justify="left">
  <Rect aspect={2} height={1} {...shapeStyle} />
  <Text {...textStyle}>Words wrap into lines.</Text>
</VStack>

return <Page n={7} title="A column shares width." subtitle="Turn the stacking direction: width becomes the common cross dimension."
  footer={"Rows share height; columns offer width. Measured children retain their content scale."}>
  <Panel title="Unsized figure follows width" stack={first} unit={0.72}
    code={"<VStack width={8} gap={1} justify=\"left\">\n  <Rect aspect={2} />\n  <Text>Words wrap into lines.</Text>\n</VStack>"}
    note="The figure receives width 8 and becomes 8 × 4. Text wraps at width 8. The column adds their heights and the gap." />
  <Panel title="Explicit height stays fixed" stack={second} unit={0.72}
    code={"<VStack width={8} gap={1} justify=\"left\">\n  <Rect aspect={2} height={1} />\n  <Text>Words wrap into lines.</Text>\n</VStack>"}
    note="The figure keeps height 1 and draws at 2 × 1 inside an 8-wide slot. Text wraps identically; the column is shorter." />
</Page>
