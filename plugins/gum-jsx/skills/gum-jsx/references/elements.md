# Element reference

Each entry includes its runnable JSX example.

## Layout

- [Anchor](elements/layout.md#Anchor) — A zero-size point or line frame around a naturally measured child.
- [Attach](elements/layout.md#Attach) — Attach an Element outside one content child.
- [Box](elements/layout.md#Box) — Add padding, a background, an inside border, optional rounded clipping, and alignment around one content element.
- [Frame](elements/layout.md#Frame) — Surround one element with padding, background, and a default border.
- [Grid](elements/layout.md#Grid) — Arrange children row by row with column widths shared across every row.
- [Group](elements/layout.md#Group) — A finite canvas for independently positioned children.
- [HStack](elements/layout.md#HStack) — Arrange child elements left to right with flex sizing and alignment.
- [Overlay](elements/layout.md#Overlay) — Place positioned decorations over a measured base child.
- [Rotate](elements/layout.md#Rotate) — Rotate a measured child around a chosen alignment point.
- [Spacer](elements/layout.md#Spacer) — An empty stack child with explicit defaults basis={0} grow={1}.
- [Svg](elements/layout.md#Svg) — Set the document viewport and contain its root element.
- [TransformBox](elements/layout.md#TransformBox) — Transform a naturally measured child using an affine matrix [a,b,c,d,e,f]: x′=ax+cy+e, y′=bx+dy+f.
- [VStack](elements/layout.md#VStack) — Arrange child elements top to bottom with flex sizing and alignment.

## Geometry

- [Arc](elements/geometry.md#Arc) — An ellipse segment with center, scalar or paired radius, and start/end angles in degrees.
- [Arrow](elements/geometry.md#Arrow) — Draw a straight, curved, or rounded shaft with optional arrowheads between points.
- [ArrowHead](elements/geometry.md#ArrowHead) — Draw a standalone open or closed arrowhead at a chosen tip and angle.
- [Circle](elements/geometry.md#Circle) — Circle has an intrinsic 1:1 aspect.
- [CoordLine](elements/geometry.md#CoordLine) — A piecewise linear path through {x,y} or [x,y] points.
- [Dot](elements/geometry.md#Dot) — A filled Circle with a preferred 6px diameter and no stroke.
- [Ellipse](elements/geometry.md#Ellipse) — Ellipse draws an axis-aligned ellipse in its allocated rectangle.
- [Fill](elements/geometry.md#Fill) — Fill the region between a series of points and a boundary.
- [HFill](elements/geometry.md#HFill) — Fill horizontally between a series of points and a vertical boundary.
- [HLine](elements/geometry.md#HLine) — Draw a horizontal line across a local drawing frame.
- [Line](elements/geometry.md#Line) — Draw a line segment in local coordinates or an enclosing data projection.
- [Path](elements/geometry.md#Path) — Path draws a sequence of explicit path commands.
- [Points](elements/geometry.md#Points) — Repeat a marker at each {x,y} or [x,y] in points.
- [Polygon](elements/geometry.md#Polygon) — Polygon connects points in order and closes the path back to the first point.
- [Polyline](elements/geometry.md#Polyline) — Polyline connects points in order with straight segments.
- [Ray](elements/geometry.md#Ray) — A finite ray from origin at a screen-space angle in degrees (positive clockwise).
- [Rect](elements/geometry.md#Rect) — Rect paints its allocated rectangle.
- [RoundedLine](elements/geometry.md#RoundedLine) — Draw a polyline with quadratic corners rounded by a configurable radius.
- [RoundedRect](elements/geometry.md#RoundedRect) — RoundedRect is Rect with a default corner radius of 0.125 of its shorter side.
- [Segments](elements/geometry.md#Segments) — Independent segments in one drawing. segments is an array of pairs of {x,y} or [x,y] endpoints.
- [Spline](elements/geometry.md#Spline) — Draw a cubic spline through points with optional tension and closure.
- [Square](elements/geometry.md#Square) — Square is a rectangle with an intrinsic 1:1 aspect and square drawing geometry.
- [Triangle](elements/geometry.md#Triangle) — A Polygon with vertices at top center and both bottom corners.
- [UnitLine](elements/geometry.md#UnitLine) — Draw a unit-length horizontal line in a local frame.
- [VFill](elements/geometry.md#VFill) — Fill vertically between a series of points and a horizontal boundary.
- [VLine](elements/geometry.md#VLine) — Draw a vertical line across a local drawing frame.

## Plotting

- [Axis](elements/plotting.md#Axis) — An axis occupies the graph frame; ticks and labels extend outside it.
- [Bar](elements/plotting.md#Bar) — Draw one vertical bar at a specified value and position.
- [BarPlot](elements/plotting.md#BarPlot) — Combine bars, axes, labels, and other plot features in one chart.
- [Bars](elements/plotting.md#Bars) — Draw a series of vertical bars from values, positions, and baselines.
- [Field](elements/plotting.md#Field) — Draw vectors=[{point,vector},...], with either {x,y} or [x,y] for each point and vector.
- [Graph](elements/plotting.md#Graph) — A finite canvas with data coordinates and optional point-pair projection.
- [HAxis](elements/plotting.md#HAxis) — HAxis draws a baseline, ticks, and labels.
- [HBar](elements/plotting.md#HBar) — Draw one horizontal bar at a specified value and position.
- [HBars](elements/plotting.md#HBars) — Draw a series of horizontal bars from values, positions, and baselines.
- [HLabel](elements/plotting.md#HLabel) — One tick label. value defaults to 0; children can be a string, number, or Element (omitted text formats the value).
- [HLabels](elements/plotting.md#HLabels) — HLabels draws labels only, without a baseline or ticks.
- [HMesh](elements/plotting.md#HMesh) — Draw horizontal grid lines at generated or explicit tick values.
- [HScale](elements/plotting.md#HScale) — HScale draws ticks only, without a baseline or labels.
- [Label](elements/plotting.md#Label) — Draw one formatted label at a tick value on an axis.
- [Labels](elements/plotting.md#Labels) — Labels draws labels only, without a baseline or ticks.
- [Legend](elements/plotting.md#Legend) — A measured box of badge/label rows.
- [LegendItem](elements/plotting.md#LegendItem) — One badge and label row inside Legend.
- [Mesh](elements/plotting.md#Mesh) — Draw grid lines at generated or explicit tick values.
- [Mesh2D](elements/plotting.md#Mesh2D) — Combine horizontal and vertical grid lines in graph coordinates.
- [OuterLabel](elements/plotting.md#OuterLabel) — Place a label outside a chosen frame edge with optional offset and rotation.
- [Plot](elements/plotting.md#Plot) — Compose graphable children with linear axes, grid lines, measured tick labels, axis titles, an optional legend, and an optional background.
- [Scale](elements/plotting.md#Scale) — Draw axis ticks without a baseline or labels.
- [SymField](elements/plotting.md#SymField) — Sample f(x,y) on a rectangular grid and draw it with Field.
- [SymFill](elements/plotting.md#SymFill) — Sample a band between upper and lower functions or numbers (defaults 1 and 0).
- [SymLine](elements/plotting.md#SymLine) — Sample a function at the specified values and draw with CoordLine.
- [SymPoints](elements/plotting.md#SymPoints) — Use the sampling options described by SymLine and draw with Points.
- [SymPoly](elements/plotting.md#SymPoly) — Sample a function or parametric curve and close each finite run into a polygon.
- [SymSpline](elements/plotting.md#SymSpline) — Use the sampling options described by SymLine and draw with Spline.
- [VAxis](elements/plotting.md#VAxis) — VAxis draws a baseline, ticks, and labels.
- [VBar](elements/plotting.md#VBar) — Draw one vertical bar at a specified value and position.
- [VBars](elements/plotting.md#VBars) — Draw a series of vertical bars from values, positions, and baselines.
- [VLabel](elements/plotting.md#VLabel) — One tick label. value defaults to 0; children can be a string, number, or Element (omitted text formats the value).
- [VLabels](elements/plotting.md#VLabels) — VLabels draws labels only, without a baseline or ticks.
- [VMesh](elements/plotting.md#VMesh) — Draw vertical grid lines at generated or explicit tick values.
- [VScale](elements/plotting.md#VScale) — VScale draws ticks only, without a baseline or labels.

## Maps

- [GeoMap](elements/maps.md#GeoMap) — Project GeoJSON or TopoJSON with per-feature styles and shared borders.

## Networks

- [Edge](elements/networks.md#Edge) — A connection rendered with Arrow's shaft, heads, and paint options.
- [Network](elements/networks.md#Network) — Network lays out and places its nodes before connecting them with Edge.
- [Node](elements/networks.md#Node) — A compact TextFrame with a centered placement anchor: the conventional labeled node.

## Text

- [Bullets](elements/text.md#Bullets) — A vertical list with baseline-aligned markers.
- [Slide](elements/text.md#Slide) — Lay out a 16:9 slide with a measured title and flexible content area.
- [Span](elements/text.md#Span) — Span changes inherited style for part of a Text element.
- [Text](elements/text.md#Text) — Text lays out shaped glyphs at a fixed font size.
- [TextBox](elements/text.md#TextBox) — TextBox accepts string/Span/Element children, with 0.6em padding.
- [TextCol](elements/text.md#TextCol) — A text-aware stack: strings/numbers become Text elements at construction.
- [TextFigure](elements/text.md#TextFigure) — Pair a figure with an optional measured caption and outer decoration.
- [TextFrame](elements/text.md#TextFrame) — TextFrame accepts string/Span/Element children, with 0.6em padding.
- [TextGrid](elements/text.md#TextGrid) — A Grid that converts strings and numbers to Text elements at construction.
- [TextRow](elements/text.md#TextRow) — A text-aware stack: strings/numbers become Text elements at construction.
- [TextStack](elements/text.md#TextStack) — A text-aware stack: strings/numbers become Text elements at construction.
- [TitleBox](elements/text.md#TitleBox) — Place an optional title above content inside a box.
- [TitleFrame](elements/text.md#TitleFrame) — TitleFrame draws a border around its content, with an optional boxed title centered across the top border.

## Math

- [Accent](elements/math.md#Accent) — Put a glyph or a width-fitting decoration over an operand.
- [Bracket](elements/math.md#Bracket) — An atom with left/right fences fitted to its complete body.
- [Enclose](elements/math.md#Enclose) — Frame, highlight, cancel, or strike through a math operand.
- [Frac](elements/math.md#Frac) — A fraction with numerator and denominator styles, baseline shifts, and clearance around its rule.
- [HorizBrace](elements/math.md#HorizBrace) — An overbrace or underbrace with an optional label.
- [Lap](elements/math.md#Lap) — A zero-advance ordinary atom that still draws its operand.
- [Latex](elements/math.md#Latex) — A complete formula in display style, with a one-em minimum line box.
- [MathArray](elements/math.md#MathArray) — Arrange math cells in columns and baseline-aligned rows.
- [MathBox](elements/math.md#MathBox) — Pad, allocate, and align one math child while preserving its baseline and axis.
- [MathChoice](elements/math.md#MathChoice) — Select one of four children according to the active math style, like TeX \mathchoice.
- [MathCol](elements/math.md#MathCol) — Stack math elements vertically, with an explicit gap and horizontal alignment.
- [MathOp](elements/math.md#MathOp) — A named function or large operator.
- [MathRow](elements/math.md#MathRow) — Group math children in order without adding inter-atom spacing.
- [MathRule](elements/math.md#MathRule) — A filled horizontal rule centered on the math axis.
- [MathSpacer](elements/math.md#MathSpacer) — Explicit glue with a signed logical advance.
- [MathSpan](elements/math.md#MathSpan) — A literal glyph run measured from font outlines.
- [MathStretch](elements/math.md#MathStretch) — A drawn horizontal decoration centered on the math axis.
- [MathSymbol](elements/math.md#MathSymbol) — Select a glyph and its atom class from the TeX symbol table.
- [MathText](elements/math.md#MathText) — Parse and space a sequence of TeX and math elements.
- [Overline](elements/math.md#Overline) — Draw a rule above a cramped math operand while keeping its baseline.
- [Phantom](elements/math.md#Phantom) — Reserve an operand's dimensions while hiding all its ink, including colored children, backgrounds, and cancellation marks.
- [Pmb](elements/math.md#Pmb) — Simulate bold math by drawing a slightly offset second copy of an operand.
- [RaiseBox](elements/math.md#RaiseBox) — Raise or lower an operand relative to the surrounding math baseline.
- [Smash](elements/math.md#Smash) — Keep an operand's ink and advance while suppressing its logical height or depth.
- [Sqrt](elements/math.md#Sqrt) — A radical whose rule covers its cramped radicand.
- [SupSub](elements/math.md#SupSub) — Attach superscripts, subscripts, or operator limits to one math operand.
- [Tex](elements/math.md#Tex) — The text-style convenience for a complete formula.
- [TextMode](elements/math.md#TextMode) — Set literal prose inside a math expression.
- [Underline](elements/math.md#Underline) — Draw a rule beneath a math operand.
- [VCenter](elements/math.md#VCenter) — Center an operand's logical height on the math axis.
- [XArrow](elements/math.md#XArrow) — An extensible relation arrow with labels above and optionally below it.

## Special

- [PngImage](elements/special.md#PngImage) — Embeds a PNG from a base64 data URL.
