import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  optimizeDeps: {
    exclude: ["@resvg/resvg-js"],
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  resolve: { tsconfigPaths: true },
  server: {
    port: 3000,
    strictPort: true,
  },
});

export default config;
