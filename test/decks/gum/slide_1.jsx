// gum.jsx in five slides. Each file is standalone; all artwork is native JSX.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const code = [
  [0, '<Plot'],
  [1, 'xlim={[0, 2*pi]} grid>'],
  [1, '<SymLine fy={sin}'],
  [2, 'stroke={blue} />'],
  [0, '</Plot>'],
]

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 01</T>
  <T scale={1.95} font-weight={bold}>Pictures, written.</T>
  <T scale={0.9} color={muted}>Plots, diagrams, and math. Composed in JSX.</T>
  <Group aspect={2.9}>
    <Rect rect={[0, 0, 0.49, 1]} rounded={12} fill={ink} stroke={none} />
    <T rect={[0.035, 0.07, 0.45, 0.135]} align="left"
      font-family={mono} color="#9bb8c5">figure.jsx</T>
    {code.map(([indent, line], i) =>
      <T rect={[0.035 + indent * 0.022, 0.26 + i * 0.12, 0.465, 0.33 + i * 0.12]}
        align="left" font-family={mono} color={i === 3 ? '#72d7dc' : '#e8f0f3'}>{line}</T>
    )}
    <Arrow points={[[0.51, 0.5], [0.58, 0.5]]} stroke={teal} fill={teal}
      stroke-width={2} arrow-size={0.06} />
    <Plot rect={[0.62, 0.12, 0.99, 0.88]} aspect={1.5}
      xlim={[0, 2*pi]} ylim={[-1.2, 1.2]} margin={[0.17, 0.12]}
      xticks={[[0, '0'], [pi, 'π'], [2*pi, '2π']]} yticks={[-1, 0, 1]} grid
      grid-stroke="#d9dedb" axis-stroke={muted} axis-label-color={ink} axis-label-size={2.2}>
      <SymLine fy={sin} stroke={blue} stroke-width={3.5} />
    </Plot>
  </Group>
  <T scale={0.75} color={muted}>Tweak a function. Redraw the figure.</T>
</Slide>
