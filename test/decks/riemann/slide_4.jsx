// Slide 4: |zeta(1/2 + it)| along the critical line with the first ten zeros

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
