// A first plot to make with the CLI.
<Plot
  aspect={2} padding={0} margin={em(1.5)} grid
  xticks={[[0, '0'], [pi/2, 'π/2'], [pi, 'π'], [3*pi/2, '3π/2'], [2*pi, '2π']]}
>
  <SymLine fy={sin} xlim={[0, tau]} stroke={blue} stroke-width={px(2)} />
</Plot>
