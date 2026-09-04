// a child's own align overrides its container's placement: in the column the
// framed rect sits at the right and the captioned plot is centered by its
// justify, and in the row one text block sits at the bottom and one in the
// middle beside the figure
<Slide title="Align on a Child">
  <Text>A left column; the figures below pick their own side.</Text>
  <TextRow>
    <Frame padding rounded fill={lightgray}><Rect aspect={1.5} fill={blue} rounded /></Frame>
    <Text align="bottom">Bottom-aligned beside a figure, by align on the text.</Text>
    <Text align="center">And centered.</Text>
  </TextRow>
  <Frame padding rounded fill={lightgray} align="right"><Rect aspect={3} fill={red} rounded /></Frame>
  <TextFigure caption="A centered captioned plot" caption-scale={0.8} justify="center">
    <Plot xlim={[0, 2*pi]} ylim={[-1.5, 1.5]} grid aspect={4} margin={[0.2, 0.05]}>
      <SymLine fy={sin} stroke={blue} stroke-width={2} />
    </Plot>
  </TextFigure>
</Slide>
