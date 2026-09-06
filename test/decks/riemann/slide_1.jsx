// Slide 1: definition of the zeta function and the Euler product

// Borwein's algorithm coefficients for the Dirichlet eta function
const NB = 64
const terms = range(1, NB+1).reduce(
  (acc, i) => [...acc, acc[acc.length-1] * 4*(NB+i-1)*(NB-i+1) / (2*i*(2*i-1))], [1/NB]
)
const dk = cumsum(terms, false).map(d => NB*d)
const dn = dk[NB]
const wk = range(0, NB).map(k => pow(-1, k) * (dk[k] - dn) / dn)

// complex zeta(sigma + i t) for sigma > 0, returned as [re, im]
const zeta = (sigma, t) => {
  const ks = range(0, NB)
  const ere = -sum(ks.map(k => wk[k] * pow(k+1, -sigma) * cos(t * log(k+1))))
  const eim =  sum(ks.map(k => wk[k] * pow(k+1, -sigma) * sin(t * log(k+1))))
  const p = pow(2, 1-sigma), a = t * log(2)
  const dre = 1 - p * cos(a), dim = p * sin(a)
  const den = dre*dre + dim*dim
  return [(ere*dre + eim*dim) / den, (eim*dre - ere*dim) / den]
}
const zreal = s => zeta(s, 0)[0]

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
