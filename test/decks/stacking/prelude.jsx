// Stacking scenarios: the deck's prelude (see index.json). Every slide is
// evaluated with these declarations in scope: the palette and the shared
// styles of the example stacks, the Diagram that draws a finished stack with
// its allocations, the Panel around one example, and the Page around two.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780'
const teal = '#137f89', coral = '#c45d3d'
const colors = [teal, coral]
const shapeStyle = { fill: teal, stroke: none }
const secondShapeStyle = { fill: coral, stroke: none }
const textStyle = { color: coral, font_family: mono, font_weight: regular, gap: 0 }
const rowStyle = { justify: 'left', valign: 'top' }
const SLIDES = 7

const number = value => String(Math.round(value * 100) / 100)
const dimensions = (width, height) => `${number(width)} × ${number(height)}`
const pad = n => String(n).padStart(2, '0')

// body text in the slide's ink, and a small monospace caption
const T = ({ children, ...args }) => <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const Mono = ({ children, ...args }) => <T font-family={mono} color={muted} scale={0.5} {...args}>{children}</T>

// The finished stack at `unit` em per layout unit, with the box each child
// was allocated outlined in its color and labeled with its size. The stack
// has laid itself out already: its em is its box and its children's rects are
// their allocations (there is no ink overhang in these examples), so the
// drawing is the stack placed at its own size in a frame of its own units,
// with room below (or beside, for a column) for the labels. The labels are
// 0.45 em on the slide whatever the unit.
const Diagram = ({ stack, unit }) => {
  const { width, height } = stack.em
  const slots = stack.children.map(child => child.spec.rect)
  const vertical = stack instanceof VStack
  const [W, H] = vertical ? [width + 6, height] : [width, height + 1]
  const size = 0.45 / unit
  const Size = ({ pos, color, w, h }) =>
    <Text pos={pos} ysize={size} align="left" font-family={mono} color={color}>{dimensions(w, h)}</Text>
  return <Group coord={[0, 0, W, H]} aspect={W / H} width={W * unit}>
    <Rect rect={[0, 0, width, height]} fill="#f1f4f3" stroke={muted} stroke-width={0.85} stroke-dasharray={4} />
    {stack.clone({ rect: [0, 0, width, height] })}
    {slots.map((rect, i) => <Rect rect={rect} fill={none} stroke={colors[i]} stroke-width={1.1} stroke-dasharray={3} />)}
    {slots.map(([left, top, right, bottom], i) => <Size color={colors[i]} w={right - left} h={bottom - top}
      pos={vertical ? [width + 0.5, (top + bottom) / 2] : [left, height + 0.55]} />)}
  </Group>
}

// One example: its title, the code that builds it, the diagram, the stack's
// size and a note, in a framed column
const Panel = ({ title, code, stack, note, unit = 1.35 }) =>
  <Box fill="#ffffff" border={0.8} border-stroke="#d9e1df" rounded={8} padding={1} height={17} justify="left" valign="top">
    <TextCol gap={0.55}>
      <T scale={0.9} font-weight={bold}>{title}</T>
      <Verbatim scale={0.52} color={ink} font-weight={regular}>{code}</Verbatim>
      <Mono>ACTUAL LAYOUT / ALLOCATED CHILD BOXES</Mono>
      <Diagram stack={stack} unit={unit} />
      <Mono scale={0.58}>{`stack = ${dimensions(stack.em.width, stack.em.height)} layout units`}</Mono>
      <T scale={0.74}>{note}</T>
    </TextCol>
  </Box>

// A slide: the running head, the title and the subtitle, the two panels side
// by side, and a footer
const Page = ({ n, title, subtitle, footer, children }) =>
  <Slide background={paper} border={0} margin={0} padding={0.06}
    width={48} gap={0.6} valign="top" overflow="error">
    <Mono scale={0.55} color={teal}>{`STACKING / ${pad(n)} OF ${pad(SLIDES)} / UNIFIED METRICS`}</Mono>
    <T scale={1.4} font-weight={bold}>{title}</T>
    <T scale={0.76} color={muted}>{subtitle}</T>
    <Mono>Dashed outlines = allocated boxes. Numbers = width × height.</Mono>
    <HStack even spacing={0.03} valign="top">{children}</HStack>
    <T scale={0.57} color={muted}>{footer}</T>
  </Slide>
