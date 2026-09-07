// Stacking scenarios / 03. Read README.md for the deck and render commands.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780'
const teal = '#137f89', coral = '#c45d3d'
const colors = [teal, coral]
const shapeStyle = { fill: teal, stroke: none }
const secondShapeStyle = { fill: coral, stroke: none }
const textStyle = { color: coral, font_family: mono, font_weight: regular, gap: 0 }
const rowStyle = { justify: 'left', valign: 'top' }

// Compare these two real layouts. Shared styles only set color, font, and alignment.
const first = <HStack width={12} gap={1} {...rowStyle}>
  <Rect aspect={2} {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

const second = <HStack width={12} gap={1} {...rowStyle}>
  <Rect {...shapeStyle} />
  <Text width={4} {...textStyle}>Hi</Text>
</HStack>

// Each slide is standalone. Only the presentation helpers are repeated.
// The examples above are real stacks. The helpers below freeze their already
// computed layouts in drawing coordinates, so the slide cannot reflow them.
const number = value => String(Math.round(value * 100) / 100)
const dimensions = (width, height) => `${number(width)} × ${number(height)}`

const Label = ({ children, x, y, width, size = 0.7, color = ink, weight = regular, family = sans }) => {
  const text = <Text width={width / size} scale={size} gap={0}
    font-family={family} font-weight={weight} color={color} justify="left">{children}</Text>
  return text.clone({ rect: [x, y, x + text.em.width, y + text.em.height] })
}

const Code = ({ children, x, y }) => {
  const text = <Verbatim scale={0.52} gap={0} color={ink} font-weight={regular}>{children}</Verbatim>
  return text.clone({ rect: [x, y, x + text.em.width, y + text.em.height] })
}

const Diagram = ({ stack, unit }) => {
  const { width, height } = stack.em
  const slots = stack.children.map(child => child.spec.rect)
  const vertical = stack instanceof VStack
  const diagramWidth = vertical ? width + 6 : width
  const coord = [0, 0, diagramWidth, height + 0.9]
  // For these examples there is no ink overhang: each immediate child's rect
  // is its allocated layout box, including any wrapper around fitted content.
  return <Group coord={coord} aspect={diagramWidth / (height + 0.9)}
    rect={[1.2, 6.7, 1.2 + diagramWidth * unit, 6.7 + (height + 0.9) * unit]}>
    <Rect rect={[0, 0, width, height]} fill="#f1f4f3" stroke={muted}
      stroke-width={0.85} stroke-dasharray={4} />
    {stack.clone({ rect: [0, 0, width, height] })}
    {slots.map((rect, i) => <Rect rect={rect} fill={none} stroke={colors[i]}
      stroke-width={1.1} stroke-dasharray={3} />)}
    {slots.map(([left, top, right, bottom], i) => {
      // Column labels sit beside their cells instead of sharing one baseline.
      const x = vertical ? width + 0.5 : left
      const y = vertical ? (top + bottom) / 2 - 0.3 : height + 0.3
      const labelWidth = vertical ? 5.5 : Math.max(right - left, 2.1)
      const size = vertical ? 0.65 : 0.4
      return <Label x={x} y={y} width={labelWidth} size={size} color={colors[i]} family={mono}>
        {dimensions(right - left, bottom - top)}
      </Label>
    })}
  </Group>
}

const Panel = ({ x, title, code, stack, note, unit = 1.35 }) =>
  <Group rect={[x, 7, x + 21.5, 24.4]} coord={[0, 0, 21.5, 17.4]} aspect={21.5 / 17.4}>
    <Rect fill="#ffffff" stroke="#d9e1df" stroke-width={0.8} rounded={8} />
    <Label x={1.2} y={0.8} width={19.1} size={0.9} weight={bold}>{title}</Label>
    <Code x={1.2} y={2.3}>{code}</Code>
    <Label x={1.2} y={5.8} width={19.1} size={0.48} color={muted} family={mono}>
      ACTUAL LAYOUT / ALLOCATED CHILD BOXES
    </Label>
    <Diagram stack={stack} unit={unit} />
    <Label x={1.2} y={12.7} width={19.1} size={0.58} color={muted} family={mono}>
      {`stack = ${dimensions(stack.em.width, stack.em.height)} layout units`}
    </Label>
    <Label x={1.2} y={14} width={19.1} size={0.74}>{note}</Label>
  </Group>

return <Slide background={paper} border={0} margin={0} padding={0}
  width={48} gap={0} overflow="error">
  <Group coord={[0, 0, 48, 27]} aspect={16 / 9}>
    <Label x={2} y={1.25} width={44} size={0.55} color={teal} family={mono}>
      STACKING / 03 OF 07 / UNIFIED METRICS
    </Label>
    <Label x={2} y={2.55} width={44} size={1.4} weight={bold}>An aspect changes the allocation.</Label>
    <Label x={2} y={4.55} width={44} size={0.76} color={muted}>The same text and row budget, with one property removed from the shape.</Label>
    <Label x={2} y={6} width={44} size={0.5} color={muted} family={mono}>
      Dashed outlines = allocated boxes. Numbers = width × height.
    </Label>
    <Panel x={2} title="Aspect set: pack naturally" stack={first} unit={1.35}
      code={"<HStack width={12} gap={1}>\n  <Rect aspect={2} />\n  <Text width={4}>Hi</Text>\n</HStack>"}
      note="Text supplies height 1. The 2:1 shape takes width 2. Five units of the row stay empty without a growth request." />
    <Panel x={24.5} title="No aspect: fill the remainder" stack={second} unit={1.35}
      code={"<HStack width={12} gap={1}>\n  <Rect />\n  <Text width={4}>Hi</Text>\n</HStack>"}
      note="The unsized, aspect-free Rect is flexible. It receives 12 − 4 − 1 = 7 units and fills that 7 × 1 box." />
    <Label x={2} y={25.3} width={44} size={0.57} color={muted}>{"A ratio alone does not request growth. Geometry without a main size or aspect is flexible."}</Label>
  </Group>
</Slide>
