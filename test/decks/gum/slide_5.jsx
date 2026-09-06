// The evaluator produces SVG; runtime packages make it useful in other places.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const outputs = [
  { y: 0.15, label: 'Web / React', color: teal },
  { y: 0.5, label: 'PNG / PDF', color: blue },
  { y: 0.85, label: 'Terminal', color: '#e77654' },
]

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <Text scale={0.65} color={teal} font-family={mono}>GUM.JSX / 05</Text>
  <Text scale={1.95} color={ink} font-weight={bold}>Write once. Render anywhere.</Text>
  <Text scale={0.9} color={muted}>Keep the source. Export the picture.</Text>
  <Group aspect={2.9}>
    <Rect rect={[0, 0.12, 0.26, 0.88]} rounded={12} fill={ink} stroke={none} />
    <Text rect={[0.025, 0.2, 0.235, 0.28]} align="left"
      font-family={mono} color="#e8f0f3">figure.jsx</Text>
    {['<Plot>', '<SymLine ... />', '</Plot>'].map((line, i) =>
      <Text rect={[0.025, 0.4 + i * 0.12, 0.235, 0.46 + i * 0.12]}
        align="left" font-family={mono} color={i === 1 ? '#72d7dc' : '#9bb8c5'}>{line}</Text>
    )}
    <Arrow points={[[0.28, 0.5], [0.355, 0.5]]} stroke={muted} fill={muted}
      stroke-width={2} arrow-size={0.06} />
    <Rect rect={[0.375, 0.12, 0.615, 0.88]} rounded={12} fill="#ffffff"
      stroke="#d2ddd8" stroke-width={1.5} />
    <Text rect={[0.405, 0.2, 0.585, 0.28]} align="left"
      font-family={mono} color={teal}>SVG</Text>
    <Plot rect={[0.415, 0.4, 0.575, 0.75]} aspect={1.8}
      xlim={[0, 2*pi]} ylim={[-1.2, 1.2]} xticks={[]} yticks={[]}
      axis-stroke={muted}>
      <SymLine fy={sin} stroke={teal} stroke-width={3} />
    </Plot>
    {outputs.map(({ y, label, color }) =>
      <Group>
        <Arrow points={[[0.635, 0.5], [0.755, y]]} stroke={color} fill={color}
          stroke-width={2} arrow-size={0.06} />
        <Rect rect={[0.78, y - 0.125, 1, y + 0.125]} rounded={10}
          fill={color} fill-opacity={0.12} stroke={none} />
        <Text rect={[0.795, y - 0.04, 0.985, y + 0.04]} align="center" color={ink}>{label}</Text>
      </Group>
    )}
  </Group>
  <Text scale={0.75} color={teal} font-family={mono}>gum figure.jsx -o figure.svg</Text>
</Slide>
