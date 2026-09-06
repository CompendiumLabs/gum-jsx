// Slide 2: analytic continuation, functional equation, and the critical strip

// imaginary parts of the first nontrivial zeros
const zeros = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351]

// diagram coordinates: real part in [X0, X1], imaginary part in [-Y1, Y1]
const [X0, X1, Y1, ASP] = [-9.5, 4.5, 38, 0.8]

const Leader = ({ p1, p2 }) => <Line points={[p1, p2]} stroke="#999" />
const Cross = (attr) => <Group aspect {...attr}>
  <Line points={[[0, 1], [1, 0]]} stroke={red} stroke-width={2.5} />
  <Line points={[[0, 0], [1, 1]]} stroke={red} stroke-width={2.5} />
</Group>

const Diagram = (attr) =>
  <Graph aspect={ASP} coord={[X0, -Y1, X1, Y1]} {...attr}>
    <Rect rect={[1, -Y1, X1, Y1]} fill="#f3f3f3" stroke={none} />
    <Rect rect={[0, -Y1, 1, Y1]} fill={blue} fill-opacity={0.12} stroke={none} />
    <HLine loc={0} lim={[X0, X1]} stroke="#444" />
    <VLine loc={0} lim={[-Y1, Y1]} stroke="#444" />
    <VLine loc={0.5} lim={[-Y1, Y1]} stroke={blue} stroke-dasharray={5} stroke-width={1.5} />
    {range(-8, 0, 2).map(x => <Text pos={[x, -3]} ysize={2.8} color="#666">{x}</Text>)}
    <Text pos={[1.7, -3]} ysize={2.8} color="#666">1</Text>
    {[-8, -6, -4, -2].map(x => <Circle pos={[x, 0]} xrad={0.25} fill={white} stroke={purple} stroke-width={2} />)}
    {zeros.map(t => <Circle pos={[0.5, t]} xrad={0.25} fill={blue} stroke={none} />)}
    {zeros.map(t => <Circle pos={[0.5, -t]} xrad={0.25} fill={blue} stroke={none} />)}
    <Cross pos={[1, 0]} xrad={0.35} />
    <Text pos={[-5, 5.5]} ysize={3} color={purple}>trivial zeros</Text>
    <Text pos={[2.75, 21]} ysize={2.8} color="#555">series</Text>
    <Text pos={[2.75, 16.5]} ysize={2.8} color="#555">converges</Text>
    <Text pos={[2.7, 4.5]} ysize={2.8} color={red}>pole</Text>
    <Text pos={[-4.5, 33]} ysize={3} color={blue}>critical line</Text>
    <Latex pos={[-4.5, 28]} ysize={4} color={blue}>{"\\mathrm{Re}(s) = \\tfrac{1}{2}"}</Latex>
    <Leader p1={[-1.4, 30.5]} p2={[0.4, 27.5]} />
    <Text pos={[-4.5, -14]} ysize={3} color={blue}>critical strip</Text>
    <Leader p1={[-1.5, -14]} p2={[0, -14]} />
    <Text pos={[-4.5, -31]} ysize={3} color={blue}>nontrivial zeros</Text>
    <Leader p1={[-1.2, -31]} p2={[0.2, -30.6]} />
    <Latex pos={[X1 - 0.8, -3.5]} ysize={3}>{"\\mathrm{Re}"}</Latex>
    <Latex pos={[-1.3, Y1 - 3]} ysize={3}>{"\\mathrm{Im}"}</Latex>
  </Graph>

return <Slide title="Analytic Continuation" width={30}>
  <TextRow>
    <TextCol gap={1}>
      <Text>Riemann (1859): <Tex>\zeta</Tex> extends to all <Tex>{"s \\neq 1"}</Tex> via the functional equation</Text>
      <Latex>{"\\zeta(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\tfrac{\\pi s}{2}\\right) \\Gamma(1-s)\\, \\zeta(1-s)"}</Latex>
      <Text>Trivial zeros at <Tex>{"s = -2, -4, -6, \\ldots"}</Tex> from the sine factor. Also</Text>
      <Latex>{"\\zeta(0) = -\\tfrac{1}{2} \\quad \\zeta(-1) = -\\tfrac{1}{12}"}</Latex>
      <Text>All other zeros lie in the strip <Tex>{"0 < \\mathrm{Re}(s) < 1"}</Tex>, symmetric about <Tex>{"\\mathrm{Re}(s) = \\tfrac{1}{2}"}</Tex>.</Text>
    </TextCol>
    <Diagram />
  </TextRow>
</Slide>
