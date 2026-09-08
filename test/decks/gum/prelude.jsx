// gum.jsx in five slides: the deck's prelude (see index.json). The palette,
// the body text and the Page every slide is laid out on.
const paper = '#f5f3ee', ink = '#182d3b', muted = '#657780', teal = '#137f89'
const T = ({ children, ...args }) =>
  <Text color={ink} font-weight={regular} {...args}>{children}</Text>

// A slide: the running head, the title and the subtitle, then the slide's own content
const Page = ({ n, title, subtitle, children }) =>
  <Slide background={paper} border={0} margin={0} padding={0.07}
    em={0.044} gap={0.65} valign="top" overflow="error">
    <T scale={0.65} color={teal} font-family={mono}>{`GUM.JSX / ${String(n).padStart(2, '0')}`}</T>
    <T scale={1.95} font-weight={bold}>{title}</T>
    <T scale={0.9} color={muted}>{subtitle}</T>
    {children}
  </Slide>
