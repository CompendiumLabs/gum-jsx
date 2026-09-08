import { useEffect, useMemo, useState } from "react";
import "./index.css";
import type { Deck, Example, Manifest, Theme } from "./types";
import { CardTile, DeckTile } from "./CardTile";
import { Dialog } from "./Dialog";
import { DeckDialog } from "./DeckDialog";

type Status = "" | "pass" | "fail";

// the theme picks both the page chrome and which of the two renders shows
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("gum-report-theme") as Theme) ?? "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("gum-report-theme", theme);
  }, [theme]);
  return [theme, () => setTheme(t => (t === "dark" ? "light" : "dark"))] as const;
}

export function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [status, setStatus] = useState<Status>("");
  // the open example (or deck slide) lives in the URL hash, so a card can be
  // linked to and reloaded
  const [active, setActive] = useState<string | null>(() => decodeURIComponent(location.hash.slice(1)) || null);
  useEffect(() => {
    const base = location.href.split("#")[0]!;
    history.replaceState(null, "", active ? `${base}#${encodeURIComponent(active)}` : base);
  }, [active]);
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    // relative, so the app works both at the server root and from a built dist
    fetch("manifest.json")
      .then(async r => {
        const text = await r.text();
        let data: Manifest & { error?: string };
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`manifest.json: ${r.status} ${r.statusText} (not json) \u2014 run \`bun scripts/test.ts --report\``);
        }
        if (!r.ok) throw new Error(data.error ?? r.statusText);
        setManifest(data);
      })
      .catch(e => setError(String(e)));
  }, []);

  // the examples that survive the filters, in page order, and the decks: a
  // deck shows when any of its slides matches the text, and when its slides
  // together match the status ("failing" is one failing slide, "passing" none)
  const needle = query.trim().toLowerCase();
  const matches = (e: Example) =>
    !needle || [e.id, e.code, e.renders.light.error, e.renders.dark.error].join(" ").toLowerCase().includes(needle);
  const visible = useMemo(() => {
    if (!manifest) return [];
    return manifest.examples.filter(e => (!group || e.group === group) && (!status || e.status === status) && matches(e));
  }, [manifest, needle, group, status]);
  const decks = useMemo(() => {
    if (!manifest || (group && group !== "decks")) return [];
    return manifest.decks.filter(d => {
      const failing = d.slides.some(s => s.status === "fail");
      return (!status || (status === "fail") === failing) && d.slides.some(matches);
    });
  }, [manifest, needle, group, status]);

  // what the active id opens: an example's dialog, or a deck at one of its slides
  const activeExample = visible.find(e => e.id === active);
  const activeDeck = manifest?.decks.find(d => d.slides.some(s => s.id === active));
  const slideIndex = activeDeck ? activeDeck.slides.findIndex(s => s.id === active) : -1;
  const stepSlide = (delta: number) => {
    if (!activeDeck) return;
    const n = activeDeck.slides.length;
    setActive(activeDeck.slides[(slideIndex + delta + n) % n]!.id);
  };
  const openDeck = (deck: Deck) => { if (deck.slides.length > 0) setActive(deck.slides[0]!.id); };

  if (error) return <p className="p-8 font-mono text-red-600">{error}</p>;
  if (!manifest) return <p className="p-8 text-gray-500">loading…</p>;

  const control = "rounded-md border border-gray-300 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800";
  const counts = (items: Example[]) => {
    const failed = items.filter(e => e.status === "fail").length;
    return failed > 0 ? `${items.length} · ${failed} failing` : `${items.length}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6 text-gray-900 dark:bg-neutral-900 dark:text-neutral-200">
      <header className="mb-4 flex flex-wrap items-center gap-4">
        <h1 className="mr-auto text-xl font-semibold">gum.jsx test report</h1>
        <input
          type="search" value={query} onChange={e => setQuery(e.target.value)} size={32}
          placeholder="filter by name, code, error…" className={control}
        />
        <select value={group} onChange={e => setGroup(e.target.value)} className={control}>
          <option value="">all groups</option>
          {manifest.groups.map(g => <option key={g} value={g}>{g}</option>)}
          {manifest.decks.length > 0 && <option value="decks">decks</option>}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value as Status)} className={control}>
          <option value="">all results</option>
          <option value="fail">failing</option>
          <option value="pass">passing</option>
        </select>
        <button onClick={toggleTheme} className={`${control} rounded-full`}>
          {theme === "dark" ? "light" : "dark"}
        </button>
        <div className="w-full text-sm text-gray-500 dark:text-neutral-400">
          <span className="text-green-600 dark:text-green-400">{manifest.passed} passed</span>
          {", "}
          <span className={manifest.failed > 0 ? "text-red-600 dark:text-red-400" : ""}>{manifest.failed} failed</span>
          {" · generated "}{manifest.generated.replace("T", " ").slice(0, 19)}
          {" · click a card; in a deck, ← → move between slides"}
        </div>
      </header>

      {manifest.groups.map(g => {
        const members = visible.filter(e => e.group === g);
        if (members.length === 0) return null;
        return (
          <section key={g}>
            <h2 className="mt-8 mb-3 border-b border-gray-300 pb-1 font-mono text-base font-semibold dark:border-neutral-700">
              {g} <span className="ml-2 font-normal text-gray-500 dark:text-neutral-400">{counts(members)}</span>
            </h2>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
              {members.map(e => <CardTile key={e.id} example={e} theme={theme} onOpen={() => setActive(e.id)} />)}
            </div>
          </section>
        );
      })}

      {decks.length > 0 && (
        <section>
          <h2 className="mt-8 mb-3 border-b border-gray-300 pb-1 font-mono text-base font-semibold dark:border-neutral-700">
            decks <span className="ml-2 font-normal text-gray-500 dark:text-neutral-400">{counts(decks.flatMap(d => d.slides))}</span>
          </h2>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(420px,1fr))]">
            {decks.map(d => <DeckTile key={d.name} deck={d} theme={theme} onOpen={() => openDeck(d)} />)}
          </div>
        </section>
      )}

      {activeExample && <Dialog example={activeExample} theme={theme} onClose={() => setActive(null)} />}
      {activeDeck && slideIndex >= 0 && (
        <DeckDialog deck={activeDeck} index={slideIndex} theme={theme} onClose={() => setActive(null)} onStep={stepSlide} />
      )}
    </div>
  );
}

export default App;
