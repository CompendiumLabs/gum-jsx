/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { gum } from "@gum-jsx/core";
import { math } from "@gum-jsx/math";
import { loadWebFonts } from "@gum-jsx/web";
import { App } from "./App";

// the svgs are inlined, so the page needs the faces gum's output names: load
// them through the default Env's registry (with the math plugin for the KaTeX
// ones) and install them with the FontFace API — no @font-face css
gum.use(math);
await loadWebFonts();

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
