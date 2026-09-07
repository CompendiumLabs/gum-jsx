// a TextStack lays its children out in em, so text, formulas and figures
// come out at one size: text wraps to the column's width, a formula keeps
// its size, a figure sized in em keeps it, a bare shape spans the column,
// and a nested row shares the width between its children
<TextStack width={24} gap={0.75}>
  <Text>A column in em: this text wraps to the column's width of twenty-four em, and the rows below share its em.</Text>
  <TextStack direc="h" gap={1} valign="anchor">
    <TextFigure height={2}><Circle fill={blue} /></TextFigure>
    <Text>a circle two em tall, on the text's anchor</Text>
    <Latex>{"e^{i\\pi} + 1 = 0"}</Latex>
  </TextStack>
  <Rect aspect={6} fill={lightgray} stroke={none} />
  <TextStack direc="h" width={24} gap={1}>
    <TextFigure height={1.5}><Square fill={red} /></TextFigure>
    <Text>a share of what is left</Text>
    <Text width={6}>six em of its own</Text>
  </TextStack>
  <TextStack width={24} height={6} gap={0.5} justify="center">
    <Text>a height budget: the plot below fills what the text leaves</Text>
    <Plot xlim={[0, 2*pi]} ylim={[-1, 1]} aspect={3} grid><SymLine fy={sin} stroke={blue} /></Plot>
  </TextStack>
</TextStack>
