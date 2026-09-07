// Literal whitespace, tabs, blank lines, proportional fonts, and em containers.
const source = '  name\tvalue\r\n  a\t\t1\r\n\r\n  long\t20  \r\n'
const Literal = ({ children }) => <Verbatim>{children}</Verbatim>
const block = <Verbatim>{source}</Verbatim>

return <TextCol width={28} gap={0.8}>
  <Text>Normal text collapses spaces and newlines:</Text>
  <Text font-family={mono}>{source}</Text>
  <Text>Preserved source, including a final blank line:</Text>
  <Frame padding={0.4}>{block}</Frame>
  <Text>Centered blocks keep left-aligned lines; line alignment is explicit:</Text>
  <HStack gap={1} justify="center">
    <Frame padding={0.4}><Verbatim>{'long line\nshort\n  indented'}</Verbatim></Frame>
    <Frame padding={0.4}><Verbatim justify="right">{'long line\nshort\n  indented'}</Verbatim></Frame>
  </HStack>
  <TextRow gap={1}>
    <Text whitespace="pre" width={12}>{'One    two\n  three\n\nfour'}</Text>
    <Verbatim tab-size={8} width={12}>{'x\ty\nxx\tz'}</Verbatim>
  </TextRow>
  <TextRow gap={1}>
    <Frame padding={0.4}>{block.clone({ scale: 0.65 })}</Frame>
    <Frame padding={0.4}>{block.clone({ children: ['  replacement\n\n    text'], scale: 0.65 })}</Frame>
  </TextRow>
  <Text>Whitespace-only expressions still occupy space:</Text>
  <TextRow>
    <Frame padding={0.4}><Literal>{'   \n\n'}</Literal></Frame>
    <Frame padding={0.4}><Verbatim>{''}</Verbatim></Frame>
    <Frame padding={0.4}><Verbatim>{'left'}{'   '}{'right'}</Verbatim></Frame>
  </TextRow>
</TextCol>
