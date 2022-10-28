import { defineConfig } from "vitepress";

export default defineConfig({
  title: "entanclature.js",
  base: "/entanclature.js/",
  lang: "zh-CN",
  themeConfig: {
    sidebar: [
      {
        text: "介绍",
        items: [
          { text: "什么是 Entanclature？", link: "/0-intro/1-what-is-entanclature" },
          { text: "快速上手", link: "/0-intro/2-getting-started" },
        ],
      },
      {
        text: "实现原理",
        items: [
          { text: "前提", link: "/1-principle/1-before-use" },
          { text: "编码流程", link: "/1-principle/2-coding-process" },
          { text: "句法分析", link: "/1-principle/3-syntax-analysis" },
        ],
      },
      {
        text: "功能",
        items: [
          { text: "输入 & 输出", link: "/2-function/1-parameters-and-results" },
          { text: "可用的类型标识", link: "/2-function/2-available-type" },
          { text: "可用的质量标识", link: "/2-function/3-available-quality" },
        ],
      },
      {
        text: "APIs",
        items: [
          { text: "API 参考", link: "/api-reference/" },
          { text: "Types 参考", link: "/api-report/" },
        ],
      },
    ],
    footer: {
      message: "Released under the CC-BY-SA-4.0 License.",
      copyright: "Copyright © 2022 Zheng Junyi",
    },
  },
});
