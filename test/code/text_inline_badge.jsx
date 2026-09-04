// elements with metrics inline in a sentence: a formula and a framed badge
// are placed by their anchors, so the badge's text sits on the line's axis
// and its frame overhangs the line box, as a tall formula would, which the
// line spacing leaves room for
<Text width={18} spacing={0.25}>
  A sentence with a formula <Tex>{"\\frac{a}{b}"}</Tex> in it, then a
  <TextFrame padding={[0.4, 0.15]} rounded fill="#fee">badge</TextFrame>
  set in a frame, and a plain <Square fill={blue} /> square, all in one paragraph that wraps.
</Text>
