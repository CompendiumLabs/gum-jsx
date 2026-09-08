// The same Circle fits three different allocations without changing its aspect.
const slots = [
  { aspect: 2.5, color: blue, label: 'wide' },
  { aspect: 1, color: teal, label: 'square' },
  { aspect: 0.5, color: '#e77654', label: 'tall' },
]

return <Page n={2} title="Layout follows shape." subtitle="Offer a rectangle. Fill as much as possible. Keep the aspect.">
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
</Page>
