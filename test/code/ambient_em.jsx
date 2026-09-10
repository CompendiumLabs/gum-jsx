// a group without an em of its own takes the ambient one, in its own
// coordinates: the plot's and the graph's labels (in data units) and the
// network's nodes come out at the canvas text size, like the plain text
<VStack spacing={0.05}>
  <Plot xlim={[0, 10]} ylim={[-1.5, 1.5]} grid aspect={2}>
    <SymLine fy={sin} stroke={blue} stroke-width={2} />
    <Text pos={[5, 1.2]}>A plot label at the ambient em</Text>
  </Plot>
  <Graph xlim={[0, 10]} ylim={[0, 5]} aspect={2}>
    <SymLine fy={x => 2 + 2 * sin(x)} xlim={[0, 10]} stroke={blue} stroke-width={2} />
    <Text pos={[5, 4.6]}>A graph label at the ambient em</Text>
  </Graph>
  <Network aspect={4} node-fill={gray}>
    <Node id="a" pos={[0.25, 0.5]}>Hello world</Node>
    <Node id="b" pos={[0.75, 0.5]}>Goodbye</Node>
    <Edge start="a" end="b" />
  </Network>
  <Text>Plain text at the ambient em</Text>
</VStack>
