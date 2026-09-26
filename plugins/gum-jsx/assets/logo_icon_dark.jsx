const size = 512
const background = '#1f1f1f'
const foreground = '#ffffff'

const gap = [
  [-0.20625, 0.2409375],
  [0.99375, 0.5215625],
  [1.20625, 0.7590625],
  [0.00625, 0.4784375],
]

const bands = [
  [[0.15875, 0.348125], [0.83875, 0.5071875], [0.86125, 0.5321875], [0.18125, 0.373125]],
  [[0.00875, 0.3546875], [0.93875, 0.5721875], [0.96125, 0.596875], [0.03125, 0.379375]],
  [[0.13875, 0.4265625], [0.82875, 0.5878125], [0.85125, 0.6128125], [0.16125, 0.45125]],
  [[0.19875, 0.481875], [0.96875, 0.6621875], [0.99125, 0.686875], [0.22125, 0.506875]],
]

return <Svg width={px(size)} height={px(size)}>
  <Box padding={0.03} stroke={none}>
    <Box background={background} border-radius={0.2} clip>
      <Group>
        <Circle x={0.5} y={0.5} anchor="center" width={0.45375} fill={foreground} />
        <Circle x={0.62} y={0.3078125} anchor="center" width={0.07} fill={background} />
        <Polygon points={gap} fill={background} />
        {bands.map(vertices => (
          <Polygon points={vertices} fill={foreground} />
        ))}
      </Group>
    </Box>
  </Box>
</Svg>
