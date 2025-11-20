# Markdown 基本语法

## 标题
一级标题：#

二级标题：##

三级标题：###

.....

一级标题和二级标题之间有分割线

## 分行
分行：回车空行隔开

## 链接
链接：\[链接文本内容](地址)[Bilibili]\(https://www.bilibili.com/)

## 加粗
加粗:\*\*要加粗的文本**

## 代码块
代码块：\```三个反引号标记代码块的开始和结束，你可以在这些标记之间放置代码（\```ts xxx  ```）

## 表情
表情：\:tada: =>  :tada:  \:100: => :100:

## 目录表
生成目录表：[[toc]]

## 导入文件
导入文件代码片段：<<< @/filepath

## 生成背景颜色框
```ts
背景颜色框框：::: 语法用于创建不同类型的提示框，或者使用[类型]+>符号
::: info 用于提供一般信息，通常背景颜色为浅蓝色。
::: tip 用于提供有用的提示或建议，通常背景颜色为浅绿色。
::: warning 用于提醒用户注意某些事项，通常背景颜色为浅黄色。
::: danger 用于警告用户可能的危险或严重问题，通常背景颜色为浅红色。
::: details 用于提供详细信息，通常背景颜色为浅灰色
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。
```

## 表格语法
```ts 
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

## 行高亮
```ts 
```js{1,4,6-8}//在此输入想要高亮的行数，可以单行、多行
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

## 代码聚焦
```ts
在某一行上添加 // [!code focus] 注释将聚焦它并模糊代码的其他部分。
此外，可以使用 // [!code focus:<lines>] 定义要聚焦的行数。
```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

## 代码块行颜色差异
```ts
在某一行末尾添加 // [!code --] 或 // [!code ++] 注释将会为该行创建 diff，同时保留代码块的颜色
```js
export default {
  data () {
    return {
      msg: 'Removed'   // [!code --]
      msg: 'Added'    // [!code ++]
    }
  }
}
```

## 代码块分组
使用 ::: code-group 语法可以将代码块分组，并为每组代码块指定标题。
```
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
:::
```

## 图片懒加载
```ts
export default {
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  }
}
```

## 更多 

参阅   [VitePress官方文档](https://vitepress.dev/zh/guide/getting-started)
参阅   [Markdown语法说明](https://markdown.com.cn/intro.html)
