// a network sized by a single em: the nodes hug their labels at one text
// size, the wrapped label makes a taller node, the formula node and the free
// label take the em too, and the ellipse node falls back to its ysize
<Network aspect={1.5} em={0.05} node-fill={gray} node-rounded edge-fill={white}>
  <Node id="hello" pos={[0.25, 0.5]}>Hello world</Node>
  <Node id="test" pos={[0.75, 0.25]} width={8}>This is a test of wrapping capabilities</Node>
  <Node id="ball" pos={[0.75, 0.75]} ysize={0.2}><Ellipse aspect={1.5} fill={blue}/></Node>
  <Node id="math" pos={[0.25, 0.85]} padding={0.6}><Tex>{"e^{i\\pi} + 1 = 0"}</Tex></Node>
  <Edge start="hello" end="test" />
  <Edge start="hello" end="ball" start-side="s" />
  <Edge start="math" end="hello" />
  <Text pos={[0.5, 0.05]}>A label sized by the em</Text>
</Network>
