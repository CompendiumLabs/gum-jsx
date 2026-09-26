# Math gallery

<a id="aligned_math"></a>

## Aligned equations

Use `aligned` to line up relations across several equations. Put `&` before
the relation and `\\` between rows. The first column is right aligned, the
second is left aligned, and relation spacing is retained at the start of the
second column. Additional pairs are separated by one em.

```jsx
<Latex>
  {String.raw`
    \begin{aligned}
      a+b &= c \\
        a &= c-b
    \end{aligned}
  `}
</Latex>
```

| Environment | Behavior |
| --- | --- |
| `aligned` | Alternating right/left columns, with a one-em gap between equation pairs. |
| `alignedat` | Required pair count, such as `{2}`; no automatic gap between pairs. Use explicit math spaces where needed. |
| `gathered` | Centered display-style lines. |
| `split` | Up to two relation-aligned columns. |
| `align`, `align*` | Display-only forms of the aligned layout. |
| `alignat`, `alignat*` | Display-only forms with an explicit pair count. |
| `gather`, `gather*` | Display-only centered lines. |
| `equation`, `equation*` | A single display row; it can contain `split` or other nested math. |

All these environments use display-style cells. Multiline forms add 0.3 em of
leading **between** rows, with no extra leading after the last row. Tall cells,
row gap commands, and array stretch are measured before the complete table is
centered on its math axis.

Use `Latex` for display-only environments. Embedded `aligned`, `alignedat`, and
`gathered` also work in `Tex`, where their cells still use display style. These
are naturally sized math elements: they do not distribute columns across an
available display width, wrap equations, or shrink to a width offer.

Both starred and unstarred display environments currently render **without
equation numbers**. Automatic numbering awaits a display container; explicit
`\tag` is an unsupported error. `\notag` and `\nonumber` can suppress a
future number but do not change the current body layout. KaTeX's supported
environment syntax applies; optional top/bottom positioning arguments such as
`\begin{aligned}[t]` are not supported by this adapter.

[MathArray](../elements/math.md#MathArray) is the direct JSX counterpart.
Use explicit `cols` descriptors to specify alignment and gaps, `cell-style="display"`
for display cells, and `jot={true}` for multiline leading. A direct cell beginning
with a relation or binary operator can use a TeX empty group, such as `"{}=b"`,
to preserve the intended spacing. Parsed aligned environments insert this
group automatically.

See [matrices and arrays](math.md#math_arrays) for rules, cases, and small tables.
`\substack` and `subarray` make script-style multiline content for limits and
scripts. Phase 5 comparison galleries are available through
`bun run compare --suite 5`; `--inline` covers the embeddable environments and
omits display-only cases.

<a id="aligned_math-example"></a>

### Example

```jsx
// Shared relation columns, paired equations, gathered lines, and multiline limits.
<Box font-size={px(30)} padding={em(0.8)}>
  <VStack gap={em(0.8)} align="start">
    <Text font-size={em(0.7)} font-weight={bold}>Align on the relation</Text>
    <Latex>{String.raw`
      \begin{aligned}
        (a+b)^2 &= a^2 + 2ab + b^2 \\
                &= a(a+b) + b(a+b)
      \end{aligned}
    `}</Latex>
    <Text font-size={em(0.7)} font-weight={bold}>Multiple equation pairs</Text>
    <Latex>{String.raw`
      \begin{aligned}
        x &= a+b & u &= a-b \\
        y &= c+d & v &= c-d
      \end{aligned}
    `}</Latex>
    <Text font-size={em(0.7)} font-weight={bold}>Centered lines</Text>
    <Latex>{String.raw`
      \begin{gathered}
        a+b=c \\
        \frac{1}{1+x}=y
      \end{gathered}
    `}</Latex>
    <Text font-size={em(0.7)} font-weight={bold}>Multiline operator limits</Text>
    <Latex>
      {String.raw`
        S = \sum_{\substack{1\leq i\leq n\\1\leq j\leq m}} a_{ij}
      `}
    </Latex>
  </VStack>
</Box>
```

---

<a id="inline_math"></a>

## Math inside prose

[Text](../elements/text.md#Text) accepts formulas and other Gum elements
alongside prose. Use [Tex](../elements/math.md#Tex) for text-style formulas;
[Latex](../elements/math.md#Latex) keeps its display-style default, even inline.

```jsx
<Text width={px(360)}>
  {"The average speed is "}
  <Tex>
    <Frac>
      <TextMode>distance</TextMode>
      <TextMode>time</TextMode>
    </Frac>
  </Tex>
  {" over the measured interval."}
</Text>
```

Each formula is one indivisible item. The paragraph breaks around it at Unicode
line-break opportunities, keeping adjacent punctuation and nonbreaking spaces
attached. An oversized formula overflows instead of shrinking. `wrap={false}`
keeps the whole paragraph on one line; use [fitting](../guides/sizing.md#fitting)
when scaling is intentional.

String expression children make spaces explicit while keeping nested JSX
indented. Ordinary literal prose newlines still create hard breaks in `Text`.

Inline elements align on their baseline, or their bottom edge if they have no
baseline. The normal prose strut sets a minimum line height. Fractions and
other tall items expand that line using logical height and depth; intentional
ink overhang remains overflow. Subsequent lines retain their ordinary height.

[Span](../elements/text.md#Span) passes its font size and color to a formula.
Math retains its own default faces independently of the prose family. Ordinary
kerning, whitespace normalization, hard breaks, and nonbreaking spaces still
apply to the surrounding text.

[TextBox](../elements/text.md#TextBox) and [Text](../elements/text.md#Text) children in a bullet accept arrays mixing
prose, spans, and formulas. Captions and titles can use the same arrays, or an
explicit `Text` element. A sole block child stays a block. For several elements
without prose, wrap them in `Text` to request inline layout, or use `TextCol` for
separate blocks.

The example reuses one formula in two different paragraph widths and in a list.
See [Gum inside math](math.md#math_composition) for the other direction.

<a id="inline_math-example"></a>

### Example

```jsx
// The same inline formula reflows in paragraphs, styled spans, text boxes, and bullets.
const rate = <Tex>
  <Frac>
    <TextMode>distance</TextMode>
    <TextMode>time</TextMode>
  </Frac>
</Tex>
const paragraph = <Span>
  The average speed is {rate}. Each formula stays together as the paragraph wraps, and a tall fraction expands the line around its baseline.
</Span>
const equation = <Tex>
  <SupSub sup="2">x</SupSub> + <SupSub sup="2">y</SupSub> = 1
</Tex>
return <Box font-size={px(22)} padding={em(1)}>
  <TextCol width="fill" gap={em(0.9)}>
    <Text font-size={em(1.35)} font-weight={bold}>Math belongs in the paragraph</Text>
    <Text>When <Span color={blue}>{equation}</Span>, the point lies on the unit circle. Prose and formulas share a baseline.</Text>
    <VStack gap={em(1)} align="fill">
      <TextFrame>{paragraph}</TextFrame>
      <TextFrame width={0.75}>{paragraph}</TextFrame>
    </VStack>
    <Bullets>
      <Text>The rate {rate} also works in a list item.</Text>
      <Text>Styles can emphasize <Span color={blue}>{rate}</Span> without changing the surrounding prose.</Text>
    </Bullets>
  </TextCol>
</Box>
```

---

<a id="math_arrays"></a>

## Matrices and arrays

Math tables measure their cells at natural size, align columns, and share a
baseline across each row. Fractions and other tall cells expand the row.
Matrix and cases delimiters fit the completed table.

```jsx
<Latex>
  {String.raw`
    A = \begin{pmatrix}
      a & bb \\
      ccc & d
    \end{pmatrix}
  `}
</Latex>
```

Use `&` between cells and `\\` between rows. Keep multiline examples indented,
and use `String.raw` so JavaScript preserves TeX backslashes.

| Environment | Cell style and behavior |
| --- | --- |
| `array`, `darray` | Text or display cells; required alignment string, such as `{lcr}` or `{|r:c|}`. Outer column gaps included. |
| `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix` | Centered text cells; no delimiters, parentheses, brackets, braces, single bars, or double bars. |
| Each matrix name followed by `*` | Optional `[l]`, `[c]`, or `[r]` alignment; defaults to centered. |
| `cases`, `dcases` | Left brace, left-aligned columns, one-em column gap, and 1.2 array stretch. `dcases` uses display cells. |
| `rcases`, `drcases` | The corresponding cases layout with the brace on the right. |
| `smallmatrix` | Script cells, tighter column spacing, and half-height row struts. |
| `subarray` | One script-style column, with required `{l}` or `{c}` alignment. |
| `\substack{…}` | Centered script-style rows, often used in operator limits. |

An empty cell between separators stays empty. `\\[0.4em]` increases a row's
minimum depth; a tall cell may already provide that much depth. `\\[-0.2em]`
moves the next row upward. A local `\def\arraystretch{1.5}` enlarges the minimum
row struts without resizing glyphs.

Parsed environment cells reset an outer math alphabet, matching KaTeX. A local
command such as `\mathbf{x}` inside a cell still applies; cell colors inherit.

Arrays support solid `|` and dashed `:` column separators, repeated separators,
and `\hline` / `\hdashline` at row boundaries. Consecutive horizontal rules
are separated. Rules inherit the formula color, and their intersections meet
at the outer corners. Only the pinned KaTeX column syntax is accepted; LaTeX
preambles such as `p{…}` and `@{…}` are not supported.

For direct composition, [MathArray](../elements/math.md#MathArray) accepts
flat JSX children with `ncol`, or nested child arrays with elements and TeX strings.
For example, `children: [["a", "b"], [null, "d"]]` reserves an empty cell at the
start of the second row. [Bracket](../elements/math.md#Bracket) supplies
delimiters around a direct array. Shapes, plots, and explicitly sized text
blocks can be cells, just as they can be other math operands.

Arrays measure their cells naturally; a whole standalone formula shrinks to its
offered bounds automatically without changing the table's internal proportions.
Use `fit={false}` for unscaled allocation and intentional overflow. Give a prose
cell an explicit width to wrap it. Small shape and plot cells can use em widths
and aspect ratios, so their dimensions follow the surrounding base font.
See [fitting](../guides/sizing.md#fitting) for the distinction between inline and standalone math.
Formula ink may extend beyond the logical advance at outer rules and italic
glyphs, so retain padding inside an explicit SVG viewport.
Very tall braces and matrix bars retain the current glyph-scaling fallback;
their shapes can differ from the assembled delimiters in KaTeX and LaTeX.

[Aligned equations](math.md#aligned_math) describes the related multiline display
environments. Equation numbering and `CD` diagrams remain deferred; explicit
tags and `CD` produce unsupported diagnostics.

<a id="math_arrays-example"></a>

### Example

```jsx
// Matrices, cases, small inline arrays, and matrices containing ordinary Gum elements.
<Box font-size={px(30)} padding={em(0.8)}>
  <VStack gap={em(0.8)} align="start">
    <Text font-size={em(0.7)} font-weight={bold}>Matrices and unequal cells</Text>
    <Latex>{String.raw`
      A = \begin{pmatrix}
        a & bb \\
        ccc & d
      \end{pmatrix}
      \qquad
      B = \begin{bmatrix}
        \frac{1}{x} & 0 \\
        0 & \frac{a+b}{c}
      \end{bmatrix}
    `}</Latex>
    <Text font-size={em(0.7)} font-weight={bold}>Piecewise definitions</Text>
    <Latex>{String.raw`
      f(x) = \begin{cases}
        x^2 & \text{if } x > 0 \\
        0 & \text{otherwise}
      \end{cases}
    `}</Latex>
    <Text font-size={em(0.65)}>
      Small matrices fit inside prose: <Tex>{String.raw`
        R = \left(
          \begin{smallmatrix}
            0 & -1 \\
            1 & 0
          \end{smallmatrix}
        \right)
    `}</Tex> rotates a vector by a quarter turn.
    </Text>
    <Text font-size={em(0.7)} font-weight={bold}>Gum elements are cells too</Text>
    <MathText style="display">
      G=
      <Bracket delim="square">
        <MathArray ncol={2} colsep={em(0.5)}>
          <Circle width={em(1)} fill={blue} stroke={none} />
          <Plot
            width={em(4.2)}
            aspect={2.3}
            axis={false}
            grid={false}
            margin={0}
            xlim={[0, pi]}
            ylim={[0, 1.1]}
          >
            <SymLine fy={sin} xlim={[0, pi]} stroke={blue} stroke-width={em(0.07)} />
          </Plot>
          <TextMode>shape</TextMode>
          <TextMode>curve</TextMode>
        </MathArray>
      </Bracket>
    </MathText>
  </VStack>
</Box>
```

---

<a id="math_boxes"></a>

## Math boxes and invisible layout

Math keeps logical dimensions separate from drawing bounds. Phantom, smash,
and lap deliberately change one without changing the other.

| Command | Dimensions | Ink |
| --- | --- | --- |
| `\phantom{…}` | Keep width, height, and depth. | Hidden. |
| `\hphantom{…}` | Keep horizontal advance only. | Hidden. |
| `\vphantom{…}` | Keep height and depth only. | Hidden. |
| `\smash{…}` | Keep advance; suppress height and depth. | Retained. |
| `\smash[t]{…}` / `\smash[b]{…}` | Suppress only height / depth. | Retained. |
| `\mathrlap{…}` / `\mathllap{…}` / `\mathclap{…}` | Zero advance; retain height and depth. | Right of / left of / centered on the insertion point. |

The direct elements are [Phantom](../elements/math.md#Phantom),
[Smash](../elements/math.md#Smash), and [Lap](../elements/math.md#Lap).
A lap has zero advance; a negative kern actually moves the next atom backward.
Physical boxes remain nonnegative even when a sequence's total advance is negative.
Nested explicit colors and backgrounds cannot make phantom ink reappear.

Suppressed dimensions stay suppressed when the expression is put in a math
row or prose line. Ink survives in the fragment's independent bounds. Give
an explicit SVG enough padding; its viewport still clips overhang. The
comparison script includes this ink when rasterizing, including leading laps.

<a id="math_boxes-frames-cancellation-and-position"></a>

### Frames, cancellation, and position

[Enclose](../elements/math.md#Enclose) supplies frames, background colors,
diagonal cancellation, and strikeout. TeX supports `\boxed`, `\fbox`,
`\colorbox`, `\fcolorbox`, `\cancel`, `\bcancel`, `\xcancel`, and text-mode
`\sout`. Frames add padding and preserve the body's baseline. Cancellation
retains the original logical box and draws its lines over the body.

`\rule[shift]{width}{height}` draws a filled rectangle with its bottom at
`shift` above the baseline. Positive and negative shifts are supported; a
nonpositive width or height has no ink. Its direct counterpart is
[MathRule](../elements/math.md#MathRule). TeX point dimensions keep their
size in script styles; TeX em/ex dimensions use the local text size.

[RaiseBox](../elements/math.md#RaiseBox) changes an operand's position relative
to the baseline; [VCenter](../elements/math.md#VCenter) centers it on the
math axis. `\hbox{…}` is a literal text box with optional `$…$` math, useful
inside `\raisebox` and `\vcenter`.

[Pmb](../elements/math.md#Pmb) overprints an operand to simulate bold while
retaining its advance. Real bold font commands are covered in
[math fonts and macros](../guides/math_fonts.md). Exotic `\phase`, `\angl`, and `\angln`
enclosures remain unsupported.

<a id="math_boxes-example"></a>

### Example

```jsx
// Invisible dimensions and visible overhang are separate layout choices.
<Box font-size={px(32)} padding={em(1)}>
  <VStack gap={em(0.9)} align="start">
    <Text font-size={em(0.65)} font-weight={bold}>Reserve height without drawing</Text>
    <Latex>{String.raw`
      \sqrt{\frac{1}{x}} + \sqrt{\vphantom{\frac{1}{x}}y}
      \qquad
      a + \phantom{x+y} + b
    `}</Latex>
    <Text font-size={em(0.65)} font-weight={bold}>Retain ink without its full dimensions</Text>
    <Latex>{String.raw`
      \sqrt{\smash{x^2}}
      \qquad
      \sum_{\mathclap{1\leq i\leq n}} x_i
      \qquad
      \smash[t]{\frac{x}{y}} + \smash[b]{\frac{x}{y}}
    `}</Latex>
    <Text font-size={em(0.65)} font-weight={bold}>Frames, highlights, and cancellation</Text>
    <Latex>{String.raw`
      \boxed{x^2+1}
      \quad
      \fcolorbox{blue}{yellow}{$y$}
      \quad
      \cancel{x} + \bcancel{a+b} + \xcancel{\frac{1}{y}}
    `}</Latex>
    <Text font-size={em(0.65)} font-weight={bold}>Rules, shifts, and verbatim text</Text>
    <Latex>{String.raw`
      x\rule[2pt]{1em}{0.6pt}y
      \quad
      x\raisebox{0.5ex}{up}\raisebox{-2pt}{down}y
      \quad
      \verb*|a b|
    `}</Latex>
  </VStack>
</Box>
```

---

<a id="math_composition"></a>

## Gum and math composition

Math operands are ordinary Gum children. A [Frac](../elements/math.md#Frac)
can contain a shape or a plot; scripts, roots, and math rows accept the same
elements. Their normal layout queries determine their size and drawing.

```jsx
<MathText style="display">
  <Frac>
    <Circle width={em(1)} fill={blue} stroke={none} />
    <TextMode>area</TextMode>
  </Frac>
</MathText>
```

Give a figure concrete dimensions with `px()` or `em()`. Give a wrapping
[Text](../elements/text.md#Text) operand an explicit width. A formula's
available width is a budget, not a reference for percentage dimensions or an
instruction to infer a plot's aspect ratio. Ordinary Gum font sizes and
dimensions retain their normal meaning inside a script. `TextMode` literals
and math glyphs follow TeX's script-size table.

The runnable example uses `em()` widths and aspect ratios for its small figures,
so only the outer base font uses pixels. A text operand's em width is relative to
that text's own font size, including its `font-size` override.

Elements with a `math_axis` guide use it. Otherwise, an ordinary text baseline
implies an axis a quarter of its local font size above that baseline. An element
without either guide centers on the math axis. Multiline text uses its first
baseline and keeps its wrapping width.

[Box](../elements/layout.md#Box) padding and [fitting](../guides/sizing.md#fitting)
transform the child's baseline and math axis along with its drawing. The `fit` prop
explicitly scales a plot for a compact script; embedding alone does not.
[TextRow](../elements/text.md#TextRow) aligns prose and formulas by baseline.
A rotated label keeps the child's complete geometry; tilted baselines have no
single vertical coordinate, so the wrapper does not advertise a baseline.

The example includes a shape and plot in fractions, a multiline text operand,
explicit fitting, and a larger plot with formulas in its title, caption, and
rotated vertical label. All export as self-contained outlines in SVG and PNG.
See [math inside prose](math.md#inline_math) for paragraphs and lists.

<a id="math_composition-example"></a>

### Example

```jsx
// Shapes, small plots, and wrapping text are ordinary operands; plots can carry math labels too.
const Curve = props => (
  <Plot
    width={em(5)}
    aspect={2.1}
    axis={false}
    grid={false}
    margin={0}
    xlim={[0, pi]}
    ylim={[0, 1.1]}
    plot-background={lightgray}
    {...props}
  >
    <SymLine fy={sin} xlim={[0, pi]} stroke={blue} stroke-width={em(0.08)} />
  </Plot>
)
return (
  <Box font-size={px(30)} padding={em(0.8)}>
    <VStack gap={em(0.9)} align="start">
      <Text font-size={em(0.75)} font-weight={bold}>Gum elements inside math</Text>
      <MathText style="display">
        <Frac>
          <Circle width={em(1.1)} fill={blue} stroke={none} />
          <TextMode>area</TextMode>
        </Frac>
        +
        <Frac>
          <Curve />
          <Text width={em(8.5)} font-size={em(0.6)} justify="center">
            A wrapping text operand keeps its explicit width.
          </Text>
        </Frac>
      </MathText>
      <MathRow>
        <Text width={em(9.5)} font-size={em(0.6)}>
          A text operand aligns by its first baseline.
        </Text>
        <MathSpacer advance="quad" />
        <MathSymbol>≈</MathSymbol>
        <MathSpacer advance="quad" />
        <Sqrt>
          <TextMode>area</TextMode>
        </Sqrt>
      </MathRow>
      <Text font-size={em(0.6)} color={slate}>Use fit when a figure should deliberately shrink into a script.</Text>
      <SupSub
        sup={<Curve fit="contain" max-width={em(1.7)} max-height={em(0.8)} />}
      >P</SupSub>
      <TextFigure
        caption={
          <Text font-size={em(0.6)}>
            The caption includes <Tex><SupSub sup="2">x</SupSub></Tex> using the same inline layout as a paragraph.
          </Text>
        }
      >
        <Plot
          width="fill"
          aspect={2.4}
          min-height={em(14)}
          font-size={em(0.5)}
          title={<Text>A plot of <Tex>y=x^2</Tex></Text>}
          xlabel={<Text>Position <Tex>x</Tex></Text>}
          ylabel={<Text>Power <Tex>x^2</Tex></Text>}
          xlim={[-2, 2]}
          ylim={[0, 4]}
        >
          <SymLine fy={(x) => x * x} xlim={[-2, 2]} stroke={blue} stroke-width={em(0.16)} />
        </Plot>
      </TextFigure>
    </VStack>
  </Box>
)
```

---

<a id="math_decorations"></a>

## Math decorations

Accents, horizontal rules, braces, and extensible arrows work in TeX and JSX.
Their bodies and labels can contain ordinary Gum elements as well as math.

<a id="math_decorations-accents-and-rules"></a>

### Accents and rules

Use `\hat{x}`, `\bar{x}`, `\vec{v}`, `\dot{x}`, or `\ddot{x}` for fixed
accents. `\acute`, `\grave`, `\breve`, `\check`, `\tilde`, and `\mathring`
are also supported. Character skew comes from the selected font. In
`\hat{x}_i^2`, scripts attach to the underlying character; an accented
compound body uses the whole decorated box.

`\widehat`, `\widecheck`, and `\widetilde` fit the measured operand width.
Their height grows modestly as the expression widens. `\overline` and
`\underline` span the complete advance. The corresponding elements are
[Accent](../elements/math.md#Accent), [Overline](../elements/math.md#Overline),
and [Underline](../elements/math.md#Underline).

Arrow decorations include `\overrightarrow`, `\overleftarrow`,
`\overleftrightarrow`, their under forms, `\Overrightarrow`, and
`\overleftharpoon`/`\overrightharpoon`. Groups and line segments have
over/under forms; `\utilde` puts a tilde below the body. In JSX, choose the
shape through `Accent.accent` and use `under={true}` for an under decoration.

<a id="math_decorations-braces-and-labeled-arrows"></a>

### Braces and labeled arrows

```jsx
<MathText>
  <HorizBrace label={String.raw`n\text{ terms}`}>
    <MathText>a_1+\cdots+a_n</MathText>
  </HorizBrace>
  =
  <MathText>S_n</MathText>
</MathText>
```

[HorizBrace](../elements/math.md#HorizBrace) measures the body before the
label. A long label can enlarge the complete box while the brace continues to
span the body. TeX's matching superscript/subscript becomes the label; an
opposite script remains at the side. Horizontal brackets work the same way.

[XArrow](../elements/math.md#XArrow) centers its arrow on the math axis and
sizes it to the larger padded label. TeX uses `\xrightarrow[below]{above}`;
left/bidirectional, double, hook, mapsto, two-headed, harpoon, paired, and
equilibrium variants are available. [MathStretch](../elements/math.md#MathStretch)
lists the shape names and also exposes the shapes directly.

`\overset{above}{body}`, `\underset{below}{body}`, and `\stackrel` force
stacking even in inline or script style. For direct composition, use
[SupSub](../elements/math.md#SupSub) with `limits="always"` and the
appropriate atom class.

All generated paths inherit color and opacity, including on dark backgrounds.
These are Gum's own shapes, so their curves can differ from KaTeX and LaTeX.
No font glyph is stretched horizontally to simulate a wide hat or tilde.

Run `bun run compare --suite 6 -S 48 -o /tmp/typography.png` for the common
Gum/KaTeX/LaTeX gallery; add `--inline` for text style. The extended gallery is
`--suite 6-extra --no-latex`, covering the additional KaTeX command names.

<a id="math_decorations-example"></a>

### Example

```jsx
// Accents, wide shapes, brace labels, and arrows share the surrounding math context.
<Box font-size={px(32)} padding={em(0.8)}>
  <VStack gap={em(0.8)} align="start">
    <Text font-size={em(0.65)} font-weight={bold}>Accents and scripts</Text>
    <Latex>{String.raw`
      \hat{x}_i^2 + \bar{f}_j + \vec{v}
      \qquad
      \widehat{a+b+c} + \widetilde{ABC}
    `}</Latex>
    <Text font-size={em(0.65)} font-weight={bold}>Braces and labels</Text>
    <Latex>{String.raw`
      \overbrace{a_1+a_2+\cdots+a_n}^{n\text{ terms}}
      = \underbrace{S_n}_{\text{total}}
    `}</Latex>
    <Text font-size={em(0.65)} font-weight={bold}>An arrow follows both labels</Text>
    <MathText>
      A
      <XArrow below="f^{-1}">
        <TextMode>an invertible map</TextMode>
      </XArrow>
      B
      <XArrow label="xrightleftharpoons" below="h">g</XArrow>
      C
    </MathText>
    <Box padding={em(0.7)} background={interp(black, blue, 0.18)} color={white}>
      <MathText>
        <Accent accent="widehat">
          <Plot
            width={em(4)}
            aspect={2.4}
            axis={false}
            grid={false}
            margin={0}
            xlim={[0, pi]}
            ylim={[0, 1.1]}
          >
            <SymLine fy={sin} xlim={[0, pi]} stroke={white} stroke-width={em(0.065)} />
          </Plot>
        </Accent>
        =
        <Accent accent="widecheck">
          <MathText>a+b+c</MathText>
        </Accent>
        +
        <Accent accent="utilde" under={true}>
          <MathText>ABC</MathText>
        </Accent>
      </MathText>
    </Box>
  </VStack>
</Box>
```

---

<a id="math_expressions"></a>

## Ordinary mathematical expressions

Parsed TeX and explicit JSX use the same math elements. Use a string for a compact
formula, or compose elements when operands, styles, or colors come from code.

The example includes Euler's identity, the quadratic formula, a Gaussian
integral, a sum with limits, and nested fractions with a middle delimiter.

```jsx
<MathText style="display">
  x=
  <Frac>
    <MathText>
      -b±
      <Sqrt>
        <MathText>
          <SupSub sup="2">b</SupSub>
          -4ac
        </MathText>
      </Sqrt>
    </MathText>
    <MathText>2a</MathText>
  </Frac>
</MathText>
```

[SupSub](../elements/math.md#SupSub) attaches scripts and limits;
[Frac](../elements/math.md#Frac) selects numerator and denominator styles;
[Sqrt](../elements/math.md#Sqrt) cramps its radicand and sizes the surd.
[MathOp](../elements/math.md#MathOp) sets operator size and limit policy;
[Bracket](../elements/math.md#Bracket) measures a complete delimiter group.

Direct string operands are TeX source, just like string children of `MathText`.
Keep nested element operands indented on separate lines so the mathematical
structure stays readable. Whitespace between elements is ignored by math.

All geometry is in outline paths, so the CLI, editor, and docs previews use the
same layout without installed fonts. [Math authoring](../guides/math.md) describes font
setup and comparison with KaTeX and LaTeX. Continue with [inline formulas](math.md#inline_math),
[matrices and arrays](math.md#math_arrays), or [aligned equations](math.md#aligned_math).

<a id="math_expressions-example"></a>

### Example

```jsx
// Ordinary formulas: parsed TeX and direct JSX share script, fraction, root, and operator layout.
<Box font-size={px(32)} padding={em(1)}>
  <VStack gap={em(0.8)} align="start">
    <Text font-size={em(0.6)} color={slate}>Euler's identity</Text>
    <MathText style="display">
      <SupSub sup="iπ">e</SupSub>
      +1=0
    </MathText>
    <Text font-size={em(0.6)} color={slate}>The quadratic formula, composed from elements</Text>
    <MathText style="display">
      x=
      <Frac>
        <MathText>
          -b±
          <Sqrt>
            <MathText>
              <SupSub sup="2">b</SupSub>
              -4ac
            </MathText>
          </Sqrt>
        </MathText>
        <MathText>2a</MathText>
      </Frac>
    </MathText>
    <Text font-size={em(0.6)} color={slate}>Gaussian integral</Text>
    <Latex>{String.raw`\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt{\pi}`}</Latex>
    <Text font-size={em(0.6)} color={slate}>Series with limits</Text>
    <MathText style="display">
      <SupSub sub="n=0" sup="∞">
        <MathOp>∑</MathOp>
      </SupSub>
      <Frac>
        <SupSub sup="n">x</SupSub>
        <MathText>n!</MathText>
      </Frac>
    </MathText>
    <Text font-size={em(0.6)} color={slate}>Nested fractions and middle delimiters</Text>
    <Latex>{String.raw`\left\{x\middle|\frac{1}{1+\frac{1}{x}}>0\right\}`}</Latex>
  </VStack>
</Box>
```

---

<a id="math_plot_labels"></a>

## Math on plots and axes

Axis tick labels can be Gum elements. Supply `[value, element]` pairs to
**Plot**'s `xticks` or `yticks`, or to **Axis**'s `ticks`. The numeric value
determines position; **Tex** supplies the label's math typography.

```jsx
const ticks = [
  [0, <Tex>0</Tex>],
  [pi / 2, <Tex>{String.raw`\frac\pi2`}</Tex>],
  [pi, <Tex>{String.raw`\pi`}</Tex>],
]
```

Titles, axis titles, and legend labels also accept elements. Use **Text** with
inline **Tex** for mixed prose, or **Latex** for a display-style label. Labels
are measured before the plot's margins are chosen, so a fraction can reserve
more height than a plain numeral. Math elements receive the plot's inherited
font size and color; explicit styling on the formula takes precedence.

The runnable example uses formulas in every label position. It plots sine and
cosine with multiples of π on the horizontal axis and a mathematical legend.

See [Plot](../elements/plotting.md#Plot), [Axis](../elements/plotting.md#Axis),
[math inside prose](math.md#inline_math), and [math in slides](math.md#math_slides).

<a id="math_plot_labels-example"></a>

### Example

```jsx
// Tick values, axis titles, the legend, and the plot title can all contain formulas.
const ticks = [
  [0, <Tex>0</Tex>],
  [pi / 2, <Tex>{String.raw`\frac{\pi}{2}`}</Tex>],
  [pi, <Tex>{String.raw`\pi`}</Tex>],
  [3 * pi / 2, <Tex>{String.raw`\frac{3\pi}{2}`}</Tex>],
  [tau, <Tex>{String.raw`2\pi`}</Tex>],
]
const title = <Text font-size={em(1.2)}>
  Phase shifts: <Tex>\cos x = \sin(x+\pi/2)</Tex>
</Text>
return (
  <Plot
    aspect={1.5}
    font-size={px(25)}
    title={title}
    xlabel={<Tex>x</Tex>}
    ylabel={<Tex>f(x)</Tex>}
    xlim={[0, tau]}
    ylim={[-1.2, 1.2]}
    xticks={ticks}
    yticks={[-1, 0, 1]}
  >
    <SymLine fy={sin} xlim={[0, tau]} stroke={blue} stroke-width={px(2.5)} />
    <SymLine fy={cos} xlim={[0, tau]} stroke={red} stroke-width={px(2.5)} />
    <Legend x={pi} y={1} anchor="start">
      <LegendItem badge-color={blue}><Tex>{String.raw`\sin x`}</Tex></LegendItem>
      <LegendItem badge-color={red}><Tex>{String.raw`\cos x`}</Tex></LegendItem>
    </Legend>
  </Plot>
)
```

---

<a id="math_slides"></a>

## Math in slides

**Slide** uses the same elements as ordinary diagrams. Put inline **Tex** in a
**Text** title, display **Latex** alongside a plot, and math inside captions or
explanatory prose. A slide does not need a separate math renderer or font setup.

Set one base `font-size` and express the rest of the composition with relative
sizes. The slide supplies its body allocation; an **HStack** splits that width
between `grow={1}` on the text column and `grow={1.1}` on the plot. Neither column
needs an explicit width. The plot's `aspect={1.3}` determines its height, and
its smaller `em(0.6)` font keeps tick labels subordinate to the explanation.

Title size and gaps also use `em()`. Standalone formulas fit their columns
automatically, while inline math keeps the paragraph's font scale. The slide's
[fit prop](../guides/sizing.md#fitting) shrinks the completed composition into the host's
bounds. No authored pixel width or height is required.

The runnable slide combines a mathematical title, two display equations, mixed
prose, and a shaded Gaussian curve. Save it
as `slide.jsx` to render it:

```sh
gum slide.jsx -o slide.svg
gum slide.jsx -W 320 -H 240 -o slide-small.svg
gum slide.jsx -o slide.png --ratio 2
```

See [Slide](../elements/text.md#Slide), [plot labels](math.md#math_plot_labels), and
[formulas inside prose](math.md#inline_math). Single-figure PDF export is available
with `-o slide.pdf`; multi-file decks remain a separate planned workflow.

<a id="math_slides-example"></a>

### Example

```jsx
// A slide combines a mathematical title, a formula, a plot, and inline math in prose.
<Slide fit
  font-size={px(15)}
  title={
    <Text font-size={em(1.4)}>
      The Gaussian integral: <Tex>{String.raw`I=\sqrt\pi`}</Tex>
    </Text>
  }
>
  <HStack gap={em(1)} align="center">
    <VStack grow={1} gap={em(1)}>
      <Latex>
        {String.raw`I = \int_{-\infty}^{\infty} e^{-x^2} \, dx`}
      </Latex>
      <Text>
        Squaring the integral gives <Tex>I^2</Tex>, the area under a rotationally symmetric surface.
      </Text>
      <Latex color={blue}>
        {String.raw`I^2 = \int_0^{2\pi} \int_0^{\infty} e^{-r^2} r \, dr \, d\theta = \pi`}
      </Latex>
    </VStack>
    <Plot
      aspect={1.3}
      grow={1.1}
      font-size={em(0.6)}
      xlim={[-3, 3]}
      ylim={[0, 1.1]}
    >
      <SymFill xlim={[-3, 3]} upper={(x) => exp(-x * x)} fill={blue} opacity={0.15} />
      <SymLine xlim={[-3, 3]} fy={(x) => exp(-x * x)} stroke={blue} />
    </Plot>
  </HStack>
</Slide>
```

---

<a id="scenic_route"></a>

## The Scenic Route

A direct arrow, a hooked arrow, and a custom figure-eight arrow provide three routes from A to B.

The custom arrow occupies a MathBox with relation spacing. Its graph has explicit em dimensions, its spline has fixed head geometry, and the polar samples are converted from point objects to tuples for the path arithmetic. The `head-curve` prop supplies the curved barb.

See [MathBox](../elements/math.md#MathBox).

<a id="scenic_route-example"></a>

### Example

```jsx
// A figure-eight spline acts as a relation between two math atoms.
const arc = (cx, radius, a, b) =>
  linspace(a, b, 13).map((angle) => {
    const point = polard(angle, radius, [cx, 0])
    return [point.x, point.y]
  })
const rope = (width, cx, radius) =>
  [
    [-width / 2, 0],
    [-width / 4, 0],
    [-0.36 * cx, 0.03],
    ...arc(cx, radius, 135, -135),
    [0, 0],
    ...arc(-cx, radius, 45, 315),
    [0.36 * cx, -0.03],
    [width / 4, 0],
    [width / 2, 0],
  ].map(([x, y]) => [width / 2 + x, 0.5 - y])
const ScenicArrow = () => (
  <MathBox klass="mrel">
    <Graph width={em(4)} height={em(1.2)} xlim={[0, 2.5]} ylim={[0, 1]} flip-y={false}>
      <Arrow
        points={rope(2.5, 0.245, 0.175)}
        curve
        tension={0.5}
        stroke={slate}
        stroke-width={px(2.5)}
        head-size={px(12)}
        head-curve={0.7}
      />
    </Graph>
  </MathBox>
)
const Row = ({ label, children }) => (
  <HStack gap={em(1)} align="center">
    <Box width={em(7)}>{children}</Box>
    <Text font-size={em(0.625)}>{label}</Text>
  </HStack>
)
return (
  <Box fit font-size={px(32)} padding={em(0.95)}>
    <TitleFrame
      title="From A to B"
      title-font-size={em(0.625)}
      padding={em(0.75)}
      border-radius={em(0.45)}
    >
      <VStack gap={em(1)}>
        <Row label="the direct method">
          <Latex>{String.raw`A\xrightarrow{\quad\quad}B`}</Latex>
        </Row>
        <Row label="the polite detour">
          <Latex>{String.raw`A\xhookrightarrow{\quad\quad}B`}</Latex>
        </Row>
        <Row label="the scenic route">
          <MathText>
            A
            <ScenicArrow />B
          </MathText>
        </Row>
      </VStack>
    </TitleFrame>
  </Box>
)
```

---

<a id="shape_algebra"></a>

## Shape Algebra

A subdivided square is the value of a series, a colored circle appears under a radical, and a matrix transpose swaps colored swatches.

Math operands are ordinary Gum elements. Each geometric operand has explicit em dimensions, while MathArray measures the cells and Bracket sizes the fences. Compound operands remain separate JSX children.

The TitleFrame uses `frame-aspect={1}` to make a content-sized square border.
Svg hugs the frame and its raised title without an outer Box or fixed dimensions.
The frame's `fit` keeps the complete composition inside smaller previews.
Spacing, borders, corner radii, and the title font use ems, so changing the single
base font size on TitleFrame scales the whole figure.

See [MathArray](../elements/math.md#MathArray).

<a id="shape_algebra-example"></a>

### Example

```jsx
// Ordinary shapes become operands in a series, a radical, and a matrix transpose.
const halves = [
  [0.5, 0, 1, 1],
  [0, 0.5, 0.5, 1],
  [0.25, 0, 0.5, 0.5],
  [0, 0.25, 0.25, 0.5],
  [0.125, 0, 0.25, 0.25],
  [0, 0.125, 0.125, 0.25],
]
const paint = palette(blue, red, [0, halves.length - 1])
const HalfSquare = () => (
  <Group width={em(2.2)} height={em(2.2)}>
    {halves.map(([x0, y0, x1, y1], i) => (
      <Rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={paint(i)} stroke={none} />
    ))}
    <Rect fill={none} stroke={slate} stroke-width={em(0.03)} />
  </Group>
)
const Matrix = ({ colors }) => (
  <Bracket delim="square">
    <MathArray ncol={2} colsep={em(0.12)}>
      {colors.map((color) => (
        <Square width={em(0.75)} fill={color} stroke={none} />
      ))}
    </MathArray>
  </Bracket>
)
return (
  <TitleFrame
    fit
    font-size={px(34)}
    frame-aspect={1}
    title="Shape Algebra"
    title-font-size={em(0.6)}
    padding={em(0.7)}
    border-width={em(0.03)}
    border-radius={em(0.4)}
    align="center"
  >
    <VStack gap={em(0.8)} align="center">
      <MathText style="display">
        <SupSub sup={String.raw`\infty`} sub="n=1">
          <MathOp>{String.raw`\sum`}</MathOp>
        </SupSub>
        <Frac>
          1
          <SupSub sup="n">2</SupSub>
        </Frac>
        =
        <HalfSquare />
        = 1
      </MathText>
      <MathText style="display">
        r =
        <Sqrt>
          <Frac>
            <Circle width={em(1.1)} fill={interp(white, blue, 0.7)} stroke={none} />
            <MathSymbol>{String.raw`\pi`}</MathSymbol>
          </Frac>
        </Sqrt>
      </MathText>
      <MathText style="display">
        <SupSub sup={String.raw`\mathsf{T}`}>
          <Matrix colors={[blue, red, green, yellow]} />
        </SupSub>
        =
        <Matrix colors={[blue, green, red, yellow]} />
      </MathText>
    </VStack>
  </TitleFrame>
)
```

---

<a id="stokes_theorem"></a>

## Stokes’ Theorem

An obliquely projected surface shows its oriented boundary, tangent arrows, and surface normals beside the theorem and explanatory prose.

Projection arithmetic stays in local point tuples. The surface derivatives drive both tangents and normals; the x derivative with respect to v includes the quadratic term. The figure and paragraph have explicit allocations. Custom math and geometry share the same row.

See [Arrow](../elements/geometry.md#Arrow).

Relative flex bases establish the diagram and prose widths. The root's `fit` prop preserves
this side-by-side composition and hugs its scaled extent in smaller hosts.

<a id="stokes_theorem-example"></a>

### Example

```jsx
// A projected surface with its oriented boundary, tangent arrows, and normal vectors.
const addPair = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mulPair = (a, k) => [a[0] * k, a[1] * k]

//
// constants
//

const center = [0.48, 0.52]
const basisX = [0.39, 0]
const basisY = [0.06, 0.29]
const basisZ = [0.03, -0.22]
const boundaryCount = 18
const meshH = [-0.35, 0.28]
const meshV = [-0.52, 0, 0.48]
const tangentCount = 6
const tangentPhase = 0.58
const tangentLength = 0.2
const normalLength = 0.15
const normalPoints = [
  [-0.45, -0.02],
  [-0.1, -0.22],
  [0.26, 0.08],
  [0.32, 0.52],
  [-0.22, 0.64],
]

//
// vector ops
//

const add3 = ([ax, ay, az], [bx, by, bz]) => [ax + bx, ay + by, az + bz]
const scale3 = ([x, y, z], s) => [s * x, s * y, s * z]
const cross3 = ([ax, ay, az], [bx, by, bz]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
]

const project_vec = ([x, y, z]) =>
  addPair(mulPair(basisX, x), addPair(mulPair(basisY, y), mulPair(basisZ, z)))

const project = (point) => addPair(center, project_vec(point))

//
// surface definitions
//

const surface_point = (u, v) => {
  const x = u + 0.09 * u * v - 0.05 * v * v
  const y = v + 0.05 * u - 0.06 * u * u + 0.03 * v * v
  const z = 0.5 - 0.24 * u * u - 0.46 * v * v + 0.08 * u - 0.05 * v + 0.08 * u * v
  return [x, y, z]
}

const surface_du = (u, v) => [1 + 0.09 * v, 0.05 - 0.12 * u, -0.48 * u + 0.08 + 0.08 * v]

const surface_dv = (u, v) => [0.09 * u - 0.1 * v, 1 + 0.06 * v, -0.92 * v - 0.05 + 0.08 * u]

const boundary_tangent = (t) => {
  const [u, v] = [cos(t), sin(t)]
  return project_vec(add3(scale3(surface_du(u, v), -sin(t)), scale3(surface_dv(u, v), cos(t))))
}

//
// point generators
//

const boundary_sample = (t) => project(surface_point(cos(t), sin(t)))

const iso_u = (u0) => {
  const span = sqrt(1 - u0 * u0)
  return linspace(-span, span, 5).map((v) => project(surface_point(u0, v)))
}

const iso_v = (v0) => {
  const span = sqrt(1 - v0 * v0)
  return linspace(-span, span, 5).map((u) => project(surface_point(u, v0)))
}

const tangent_arrow = (turn) => {
  const t = 2 * pi * turn
  const start = boundary_sample(t)
  const delta = normalize(boundary_tangent(t), 2)
  const end = addPair(start, mulPair(delta, tangentLength))
  return [start, end]
}

const normal_arrow = ([u, v]) => {
  const base = project(surface_point(u, v))
  const normal = project_vec(cross3(surface_du(u, v), surface_dv(u, v)))
  const delta = normalize(normal[1] > 0 ? mulPair(normal, -1) : normal, 2)
  const tip = addPair(base, mulPair(delta, normalLength))
  return [base, tip]
}

//
// diagram elements
//

const boundary = linspace(0, 2 * pi, boundaryCount, false).map(boundary_sample)
const [meshH1, meshH2] = meshH.map(iso_v)
const [meshV1, meshV2, meshV3] = meshV.map(iso_u)
const normals = normalPoints.map(normal_arrow)
const tangents = linspace(0, 1, tangentCount, false).map(tangent_arrow)

const SurfaceDiagram = (props) => (
  <Group aspect={1} {...props}>
    <Spline
      closed
      points={boundary}
      stroke={blue}
      stroke-width={px(2.5)}
      fill={interp(white, purple, 0.15)}
      tension={0.5}
    />
    {[meshH1, meshH2, meshV1, meshV2, meshV3].map((points) => (
      <Spline
        points={points}
        stroke={interp(white, purple, 0.45)}
        stroke-dasharray={[px(4), px(3)]}
      />
    ))}
    {tangents.map(([start, end]) => (
      <Arrow from={start} to={end} stroke={blue} stroke-width={px(2)} head-size={px(13)} />
    ))}
    {normals.map(([base, tip]) => (
      <Arrow from={base} to={tip} stroke={purple} stroke-width={px(2)} head-size={px(12)} />
    ))}
    <Latex x={0.48} y={0.5} anchor="center" font-size={em(1.6)} color={purple}>
      S
    </Latex>
    <Latex
      x={0.05}
      y={0.55}
      anchor="center"
      font-size={em(1.25)}
      color={blue}
    >{String.raw`\partial S`}</Latex>
    <Latex
      x={0.56}
      y={0.17}
      anchor="center"
      font-size={em(1.25)}
      color={purple}
    >{String.raw`\hat n`}</Latex>
  </Group>
)
return <Box fit font-size={px(20)} padding={em(1.5)}>
  <VStack gap={em(1.4)}>
    <Text font-size={em(2)} font-weight={bold}>
      Stokes' Theorem
    </Text>
    <HStack gap={em(1.7)} align="center">
      <SurfaceDiagram width={em(20)} />
      <TextCol width={em(15)} gap={em(1.35)} font-size={em(1.4)}>
        <TextFrame
          padding={em(0.85)}
          border-radius={em(0.55)}
          background={interp(white, purple, 0.05)}
          border-color={interp(white, purple, 0.3)}
        >
          <Latex font-size={em(1.2)}>{String.raw`
            \oint_{\partial S} F \cdot dr = \iint_S (\nabla \times F) \cdot dS
          `}</Latex>
        </TextFrame>
        <Text>
          The line integral of a vector field <Tex>F</Tex> around the closed boundary <Tex>\partial S</Tex> equals the surface integral of its curl over an oriented surface <Tex>S</Tex> bounded by that curve.
        </Text>
      </TextCol>
    </HStack>
  </VStack>
</Box>
```
