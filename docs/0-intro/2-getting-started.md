---
title: 快速上手
---

# {{ $frontmatter.title }}

`entanclature.js` 是一个 JavaScript 库。它仅导出一个函数 `entanclature` 来处理 [Entanglement Nomenclature](/guide/0-1-what-is-entanclature)。`entanclature` 接受一个 `URL` 或文件路径 (Node.js only) 作为参数，并始终以固定的数据结构返回。

::: warning
`entanclature.js` 的设计目的是告诉你应该如何命名和处理图片文件，不会对图片本身做任何处理。
:::

![input_and_optput](/images/8_input_optput.png)

## Install

```shell
# npm
npm install entanclature

# yarn
yarn add entanclature

# pnpm
pnpm add entanclature
```
