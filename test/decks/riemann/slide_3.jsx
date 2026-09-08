// Slide 3: the image of the critical line, zeta(1/2 + it) for 0 <= t <= 50

// trace the critical line zeta(1/2 + i t), colored by t
const R = 4
const pal = palette(blue, red, [0, tmax])
const [NP, L] = [2000, 20]
const ts = linspace(0, tmax, NP+1, true)
const pts = ts.map(t => zeta(0.5, t))
const segs = range(0, NP/L).map(i => pts.slice(i*L, (i+1)*L + 1))

// polar grid: rings and spokes
const spokes = range(0, 12).map(i => i*pi/6)
const rings = range(1, R+1)

// colorbar for t
const NC = 100
const ColorBar = (attr) => <Box aspect={12} padding={[0.5, 0]} {...attr}>
  <Latex pos={[-0.02, 0.5]} ysize={0.6} align="right">t = 0</Latex>
  {range(0, NC).map(i =>
    <Rect rect={[i/NC, 0.15, (i+1)/NC + 0.002, 0.85]} fill={pal(tmax*i/NC)} stroke={none} />
  )}
  <Latex pos={[1.02, 0.5]} ysize={0.6} align="left">{`t = ${tmax}`}</Latex>
</Box>

const M = R + 0.8
const PolarPlot = (attr) => <VStack spacing={0.02} {...attr}>
  <Graph aspect={1} coord={[-M, -M, M, M]}>
    {spokes.map(th => <Line points={[[0, 0], polar(th, R)]} stroke="#bbb" />)}
    {rings.map(r => <Circle pos={[0, 0]} rad={r} stroke={r == R ? "#888" : "#bbb"} stroke-dasharray={r == R ? null : 4} />)}
    {rings.slice(0, -1).map(r => <Text pos={[r, -0.28]} ysize={0.36} color="#666">{r}</Text>)}
    <Latex pos={[R+0.55, 0]} ysize={0.4}>{"\\mathrm{Re}\\,\\zeta"}</Latex>
    <Latex pos={[0, R+0.5]} ysize={0.4}>{"\\mathrm{Im}\\,\\zeta"}</Latex>
    <Latex pos={[-R+0.3, R+0.2]} ysize={0.55}>{"\\zeta(\\tfrac{1}{2} + it)"}</Latex>
    {segs.map((seg, i) => <Line points={seg} stroke={pal(ts[i*L + L/2])} stroke-width={2} />)}
    <Dot pos={[0, 0]} rad={0.08} fill={red} stroke={none} />
  </Graph>
  <ColorBar />
</VStack>

return <Slide title="The Critical Line" width={30}>
  <TextRow gap={2}>
    <PolarPlot />
    <TextCol gap={1}>
      <Text>The path of <Tex>{"\\zeta(\\tfrac{1}{2} + it)"}</Tex> for <Tex>{"0 \\le t \\le 50"}</Tex>, starting at <Tex>{"\\zeta(\\tfrac{1}{2}) \\approx -1.46"}</Tex>.</Text>
      <Text>Each pass through the origin is a nontrivial zero:</Text>
      <Box padding={[0.1, 0.15]}>
        <Latex>{"t \\approx 14.13,\\ 21.02,\\ 25.01,\\ \\ldots"}</Latex>
      </Box>
      <Text>Hardy (1914): infinitely many zeros lie on this line.</Text>
    </TextCol>
  </TextRow>
</Slide>
