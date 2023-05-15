import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import crypto from "crypto-browserify";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: crypto })],
  resolve: {
    alias: {
      lib: resolve(__dirname, "src/lib"),
      routes: resolve(__dirname, "src/routes"),
    },
  },
  define: {
    process,
    "global.crypto": crypto,
  },
});
