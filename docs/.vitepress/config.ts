import { defineConfig } from "vitepress";

export default defineConfig({
  title: "entanclature.js",
  lang: "zh-CN",
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/what-is-entanclature" },
      { text: "API 参考", link: "/api-reference/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "介绍",
          items: [{ text: "什么是 Entanclature？", link: "/guide/what-is-entanclature" }],
        },
      ],
      "/api-reference/": [
        {
          text: "INDEX",
          items: [{ text: "mod.ts", link: "/api-reference/modules/mod" }],
        },
        {
          text: "CORE",
          items: [
            { text: "entanglement.ts", link: "/api-reference/modules/core_entanglement" },
            { text: "nomenclature.ts", link: "/api-reference/modules/core_nomenclature" },
          ],
        },
        {
          text: "MODELS",
          items: [
            { text: "grammar.ts", link: "/api-reference/modules/models_grammar" },
            { text: "url.ts", link: "/api-reference/modules/models_url" },
          ],
        },
        {
          text: "UTILS",
          items: [
            { text: "hash.ts", link: "/api-reference/modules/utils_hash" },
            { text: "is_empty.ts", link: "/api-reference/modules/utils_is_empty" },
            { text: "is_url.ts", link: "/api-reference/modules/utils_is_url" },
          ],
        },
      ],
    },
  },
});
