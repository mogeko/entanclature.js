---
title: 快速上手
---

# {{ $frontmatter.title }}

`entanclature.js` 是一个 JavaScript 库。它仅导出一个函数 `entanclature` 来处理 [Entanglement Nomenclature](/0-intro/1-what-is-entanclature)。`entanclature` 接受一个 `URL` 或文件路径 (Node.js only) 作为参数，并始终以固定的数据结构返回。

::: warning
`entanclature` 的设计目的是告诉你应该如何命名和处理图片文件，不会对图片本身做任何处理。
:::

![input_and_optput](/images/8_input_optput.png)

## Install

你可以使用你喜欢的包管理器安装 `entanclature`：

```shell
# npm
npm install entanclature

# yarn
yarn add entanclature

# pnpm
pnpm add entanclature
```

## Usage

然后在你的项目中导入并使用它：

```ts
import { entanclature } from "entanclature";

const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
const result = await entanclature(url);

console.log(result);
```

`entanclature` 还支持以本地文件路径作为参数 (Node.js only)，但你需要手动定义如果处理图片的 `meta` 信息，并指定 URL 的 `baseURL` 和 `fileDir`：

```ts
import { entanclature } from "entanclature";

import type { Meta, Opts } from "entanclature";

const filePath = "./path/for/an/image.png";
const meta = [
  { type: "image/png", quality: 80 },
  { type: "image/avif", quality: "+" },
  { type: "image/webp", quality: "-" },
];
const opts: Opts = {
  baseURL: "https://example.com",
  fileDir: "/images/",
};
const result = await entanclature(filePath, meta, opts);

console.log(result);
```

如果你不喜欢 `await`，你还可以使用 `entanclature.formURL` 来处理 URLs：

```ts
import { entanclature } from "entanclature";

const url = "https://example.com/images/OTk0QTc5OVA4MEErVy04.png";
const result = entanclature.fromURL(url);

console.log(result);
```

但是对于文件路径，`await` 是必须的，因为我们需要计算该文件的 SHA-1：

```ts
import { entanclature } from "entanclature";

// 省略定义 `filePath`, `meta` 和 `opts`。

const result = await entanclature.fromURL(filePath, meta, opts);

console.log(result);
```

## Result

参考[《输入 & 输出》](/2-function/1-parameters-and-results.html#结果-输出)。
