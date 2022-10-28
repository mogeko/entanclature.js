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
        {
          text: "APIs",
          items: [
            { text: "API Reference", link: "/api-reference/" },
            { text: "Type Reference", link: "/api-report/" },
          ],
        },
      ],
      "/api-reference/": [
        {
          text: "INDEX",
          items: [{ text: "entanclature", link: "/api-reference/" }],
        },
        {
          text: "FUNCTIONS",
          items: [{ text: "entanclature", link: "/api-reference/entanclature.entanclature" }],
        },
        {
          text: "MODULES",
          items: [{ text: "entanclature", link: "/api-reference/entanclature" }],
        },
        {
          text: "OTHERS",
          items: [{ text: "Type Reference", link: "/api-report/" }],
        },
      ],
    },
    footer: {
      message: "Released under the CC-BY-SA-4.0 License.",
      copyright: "Copyright © 2022 Zheng Junyi",
    },
  },
});
