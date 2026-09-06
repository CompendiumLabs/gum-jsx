// Literal whitespace, tabs, blank lines, proportional fonts, and em containers.
const source = '  name\tvalue\r\n  a\t\t1\r\n\r\n  long\t20  \r\n'
const Literal = ({ children }) => <Verbatim>{children}</Verbatim>
const block = <Verbatim>{source}</Verbatim>

return <TextCol width={28} gap={0.8}>
  <Text>Normal text collapses spaces and newlines:</Text>
  <Text font-family={mono}>{source}</Text>
  <Text>Preserved source, including a final blank line:</Text>
  <TextFrame>{block}</TextFrame>
  <TextRow gap={1}>
    <Text whitespace="pre" width={12}>{'One    two\n  three\n\nfour'}</Text>
    <Verbatim tab-size={8} width={12}>{'x\ty\nxx\tz'}</Verbatim>
  </TextRow>
  <TextRow gap={1}>
    <TextFrame>{block.clone({ scale: 0.65 })}</TextFrame>
    <TextFrame>{block.clone({ children: ['  replacement\n\n    text'], scale: 0.65 })}</TextFrame>
  </TextRow>
  <Text>Whitespace-only expressions still occupy space:</Text>
  <TextRow>
    <TextFrame><Literal>{'   \n\n'}</Literal></TextFrame>
    <TextFrame><Verbatim>{''}</Verbatim></TextFrame>
    <TextFrame><Verbatim>{'left'}{'   '}{'right'}</Verbatim></TextFrame>
  </TextRow>
</TextCol>
