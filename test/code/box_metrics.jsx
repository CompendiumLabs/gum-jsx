// Boxing changes the padding, not the content's scale or anchor. Ink can
// overhang its layout advance, including a formula with zero advance.
const teal = '#137f89', coral = '#e77654'
const examples = [
  ['Scaled text', <Text scale={1.5}>Hello</Text>],
  ['Tall ink', <Latex scale={1.5}>{String.raw`\smash{\frac{a}{b}}`}</Latex>],
  ['Left and right overhang', <Latex scale={1.5}>{String.raw`\llap{x}y\rlap{z}`}</Latex>],
  ['Zero advance', <Latex scale={1.5}>{String.raw`\smash{\rlap{x}}`}</Latex>],
]
const Row = ({children}) => <HStack width={26} sizes={[1, 1, 1]} gap={1} valign="anchor">
  {children}
</HStack>

return <Box margin={1}><VStack gap={1} justify="left">
  <Text scale={1.3}>Metrics through boxes</Text>
  <Row>
    <Text>Bare</Text>
    <Text>Padded box</Text>
    <Text>Nested boxes</Text>
  </Row>
  {examples.map(([label, content]) => <VStack gap={0.5} justify="left">
    <Text scale={0.65}>{label}</Text>
    <Row>
      {content}
      <Box padding={0.15} border border-stroke={teal}>{content}</Box>
      <Box padding={0.1} margin={0.05} border border-stroke={coral}>
        <Box padding={[0.2, 0.1, 0.05, 0.3]} border border-stroke={teal}>{content}</Box>
      </Box>
    </Row>
  </VStack>)}
</VStack></Box>
