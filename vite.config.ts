import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The repo root is the playground app root. The block components live under plugins/.../files/
// and are imported by src/demos/* via relative paths — both resolve deps from this one node_modules.
export default defineConfig({
  plugins: [react()],
});
