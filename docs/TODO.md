# Todo

Try out a resizable box on the blog. Put an id tag on a Dot element and use it to pick up drag events.

Tree surgery tool? Select elements with query selectors and modify/delete/replace/append/prepend them. Would only work with pure XML (not JSX) scripts.

Decide what to do with the Svg element. No docs example needs it anymore: size, font, color, background, theme, and clip all work on the root element, and hosts wrap a bare root via make_viewport. It still does three engine jobs: it is the viewport that host defaults and overrides (CLI -W/-H/--theme/--background) are merged into; a hugging axis absorbs a child's reserved outset (a nested Svg around a framed Plot turns the outset into layout width, which Box does not); and mathToElement and gum-tex --fit return one. Options: keep the class but reframe Svg.md as the host viewport and move it next to Rendering; update the editor starter (App.tsx), the MCP viewer default code, and the Docs.tsx default page, which still lead with Svg; keep the JSX binding for existing sources. If outset absorption became a Box prop, Svg could become purely internal.
