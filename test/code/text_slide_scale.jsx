// a slide sized by scale alone: a heading, body, a figure with a caption, and
// a list with a smaller sub-list, none of it needing a width
<Slide title="Scale on a Slide">
  <Text scale={1.4}>The em is the slide's</Text>
  <Text>Body text at the slide's own size, wrapping onto a second line as it runs past the frame.</Text>
  <Plot xlim={[0, 2*pi]} ylim={[-1.5, 1.5]} grid aspect={4} margin={[0.2, 0.05]}>
    <SymLine fy={sin} stroke={blue} stroke-width={2} />
  </Plot>
  <Text scale={0.7} justify="center">A caption at seven tenths</Text>
  <Bullets>
    <Text>a list item</Text>
    <Bullets scale={0.85}>
      <Text>a sub-list at eighty five percent</Text>
      <Text>with an equation <Tex>{"x^2 + y^2 = r^2"}</Tex> inline</Text>
    </Bullets>
  </Bullets>
</Slide>
