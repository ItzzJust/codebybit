import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  resolve: { tsconfigPaths: true },
  optimizeDeps: {
    exclude: ["@resvg/resvg-js"],
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});

export default config;
