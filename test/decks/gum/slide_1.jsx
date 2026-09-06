// gum.jsx in five slides. Each file is standalone; all artwork is native JSX.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const code = `<Plot
  xlim={[0, 2*pi]} grid>
  <SymLine fy={sin}
    stroke={blue} />
</Plot>`

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 01</T>
  <T scale={1.95} font-weight={bold}>Pictures, written.</T>
  <T scale={0.9} color={muted}>Plots, diagrams, and math. Composed in JSX.</T>
  <HStack spacing={0.05}>
    <Box aspect={1.4} rounded={12} padding={0.12} fill={ink}>
      <TextCol gap={0.8}>
        <T scale={0.75} font-family={mono} color="#9bb8c5">figure.jsx</T>
        <Verbatim spacing={0.2} font-weight={regular} color="#e8f0f3">{code}</Verbatim>
      </TextCol>
    </Box>
    <Arrow stack-size={0.08} aspect={3} points={[[0, 0.5], [1, 0.5]]}
      stroke={teal} fill={teal} stroke-width={2} arrow-size={0.35} />
    <Plot aspect={1.5}
      xlim={[0, 2*pi]} ylim={[-1.2, 1.2]} margin={[0.17, 0.12]}
      xticks={[[0, '0'], [pi, 'π'], [2*pi, '2π']]} yticks={[-1, 0, 1]} grid
      grid-stroke="#d9dedb" axis-stroke={muted} axis-label-color={ink} axis-label-size={2.2}>
      <SymLine fy={sin} stroke={blue} stroke-width={3.5} />
    </Plot>
  </HStack>
  <T scale={0.75} color={muted}>Tweak a function. Redraw the figure.</T>
</Slide>
