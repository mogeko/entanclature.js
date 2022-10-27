---
title: 什么是 Entanclature？
---

# {{ $frontmatter.title }}

::: danger
Need to be updated!
:::

纠缠命名法 (Entanclature) 的灵感来自于[量子纠缠](https://zh.wikipedia.org/wiki/量子纏結)；将数个图片纠缠到一起，通过观测 (解码) 一个图片的状态 (URL) 便可得到其余所有图片的状态 (URL)。其主要目的是为了在保证兼容性的基础上扩展 [`<img>` 标签](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)，使其能够被无缝切换为 [`<picture>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture)。

::: info
<span style="color: green;">Entanclature</span> 一词是由 <span style="color: green;">Entan</span><span style="color: red;">glement</span> 和 <span style="color: red;">Nomen</span><span style="color: green;">clature</span> 糅合而成的。
:::

## 核心思想

我们为不同的显示/设备场景提供不同的图像版本的最佳方式是通过 `<picture>` 标签与 [`<source>` 标签](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source)的组合。例如，你希望使用 [AVIF](https://en.wikipedia.org/wiki/AVIF) 或 [WebP](https://zh.wikipedia.org/wiki/WebP) 节约带宽/增加加载速度时，但你不确定你用户的浏览器是否支持 AVIF、WebP；你只需要：

```html
<picture>
  <source
    type="image/avif"
    srcset="https://mogeko.github.io/entanclature.js/images/cc0_sample.avif"
  />
  <source
    type="image/webp"
    srcset="https://mogeko.github.io/entanclature.js/images/cc0_sample.webp"
  />
  <img src="https://mogeko.github.io/entanclature.js/images/cc0_sample.png" />
</picture>
```

如果你的浏览器支持 AVIF 你将可以看到 AVIF 格式的图片；如果你的浏览器不支持 AVIF 但支持 WebP，你将会看到 WebP 格式的图片；再不济，将会看到作为兼容项提供的 PNG 格式的图片。显示什么格式的图片仅与用户的浏览器有关，不涉及任何 JavaScript，也没有任何额外的运行时，即原生又安全。

<picture>
  <source type="image/avif" srcset="/images/cc0_sample.avif" />
  <source type="image/webp" srcset="/images/cc0_sample.webp" />
  <img src="/images/cc0_sample.png" />
</picture>

但不幸的是，我们很难通过 Markdown 的语法得到一个符合要求的 `<picture>`。Markdown 的图片语法 (`![]()`) 的编译目标是一个 `<img>`；其很难在保证兼容性的前提下，通过扩展语法提供 `<picture>` 所需的冗余信息。

![status_quo](/images/1_status_quo.png)

但如果通过纠缠命名法，我们可以将冗余信息编码在 PNG 文件的文件名中；如果我们得到了 PNG 文件的文件名，便可以获得与之关联的 AVIF、WebP...等格式的文件名，进而获得它们的 URL。反之亦然；通过 AVIF 等格式文件的文件名中也包含了 PNG 文件的信息。

![aspiration](/images/2_aspiration.png)

## 实现原理

### 前提

使用纠缠命名法命名图片有三个前提，或者说三个限制：

1. 所有图片需要拥有相同的 Base URL
2. 对任意图片重命名将会打破纠缠
3. 将会丢失图片的原始文件名这一信息

### 编码流程

纠缠命名法的编码遵循以下流程：

1. 根据图片的关联性使用纠缠命名法的句法命名
2. 使用 Base64 对文件名编码以保证其在 URL 中是安全的

![process](/images/3_process.png)

解码是编码的逆过程。

### 句法分析

纠缠命名法的句法由三部分组成：**Hash 信息**、**Meta 信息**、**校验信息 (可选)**。部分间由分隔符 (`#`) 区分。

![syntax_analysis](/images/4_syntax_analysis.png)

#### Hash 信息

第一部分是原始图片 (一般是兼容性强的格式) 的 Hash (SHA-1) 值的前 7 位。**所有相关图片的第一部分是相同的**。因此，他可以用来表明图片间的关系；**并且还可以在作用域内保证命名的唯一性 (主要功能)**。另一个用隐藏好处是：保证按文件名排序时，相关图片会被放在一起。

虽然 SHA-1 对大小写不敏感，但纠缠命名法的 Hash 部分强制使用**大写字母**，以追求最短的 Base64 字符串长度。

![hash](/images/5_hash.png)

#### Meta 信息

Meta 信息是纠缠命名法的核心。

Meta 信息由数组相互独立的**格式标识符** + **图片质量信息标识**组成；

每组子 Meta 信息对应一个单独的图片，第一组子 Meta 信息表示的是当前文件的 Meta 信息。为了保证生成文件名的唯一性，除第一组子 Meta 信息外，其余的子 Meta 信息按字母表正序排列。

![type+quality](/images/6_type+quality.png)

以下是部分格式标识符和具体文件格式的对照信息：

| 格式标识符 | 缩写 | 文件格式             | MIME 类型    | 文件拓展名     |
| ---------- | ---- | -------------------- | ------------ | -------------- |
| `A`        | AVIF | AV1 图像文件格式     | `image/avif` | `.avif`        |
| `J`        | JPEG | 联合影像专家小组图像 | `image/jpeg` | `.jpeg`/`.jpg` |
| `P`        | PNG  | 便携式网络图像       | `image/png`  | `.png`         |
| `W`        | WebP | 万维网图像格式       | `image/webp` | `.webp`        |
| ...        | ...  | ...                  | ...          | ...            |

完整列表可以在[这里](#格式标识符和具体文件格式的对照信息)获取。

以下是图片质量标识以及其具体含义：

| 图片质量标识符 | 对图片质量标识符的解释                                   |
| -------------- | -------------------------------------------------------- |
| ∅ (empty)      | 默认的图片质量 / 目标格式推荐的压缩质量                  |
| `0` - `100`    | 0% - 100%，数字越大，文件大小越大 (甚至可能会比原图更大) |
| `+`            | 无损压缩 (可能会比原图更大)，等同于 `100`                |
| `-`            | 在不较大影响显示效果的情况下，尽可能的降低文件大小       |

#### 校验位 (可选)

校验有两个目的：

1. 确保纠缠命名法的句法的完整性
2. 确保 Base64 的编码正确

我们采用类似于[身份证校验码](https://zh.wikipedia.org/wiki/校验码#各地身份证算法)的算法进行校验；即将 Hash 信息和 Meta 信息的每一位字符 (不包含分隔符 `#`) 的 Ascii 码相加再摸上 11 (如果结果为 10，则用 `X` 表示)。

然后找到一个或数个特殊字符 (别忘了分隔符 `#` 也会参与编码)，使得经过 Base64 编码后的字符串的最后一位正好为以上算法计算的结果。这样的值有无数个，我们取使得 Base64 编码后的字符串最短的字符为校验码。

![verification_algorithm](/images/7_verification_algorithm.png)

也就是说，如果加了校验位，Base64 编码后的文件名始终以 `0` - `9` 或 `X` 结尾。

另一个特殊情况是：经过纠缠命名法的句法处理后的文件名 (包含两个分隔符，并且这种情况将以分隔符结尾) 的 Base64 编码的的最后一位正好是校验算法的结果；此时的校验码为 ∅。

<!-- TODO: 草图举个例子 -->

## 附录

### 格式标识符和具体文件格式的对照信息

受支持的格式标识符和具体文件格式的对照信息：

| 格式标识符 | 缩写 | 文件格式             | MIME 类型    | 文件拓展名     |
| ---------- | ---- | -------------------- | ------------ | -------------- |
| `A`        | AVIF | AV1 图像文件格式     | `image/avif` | `.avif`        |
| `G`        | GIF  | 图像互换格式         | `image/gif`  | `.gif`         |
| `J`        | JPEG | 联合影像专家小组图像 | `image/jpeg` | `.jpeg`/`.jpg` |
| `P`        | PNG  | 便携式网络图像       | `image/png`  | `.png`         |
| `T`        | TIFF | 标签图像文件格式     | `image/tiff` | `.tif`/`.tiff` |
| `W`        | WebP | 万维网图像格式       | `image/webp` | `.webp`        |

### 质量标识

受支持的质量标识符以及其具体含义：

| 图片质量标识符 | 对图片质量标识符的解释                                   |
| -------------- | -------------------------------------------------------- |
| ∅ (empty)      | 默认的图片质量 / 目标格式推荐的压缩质量                  |
| `0` - `100`    | 0% - 100%，数字越大，文件大小越大 (甚至可能会比原图更大) |
| `+`            | 无损压缩 (可能会比原图更大)，等同于 `100`                |
| `-`            | 在不较大影响显示效果的情况下，尽可能的降低文件大小       |
