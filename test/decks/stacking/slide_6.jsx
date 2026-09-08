// Stacking scenarios / 06. The helpers and the Page are in prelude.jsx.

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack width={12} height={3} gap={1} {...rowStyle}>
  <Text grow={1} {...textStyle} color={teal}>Hi</Text>
  <Text grow={1} {...textStyle}>Long label</Text>
</HStack>

const second = <HStack width={12} height={3} gap={1} {...rowStyle}>
  <Text width={2} {...textStyle} color={teal}>Hi</Text>
  <Text grow={1} {...textStyle}>Long label</Text>
</HStack>

return <Page n={6} title="Choose the width, keep the em." subtitle="Natural and explicit dimensions come first. Growth receives the remaining space."
  footer={"A declared width uses layout units. grow divides what remains after natural children and gaps."}>
  <Panel title="grow: equal child weights" stack={first} unit={1.35}
    code={"<HStack width={12} height={3} gap={1}>\n  <Text grow={1}>Hi</Text>\n  <Text grow={1}>Long label</Text>\n</HStack>"}
    note="Each gets wrapping width 5.5. Both keep a one-em font; the longer label wraps. Height 3 belongs to the row." />
  <Panel title="width + grow" stack={second} unit={1.35}
    code={"<HStack width={12} height={3} gap={1}>\n  <Text width={2}>Hi</Text>\n  <Text grow={1}>Long label</Text>\n</HStack>"}
    note="The first child takes 2 em. After the 1-em gap, the second gets 9 em. Both keep the same font size." />
</Page>
