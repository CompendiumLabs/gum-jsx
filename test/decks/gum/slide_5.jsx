// The evaluator produces SVG; runtime packages make it useful in other places.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const outputs = [
  { label: 'Web / React', color: teal },
  { label: 'PNG / PDF', color: blue },
  { label: 'Terminal', color: '#e77654' },
]
// A three-column diagram in em; leave half a grid cell around the nodes.
const columnGap = 14, rowGap = 4
const diagramWidth = 3 * columnGap, diagramHeight = outputs.length * rowGap

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <Text scale={0.65} color={teal} font-family={mono}>GUM.JSX / 05</Text>
  <Text scale={1.95} color={ink} font-weight={bold}>Write once. Render anywhere.</Text>
  <Text scale={0.9} color={muted}>Keep the source. Export the picture.</Text>
  <Network xlim={[-columnGap / 2, 2.5 * columnGap]}
    ylim={[-diagramHeight / 2, diagramHeight / 2]} aspect={diagramWidth / diagramHeight}
    em={1} node-padding={0.7} node-border={0} node-rounded={12}
    edge-stroke-width={2} edge-arrow-size={0.35}>
    <Node id="source" pos={[0, 0]} fill={ink} justify="left">
      <TextCol gap={0.8}>
        <Text scale={0.75} font-family={mono} color="#e8f0f3">figure.jsx</Text>
        <Verbatim spacing={0.2} font-weight={regular} color="#9bb8c5">{`<Plot>
  <SymLine ... />
</Plot>`}</Verbatim>
      </TextCol>
    </Node>
    <Node id="svg" pos={[columnGap, 0]} fill="#ffffff" border={1.5} border-stroke="#d2ddd8" justify="left">
      <TextCol width={7} gap={0.8}>
        <Text scale={0.75} font-family={mono} color={teal}>SVG</Text>
        <Plot aspect={1.8} xlim={[0, 2*pi]} ylim={[-1.2, 1.2]}
          xticks={[]} yticks={[]} axis-stroke={muted}>
          <SymLine fy={sin} stroke={teal} stroke-width={3} />
        </Plot>
      </TextCol>
    </Node>
    <Edge start="source" end="svg" stroke={muted} fill={muted} />
    {outputs.map(({ label, color }, i) =>
      <Node id={label} pos={[2 * columnGap, rowGap * (i - (outputs.length - 1) / 2)]}
        fill={color} fill-opacity={0.12}>
        <Text color={ink}>{label}</Text>
      </Node>
    )}
    {outputs.map(({ label, color }) =>
      <Edge start="svg" end={label} start-side="e" end-side="w" stroke={color} fill={color} />
    )}
  </Network>
  <Text scale={0.75} color={teal} font-family={mono}>gum figure.jsx -o figure.svg</Text>
</Slide>
