// Slide 1: definition of the zeta function and the Euler product

const ZPlot = (attr) =>
  <Plot aspect={1} xlim={[0.5, 5]} ylim={[0, 5]} xticks={[1, 2, 3, 4, 5]} yticks={6} grid grid-stroke="#ddd" axis-label-size={2.2} xlabel={<Tex>s</Tex>} ylabel={<Tex>\zeta(s)</Tex>} label-size={0.07} margin={[0.18, 0.05, 0.05, 0.15]} clip {...attr}>
    <VLine loc={1} lim={[0, 5]} stroke={red} stroke-dasharray={4} />
    <HLine loc={1} lim={[0.5, 5]} stroke="#888" stroke-dasharray={4} />
    <SymLine fy={zreal} xlim={[1.01, 5]} N={400} stroke={blue} stroke-width={2.5} />
    <Dot pos={[2, pi*pi/6]} rad={0.07} fill={red} stroke={none} />
    <Latex pos={[3.0, 2.3]} ysize={0.32}>{"\\zeta(2) = \\pi^2/6"}</Latex>
    <Latex pos={[2.7, 4.5]} ysize={0.3} color={red}>{"\\text{pole at } s = 1"}</Latex>
    <Latex pos={[4.2, 0.6]} ysize={0.3} color="#666">{"\\zeta(s) \\to 1"}</Latex>
  </Plot>

return <Slide title="The Riemann Zeta Function" width={30}>
  <TextRow gap={2}>
    <TextCol gap={1}>
      <Text>Dirichlet series and Euler product, for <Tex>{"\\mathrm{Re}(s) > 1"}</Tex>:</Text>
      <Latex>{"\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p\\ \\mathrm{prime}} \\frac{1}{1 - p^{-s}}"}</Latex>
      <Text>The product encodes the primes. Divergence at <Tex>s = 1</Tex> means there are infinitely many.</Text>
      <Latex>{"\\zeta(2) = \\frac{\\pi^2}{6} \\qquad \\zeta(4) = \\frac{\\pi^4}{90}"}</Latex>
    </TextCol>
    <ZPlot />
  </TextRow>
</Slide>
