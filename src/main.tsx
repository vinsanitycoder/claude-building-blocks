import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
// Design-standard tokens + base component styles are loaded ONCE at app root so
// every tab (not only the Design standard demo) renders with the same affordances.
import "../plugins/building-blocks/skills/design-standard/files/globals.css";
import "../plugins/building-blocks/skills/design-standard/files/themes.css";
import "../plugins/building-blocks/skills/design-standard/files/components.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
