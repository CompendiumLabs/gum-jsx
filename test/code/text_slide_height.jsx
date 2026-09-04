// a slide budgets its area height to figures with no size of their own: the
// framed figure beside the column and the captioned plot below split the
// height a row of text leaves, the figure at its aspect with the text taking
// the remaining width, and the plot with its caption counted in
<Slide title="Height on a Slide">
  <TextRow>
    <Frame padding rounded fill={lightgray}>
      <Rect aspect={0.75} fill={blue} rounded />
    </Frame>
    <TextCol>
      <Text scale={1.3}>A figure beside text</Text>
      <Text>The figure takes its share of the height at its aspect, and this column wraps beside it at the slide's own size.</Text>
    </TextCol>
  </TextRow>
  <TextFigure caption="A sine wave, its caption counted against the height" caption-scale={0.8}>
    <Plot xlim={[0, 2*pi]} ylim={[-1.5, 1.5]} grid aspect={4} margin={[0.2, 0.05]}>
      <SymLine fy={sin} stroke={blue} stroke-width={2} />
    </Plot>
  </TextFigure>
</Slide>
