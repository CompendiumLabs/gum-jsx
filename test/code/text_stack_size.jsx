// stack-size in a text stack is a length in em along the stack: the bar is
// two em tall across the column, and the square four em wide beside the
// paragraph, each fit inside its box by its aspect
<TextCol width={20} gap={0.75}>
  <TextFrame fill={lightgray}>a one-line box tightens to its line</TextFrame>
  <Rect stack-size={2} fill={lightgray} stroke={none} />
  <TextRow gap={0.5}>
    <Text>a paragraph beside a square four em wide, which takes the row's height and keeps its shape inside it</Text>
    <Square stack-size={4} fill={blue} />
  </TextRow>
</TextCol>
