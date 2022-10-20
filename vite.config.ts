/// <reference types="vitest" />
import { defineConfig } from "vite";
import pkg from "./package.json";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/mod.ts"),
      name: pkg.name,
    },
    sourcemap: true,
  },
  define: {
    "import.meta.vitest": "undefined",
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
