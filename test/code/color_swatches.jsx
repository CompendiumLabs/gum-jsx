// oxocarbon.nvim — realized palette (dark variant)
// values extracted by loading the colorscheme in headless nvim

const dim   = '#525252'
const rule  = '#393939'

const hgap = 1.5

const rows = [
  ['base00', '#161616', 'background'],
  ['base01', '#262626', 'CursorLine, Pmenu, ColorColumn'],
  ['base02', '#393939', 'Visual, PmenuSel bg, MatchParen'],
  ['base03', '#525252', 'comments, LineNr'],
  ['base04', '#d0d0d0', 'Normal foreground'],
  ['base05', '#f2f2f2', 'NormalFloat fg'],
  ['base06', '#ffffff', 'brightest'],
  ['base07', '#08bdba', 'teal'],
  ['base08', '#3ddbd9', 'cyan'],
  ['base09', '#78a9ff', 'blue'],
  ['base10', '#ee5396', 'crimson'],
  ['base11', '#33b1ff', 'sky blue'],
  ['base12', '#ff7eb6', 'pink'],
  ['base13', '#42be65', 'green'],
  ['base14', '#be95ff', 'purple'],
  ['base15', '#82cfff', 'pale blue'],
  ['blend',  '#131313', 'float backgrounds'],
]

const W = 33, CSLOT = 4, CHEX = 4.8, CSWATCH = 3

const Row = ({ slot, hex, role, ...attr }) =>
  <TextRow width={W} gap={hgap} {...attr}>
    <Text width={CSLOT} font-family={mono}>{slot}</Text>
    <Text width={CHEX} font-family={mono} color={dim}>{hex}</Text>
    <Rectangle width={CSWATCH} rounded={3} stroke={rule} fill={hex} />
    <Text>{role}</Text>
  </TextRow>

const Head = ({ ...attr }) =>
  <TextRow width={W} gap={hgap} {...attr}>
    <Text width={CSLOT} font-weight={bold} color={dim}>Slot</Text>
    <Text width={CHEX} font-weight={bold} color={dim}>Hex</Text>
    <Text width={CSWATCH} font-weight={bold} color={dim}>Color</Text>
    <Text font-weight={bold} color={dim}>Role</Text>
  </TextRow>

return <Box padding={1.5} margin={0.25}>
  <TextCol width={W}>
    <Text scale={2} font-weight={bold}>oxocarbon — dark palette</Text>
    <Spacer height={0.5} />
    <VStack gap={0.2}>
      <Head />
      <HLine height={0} fill={rule} stroke-width={3} />
    </VStack>
    <VStack gap={0.5}>
      {rows.map(([ slot, hex, role ]) =>
        <Row slot={slot} hex={hex} role={role} />
      )}
    </VStack>
  </TextCol>
</Box>
