// One component, reused by two aspect-aware layout containers.
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

return <Page n={3} title="Compose. Reuse. Repeat." subtitle="A component is a figure. A layout is a component.">
  <TextRow even gap={0} spacing={0.04} valign="center">
    <Box aspect={1.4} rounded={12} padding={1} fill={ink}>
      <TextCol gap={0.8}>
        <T scale={0.9} font-family={mono} color="#9bb8c5">One reusable tile</T>
        <Verbatim spacing={0.2} font-weight={regular} color="#e8f0f3">{code}</Verbatim>
      </TextCol>
    </Box>
    <TextCol gap={0.6}>
      <T scale={0.75} color={muted} font-family={mono}>HStack</T>
      <HStack spacing={0.1}>
        {colors.slice(0, 3).map(color => <Tile color={color} />)}
      </HStack>
      <T scale={0.75} color={muted} font-family={mono}>Grid</T>
      <Grid cols={3} spacing={0.12}>
        {colors.map(color => <Tile color={color} />)}
      </Grid>
    </TextCol>
  </TextRow>
  <T scale={0.75} color={muted}>Map over data. Nest layouts. Let proportions propagate.</T>
</Page>
