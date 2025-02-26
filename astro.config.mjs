// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://accessun.github.io",
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: "everforest-dark",
    },
  },
});
