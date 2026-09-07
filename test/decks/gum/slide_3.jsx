// One component, reused by two aspect-aware layout containers.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const colors = [teal, blue, '#e77654', '#d5a33d', '#8f76b0', '#678e78']
const Tile = ({ color }) => <Box rounded padding={0.5} fill={color}>
  <Circle stroke={none} fill={paper} />
</Box>
const code = `const Tile = ({ color }) =>
  <Box rounded padding={0.5}
    fill={color}>
    <Circle stroke={none}
      fill={paper} />
  </Box>`

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 03</T>
  <T scale={1.95} font-weight={bold}>Compose. Reuse. Repeat.</T>
  <T scale={0.9} color={muted}>A component is a figure. A layout is a component.</T>
  <TextRow grow={1} sizes={[1, 1]} gap={1.5} valign="center">
    <Box fit aspect={1.4} rounded={12} padding={0.12} fill={ink}>
      <TextCol gap={0.8}>
        <T scale={0.9} font-family={mono} color="#9bb8c5">One reusable tile</T>
        <Verbatim spacing={0.2} font-weight={regular} color="#e8f0f3">{code}</Verbatim>
      </TextCol>
    </Box>
    <TextCol gap={0.6}>
      <T scale={0.75} color={muted} font-family={mono}>HStack</T>
      <HStack grow={1} spacing={0.1}>
        {colors.slice(0, 3).map(color => <Tile color={color} />)}
      </HStack>
      <T scale={0.75} color={muted} font-family={mono}>Grid</T>
      <Grid grow={2} cols={3} spacing={0.12}>
        {colors.map(color => <Tile color={color} />)}
      </Grid>
    </TextCol>
  </TextRow>
  <T scale={0.75} color={muted}>Map over data. Nest layouts. Let proportions propagate.</T>
</Slide>
