// The same Circle fits three different allocations without changing its aspect.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>
const slots = [
  { aspect: 2.5, color: blue, label: 'wide' },
  { aspect: 1, color: teal, label: 'square' },
  { aspect: 0.5, color: '#e77654', label: 'tall' },
]

return <Slide background={paper} border={0} margin={0} padding={0.07}
  em={0.044} gap={0.65} valign="top" overflow="error">
  <T scale={0.65} color={teal} font-family={mono}>GUM.JSX / 02</T>
  <T scale={1.95} font-weight={bold}>Layout follows shape.</T>
  <T scale={0.9} color={muted}>Offer a rectangle. Fill as much as possible. Keep the aspect.</T>
  <TextRow gap={1.5}>
    {slots.map(({ aspect, color, label }) =>
      <TextFigure height={10} gap={0.6} justify="center"
        caption={<T scale={0.75} color={muted} font-family={mono}>{label}</T>}>
        <Box aspect={aspect} fill="#e9e8e1" border={1.2}
          border-stroke={muted} border-stroke-dasharray={5}>
          <Circle fill={color} stroke={none} />
        </Box>
      </TextFigure>
    )}
  </TextRow>
  <T scale={0.75} color={muted}>Same Circle. Different boxes. No distortion.</T>
</Slide>
