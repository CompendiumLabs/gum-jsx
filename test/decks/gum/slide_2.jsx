// The same Circle fits three different allocations without changing its aspect.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const slots = [
  { rect: [0.025, 0.28, 0.295, 0.67], color: blue, label: 'wide', x: 0.16 },
  { rect: [0.39, 0.12, 0.61, 0.758], color: teal, label: 'square', x: 0.5 },
  { rect: [0.785, 0.06, 0.905, 0.85], color: '#e77654', label: 'tall', x: 0.845 },
]

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 02</T>
  <T scale={1.95} font-weight={bold}>Layout follows shape.</T>
  <T scale={0.9} color={muted}>Offer a rectangle. Fill as much as possible. Keep the aspect.</T>
  <Group aspect={2.9}>
    {slots.map(({ rect, color, label, x }) =>
      <Group>
        <Rect rect={rect} fill="#e9e8e1" stroke={muted} stroke-width={1.2}
          stroke-dasharray={5} />
        <Circle rect={rect} fill={color} stroke={none} />
        <T rect={[x - 0.12, 0.925, x + 0.12, 0.995]} align="center"
          color={muted} font-family={mono}>{label}</T>
      </Group>
    )}
  </Group>
  <T scale={0.75} color={muted}>Same Circle. Different boxes. No distortion.</T>
</Slide>
