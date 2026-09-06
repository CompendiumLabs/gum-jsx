// One component, reused by two aspect-aware layout containers.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const colors = [teal, blue, '#e77654', '#d5a33d', '#8f76b0', '#678e78']
const Tile = ({ color, ...args }) => <Group aspect={1} {...args}>
  <Square rounded fill={color} />
  <Circle size={0.5} fill={paper} />
</Group>
const code = [
  [0, 'const Tile = ({ color }) =>'],
  [1, '<Group aspect={1}>'],
  [2, '<Square rounded fill={color} />'],
  [2, '<Circle size={0.5} fill={paper} />'],
  [1, '</Group>'],
]

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 03</T>
  <T scale={1.95} font-weight={bold}>Compose. Reuse. Repeat.</T>
  <T scale={0.9} color={muted}>A component is a figure. A layout is a component.</T>
  <Group aspect={2.9}>
    <Rect rect={[0, 0, 0.49, 1]} rounded={12} fill={ink} stroke={none} />
    <T rect={[0.035, 0.07, 0.45, 0.135]} align="left"
      font-family={mono} color="#9bb8c5">One reusable tile</T>
    {code.map(([indent, line], i) =>
      <T rect={[0.035 + indent * 0.016, 0.25 + i * 0.12, 0.47, 0.305 + i * 0.12]}
        align="left" font-family={mono} color="#e8f0f3">{line}</T>
    )}
    <T rect={[0.55, 0.005, 0.96, 0.065]} align="left" color={muted} font-family={mono}>HStack</T>
    <HStack rect={[0.55, 0.1, 0.98, 0.45]} spacing={0.1}>
      {colors.slice(0, 3).map(color => <Tile color={color} />)}
    </HStack>
    <T rect={[0.55, 0.52, 0.96, 0.58]} align="left" color={muted} font-family={mono}>Grid</T>
    <Grid rect={[0.55, 0.62, 0.98, 0.99]} cols={3} spacing={0.12}>
      {colors.map(color => <Tile color={color} />)}
    </Grid>
  </Group>
  <T scale={0.75} color={muted}>Map over data. Nest layouts. Let proportions propagate.</T>
</Slide>
