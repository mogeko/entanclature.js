import { defineConfig } from "vitepress";

export default defineConfig({
  title: "entanclature.js",
  base: "/entanclature.js/",
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
            { text: "grammar.ts", link: "/api-reference/modules/core_grammar" },
            { text: "nomenclature.ts", link: "/api-reference/modules/core_nomenclature" },
          ],
        },
        {
          text: "UTILS",
          items: [
            { text: "base64.ts", link: "/api-reference/modules/base64" },
            { text: "hash.ts", link: "/api-reference/modules/utils_hash" },
            { text: "is_empty.ts", link: "/api-reference/modules/utils_is_empty" },
            { text: "is_url.ts", link: "/api-reference/modules/utils_is_url" },
          ],
        },
      ],
    },
    footer: {
      message: "Released under the CC-BY-SA-4.0 License.",
      copyright: "Copyright © 2022 Zheng Junyi",
    },
  },
});
