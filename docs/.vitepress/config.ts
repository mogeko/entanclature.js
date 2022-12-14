import { defineConfig } from "vitepress";

export default defineConfig({
  title: "entanclature.js",
  base: "/entanclature.js/",
  lang: "zh-CN",
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/0-intro/1-what-is-entanclature" },
      { text: "API 参考", link: "/api-reference/_/entanclature" },
    ],
    sidebar: [
      {
        text: "介绍",
        items: [
          { text: "什么是 Entanclature？", link: "/guide/0-intro/1-what-is-entanclature" },
          { text: "快速上手", link: "/guide/0-intro/2-getting-started" },
        ],
      },
      {
        text: "实现原理",
        items: [
          { text: "前提 (限制)", link: "/guide/1-principle/1-before-use" },
          { text: "编码流程", link: "/guide/1-principle/2-coding-process" },
          { text: "句法分析", link: "/guide/1-principle/3-syntax-analysis" },
        ],
      },
      {
        text: "功能",
        items: [
          { text: "输入 & 输出", link: "/guide/2-function/1-parameters-and-results" },
          { text: "可用的类型标识", link: "/guide/2-function/2-available-type" },
          { text: "可用的质量标识", link: "/guide/2-function/3-available-quality" },
        ],
      },
      {
        text: "APIs",
        items: [
          { text: "API 参考", link: "api-reference/_/entanclature" },
          { text: "Types 参考", link: "/api-reference/api-report" },
        ],
      },
    ],
    footer: {
      message: "Released under the CC-BY-SA-4.0 License.",
      copyright: "Copyright © 2022 Zheng Junyi",
    },
  },
});
