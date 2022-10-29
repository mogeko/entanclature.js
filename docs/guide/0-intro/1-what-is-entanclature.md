---
title: 什么是 Entanclature？
---

# {{ $frontmatter.title }}

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

但如果通过 Entanclature，我们可以将冗余信息编码在 PNG 文件的文件名中；如果我们得到了 PNG 文件的文件名，便可以获得与之关联的 AVIF、WebP...等格式的文件名，进而获得它们的 URL。反之亦然；通过 AVIF 等格式文件的文件名中也包含了 PNG 文件的信息。

![aspiration](/images/2_aspiration.png)
