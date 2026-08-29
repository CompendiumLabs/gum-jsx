/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@gum-jsx/math";
import { loadWebFonts } from "@gum-jsx/web";
import { App } from "./App";

// the svgs are inlined, so the page needs the faces gum's output names: load
// them through core's registry (@gum-jsx/math imported first registers the
// KaTeX ones) and install them with the FontFace API — no @font-face css
await loadWebFonts();

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
