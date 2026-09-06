// Slide 4: |zeta(1/2 + it)| along the critical line with the first ten zeros

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
const zabs = t => { const [a, b] = zeta(0.5, t); return sqrt(a*a + b*b) }
const zre = t => zeta(0.5, t)[0]
const zim = t => zeta(0.5, t)[1]

// imaginary parts of the first ten nontrivial zeros
const zeros = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738]
const tmax = 50
const [Y0, Y1] = [-3, 4]

const ZPlot = (attr) =>
  <Plot aspect={3.2} xlim={[0, tmax]} ylim={[Y0, Y1]} xticks={11} yticks={8} grid grid-stroke="#e4e4e4" axis-label-size={1.7} xanchor={Y0} margin={[0.06, 0.03, 0.02, 0.05]} clip {...attr}>
    <HLine loc={0} lim={[0, tmax]} stroke="#888" />
    {zeros.map(t => <VLine loc={t} lim={[Y0, Y1]} stroke={red} stroke-dasharray={4} opacity={0.4} />)}
    <SymLine fy={zre} xlim={[0, tmax]} N={1500} stroke={green} stroke-width={1.2} opacity={0.8} />
    <SymLine fy={zim} xlim={[0, tmax]} N={1500} stroke={purple} stroke-width={1.2} opacity={0.8} />
    <SymLine fy={zabs} xlim={[0, tmax]} N={1500} stroke={blue} stroke-width={2.5} />
    {zeros.map(t => <Dot pos={[t, 0]} rad={[0.3, 0.13]} fill={red} stroke={none} />)}
    <Legend pos={[6.2, -1.6]} ysize={2.2} text-color="#333">
      {[
        { stroke: blue, 'stroke-width': 2.5, label: <Tex>{"|\\zeta(\\tfrac12 + it)|"}</Tex> },
        { stroke: green, label: <Tex>{"\\mathrm{Re}\\,\\zeta"}</Tex> },
        { stroke: purple, label: <Tex>{"\\mathrm{Im}\\,\\zeta"}</Tex> },
      ]}
    </Legend>
  </Plot>

return <Slide title="Zeros on the Critical Line" width={30}>
  <TextCol gap={2}>
    <ZPlot align="center" />
    <TextRow>
      <Text>Zeros: where <Tex>{"\\mathrm{Re}\\,\\zeta"}</Tex> and <Tex>{"\\mathrm{Im}\\,\\zeta"}</Tex> vanish together. Ten lie below <Tex>t = 50</Tex> and the count up to height <Tex>T</Tex> grows like</Text>
      <Latex align="center">{"N(T) \\sim \\frac{T}{2\\pi} \\log \\frac{T}{2\\pi e}"}</Latex>
    </TextRow>
  </TextCol>
</Slide>
