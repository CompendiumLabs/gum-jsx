const S = 926.7
const xlim = [-1.15, 3.75]
const ylim = [-200, 5400]

// dot size in coord units, tuned so it comes out square on screen
const asp = 1.6
const f = 0.014
const psize = [f * (xlim[1] - xlim[0]), f * asp * (ylim[1] - ylim[0])]

const series = [
  ['The Dude', blue, [[379, 3322], [300, 3616], [130, 4348], [29, 4844], [0.1795, 4999]]],
  ['Walter', red, [[4.4, 4976], [105, 4465], [291, 3653], [41, 4786], [1643, 849]]],
  ['Donny', green, [[461, 3040], [2.2, 4988], [2598, 303], [873, 1949], [22, 4883]]],
]

const xticks = [[-1, '0.1'], [0, '1'], [1, '10'], [2, '100'], [3, '1,000']]
const yticks = [[0, '0'], [1000, '1k'], [2000, '2k'], [3000, '3k'], [4000, '4k'], [5000, '5k']]

const Entry = ({ color, name, ...attr }) =>
  <HStack gap={0.3} {...attr}>
    <Dot width={0.3} fill={color} stroke={color} stack-size={0.09} />
    <Text scale={0.5} justify="left">{name}</Text>
  </HStack>

const Lego = ({ ...attr }) =>
  <VStack gap={0.3} justify="left" {...attr}>
    {series.map(([name, color]) =>
      <Entry name={name} color={color} />
    )}
  </VStack>

const Ploto = ({ ...attr }) =>
  <Plot aspect={asp} margin={0.22} xlim={xlim} ylim={ylim}
    xticks={xticks} yticks={yticks} grid grid-stroke-dasharray={3} grid-opacity={0.3}
    xlabel="distance from correct location (miles, log scale)" ylabel="round score (pts)"
    title="score = 5000 · exp(−d / 927 mi)" {...attr}>
    <SymLine fy={X => 5000 * exp(-pow(10, X) / S)} xlim={xlim} N={400}
      stroke-width={2} stroke-dasharray={7} opacity={0.6} />
    {series.map(([name, color, pts]) =>
      <Points points={pts.map(([d, p]) => [log10(d), p])} point-size={psize} fill={color} stroke={color} />
    )}
  </Plot>

return <Group aspect={1.4}>
  <Ploto />
  <Lego pos={[0.35, 0.5]} />
</Group>

