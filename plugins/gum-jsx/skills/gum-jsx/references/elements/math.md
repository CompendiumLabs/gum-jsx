# Math elements

<a id="Accent"></a>

## Accent

Put a glyph or a width-fitting decoration over an operand. Strings parse as TeX;
elements, including ordinary Gum figures, keep their natural size.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Accented operand. |
| accent | `"hat"` | Command name, with or without a leading backslash. |
| stretchy | Inferred from the name | Fit a drawn decoration to the body. |
| under | `false` | Place a stretchy decoration beneath the body. |
| shifty | `true` | Apply a single character's font skew. |
| mode | `"math"` | Symbol table for a fixed glyph; `"text"` supports text accents. |
| head-curve | `0.7` | Barb curvature from `0` to `1` for drawn arrow accents, including `vec`. |

Fixed accents include `hat`, `bar`, `vec`, `dot`, `ddot`, `acute`, `grave`,
`breve`, `check`, `tilde`, and `mathring`. Wide hats, checks, and tildes fit the
measured width, including a figure's width. Arrows, groups, and line segments
use the [MathStretch](math.md#MathStretch) names.

The body is cramped for an over-accent. A [SupSub](math.md#SupSub) around an accented
single character attaches its scripts to the original character; an accented
compound operand supplies its complete decorated box. Fixed accent overhang
does not enlarge advance. Stretchy accents can enlarge a narrow operand to
their minimum width. The result is an ordinary math atom.

See [math decorations](../gallery/math.md#math_decorations).

<a id="Accent-example"></a>

### Example

```jsx
// Character accents keep their script attachment; wide accents follow the body.
<Box font-size={px(38)} padding={em(0.7)}>
  <MathText>
    <SupSub sup="2" sub="i">
      <Accent accent="hat">x</Accent>
    </SupSub>
    +
    <Accent accent="vec">v</Accent>
    =
    <Accent accent="widehat">
      <MathText>a+b+c</MathText>
    </Accent>
  </MathText>
</Box>
```

---

<a id="Bracket"></a>

## Bracket

An atom with left/right fences fitted to its complete body. Middle delimiters use the same measured extent and do not enlarge their own sizing target.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Body elements or TeX source; with middle delimiters, one run per interval. |
| delim | `"round"` | Named pair: round, square, curly, or angle. |
| left_delim / right_delim | Named pair | Individual glyphs/commands; null omits a fence, while `"."` reserves TeX null-delimiter space. |
| middle | Absent | One delimiter string, or an array separating the body runs. |
| level | Automatic | Fixed level from `1` to `4`, corresponding to big through Bigg. |
| delimiter_height | Body extent | Fixed requested height as a Gum length; use this or level. |
| style / size_index | Inherited | Math style and optional TeX size index. |
| klass / left / right | `"minner"` | Classes exposed to the surrounding row. |

TeX `\left…\middle…\right` uses the same group measurement. Nested groups
measure independently. `\big`, `\Big`, `\bigg`, `\Bigg`, and their l/m/r
variants select fixed delimiter levels and the corresponding atom classes.

Missing glyphs in a Size font are skipped. Beyond the largest available glyph,
ordinary fences scale uniformly; vertical bars preserve their width. Extensible
piece assembly is not implemented. See [math authoring](../guides/math.md).

<a id="Bracket-example"></a>

### Example

```jsx
// Bracket: Size all fences against the complete body, including middle delimiters.
<Box font-size={px(36)} padding={em(0.8)}>
  <MathCol gap={em(0.7)} justify="start">
    <Bracket delim="round" style="display">
      <Frac>
        <MathText>a+b</MathText>
        <MathText>c+d</MathText>
      </Frac>
    </Bracket>
    <Bracket delim="curly" middle="|" style="display">
      <MathText>x</MathText>
      <MathText>
        <Frac>
          <MathText>1</MathText>
          <MathText>x</MathText>
        </Frac>
        &gt;0
      </MathText>
    </Bracket>
    <Bracket delim="angle" level={3} color={blue}>
      <MathText>x,y</MathText>
    </Bracket>
  </MathCol>
</Box>
```

---

<a id="Enclose"></a>

## Enclose

Frame, highlight, cancel, or strike through a math operand.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | TeX or an element. |
| notation | `"box"` | `"box"`, `"colorbox"`, `"cancel"`, `"bcancel"`, `"xcancel"`, or `"sout"`. |
| background | Absent | Background paint for box/colorbox. |
| border-color | Inherited color | Border or cancellation paint. |
| padding | `em(0.3)` | Space inside a box, in addition to its border. |
| thickness | TeX rule, or `em(0.046)` for cancellation | Border/line thickness. |

Boxes enlarge the logical dimensions and preserve the body's baseline with
padding. Cancellation and strikeout retain the original dimensions; their
lines draw over the body and can extend beyond it. A single-character cancel
extends vertically; a compound cancel extends horizontally. The result is an
ordinary atom.

TeX forms include `\boxed`, `\fbox`, `\colorbox`, `\fcolorbox`, `\cancel`,
`\bcancel`, `\xcancel`, and text-mode `\sout`. The text-box forms accept
math between `$…$`. `\phase`, `\angl`, and `\angln` remain unsupported.

<a id="Enclose-example"></a>

### Example

```jsx
// Enclosures mix frames, backgrounds, and overprinted cancellation marks.
<Box font-size={px(36)} padding={em(0.8)}>
  <MathText>
    <Enclose background={interp(white, yellow, 0.3)} border-color={blue}>
      <MathText>x^2+1</MathText>
    </Enclose>
    =
    <Enclose notation="cancel" color={red}>y</Enclose>
    +
    <Enclose notation="xcancel">
      <Frac>
        <MathText>a</MathText>
        <MathText>b</MathText>
      </Frac>
    </Enclose>
  </MathText>
</Box>
```

---

<a id="Frac"></a>

## Frac

A fraction with numerator and denominator styles, baseline shifts, and clearance around its rule. Generalized fractions can omit the rule or add delimiters.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Required | Exactly two operands: numerator, then denominator. |
| has_bar | `true` | Draw the fraction rule; false uses no-bar clearance. |
| thickness | Style metric | Rule thickness as a Gum length, such as `px(2)` or `em(0.04)`. |
| continued | `false` | Reserve a continued-fraction numerator strut and omit right-side padding/delimiter. |
| padding | TeX null-delimiter space | Horizontal padding on sides without a delimiter. |
| left_delim / right_delim | Absent | Delimiters selected at the style's fraction delimiter height. |
| style / size_index | Inherited | Fraction style and optional TeX size index. |
| klass / left / right | `"mord"` | Classes exposed by the fraction. |

TeX supports `\frac`, `\dfrac`, `\tfrac`, `\cfrac`, binomials, infix
`\over`/`\atop`/`\choose`, and `\genfrac`. Generalized fractions preserve
bar thickness, delimiters, and style. Absolute TeX dimensions keep their size
in scripts; public Gum `em()` thickness uses the active math em.

The denominator is cramped. Without a bar, clearance is measured between the
two operands rather than reserving space around an invisible rule. See
[ordinary formulas](../gallery/math.md#math_expressions).

<a id="Frac-example"></a>

### Example

```jsx
// Frac: Style-dependent fractions, custom rules, and binomial delimiters.
<Box font-size={px(36)} padding={em(0.8)}>
  <MathCol gap={em(0.7)} justify="start">
    <Frac style="display">
      <MathText>a+b</MathText>
      <MathText>c+d</MathText>
    </Frac>
    <Frac thickness={px(3)} color={blue}>
      <MathText>1</MathText>
      <MathText>
        1+
        <Frac>
          <MathText>1</MathText>
          <MathText>1+x</MathText>
        </Frac>
      </MathText>
    </Frac>
    <Frac has-bar={false} left-delim="(" right-delim=")" style="display">
      <MathText>n</MathText>
      <MathText>k</MathText>
    </Frac>
  </MathCol>
</Box>
```

---

<a id="HorizBrace"></a>

## HorizBrace

An overbrace or underbrace with an optional label. The body sets the brace
width; a wider label increases the complete box without stretching the brace.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Braced operand; strings parse as TeX. |
| label | Absent | Element or TeX label, set in the corresponding script style. |
| over | `true` | Set `false` for an underbrace. |
| bracket | `false` | Use a square horizontal bracket. |
| thickness | Braces `em(0.1)`, brackets `em(0.12)` | Decoration thickness. |

The body uses display typography at the surrounding math size, including
display spacing, fractions, and operator limits inside a script.
There is a 0.1-em gap between body and brace and a 0.2-em gap before the label.
The completed expression is an inner atom. Color and opacity inherit.

TeX uses `\overbrace{…}^{label}` or `\underbrace{…}_{label}`. If both scripts
are present, the matching one labels the brace and the opposite one remains
a side script. In JSX, use `label` and wrap in [SupSub](math.md#SupSub) for any side
scripts. `\overbracket` and `\underbracket` work too.

<a id="HorizBrace-example"></a>

### Example

```jsx
// The body sets the brace width, and the label uses script style.
<Box font-size={px(36)} padding={em(0.7)}>
  <MathText style="display">
    <HorizBrace label={String.raw`n\text{ terms}`}>
      <MathText>a_1+a_2+\cdots+a_n</MathText>
    </HorizBrace>
    =
    <HorizBrace over={false} label={String.raw`\text{total}`}>
      <MathText>S_n</MathText>
    </HorizBrace>
  </MathText>
</Box>
```

---

<a id="Lap"></a>

## Lap

A zero-advance ordinary atom that still draws its operand. Height, depth, and
baseline remain intact. Strings parse as TeX.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Overhanging operand. |
| align | `"left"` | Align the operand's left edge, center, or right edge to the insertion point. |

`align="left"` places the operand after the insertion point (`\mathrlap`).
`align="right"` places it before the point (`\mathllap`). `align="center"`
centers it on the point (`\mathclap`). The default is `"left"`.

Ink overhang is retained independently of the zero width. A lap does not move
the following content backward; use negative [MathSpacer](math.md#MathSpacer)
advance for that. Combine with [Smash](math.md#Smash) to suppress both dimensions.
Explicit SVG viewports need padding around overhanging ink.

<a id="Lap-example"></a>

### Example

```jsx
// A centered lap keeps a long limit from widening the sum.
<Box font-size={px(40)} padding={em(1)}>
  <MathText style="display">
    <SupSub
      sub={
        <Lap align="center">
          <MathText>1\leq i\leq n</MathText>
        </Lap>
      }
    >
      <MathOp>\sum</MathOp>
    </SupSub>
    <MathText>x_i</MathText>
  </MathText>
</Box>
```

---

<a id="Latex"></a>

## Latex

A complete formula in display style, with a one-em minimum line box. Supports ordinary expressions with scripts, fractions, indexed roots, operators, limits, and delimiters.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | TeX source or MathText-compatible children. |
| inline | `false` | Choose text style instead of display style. |
| style | Inherited or display | Explicit math style overrides the default. |
| size_index | Inherited or `6` | TeX text-size index from `1` (tiny) to `11` (Huge). |
| strut | `true` | Keep at least a one-em line box. |
| macros / warnings / on_error | MathText defaults | Parser options and visible error handling. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="Latex-example"></a>

### Example

```jsx
// Latex: A complete formula in display style, with a one-em minimum line box.
<Box font-size={px(32)} padding={em(0.65)}>
  <Latex>{String.raw`\sin x+\cos y=\operatorname{rank}(A)`}</Latex>
</Box>
```

---

<a id="MathArray"></a>

## MathArray

A naturally sized math table. Each column takes the widest cell advance, and
each row shares a baseline with enough height and depth for its tallest cells.
The complete table is an ordinary math atom centered on the math axis.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Nested row arrays, or flat JSX cells chunked by `ncol`. Cells can be TeX strings, elements, or `null` for an empty cell. |
| ncol | Alignment count, or `1` | Number of columns when chunking flat children. |
| cols | Centered columns | A string such as `"r|c:l"`, or column descriptors. `l`, `c`, `r` align cells; `|` and `:` draw solid and dashed separators. |
| colsep | `em(0.5)` | Gap on each side of a column. Adjacent columns normally have twice this gap. |
| outer | `false` | Also apply column gaps at the left and right edges. |
| stretch | `1` | Positive multiplier for each row's 1.2-em minimum strut. Tall cells can enlarge it. |
| jot | `false` | Add `em(0.3)` of leading between rows, with none after the last. |
| rowgaps | Empty | Optional lengths after rows. Positive values deepen the row's minimum strut; negative values move the next row upward. |
| hlines | Empty | Rules at row boundaries, including before the first and after the last row. `false` is solid, `true` is dashed; multiple flags make multiple rules. |
| thickness | `em(0.04)` | Rule thickness. Zero omits the ink. |
| fill | Inherited color | Rule paint, independent of cell colors. |
| small | `false` | Default to script cells, half-height struts, and smallmatrix column spacing. |
| cell_style | Inherited, or `"script"` when small | Default math style for cells, independently of the table's style. Explicit styles within a cell still apply. |
| style / size_index | Inherited | Table math style and optional TeX size index. |
| klass / left / right | `"mord"` | Atom classes exposed by the complete table. |

Column descriptors use `{ type: "align", align: "l", pregap: em(0), postgap: em(1) }`
or `{ type: "separator", separator: "|" }`. Explicit pre/post gaps override
`colsep`; `outer` still controls whether the edge gaps apply. Adjacent vertical
rules have `em(0.2)` between their centerlines, and stacked horizontal rules
have `em(0.25)`. Horizontal and vertical rule ink meets at the corners without
changing column advances.

Use an empty `<MathText />` to reserve an empty cell in flat JSX. Whitespace and
conditional children in that form are skipped. Pass nested row arrays through
`children` when constructing **MathArray** in JavaScript; JSX flattens expression
arrays. Nested row data preserves cell
positions. Ragged rows are allowed. A zero-row table is empty; an explicit empty
row still reserves its strut.

Cells keep their natural size. Width offers do not wrap or shrink the table;
small exact allocations report overflow. For wrapping prose cells, give
[Text](text.md#Text) a width; give figures and plots explicit dimensions. Use
the [fit prop](../guides/sizing.md#fitting) on the table when scaling is intended. A surrounding
[Bracket](math.md#Bracket) selects delimiters after measuring all cells and rules.

See [matrices and arrays](../gallery/math.md#math_arrays) and
[aligned equations](../gallery/math.md#aligned_math) for TeX environments.

<a id="MathArray-example"></a>

### Example

```jsx
// MathArray: Natural columns, shared row baselines, and explicit table rules.
<Box font-size={px(30)} padding={em(0.7)}>
  <MathArray
    ncol={3}
    cols="r|c:l"
    outer={true}
    stretch={1.15}
    colsep={em(0.4)}
    hlines={[[false], [], [true], [false]]}
    rowgaps={[null, em(0.15)]}
  >
    <MathText>x</MathText>
    <Frac>
      <MathText>a+b</MathText>
      <MathText>c</MathText>
    </Frac>
    <TextMode>positive</TextMode>
    <MathText>y</MathText>
    <MathText>0</MathText>
    <TextMode>zero</TextMode>
    <MathText>z</MathText>
    <MathText>-1</MathText>
    <TextMode>negative</TextMode>
  </MathArray>
</Box>
```

---

<a id="MathBox"></a>

## MathBox

Pad, allocate, and align one math child while preserving its baseline and axis. The wrapper is an ordinary grouped atom by default.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | One element or TeX string. |
| padding | `px(0)` | Inset lengths around the content. |
| align | `"start"` | Ordinary Box alignment; width changes allocate space without scaling glyphs. |
| klass / left / right | `"mord"` | Classes exposed by the wrapper. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathBox-example"></a>

### Example

```jsx
// MathBox: Pad, allocate, and align one math child while preserving its baseline and axis.
<Box font-size={px(32)} padding={em(0.65)}>
  <Frame border-color={blue}>
    <MathBox padding={em(0.5)} width={em(8)} align="center">
      <MathText>a+b=c</MathText>
    </MathBox>
  </Frame>
</Box>
```

---

<a id="MathChoice"></a>

## MathChoice

Select one of four children according to the active math style, like TeX
`\mathchoice`. Give children in display, text, script, and scriptscript order.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Required | Exactly four math branches, one for each size style. |

The selected branch inherits the current style and participates in the
surrounding [MathText](math.md#MathText) sequence's spacing. Use **MathText** around
multiple elements in one branch. Use an empty `<MathText />` to keep an empty
branch's position in JSX.

<a id="MathChoice-example"></a>

### Example

```jsx
// The same choice selects a different branch in display and script styles.
<Box font-size={px(36)} padding={em(0.7)}>
  <MathCol gap={em(0.5)}>
    <MathText style="display">
      <MathChoice>
        <MathText>D</MathText>
        <MathText>T</MathText>
        <MathText>S</MathText>
        <MathText>Q</MathText>
      </MathChoice>
    </MathText>
    <MathText style="script">
      <MathChoice>
        <MathText>D</MathText>
        <MathText>T</MathText>
        <MathText>S</MathText>
        <MathText>Q</MathText>
      </MathChoice>
    </MathText>
  </MathCol>
</Box>
```

---

<a id="MathCol"></a>

## MathCol

Stack math elements vertically, with an explicit gap and horizontal alignment. The complete column is one atom, centered on its own math axis.

Use [MathArray](math.md#MathArray) for shared columns, row baselines, and table rules,
or [aligned equations](../gallery/math.md#aligned_math) for TeX multiline environments.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Elements or TeX strings. |
| gap | `em(0)` | Nonnegative vertical spacing. |
| justify | `"center"` | Horizontal start, center, end, or fractional alignment. |
| axis | Half the height | Optional axis position measured from the top. |
| klass / left / right | `"mord"` | Classes exposed by the complete column. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathCol-example"></a>

### Example

```jsx
// MathCol: Stack math elements vertically, with an explicit gap and horizontal alignment.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathCol gap={em(0.4)} justify="start">
    <Latex>a+b=c</Latex>
    <Latex>α+β=γ</Latex>
    <Latex>{String.raw`\sin(x+y)`}</Latex>
  </MathCol>
</Box>
```

---

<a id="MathOp"></a>

## MathOp

A named function or large operator. Symbols grow in display style; names stay upright on the baseline. Scripts read the operator's limit policy.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | A name, operator glyph, TeX symbol command, or a composed math operand. |
| symbol | Inferred | Select a Size font for a large operator rather than an upright name. |
| limits | Operator default | `"auto"` stacks limits in display style; `"always"` forces stacking; `"never"` keeps side scripts. Booleans mean always/never. |
| center | Symbol/body dependent | Center a glyph operator on the math axis. Named text stays on the baseline. |
| style / size_index | Inherited | Math style and optional TeX font-size index. |
| klass / left / right | `"mop"` | Atom classes exposed to the surrounding row. |

Sums and products default to automatic limits. Integrals default to side scripts;
`limits="always"` or TeX `\limits` overrides that in text and display styles.
Use [SupSub](math.md#SupSub) to attach limits or side scripts.

Operator logical height includes TeX's font metrics; its drawn ink remains
independent. This keeps limits clear of a summation sign and scripts near the
ends of an integral. See [math authoring](../guides/math.md).

<a id="MathOp-example"></a>

### Example

```jsx
// MathOp: Named functions, large symbols, and explicit limit placement.
<Box font-size={px(32)} padding={em(0.8)}>
  <MathCol gap={em(0.7)} justify="start">
    <MathText>
      <MathOp>sin</MathOp>
      x+
      <MathOp>cos</MathOp>
      y
    </MathText>
    <MathText style="display">
      <SupSub sub="n=0" sup="∞">
        <MathOp>∑</MathOp>
      </SupSub>
      <SupSub sup="n">x</SupSub>
    </MathText>
    <MathText style="text">
      <SupSub sub="0" sup="1">
        <MathOp limits="always">∫</MathOp>
      </SupSub>
      f(x)dx
    </MathText>
  </MathCol>
</Box>
```

---

<a id="MathRow"></a>

## MathRow

An explicit grouped atom. Children align on their math axes and keep their order; the row adds no inter-atom glue.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Elements or TeX strings; each string becomes its own spaced MathText. |
| klass / left / right | `"mord"` | Classes exposed by the complete group. |
| strut | `false` | Add a one-em minimum line box centered on the axis. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathRow-example"></a>

### Example

```jsx
// MathRow: An explicit grouped atom.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathCol gap={em(0.5)}>
    <MathRow>
      <MathSymbol>a</MathSymbol>
      <MathSymbol>+</MathSymbol>
      <MathSymbol>b</MathSymbol>
    </MathRow>
    <MathText>a+b</MathText>
  </MathCol>
</Box>
```

---

<a id="MathRule"></a>

## MathRule

A filled horizontal rule centered on the math axis. Its default thickness is 0.04 em.

| Property | Default | Meaning |
| --- | --- | --- |
| width | `em(1)` | Rule length, using ordinary Gum sizing. |
| thickness | `em(0.04)` | Stroke thickness represented by a filled rectangle. |
| shift | Absent | When supplied, place the bottom this far above the baseline, instead of centering on the axis. |
| fill | Inherited color | Optional rule paint override. |

The parsed form is `\rule[shift]{width}{height}`. Its dimensions preserve TeX
units: point sizes remain fixed in scripts, while em/ex use the local text size.
Nonpositive TeX dimensions have no ink; negative width retains signed advance.
The parsed rule is an ordinary atom. A direct `MathRule` defaults to no atom
class and accepts `klass`, `left`, and `right` overrides.

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathRule-example"></a>

### Example

```jsx
// MathRule: A filled horizontal rule centered on the math axis.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathCol gap={em(0.3)}>
    <MathSpan>Rule thickness</MathSpan>
    <MathRule width={em(5)} color={blue} />
    <MathRule width={em(5)} thickness={em(0.1)} color={red} />
  </MathCol>
</Box>
```

---

<a id="MathSpacer"></a>

## MathSpacer

Explicit glue with a signed logical advance. Negative advance moves the next item left while the spacer's physical width stays nonnegative.

| Property | Default | Meaning |
| --- | --- | --- |
| advance | `em(0)` | A signed length, or thin, medium, thick, quad, or qquad. |
| height | `px(0)` | Optional logical height for a strut. |
| axis | Half the height | Math-axis position from the top; may lie outside the box. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathSpacer-example"></a>

### Example

```jsx
// MathSpacer: Explicit glue with a signed logical advance.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathCol gap={em(0.5)} justify="start">
    <MathText>ab</MathText>
    <MathText>
      <MathSymbol>a</MathSymbol>
      <MathSpacer advance={em(-1 / 6)} />
      <MathSymbol>b</MathSymbol>
    </MathText>
  </MathCol>
</Box>
```

---

<a id="MathSpan"></a>

## MathSpan

A literal glyph run measured from font outlines. It does not parse TeX or add atom spacing.

| Property | Default | Meaning |
| --- | --- | --- |
| children | `""` | Literal string or number content. |
| font_family | `"KaTeX_Main"` | Exact font face; inherited KaTeX families are respected. |
| center | `false` | Center the ink on the math axis instead of using the font baseline. |
| skew | Font correction | Override character accent skew, in em. |
| klass / left / right | `"mord"` | Atom classes exposed to the containing math row. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathSpan-example"></a>

### Example

```jsx
// MathSpan: A literal glyph run measured from font outlines.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathRow>
    <MathSpan klass="mop">sin</MathSpan>
    <MathSpacer advance="thin" />
    <MathSymbol>x</MathSymbol>
  </MathRow>
</Box>
```

---

<a id="MathStretch"></a>

## MathStretch

A drawn horizontal decoration centered on the math axis. It is a relation atom
when used directly in [MathText](math.md#MathText).

| Property | Default | Meaning |
| --- | --- | --- |
| label | `"overbrace"` | Shape name; a leading backslash is optional. |
| width / height | Shape minimum / natural height | Ordinary Gum allocation lengths. |
| thickness | `em(0.04)`, braces `em(0.1)`, brackets `em(0.12)` | Thickness in the active math em. |
| head-curve | `0.7` | Arrow and harpoon barb curvature from `0` to `1`; see [ArrowHead](geometry.md#ArrowHead). |

Names include `widehat`, `widecheck`, `widetilde`, `utilde`, `vec`,
`overbrace`/`underbrace`, `overbracket`/`underbracket`, `overgroup`/`undergroup`,
`overlinesegment`/`underlinesegment`, over/under left/right/bidirectional arrows,
`Overrightarrow`, and `overleftharpoon`/`overrightharpoon`.

The extensible-arrow names are `xrightarrow`, `xleftarrow`, `xleftrightarrow`,
`xRightarrow`, `xLeftarrow`, `xLeftrightarrow`, `xlongequal`,
`xtwoheadrightarrow`, `xtwoheadleftarrow`, `xhookrightarrow`, `xhookleftarrow`,
`xmapsto`, `xrightharpoonup`, `xrightharpoondown`, `xleftharpoonup`,
`xleftharpoondown`, `xrightleftharpoons`, `xleftrightharpoons`,
`xrightleftarrows`, `xtofrom`, `xrightequilibrium`, and `xleftequilibrium`.

Shapes retain their minimum form under a smaller allocation and report
overflow. Color and opacity inherit normally. Wide accents grow modestly in
height with width. Use [Accent](math.md#Accent), [HorizBrace](math.md#HorizBrace), or
[XArrow](math.md#XArrow) to position bodies and labels automatically.

Arrow families use core [Arrow](geometry.md#Arrow) and [ArrowHead](geometry.md#ArrowHead) with open
barbs, including single-barbed harpoons. Constant-width decorations use core
lines, polylines, and arcs; tapered braces retain their variable-width outlines.

<a id="MathStretch-example"></a>

### Example

```jsx
// Extensible shapes use Gum paths and inherit the surrounding color.
<Box font-size={px(34)} padding={em(0.7)}>
  <MathArray ncol={3} colsep={em(0.5)}>
    <MathStretch label="xRightarrow" width={em(3)} />
    <MathStretch label="xrightleftharpoons" width={em(3)} />
    <MathStretch label="xhookleftarrow" width={em(3)} />
    <MathStretch label="overbrace" width={em(3)} />
    <MathStretch label="overgroup" width={em(3)} />
    <MathStretch label="overlinesegment" width={em(3)} />
    <MathStretch label="widehat" width={em(3)} />
    <MathStretch label="widecheck" width={em(3)} />
    <MathStretch label="widetilde" width={em(3)} />
  </MathArray>
</Box>
```

---

<a id="MathSymbol"></a>

## MathSymbol

Select a glyph and its atom class from the TeX symbol table. The default face follows the symbol; prose font families do not override it.

| Property | Default | Meaning |
| --- | --- | --- |
| children | `""` | A character or TeX symbol command. |
| mode | `"math"` | Math or literal text symbol lookup. |
| font_family | Symbol face | Optional exact face; unsupported glyphs fall back per symbol. |
| klass / left / right | Symbol class | Override the atom's spacing classes. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathSymbol-example"></a>

### Example

```jsx
// MathSymbol: Select a glyph and its atom class from the TeX symbol table.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathText>
    <MathSymbol>α</MathSymbol>
    <MathSymbol>+</MathSymbol>
    <MathSymbol>β</MathSymbol>
    <MathSymbol>=</MathSymbol>
    <MathSymbol>γ</MathSymbol>
  </MathText>
</Box>
```

---

<a id="MathText"></a>

## MathText

A TeX-spaced source sequence. It parses string children, classifies atoms, cancels unary binary operators, and inserts the appropriate glue.
Use [MathChoice](math.md#MathChoice) for four style-dependent child branches.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | TeX source, math elements, or an array of both. |
| style | Inherited or `"text"` | Math style; script styles scale once and use tight spacing. |
| size_index | Inherited or `6` | TeX size declaration; selects its own text/script/scriptscript size table. |
| strut | `false` | Add a one-em minimum line box. |
| klass / left / right | Sequence edges | Overrides turn a nested sequence into a grouped atom. |
| macros | Empty | Local map from TeX command names to replacement strings. |
| warnings | `"error"` | KaTeX compatibility warnings: error, warn, or ignore. |
| on_error | `"throw"` | Throw a typed formula error, or render a visible diagnostic. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="MathText-example"></a>

### Example

```jsx
// MathText: A TeX-spaced source sequence.
<Box font-size={px(32)} padding={em(0.65)}>
  <MathText>
    a <MathText color={red}> + b </MathText> = c
  </MathText>
</Box>
```

---

<a id="Overline"></a>

## Overline

Draw a rule above a cramped math operand while keeping its baseline. This is
the direct counterpart of `\overline{…}`.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Overlined operand. |
| thickness | TeX rule thickness | Nonnegative line thickness. |
| fill | Inherited color | Optional rule paint. |

`thickness` defaults to the active style's TeX rule thickness. The rule spans
the body's advance, with a gap of three thicknesses and one extra thickness
above the line. `fill` changes only the rule; `color` changes the expression.
Zero thickness omits the rule and its padding. The result is an ordinary atom.

Use [Accent](math.md#Accent) with `accent="bar"` for a short fixed accent, or
[Underline](math.md#Underline) for a rule beneath the body.

<a id="Overline-example"></a>

### Example

```jsx
// An overline spans a compound operand, unlike a short bar accent.
<Box font-size={px(36)} padding={em(0.6)}>
  <MathText>
    <Overline>
      <MathText>z+w</MathText>
    </Overline>
    =
    <Overline>z</Overline>
    +
    <Overline>w</Overline>
  </MathText>
</Box>
```

---

<a id="Phantom"></a>

## Phantom

Reserve an operand's dimensions while hiding all its ink, including colored
children, backgrounds, and cancellation marks.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Hidden operand. |
| horizontal | `true` | Retain horizontal advance. |
| vertical | `true` | Retain height, depth, and baseline. |

`horizontal={true}` retains advance and `vertical={true}` retains height,
depth, and baseline. Both default to true. Set `vertical={false}` for an
`\hphantom`-like box or `horizontal={false}` for a `\vphantom`-like box.
Strings parse as TeX; ordinary Gum operands are accepted.

The parsed `\phantom{…}` preserves the surrounding sequence's atom spacing,
including binary cancellation across its edges. A phantom has no ink or child
overflow. Use [Smash](math.md#Smash) to retain ink while removing vertical extents,
or [Lap](math.md#Lap) to retain ink with zero advance.

<a id="Phantom-example"></a>

### Example

```jsx
// A vertical phantom makes two radicals share the taller radicand's extent.
<Box font-size={px(38)} padding={em(0.7)}>
  <MathText>
    <Sqrt>
      <Frac>
        <MathText>1</MathText>
        <MathText>x</MathText>
      </Frac>
    </Sqrt>
    +
    <Sqrt>
      <MathText>
        <Phantom horizontal={false}>
          <Frac>
            <MathText>1</MathText>
            <MathText>x</MathText>
          </Frac>
        </Phantom>
        y
      </MathText>
    </Sqrt>
  </MathText>
</Box>
```

---

<a id="Pmb"></a>

## Pmb

Poor-man's bold: draw the same operand twice, with the second copy offset by
0.02 em horizontally and 0.01 em downward. Advance, baseline, and logical
height remain unchanged; the extra ink is retained as overhang.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Overprinted operand. |
| klass / left / right | `"mord"` | Atom classes of the completed box. |

Strings parse as TeX. The direct element is an ordinary atom unless `klass`
overrides it. Parsed `\pmb{…}` preserves a binary or relation argument's
classification. For actual bold font outlines, prefer `\mathbf`,
`\boldsymbol`, or the face controls on [TextMode](math.md#TextMode).

<a id="Pmb-example"></a>

### Example

```jsx
// Overprinting works on complete operands; boldsymbol selects real bold glyphs.
<Box font-size={px(40)} padding={em(0.7)}>
  <MathText>
    <Pmb>
      <MathText>x+\alpha</MathText>
    </Pmb>
    \qquad
    <MathText>
      {String.raw`\boldsymbol{x+\alpha}`}
    </MathText>
  </MathText>
</Box>
```

---

<a id="RaiseBox"></a>

## RaiseBox

Move an operand vertically relative to the surrounding baseline. `shift`
defaults to zero; positive lengths raise the operand and negative lengths
lower it. Strings parse as TeX. Use [TextMode](math.md#TextMode) for literal prose.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Shifted operand. |
| shift | `0` | Vertical displacement; positive raises the operand. |

The body keeps its natural size and ink. Its baseline/axis guides change, so
math rows and surrounding prose account for its new position. The result is
an ordinary atom. TeX's `\raisebox{dimension}{text}` accepts a text body with
optional `$…$` math; explicit point dimensions retain their size in scripts.

Use [VCenter](math.md#VCenter) to center on the math axis or [Smash](math.md#Smash) to
suppress line extents.

<a id="RaiseBox-example"></a>

### Example

```jsx
// Positive shifts raise a body and negative shifts lower it.
<Box font-size={px(36)} padding={em(0.7)}>
  <MathText>
    x+
    <RaiseBox shift={em(0.4)}>
      <TextMode>up</TextMode>
    </RaiseBox>
    +
    <RaiseBox shift={em(-0.3)}>
      <TextMode>down</TextMode>
    </RaiseBox>
    =y
  </MathText>
</Box>
```

---

<a id="Smash"></a>

## Smash

Keep an operand's ink and advance while suppressing its logical height or
depth. The baseline stays aligned with the original operand's baseline.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Visible operand. |
| top | `true` | Suppress height above the baseline. |
| bottom | `true` | Suppress depth below the baseline. |

`top={true}` suppresses height above the baseline; `bottom={true}` suppresses
depth below it. Both default to true. Use `bottom={false}` for `\smash[t]{…}`
and `top={false}` for `\smash[b]{…}`. Setting both false keeps the extents.

Smash is an ordinary atom. Its drawing remains in ink/overflow, so a surrounding
row does not regain the suppressed line height. Leave room in an explicit SVG
viewport for that overhang. [Phantom](math.md#Phantom) hides ink; [Lap](math.md#Lap) removes
horizontal advance. See [math boxes](../gallery/math.md#math_boxes).

<a id="Smash-example"></a>

### Example

```jsx
// Smash keeps the superscript's ink while giving the radical a shorter operand.
<Box font-size={px(38)} padding={em(0.9)}>
  <MathText>
    <Sqrt>
      <Smash>
        <SupSub sup="2">x</SupSub>
      </Smash>
    </Sqrt>
    \qquad
    <Sqrt>
      <SupSub sup="2">x</SupSub>
    </Sqrt>
  </MathText>
</Box>
```

---

<a id="Sqrt"></a>

## Sqrt

A radical whose rule covers its cramped radicand. An optional index is always set in scriptscript style.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Radicand element or TeX source. |
| index | Absent | Optional root index element or TeX source. |
| thickness | `em(0.04)` | Thickness of the horizontal rule. |
| style / size_index | Inherited | Surrounding math style and optional TeX size index. |
| klass / left / right | `"mord"` | Classes exposed by the radical. |

The smallest Main/Size glyph covering the body is selected. Beyond Size4, the
surd stretches vertically while retaining its horizontal proportions. The
rule overlaps the surd slightly to prevent a rasterization seam. A wide index
reserves extra width on the left.

Use TeX `\sqrt{x}` or `\sqrt[3]{x}` for the same layout. See
[ordinary formulas](../gallery/math.md#math_expressions).

<a id="Sqrt-example"></a>

### Example

```jsx
// Sqrt: Cramped radicands, root indices, and growing surds with a continuous rule.
<Box font-size={px(36)} padding={em(0.8)}>
  <MathCol gap={em(0.7)} justify="start">
    <Sqrt>
      <MathText>
        <SupSub sup="2">b</SupSub>
        -4ac
      </MathText>
    </Sqrt>
    <Sqrt index="3" color={blue}>
      <MathText>x+y</MathText>
    </Sqrt>
    <Sqrt style="display">
      <Frac>
        <MathText>a+b</MathText>
        <MathText>c+d</MathText>
      </Frac>
    </Sqrt>
  </MathCol>
</Box>
```

---

<a id="SupSub"></a>

## SupSub

Attach superscripts, subscripts, or operator limits to one math operand. Placement uses the base's character nucleus and italic correction.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Base operand: an element or TeX source. |
| sup / sub | Absent | Superscript and subscript operands. |
| limits | Base policy | Override with `"auto"`, `"always"`, `"never"`, or a boolean. |
| style / size_index | Inherited | Base math style and optional TeX size index. |
| klass / left / right | Base classes | Reclassify the complete scripted atom. |

Superscripts inherit crampedness; subscripts are always cramped. Nesting reaches
script and then scriptscript size, where it stops shrinking. A subscript starts
at the base advance; a superscript also includes its italic correction.

[MathOp](math.md#MathOp) supplies the default limit policy. Explicit `\limits` and
`\nolimits` are preserved by the TeX adapter. See
[ordinary formulas](../gallery/math.md#math_expressions) for complete examples.

<a id="SupSub-example"></a>

### Example

```jsx
// SupSub: Scripts preserve italic correction and descend through math styles.
<Box font-size={px(36)} padding={em(0.8)}>
  <MathCol gap={em(0.6)} justify="start">
    <MathText>
      <SupSub sup="iπ">e</SupSub>
      +1=0
    </MathText>
    <MathText>
      <SupSub sup="j" sub="i">f</SupSub>
      +
      <SupSub sup="y^{z^w}">x</SupSub>
    </MathText>
    <MathText style="display">
      <SupSub sup="∞" sub="n=0">
        <MathOp>∑</MathOp>
      </SupSub>
      <Frac>
        <SupSub sup="n">x</SupSub>
        <MathText>n!</MathText>
      </Frac>
    </MathText>
  </MathCol>
</Box>
```

---

<a id="Tex"></a>

## Tex

The text-style convenience for a complete formula. Embed it inside **Text** for
inline math, or use it in ordinary Gum containers. Inline formulas keep the
paragraph's font scale and stay on one line; see
[math inside prose](../gallery/math.md#inline_math).

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | TeX source or MathText-compatible children. |
| inline | `true` | Choose text style by default. |
| style | Inherited or text | Explicit math style overrides the default. |
| strut | `true` | Keep at least a one-em line box. |
| macros / warnings / on_error | MathText defaults | Parser options and visible error handling. |

Common font, color, and sizing properties follow [Gum units](../guides/units.md).
Math preserves separate logical advance, outline ink, baseline, and math-axis guides.
See [math authoring](../guides/math.md) for supported TeX and font setup.

<a id="Tex-example"></a>

### Example

```jsx
// Tex: The inline-style convenience for a complete formula.
<Box font-size={px(32)} padding={em(0.65)}>
  <Text>
    {"For "}
    <Tex>a+b=c</Tex>
    {" we have "}
    <Tex>c-b=a</Tex>
  </Text>
</Box>
```

---

<a id="TextMode"></a>

## TextMode

Literal text within math. Spaces and adjacent-run kerning survive; `x^2` stays
literal. Nest [MathText](math.md#MathText) or [Tex](math.md#Tex) for mathematical notation.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Literal strings, numbers, spans, or elements. |
| family | Main or selected text face | Choose `"main"`, `"sans"`, or `"mono"` for literal runs. |
| bold / italic | Selected text face | Override the literal face's weight and shape. |
| font-family | Main math text face | An explicit KaTeX face, such as `mathit`. |
| style / size-index | Inherited | Math style and TeX size table; scripts scale text once. |
| strut | `false` | Add the usual one-em math strut. |
| klass / left / right | `"mord"` | Treat the completed text as a math atom. |

The main family includes regular, bold, italic, and bold italic. Sans includes
regular, bold, and italic; mono has regular only. Sans bold italic and styled
mono fall back to the corresponding Main face to retain weight and shape.
KaTeX's current renderer instead errors on these unavailable combinations.
Glyphs missing from the selected face fall back to their ordinary text face;
glyphs absent there too produce an error.
The `family`, `bold`, and `italic` choices apply to literal runs; nested math
keeps its own math font. Spans can color or resize part of the literal content.

There is no automatic TeX spacing between children and no wrapping inside
`TextMode`. Source line endings and tabs become single spaces; ordinary spaces
are preserved. Use an explicitly sized [Text](text.md#Text) for a wrapping prose operand.
The TeX adapter uses this literal-run path for composed family, weight, and
shape commands, including math nested inside `$…$`. See
[math fonts and macros](../guides/math_fonts.md) for the command list,
local resets, emphasis, accents, and verbatim text.

See [inline math](../gallery/math.md#inline_math) and
[mixed composition](../gallery/math.md#math_composition).

<a id="TextMode-example"></a>

### Example

```jsx
// Literal math text preserves spaces, while nested math keeps its own notation and fonts.
<Box font-size={px(30)} padding={em(1)}>
  <VStack gap={em(0.9)} align="start">
    <MathText>
      <TextMode>average speed = </TextMode>
      <Frac>
        <TextMode>distance</TextMode>
        <TextMode>time</TextMode>
      </Frac>
    </MathText>
    <TextMode>
      {"Literal x^2; mathematical "}
      <MathText>
        <SupSub sup="2">x</SupSub>
      </MathText>
      {"."}
    </TextMode>
    <MathText>
      <SupSub sub={<TextMode>average</TextMode>}>v</SupSub>
      =
      <Frac>
        <MathText>d</MathText>
        <MathText>t</MathText>
      </Frac>
    </MathText>
  </VStack>
</Box>
```

---

<a id="Underline"></a>

## Underline

Draw a rule beneath a math operand. The operand keeps its baseline, and the
rule spans its advance. Strings parse as TeX; ordinary Gum elements also work.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Underlined operand. |
| thickness | TeX rule thickness | Nonnegative line thickness. |
| fill | Inherited color | Optional rule paint. |

`thickness` defaults to the active style's TeX rule thickness. Three rule
thicknesses separate body and line; one more thickness follows the line.
`fill` overrides the rule color, while `color` applies to the whole expression.
Zero thickness omits the rule and its padding. Negative thickness is invalid.

The result is an ordinary atom, equivalent to `\underline{…}`. Use
[Overline](math.md#Overline) for a rule above the body, or
[Accent](math.md#Accent) for an under-arrow or tilde.

<a id="Underline-example"></a>

### Example

```jsx
// The underline follows the full operand while preserving its baseline.
<Box font-size={px(36)} padding={em(0.6)}>
  <MathText>
    <Underline color={blue}>
      <Frac>
        <MathText>a+b</MathText>
        <MathText>c</MathText>
      </Frac>
    </Underline>
    =x
  </MathText>
</Box>
```

---

<a id="VCenter"></a>

## VCenter

Center an operand's logical height on the math axis. It keeps the operand's
advance, size, and ink and supplies a corresponding baseline. The result is
an ordinary atom. Strings parse as TeX, and ordinary Gum elements work too.

| Property | Default | Meaning |
| --- | --- | --- |
| children | Empty | Operand to center. |
| klass / left / right | `"mord"` | Atom classes of the completed box. |

This is useful for an object whose own baseline should not determine its
position in a formula. TeX uses `\vcenter{\hbox{…}}`, with math inside `$…$`.
Use [RaiseBox](math.md#RaiseBox) for an explicit vertical shift.

<a id="VCenter-example"></a>

### Example

```jsx
// Center a figure and a text box on the same math axis.
<Box font-size={px(36)} padding={em(0.7)}>
  <MathText>
    <VCenter>
      <Text width={em(5)} font-size={em(0.55)}>A two-line label</Text>
    </VCenter>
    =
    <VCenter>
      <Rect width={em(2)} aspect={1.4} fill={blue} stroke={none} />
    </VCenter>
  </MathText>
</Box>
```

---

<a id="XArrow"></a>

## XArrow

An extensible relation arrow with labels above and optionally below it.

| Property | Default | Meaning |
| --- | --- | --- |
| label | `"xrightarrow"` | One of the extensible [MathStretch](math.md#MathStretch) arrow names. |
| children | Empty | Upper label. |
| below | Absent | Lower label. |
| thickness | `em(0.04)` | Arrow rule thickness. |
| head-curve | `0.7` | Barb curvature from `0` to `1`, using [ArrowHead](geometry.md#ArrowHead) geometry. |

Labels can be TeX strings or elements and use upper/lower script styles. The
larger padded label determines width, subject to the shape's minimum. Each
label has half an em of its own size on either side. The arrow sits on the
math axis; a deep upper label receives extra clearance. Color and opacity
inherit normally.

Arrows use core [Arrow](geometry.md#Arrow) and [ArrowHead](geometry.md#ArrowHead) elements with
open, joined barbs. Harpoons use single-barbed heads; double shafts and hooks
combine them with core lines and arcs. Math controls sizing, the axis, and label
placement, while core handles the arrow geometry and rendering.

The TeX form is `\xrightarrow[below]{above}`. Over/under decorations on a body
belong in [Accent](math.md#Accent). See [math decorations](../gallery/math.md#math_decorations).

<a id="XArrow-example"></a>

### Example

```jsx
// Labels determine arrow width; head-curve adjusts barbs on arrows and harpoons.
<Box font-size={px(38)} padding={em(0.7)}>
  <MathCol gap={em(0.7)} justify="start">
    <MathText>
      A
      <XArrow below="f^{-1}">{String.raw`\text{a linear map}`}</XArrow>
      B
      <XArrow label="xleftrightarrow" below="h">g</XArrow>
      C
    </MathText>
    <MathText>
      A
      <XArrow head-curve={0}>
        <TextMode>straight</TextMode>
      </XArrow>
      B
      <XArrow head-curve={1}>
        <TextMode>curved</TextMode>
      </XArrow>
      C
      <XArrow label="xrightleftharpoons" below="q">p</XArrow>
      D
    </MathText>
  </MathCol>
</Box>
```
