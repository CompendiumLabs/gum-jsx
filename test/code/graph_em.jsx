// a group's em sizes the text and formulas placed by pos in its frame: the
// graph's labels and the plot's share one size each, and the bare graph's
// auto limits take in the sized labels
<VStack spacing={0.05}>
  <Graph em={0.5} xlim={[0, 10]} ylim={[0, 5]} aspect={2}>
    <SymLine fy={x => 2 + 2 * sin(x)} xlim={[0, 10]} stroke={blue} stroke-width={2} />
    <Text pos={[5, 4.6]}>A label sized by the graph's em</Text>
    <Tex pos={[8, 1]}>{"y = 2 + 2\\sin x"}</Tex>
  </Graph>
  <Plot em={0.4} xlim={[0, 10]} ylim={[-1.5, 1.5]} grid aspect={2}>
    <SymLine fy={sin} stroke={blue} stroke-width={2} />
    <Text pos={[5, 1.2]}>A plot label, also sized by em</Text>
  </Plot>
</VStack>
