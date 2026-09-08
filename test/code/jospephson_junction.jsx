// Josephson Junction

const navy  = '#2d3748'
const steel = '#3b6ea5'
const ice   = '#a8c8e8'
const sand  = '#e0c088'
const cream = '#f7f4ee'
const rose  = '#9e6060'
const sage  = '#4f8a6b'

// geometry
const xL = 0.07, xB1 = 0.455, xB2 = 0.545, xR = 0.93
const blkT = 0.42, blkB = 0.74
const yc = 0.21, amp = 0.10
const kap = 11, w = 2*pi * 4 / (xB1 - xL)

// order parameter: oscillating in the metal, evanescent in the barrier
const env = (x) =>
  x < xB1 ? amp :
  x < xB2 ? amp * exp(-kap * (x - xB1)) :
  amp * exp(-kap * (xB2 - xB1))
const ph = (x) =>
  x < xB1 ? w * (x - xL) :
  x < xB2 ? w * (xB1 - xL) :
  w * (x - xB2) + w * (xB1 - xL)
const wave = linspace(xL, xR, 400).map(x => [x, yc - env(x) * cos(ph(x))])

return <Box margin>
  <VStack gap={0.3}>
    <Text color={navy}>Josephson Junction</Text>

    <Frame height={10} rounded={10} fill={cream} border aspect={1.55}>
      <Mesh2D xlocs={24} ylocs={16} stroke={navy} stroke-opacity={0.05} />

      {/* barrier extent guides */}
      <Line points={[[xB1, 0.05], [xB1, 0.80]]} stroke={rose} stroke-width={1.5} stroke-dasharray={4} stroke-opacity={0.6} />
      <Line points={[[xB2, 0.05], [xB2, 0.80]]} stroke={rose} stroke-width={1.5} stroke-dasharray={4} stroke-opacity={0.6} />

      {/* macroscopic wavefunction */}
      <Line points={[[xL, yc], [xR, yc]]} stroke={navy} stroke-width={1} stroke-opacity={0.25} />
      <Line points={wave} stroke={steel} stroke-width={2.5} />
      <Latex pos={[0.17, 0.36]} ysize={0.08} color={steel}>{"\\psi_1 = \\sqrt{n_1}\\,e^{i\\theta_1}"}</Latex>
      <Latex pos={[0.83, 0.36]} ysize={0.08} color={steel}>{"\\psi_2 = \\sqrt{n_2}\\,e^{i\\theta_2}"}</Latex>

      {/* electrodes and barrier */}
      <Rect rect={[xL, blkT, xB1, blkB]} fill={ice} stroke={navy} stroke-width={1.5} />
      <Rect rect={[xB2, blkT, xR, blkB]} fill={ice} stroke={navy} stroke-width={1.5} />
      <Rect rect={[xB1, blkT, xB2, blkB]} fill={sand} stroke={navy} stroke-width={1.5} />
      <Text pos={[0.20, 0.67]} ysize={0.05} color={navy}>superconductor</Text>
      <Text pos={[0.80, 0.67]} ysize={0.05} color={navy}>superconductor</Text>

      {/* Cooper pair tunneling */}
      <Arrow points={[[0.36, 0.52], [0.64, 0.52]]} stroke={sage} stroke-width={2.5} arrow-fill={sage} arrow-size={0.045} />
      <Latex pos={[0.30, 0.52]} ysize={0.06} color={sage}>{"2e"}</Latex>

      {/* barrier callout */}
      <Line points={[[0.5, 0.755], [0.5, 0.845]]} stroke={rose} stroke-width={1.5} />
      <Text pos={[0.50, 0.90]} ysize={0.05} color={rose}>thin insulating barrier</Text>
    </Frame>
    <Latex scale={0.8} color={navy}>{"I = I_c \\sin(\\theta_2 - \\theta_1) \\qquad \\hbar \\, \\dot{\\theta} = 2 e V"}</Latex>
  </VStack>
</Box>
