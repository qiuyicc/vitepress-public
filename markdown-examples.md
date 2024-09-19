<!-- <script setup>
import Collapse from './components/Collapse.vue'; // 确保路径正确
</script>

# 我的文档

<Collapse title="点击这里折叠">
  这里是折叠的内容，可以放任何内容，比如段落、图片、列表等。
  #### 标题3
  #### 标题4
  #### 标题5
</Collapse> -->
<style scoped>

  /* 美化 ul 和 li */
ul {
    padding-left: 20px;
    /* 添加左侧内边距 */
    list-style-type: none;
    /* 移除默认的列表样式 */
}

li {
    text-align: center;
    max-width: 150px;
    list-style: none;
    padding: 8px;
    border-radius: 50px;
    background-color: #f9f9f9;
    transition: background-color 0.3s;
}

li:hover {
    background-color: #e9ecef;
}

.collapsible-content li a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s, background-color 0.3s;
}

</style>
<!-- <CollapsibleAside style={{ margin: '0px', position: 'absolute', left: '0' }} title="文档内容">
  <ul>
    <li>
      <a href="#section-1">第一部分</a>
    </li>
    <li><a href="#custom-containers">第二部分</a></li>
    <li><a href="#section-3">第三部分</a></li>
  </ul>
</CollapsibleAside> -->


# Markdown Extension Examples
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
## Code Blocks

### Code Blocks
This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Code Blocks

### Code Blocks

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:
链接语法示例：[Bilibili](https://www.bilibili.com/)

**Input**

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
      msg: 'Addedddd' // [!code --]
      msg: 'Addedddd111' // [!code ++]
    }
  }
}
```

:tada: :100:

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

<!-- ````md -->

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

<!-- ```` -->

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

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

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
