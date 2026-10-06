// A first plot to make with the CLI.
<Plot
  width={px(750)} height={px(375)} font-size={px(18)}
  xlim={[0, 2 * pi]} ylim={[-1.5, 1.5]} grid
>
  <SymLine
    fy={sin} xlim={[0, 2 * pi]}
    stroke={blue} stroke-width={px(3)}
  />
</Plot>
