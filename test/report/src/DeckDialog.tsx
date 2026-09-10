import { useEffect, useRef, useState } from "react";
import type { Deck, Theme } from "./types";
import { Chips, Figure } from "./CardTile";
import { Code } from "./Code";

/**
 * A deck, one slide at a time: the render fills the panel, `←`/`→` (and the
 * buttons) move between slides, and the slide's code and the deck's prelude
 * (the declarations every slide is evaluated with) can be shown beside it,
 * either or both. The open slide is the active id, so a slide can be linked to.
 */
export function DeckDialog({ deck, index, theme, onClose, onStep }: {
  deck: Deck; index: number; theme: Theme; onClose: () => void; onStep: (delta: number) => void;
}) {
  const slide = deck.slides[index]!;
  const [code, setCode] = useState(false);
  const [prelude, setPrelude] = useState(false);
  const side = code || (prelude && deck.prelude != null);

  // focus lands on the panel when it opens, and the page behind it stops
  // scrolling, so wheel and keyboard scrolling stay inside
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { panel.current?.focus(); }, [deck.name]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const box = "rounded-lg border border-gray-300 dark:border-neutral-700";
  const label = "mb-1 flex-none text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400";
  const button = "h-7 rounded-full px-2 text-sm leading-none text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-neutral-700 dark:hover:text-white";
  const active = "bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-10 backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={panel} tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="flex h-[85%] w-[90%] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white
                   text-gray-900 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
      >
        <div className="flex flex-none items-center gap-3 border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
          <span className="font-semibold">{deck.title ?? deck.name}</span>
          <span className="font-mono text-sm text-gray-500 dark:text-neutral-400">{slide.path}</span>
          <span className="mr-auto"><Chips example={slide} /></span>
          <button onClick={() => setCode(c => !c)} className={`${button} ${code ? active : ""}`}>code</button>
          {deck.prelude != null && (
            <button onClick={() => setPrelude(p => !p)} className={`${button} ${prelude ? active : ""}`}>prelude</button>
          )}
          <button onClick={() => onStep(-1)} aria-label="previous slide" className={`${button} text-xl`}>‹</button>
          <span className="text-sm text-gray-500 tabular-nums dark:text-neutral-400">{index + 1} / {deck.slides.length}</span>
          <button onClick={() => onStep(1)} aria-label="next slide" className={`${button} text-xl`}>›</button>
          <button onClick={onClose} aria-label="close" className={`${button} w-7 text-xl`}>×</button>
        </div>

        <div key={slide.id} className={`grid min-h-0 flex-1 gap-4 p-4 ${side ? "grid-cols-2" : "grid-cols-1"}`}>
          <div className="flex min-h-0 flex-col">
            <h3 className={label}>{slide.name} ({theme})</h3>
            <Figure example={slide} theme={theme} className={`${box} flex-1`} />
          </div>
          {side && (
            <div className="flex min-h-0 flex-col gap-4">
              {code && (
                <div className="flex min-h-0 flex-1 flex-col">
                  <h3 className={label}>code</h3>
                  <Code code={slide.code.trim()} className={box} />
                </div>
              )}
              {prelude && deck.prelude != null && (
                <div className="flex min-h-0 flex-1 flex-col">
                  <h3 className={label}>prelude{deck.preludePath && ` (${deck.preludePath.split("/").pop()})`}</h3>
                  <Code code={deck.prelude.trim()} className={box} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
