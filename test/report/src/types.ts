// mirrors the manifest `bun test/run.ts --report` writes to test/data

export type Theme = "light" | "dark";

export interface Render {
  svg: string | null;   // path relative to the data dir, null if it did not render
  error: string | null; // the strict-mode failure, if any
}

export interface Example {
  id: string;           // <group>/<name>
  name: string;
  group: string;        // docs | gala | test
  path: string;         // the source .jsx, relative to the repo root
  code: string;
  status: "pass" | "fail";
  renders: Record<Theme, Render>;
}

// a deck of slides (test/decks/<name>), its slides as examples with the deck
// name as their group and ids under decks/<name>/
export interface Deck {
  name: string;
  title: string | null;       // from the deck's index.json, if it has one
  path: string;               // the deck directory, relative to the repo root
  prelude: string | null;     // the prelude's source, if the deck has one
  preludePath: string | null; // and its path, relative to the repo root
  slides: Example[];
}

export interface Manifest {
  generated: string;
  themes: Theme[];
  groups: string[];
  passed: number;       // examples and slides together
  failed: number;
  examples: Example[];
  decks: Deck[];
}
