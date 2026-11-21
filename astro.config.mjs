// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gran.dubstepmolitva.ru",
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/gsap")) return "gsap";
            if (id.includes("node_modules/lenis")) return "lenis";
          },
        },
      },
    },
  },
});
