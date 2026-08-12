import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "pages-src",
  base: "/digital-health-unimelb-epro-ctcae/",
  plugins: [react()],
  build: { outDir: "../docs", emptyOutDir: true },
});
