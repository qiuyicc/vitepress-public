# longDailyRead

## 2024-10-27

Svelte技术：
[FROM公众号——前端之神]()


### Svelte

Svelte框架？
1. 使用vite创建Svelte项目
```js
npm create vite@latest
//框架选择svelte
```
2. 安装依赖
```js
npm install
```
3. 运行项目
```js
npm run dev
```
![项目运行](/sevlte.png)

### 变量和事件

1. 变量时候可以直接定义，无需使用ref或useState
2. 事件使用on+事件名，如onclick、oninput等
```ts
<script lang="ts">
  let count:number = 0;
  const increment = () => {
    count += 1
  }
</script>

<button onclick={increment}>
  count is {count}
</button>
```

### 父子传值
#### 父传子
::: code-group
```ts [Father.svelte]
<script lang="ts">
import Children from "./Children.svelte";
let message:string = "Hello from Father11111";
let fathermessage:string = "Hello from Father22222";
</script>
  
<main>
  <Children {message} /> //直接使用变量名传递
  <Children message={fathermessage} /> //使用别名
</main>
```
```ts [Children.svelte]
<script lang="ts">
export let message:string = ''; //使用export关键字来定义接受
</script>

<main>
    <div>我是子组件,接受到了父组件传递的消息：{message}</div>
</main>
```
![父传子](/svelte_fatherToChildren.png)
:::
#### 子传父
::: code-group
```ts [Father.svelte]
<script lang="ts">
import Children from "./Children.svelte";
let childrenmessage:string = ""
const handleChildrenMessage = (event:CustomEvent) => {
  console.log(event);
  childrenmessage = event.detail;
}
</script>
  
<main>
  <h4>子组件的消息：{childrenmessage}</h4>
  <Children message={fathermessage} on:message={handleChildrenMessage} />//监听message事件
</main>
```
```ts [Children.svelte]
<script lang="ts">
import { createEventDispatcher } from "svelte";
let childrenMessage:string = 'Hello, I am a child component';
const dispatch = createEventDispatcher();
const handleClick = () => {
    dispatch('message', childrenMessage);
}
</script>

<main>
    <button on:click={handleClick}>点击发送子组件的消息</button>
</main>
```
:::
![子传父](/svelte_childrenToFather.png)

### 双向绑定
通过bind:key来实现双向绑定，如bind:input、bind:checkbox、bind:checked等等。
```ts
<script lang="ts">
let inputValue = ''
let checkValue = false
let groupValue:string = ''
const handleValue = (event:Event) => {
  console.log(inputValue, checkValue, groupValue);
}
</script>
<main>
  <input type="text" bind:value={inputValue} on:input={handleValue}>
  <input type="checkbox" bind:checked={checkValue} on:change={handleValue}>
  <select bind:value={groupValue} on:change={handleValue}>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </select>
</main>
```
![双向绑定](/svelte_bind.png)

### 插槽
::: code-group
```ts [Father.svelte]
<main>
  <Children>
    <div>插入默认插槽</div>
    <div slot="child">插入child具名插槽</div>
  </Children>
</main>
```
```ts [Children.svelte]
<main>
    <slot></slot>
    <slot name="child"></slot>
</main>
```
:::

### 生命周期

1. onMounted：组件挂载完成时触发
2. beforeUpdate：组件更新前触发
3. afterUpdate：组件更新后触发
4. onDestroy：组件销毁时触发
```ts
onMounted(() => {})
beforeUpdate(() => {})
afterUpdate(() => {})
onDestroy(() => {})
```

### 获取DOM

想要获取DOM要使用bind:this
```ts
<script lang="ts">
let ele:HTMLDivElement
onMount(() => {
  console.log(ele);
})
</script>
  
<main>
  <div bind:this={ele}>组件</div>
</main>
```
```ts
//获取异步DOM，使用tick方法
import {tick } from "svelte";
let msg = 'one'
let ele:HTMLDivElement
const handleClick = async () => {
  msg = 'two'
  console.log(ele.innerHTML);
  await tick()
  console.log(ele.innerHTML);
}
</script>
  
<main>
  <div bind:this={ele}>{msg}</div>
  <button on:click={handleClick}>点击</button>
</main>
```

### watch&&computed

使用$符号可以实现类似watch和computed的功能

```ts
<script lang="ts">
  let count:number = 0;
  let msg1 = `count现在是${count}`
  let msg2 = `count的两倍是${count * 2}`
  const increment = () => {
    count += 1
  }
  $: msg1 = `count现在是${count}`
  // $: msg2 = `count的两倍是${count * 2}` //直接监听
  $: {
    let res = count * 2
    msg2 = `count的两倍是${res}`
  }
</script>

<div>msg1: {msg1}</div>
<div>msg2: {msg2}</div>
<button onclick={increment}>
  点击
</button>
```

### 条件渲染

```ts
<script lang="ts">
  let age:number = 25;
</script>

{ #if age >= 60 }
  <p>老年人</p>
{:else if age >= 30}
  <p>青年人</p>
  {:else}
  <p>儿童</p>
{/if}
```
```ts
<script lang="ts">
const items = [
    { name: 'apple', price: 1.5 },
    { name: 'banana', price: 0.5 },
    { name: 'orange', price: 2.0 },
]
</script>
{#each items as item (item.name)}
<p>{item.name}：{item.price}</p>
{/each}
```

### 状态管理

使用svelte-store插件可以实现状态管理，如store、derived、writable等。
```ts
<script lang="ts">
  import { writable } from "svelte/store";
  let count = writable(0);
</script>
<div>count: {$count}</div>
<button on:click={() => count.update((c) => c + 1)}>修改count</button>
<button on:click={() => $count++}>修改count</button>
```

## 2024-10-28

Vue中的Template：
[FROM公众号——前端之神]()

### 实现一个改变消息颜色的需求

```ts
// Item.vue
<template>
    <div style="display: flex;justify-content: center;">
        <div ref="msg" style="padding-right: 10px;">这是一条消息</div>
        <div style="display: flex;position: relative">
                <EditPen @click="showColorPicker" style="cursor: pointer;width: 20px;" />
                <div style="visibility: hidden;position: absolute;">
                    <ElColorPicker ref="colorPicker" @change="handleColorChange" />
                </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
//记得引入element-plus样式
import { ElColorPicker } from 'element-plus'
// 不使用自带的方框图标，引入编辑图标
import { EditPen } from '@element-plus/icons-vue'

export default {
    components: {
        ElColorPicker,
        ElButton,
        EditPen
    },
    setup() {
        let msg = ref<HTMLDivElement>()
        // 颜色选择器实例
        let colorPicker = ref<InstanceType<typeof ElColorPicker>>()
        //监听颜色选择器
        const showColorPicker = () =>{
            colorPicker.value?.show()
        }
        // 监听颜色选择器的颜色变化改变消息颜色
        const handleColorChange = (value: string) => {
            msg.value.style.color = value
        }
        return {
            handleColorChange,
            msg,
            colorPicker,
            showColorPicker,
        }
    }
}
</script>
```

### 新的需求

假设又有新的需求，消息很多,可能呈现列表形式铺满屏幕，直接渲染会造成页面十分卡顿，因为我们在每一个消息上都渲染了一个Item组件，而每一个Item里面又渲染了一个颜色选择器，这会导致页面渲染十分耗费资源。

```ts 
// Index.vue
<template>
    <div style="display:flex">
        <div v-for="item in data">
            <div v-for="subItem in item">
                <Item />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Item from './Item.vue'
export default {
    components:{
        Item
    },
    setup () {
        const data = new Array(10).fill(0).map(()=>{
            return new Array(50).fill(0)
        })
        return {
            data
        }
    }
}
</script>
```
![消息铺满屏幕](/dailyLearn2.png)

###  优化

因为颜色选择器太多了导致页面卡顿，所以只要保证页面只有一个颜色选择器就行
1. 第一种方法可以使用鼠标点击定位移动颜色选择器
2. 第二种方法使用Vue的Teleport组件

::: code-group
```ts [useSingleColorPicker.ts]
//编写一个单独的颜色选择器组件
import { defineComponent, ref, h, Teleport} from 'vue';
import { ElColorPicker } from 'element-plus';

const colorPickerRef = ref<InstanceType<typeof ElColorPicker>>();
const teleportTo = ref('body');
let selectEle = ref<HTMLDivElement | null>(null);

const ColorPicker = defineComponent({
  setup() {
    return () =>
      h(
        Teleport,
        {
          to: teleportTo.value,
        },
        h(
          'div',
          { style: 'visibility:hidden;width:0;height:0;overflow:hidden;' },
          h(ElColorPicker, {
            ref: colorPickerRef,
            onChange: (color: string | null) => {                
                color && (selectEle.value!.style.color = color)
            },
          })
        )
      );
  },
});
  // 更新传送位置
const updateTeleportTo = (to: string) => {
  teleportTo.value = to;
};
  // 显示颜色选择器
const showColorPicker = () => {
  colorPickerRef.value?.show();
};
const handleColorChange = (msg:any) => {
  selectEle = msg
}

export const useSingleColorPicker = () => {
  return {
    ColorPicker,
    updateTeleportTo,
    showColorPicker,
    handleColorChange
  };
};
```

```ts [Index.vue]
<template>
    <div style="display:flex">
        <div v-for="item in data">
            <div v-for="subItem in item">
                <Item />
            </div>
        </div>
    </div>
    // 挂载单例颜色选择器
    <ColorPicker />
</template>

<script lang="ts">
import Item from './Item.vue'
import { useSingleColorPicker } from '../hooks/useSingleColorPicker'
//挂载单例颜色选择器
const { ColorPicker } = useSingleColorPicker()
export default {
    components:{
        Item,
        ColorPicker
    },
    setup () {
        const data = new Array(10).fill(0).map(()=>{
            return new Array(50).fill(0)
        })
        return {
            data
        }
    }
}
</script>
```

```ts [Item.vue]
<template>
    <div style="display: flex;justify-content: center;">
        <div ref="msg" style="padding-right: 10px;">这是一条消息</div>
        <div style="display: flex;position: relative">
                <EditPen @click="showColorPickerFn" style="cursor: pointer;width: 20px;" />
                <div :id="id" style="visibility: hidden;position: absolute;">
                </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { uniqueId } from 'lodash-es'
import { EditPen } from '@element-plus/icons-vue'
import { useSingleColorPicker } from '../hooks/useSingleColorPicker'


export default {
    components: {
        EditPen
    },
    setup() {
        let msg = ref<HTMLDivElement>()
        //生成一个独一无二的占位ID
        const id = `item${uniqueId()}`
        const { updateTeleportTo,showColorPicker,handleColorChange } = useSingleColorPicker()
        const showColorPickerFn = () => {
            // 传递消息DOM
            handleColorChange(msg)            
            // 将颜色选择器传送到本组件的指定位置
            updateTeleportTo(`#${id}`)
            // 显示颜色选择器
            showColorPicker()
        }
        return {
            msg,
            showColorPickerFn,
            id
        }
    }
}
</script>
```
:::

### 其他

Tab切换等复用场景

```ts
// Tab.vue
<template>
    //v-model绑定当前tab
  <ElTabs v-model="currentTab">
    <ElTabPane label="Tab 1" name="tab1" >
          // 占位
      <div id="tab1"></div>
    </ElTabPane>
    <ElTabPane label="Tab 2" name="tab2">
          // 占位
      <div id="tab2"></div>
    </ElTabPane>
    <ElTabPane label="Tab 3" name="tab3">
          // 占位
      <div id="tab3"></div>
    </ElTabPane>
  </ElTabs>
      //提取
  <Teleport :to="teleportTo">
     <div>111111</div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref,watch,Teleport,onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';

//初始化
const currentTab = ref('tab1');
const teleportTo = ref('body');
onMounted(() => {
    teleportTo.value = `#${currentTab.value}`
})
//监听切换
watch(currentTab, (newVal) => {
    teleportTo.value = `#${newVal}`
})

</script>
```

## 2024-10-29

[2024前端行业调查——来自TSH](https://tsh.io/state-of-frontend/#frameworks)

前端框架现状：
1. React和Next.js占据了前端框架市场的主导地位，其次是Angular和Vue。
2. 新型的框架增长势头不减，如Svelte、Astro
3. 许多开发者对Angular.js和Ember的兴趣却在逐渐下降，对HTMX和Qwik的兴趣更多

前端验证库：zod占据了前端验证库的主导地位，其次是 class-validator 和 Joi。

前端日期库：date-fns和Moment.js占据了前端日期库的主导地位，其次是 Date.js 和 Day.js，最后是Luxon。

前端状态管理库：React Context Api使用最多，其次是Redux、Redux Toolkit、Zustand、Pinia

前端其他库：Lodash、JQuery、RxJS等也有相当使用量

前端数据获取：Fetch和Axios占据了前端数据获取的主导地位，其次是TanStack Query

微前端：采用率从 2022 年报告使用微前端的 75.4% 大幅下降 到 2024 年的 23.6%，一些并不真正需要微前端的公司试图实施它们，这在一定程度上解释了这种下降。许多人意识到，微前端需要的不仅仅是技术知识，还需要组织和文化变革，而他们还没有准备好应对。另一个关键因素是对服务器端渲染 （SSR） 和静态站点生成 （SSG） 架构的投资不断增长，它们融合了类似的概念。Webpack 5 Module Federation正在成为客户端应用程序的标准。

前端包管理器：NPM主导Node.js包管理器市场，但Yarn和PNPM正稳步增长。Yarn以性能和高级功能受欢迎，PNPM则因高效依赖管理获青睐。

JS运行时：Node.js以90%的投票率占据了前端运行时市场，其次Bun

前端类型：TypeScript以100%的投票率占据前端类型市场，其次是JSDoc，然后是Flow，大多数人对TS持乐观态度，前景光明

前端UI组件库：shadcn/ui占据28.1%，MUI占据21.5%，其次是Bootstrap，Ant Design

前端样式：Sass/SCSS使用率为71.8%，Tailwind CSS实用主义方法获66.7%认可，CSS Modules和Styled Components使用率分别为56.7%和42.9%

前端测试：大多数测试都是由开发人员或通过开发人员和 QA 团队之间的协作处理的 ， Jest （68.2%） 和 Cypress （42.6%） 仍然是最受欢迎的测试工具，单元测试的趋势正在转向 Vitest （39.8%），尤其是当 Vite 在各种 JavaScript 框架中越来越流行时

前端构建工具：Vite 在开发者中享有很高的满意度，82.4% 的人表示认可。 它的吸引力源于其速度、快速启动时间和最低配置要求，使其成为 Webpack 的首选替代品。Webpack 的反馈褒贬不一，只有 44% 的用户表示满意，38.5% 的用户认为它由于其复杂性和具有挑战性的配置而很麻烦

前端检查工具：ESLint （89.3%） 和 Prettier （87.5%） 继续在linting和格式化领域占据主导地位

## 2024-10-30

[33K Star React-beautiful-dnd停用！！ FROM 公众号——前端充电宝](https://mp.weixin.qq.com/s/Vkogft3rBIMzPCZpSEfryQ)

[Github React-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
![react_beautiful_dnd](/react_beautiful_dnd.png)

前端拖拽库：
1. VueDraggablePlus：Vue 版本的拖拽库，支持Vue2和3 [Github VueDraggablePlus](https://github.com/Alfred-Skyblue/vue-draggable-plus)
2. React:
   1. dnd-kit ,[Github dnd-kit](https://github.com/clauderic/dnd-kit)
   2. react-dnd, [Github react-dnd](https://github.com/react-dnd/react-dnd)
3. 通用的解决方案：pragmatic-drag-and-drop，react-beautiful-dnd 作者开发的新拖拽库，不依赖于特定的框架，[Github pragmatic-drag-and-drop](https://github.com/atlassian/pragmatic-drag-and-drop) 
4. Swapy，新发布的，[Github Swapy](https://github.com/TahaSh/swapy)

## 2024-10-31

[如何高效获取前端优质信息](https://mp.weixin.qq.com/s/46xfjH0z_ehNKPYjJZdzkg)

1. 权威性，各种官网文档和规范
2. 实用性，教程和社区分享
3. 及时性，最新的技术趋势和更新进展

### 官方文档

W3C规范：[W3C](https://www.w3.org/standards/)

Whatwg:[Whatwg](https://spec.whatwg.org/)

[The Web Platform: Browser technologies](https://html-now.github.io/)

[The Web Platform: Browser technologies](https://www.w3.org/wiki/BrowserTechnologies)

TC39:l,[TC39](https://tc39.es/)

ECMA:[ECMA](https://262.ecma-international.org/)

HTML Standard:[HTML Standard](https://html.spec.whatwg.org/multipage/)

HTML Standard————W3C School:[HTML Standard————W3C School](https://www.w3cschool.cn/html5/html5-syntax.html)

CSS Standard:[CSS Standard](https://www.w3.org/TR/CSS22/)

TS中文网:[TS中文网](https://www.tslang.cn/)

TS英文:[TS英文](https://www.typescriptlang.org/)

WebAssembly:[WebAssembly](https://webassembly.org/)

WebAssembly中文网:[WebAssembly中文网](https://www.wasm.com.cn/)

#### 浏览器生态

[Chrome 更新说明](https://developer.chrome.com/tags/new-in-devtools/)

[Chromium 开发者文档](https://www.chromium.org/developers/)

Safari 更新日志：Safari Release Notes | Apple Developer Documentation

[V8](https://v8.dev/)

#### 网络

[HTTP1.1](https://datatracker.ietf.org/doc/html/rfc2616)

[HTTP2](https://datatracker.ietf.org/doc/html/rfc7540)

#### UI框架

[React](https://zh-hans.react.dev/learn)

[Vue](https://cn.vuejs.org/)


#### 跨端

[Flutter](https://flutter.cn/)

[React Native](https://reactnative.cn/)

[Electron](https://www.electronjs.org/zh/docs/latest/)

#### 运行时

[Node.js](https://nodejs.org/zh-cn)

### 技术周刊

=> [技术周刊](/pages/good_sites/#技术周刊)

## 2024-11-01

了解npm audit以及修复漏洞 [From 公众号——前端早读课](https://mp.weixin.qq.com/s/naR0Jko-KBXml__aOFcmNw)

原文地址：https://www.niraj.life/blog/understanding-npm-audit-fixing-vulnerabilities-nodejs/

当构建Node.js项目的时候，通常依赖第三方库来开发比如axios、epxress等，这些三方库也依赖了其他的库，这种依赖关系可能会变得复杂，任何包中的漏洞会使得我们的应用出现问题。这就是npm audit所要做的工作。

audit问题指的是在你的直接依赖项（例如，axios 或 express）或它们的子依赖项中发现的已知漏洞。npm audit 会根据 npm 维护的公共漏洞数据库，对整个依赖树进行安全漏洞扫描。它扫描 package.json、package-lock.json 和 node_modules 文件夹中的任何易受攻击的包。
运行完npm audit之后，会得到一份详细报告,其中包含了一些漏洞的描述、严重程度、受影响的版本、修复版本、以及一些建议的修复方案。
```ts
npm audit
```

解决npm aduit问题：
```ts
对于许多漏洞， npm audit 提供了自动修复功能,此命令尝试将你的软件包升级到非易受攻击的版本，同时保持向后兼容性。
它将安装遵循语义版本控制的补丁版本（patch 版本）的软件包，这意味着你不必担心破坏性更改。
npm audit fix
```
```ts
可能会破坏你现有代码的兼容性。在使用 --force 时要小心，因为它可能会安装可能导致代码兼容性问题的更新
npm audit fix --force
```

使用npm audit后问题依然存在：
1. 移除 package-lock.json ：有时，锁定文件可能是遗留依赖问题的原因。首先删除 package-lock.json 文件
2. 移除 node_modules ：删除 node_modules 目录可确保所有依赖项重新安装并更新
3. 获取该易受攻击软件包的最新稳定版本：为了确保您正在使用安全版本，请检查该易受攻击软件包的最新稳定版本
4. 添加overrides字段到 package.json，覆盖不符合的依赖项,处理嵌套依赖：在某些情况下，受影响的包可能深嵌在依赖树中（即，它是另一个包的子依赖），可能需要在 package.json 中维护这种嵌套层次结构，以确保覆盖正确应用
```json
{
  "overrides": {
    "some-package": {
      "some-dependency": "1.2.3"
    }
  }
}
```

预防措施：
1. 定期运行 npm audit：养成定期运行 npm audit 的习惯，尤其是在添加新依赖或在将代码推送到生产环境之前
2. 保持依赖项更新：使用工具如 npm outdated 或 npm-check 查看是否存在可用的更新版本或更安全的依赖项
3. 使用 npm audit --production ：如果某些漏洞仅与开发依赖项（如构建工具或测试框架）相关，可以通过运行以下命令将审计范围缩小到仅包含生产依赖项
```ts
npm audit --production
```
4. 切换到活跃维护的库：如果你正在使用一个不再活跃维护且存在未解决安全问题的库，考虑切换到一个更活跃维护的替代品

## 2024-11-02

Flex中更巧妙的布局方式,[FROM 公众号——掘金技术社区](https://mp.weixin.qq.com/s/qFHz0fWX2fbLX3h2MpIrHA)

在传统布局中，marign：auto主要用于让元素水平居中，因为在普通流布局的垂直方向是由文档流控制的，不支持类似FlexBox中的自动调整行为。在启用了flex布局之后，margin: auto,会根据父容器的剩余空间自动调整元素的外边距，直到子元素居中。

```html
<style>
  .container {
    width: 100px;
    height: 100px;
    background-color: black;
    display: flex;
    margin: 100px auto;
  }
  .box {
    width: 50px;
    height: 50px;
    background-color: white;
    /* 自动分配外边距 */
    margin: auto; 
  }
</style>
<div class="container">
  <div class="box"></div>
</div>
```
![center](/flex_center.png)

实现item部分集中
```html
  <style>
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 500px;
  background: #eee;
  margin: 50px auto;
  padding: 10px;
  display: flex;
}
.item {
  width: 50px;
  height: 50px;
  border: 1px solid #333;
  box-sizing: border-box;
}
.item:nth-child(odd) {
  background: #046f4e;
}
.item:nth-child(even) {
  background: #d53b3b;
}
.item:nth-child(2) {
  /* 第二个item右对齐 */
  margin: 0 0 0 auto; 
}
.item:nth-child(4){
  /* 第四个item左对齐 */
  margin: 0 auto 0 0;
}
</style>
<div class="container c2">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```
![flex](/flex_margin.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    .container {
      width: 500px;
      background: #eee;
      margin: 50px auto;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
    }
    .item {
      width: 50px;
      height: 50px;
      border: 1px solid #333;
      box-sizing: border-box;
    }
    .item:nth-child(odd) {
      background: #046f4e;
    }
    .item:nth-child(even) {
      background: #d53b3b;
    }
    .c3 .item {
      /* 假设总列数为5,开发中可以less和scss等动态计算 */
      --count: 5; 
      /* 假设item的宽度为50px */
      --item-width: 50px;
      /* 计算每一列的剩余宽度 */
      --space-width: calc(100% / var(--count) - var(--item-width));
      /* 计算每一列的左右边距 */
      --half-space-width: calc(var(--space-width) / 2);
      /* 给item设置左右边距 */
      margin: 10px var(--half-space-width);
    }
  </style>
  <body>
    <div class="container c3">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </body>
</html>
```
![flex](/flex_margin2.png)

## 2024-11-03

为什么前端打包出来的静态文件名是一串Hash值？[FROM 掘金——Moment](https://juejin.cn/post/7418133347542597651#heading-0)

启发式缓存，服务器通常会通过 HTTP 头部信息（如 Cache-Control、Expires）明确指示一个资源可以缓存多长时间。但有时这些指示可能缺失，或者某些资源的缓存控制信息不完整，客户端就会依赖启发式规则来确定该资源的缓存时长
   1. 无明确缓存指示的资源：很多静态资源（例如图片、CSS 文件、JavaScript 文件）可能缺乏明确的 Cache-Control 或 Expires 指令。在这种情况下，启发式缓存会基于资源的类型、最后修改时间等规则来估计缓存时长
   2. 动态内容：某些动态生成的内容（例如 API 返回的数据）没有明确的缓存控制头，但服务器返回的内容在一定时间内不会频繁更新。启发式缓存可以帮助提高性能，减少重复的网络请求
1. 基于 Last-Modified 头估算：如果资源包含 Last-Modified 头，浏览器或缓存代理通常会基于该时间来计算缓存过期时间
2. 于文件类型：不同类型的资源可以采用不同的启发式缓存策略。例如：图片、字体等静态资源通常可以缓存更长时间（如 1 天到 1 周）
3. 缺省时间设定：如果无法基于其他头部信息推断，系统可能会采用默认的缓存时间，比如 1 小时或 24 小时

Hash：浏览器会默认缓存已请求过的静态文件，这种默认的缓存机制就是启发式缓存。除非明确设置了 no-store，否则浏览器会自动缓存静态资源，避免重复下载，加快页面加载速度。通过文件名中的 Hash，可以确保浏览器总是加载最新的资源，避免老版本的缓存文件污染应用

第三方库处理：
1. 通过 Webpack 的 splitChunks 插件或类似工具将库代码和应用代码分开，使得第三库文件的Hash与业务代码无关
```ts
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```
2. CDN加载,使用 externals 来避免将第三方库打包到项目中
```ts
module.exports = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
```
```html
<script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script>
```
3. 锁定第三方库版本,使用 package-lock.json 或 yarn.lock 文件确保构建环境的一致性，防止库的版本随意变动
```ts
{
  "dependencies": {
    "react": "^17.0.0",
    "lodash": "^4.17.21"
  }
}
```

## 2024-11-04

uni-app打包微信小程序主包超过2M怎么办？[FROM 公众号——前端帮](https://mp.weixin.qq.com/s/eIFl2IBe4824RqnS7WcNmg)

1. 开发版可以调整上限为4M，开发者工具 -> 详情 -> 本地设置 -> 预览及真机调试时主包、分包体积上限调整为4M -> 勾选
2. 体验版，上传代码时，主包必须在2M以内，小程序tabbar页面必须放在主包。推荐除了tabbar页面以外，其余的都放在分包。其实只要这样做了，再复杂的小程序，主包代码都很难超过2M，但如果是uni-app开发的，那就不一定了
3. 压缩代码，在package.json，script中设置压缩：在命令中加入--minimize
4. 使用HBuilderX，顶部菜单栏点击运行 -> 运行到小程序模拟器 -> 运行时是否压缩代码 -> 勾选
5. 不要在uni.css文件内写公共样式代码，uni-app项目创建后会自带一个uni.scss文件，这个文件无需手动引入，会自动注入到每一个页面文件，所以尽量不要在这个文件内写公共css代码。[uni.css](https://uniapp.dcloud.net.cn/collocation/uni-scss.html)

## 2024-11-05

Web中ES5现状[FROM 公众号——前端微志](https://mp.weixin.qq.com/s/4GtUP7zwNtXeTblSfl_Aig)

1. 选择支持旧版浏览器有成本，使用 ES6+ 语法编写代码，然后使用构建工具将其转译为 ES5，通常会引入大量的 polyfill 和转译器膨胀，这可能会显著增加你最终捆绑包的大小。
```ts
使用Babel转译这行代码，并配置它添加 polyfills——即使你将其限制在源代码中基于使用所需的polyfills
它包括了 71 个 core-js 依赖项，并且从 31 字节增加到 11,217 字节压缩!
console.log([1,2,3].at(-1))
```
2. 默认打包器和构建工具配置

| 工具             | 默认设置 | 备注                                                                                                                                                                                                                      |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browserlist      | 否       | 本身不是构建工具，但许多构建工具内部使用它，并且是最流行的开源工具，用于配置浏览器支持目标。`[defaults](https://browsersl.ist/#q=defaults)` 设置不再包括任何 ES5 浏览器。最后一个是 IE 11，它在版本 4.21 中被标记为死亡。 |
| Babel            | 是       | 建议设置一个 `[targets](https://babeljs.io/docs/options#targets)` 选项（它使用 Browserlist），但如果未指定，它将所有代码转译为 ES5。                                                                                      |
| webpack          | 否       | 默认情况下，webpack 不转译任何代码。大多数 webpack 用户包括 `[babel-loader](https://webpack.js.org/loaders/babel-loader/)`，并且webpack 的使用示例建议设置 `targets: "defaults"`。                                        |
| TypeScript (tsc) | 是       | TypeScript 的默认 `[target](https://www.typescriptlang.org/tsconfig/#target)` 选项是 ES5。                                                                                                                                |
| Next.js          | 否       | 使用 Babel 进行转译，并且默认设置一个 Browserlist 配置，目标是“现代浏览器”（即支持 ES 模块的浏览器）。                                                                                                                    |
| esbuild          | 否       | 默认不转译。你可以设置自定义目标以启用转译，但 ES5 不作为转译目标支持。                                                                                                                                                   |
| Vite             | 否       | 使用 esbuild，并且默认为“现代浏览器”设置自定义目标（即支持 ES 模块的浏览器）。Vite 允许用户安装插件，如果他们需要支持旧版浏览器。                                                                                         |
| Rollup           | 否       | 默认不转译。许多 Rollup 用户安装 `@rollup/plugin-babel`，在这种情况下，使用 Babel 默认值。                                                                                                                                |
| Parcel           | 否       | 自动应用差异化服务，具有可自定义的目标。                                                                                                                                                                                  |
| Closure Compiler | 否       | 默认为 ECMASCRIPT_NEXT，这是最新的一组稳定 ES 功能。                                                                                                                                                                      |
3. 流行的 JavaScript 库

| 库            | 包含 ES6+ 语法 | 备注                              |
| ------------- | -------------- | --------------------------------- |
| Lodash        | 否             | 仅限 ES5                          |
| React         | 否             | 仅限 ES5                          |
| date-fns      | 是             | 箭头函数                          |
| three.js      | 是             | async/await, 箭头函数, 展开, 解构 |
| d3            | 是             | 箭头函数, 展开, 解构              |
| Framer-motion | 是             | 箭头函数, 展开, 解构              |
| greensock     | 否             | 仅限 ES5                          |
| dayjs         | 否             | 仅限 ES5                          |
| Zod           | 是             | async/await, 箭头函数, 展开, 解构 |
| RxJS          | 是             | 箭头函数                          |
| immer         | 是             | 箭头函数, 展开, 解构              |
| luxon         | 是             | async/await, 箭头函数, 展开, 解构 |
| react-query   | 否             | 仅限 ES5（捆绑 Babel 助手）       |
- Webpack 的 babel-loader 文档推荐一个配置，该配置排除了 node_modules
- Rollup 的 plugin-babel 文档推荐排除 node_modules，并且还推荐库作者不发布 ES6 代码
- TypeScript（tsc），继 Babel 之后第二大流行的转译工具，只会转译项目自己的代码文件。它不会转译 node_modules 中的项目依赖项
- 这为任何想要支持 ES5 并使用 Babel 或 tsc 转译代码的网站创造了一个问题。除非他们对构建管道的各个部分如何相互作用有复杂的了解，并且除非他们知道如何正确配置每一个，他们可能会在没有意识到的情况下将 ES6+ 代码捆绑在他们的 ES5 代码中。

## 2024-11-06

[uniapp小程序本地缓存区分开发版、体验版、线上版 FROM 公众号——前端帮](https://mp.weixin.qq.com/s/HVGd1ai05kkxrIRNTVQ4YA)

开发小程序时，经常会把登录的token存到localStorage中，但微信小程序的开发版、体验版、线上版是共用缓存的，同一个key的值在不同环境中是一样的，这就导致我们访问不同版本小程序时会出现访问不了的情况，但是可以通过代码拿到当前小程序的版本。
```ts
const accountInfo = wx.getAccountInfoSync()
// uniapp可以直接uni.getAccountInfoSync()
// 结果是一样的
console.log(accountInfo.miniProgram.envVersion)
// develop 开发版
// trial 体验版
// release 正式版

const envVersion = __wxConfig.envVersion
console.log(envVersion)
// develop 开发版
// trial 体验版
// release 正式版
```
解决：可以重写uni.setStorageSync和uni.getStorageSync方法，直接给每个key都加个版本号前缀，避免在每个地方都去加。注意，这个办法仅仅在uniapp中有效，如果试图去改写小程序原生的wx.xxxx，会报以下错误，因为它是只读的
```ts
const originSetStorageSync = uni.setStorageSync
const originGetStorageSync = uni.getStorageSync

uni.setStorageSync = function setStorageSync(k, v) {
  const envVersion = __wxConfig.envVersion
  originSetStorageSync(envVersion + '_' + k, v)
}
uni.getStorageSync = function getStorageSync(k) {
  const envVersion = __wxConfig.envVersion
  return originGetStorageSync(envVersion + '_' + k)
}
```

## 2024-11-07

[使用scheduler.yield方法代替setTimeout FROM 公众号——前端早读课](https://mp.weixin.qq.com/s/wlHVHbRgKCDbJamJ5SG7WQ)

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

Scheduler 接口的 yield（） 方法用于在任务期间让步到主线程并在以后继续执行，并将延续计划为优先任务.
可以通过 await 来分解长任务。该函数返回一个 promise，让步于主线程，以允许浏览器在需要时执行其他待处理的工作，例如响应用户输入。浏览器计划解决 Promise 的后续任务，此时代码可以从中断处继续执行。scheduler.yield()
```ts
button.addEventListener("click", async () => {
  // Provide immediate feedback so the user knows their click was received.
  showSpinner();
  await scheduler.yield();
  // Do longer processing
  doSlowContentSwap();
});
```

## 2024-11-08

[前端部署后自动提醒用户更新 FROM 掘金](https://juejin.cn/post/7428793777984208896)

1. 生成git提交的hash信息json文件,请求本地json文件获取更新信息
   1. 写一个mixins监听文本版本变化，在APP组件中引用
```ts
// webpack.config.js
npm install git-revision-webpack-plugin --save-dev
引入GitRevisionPlugin
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
```
2. 后端记录更新日志，通过接口返回更新版本号，前端通用接口调用获取版本号
3. 使用webpack的hash功能

## 2024-11-09

[懒加载图片 FROM 公众号——前端帮](https://mp.weixin.qq.com/s/vhpXEaumPp5VvR7Zt9jGkQ)
```ts
// 使用原生getBoundingClientRect方法获取元素的位置信息，判断是否在可视区域内，如果在可视区域内，则加载图片
window.addEventListener("scroll", () => {
  const img = document.querySelectorAll('img')
  img.forEach(img => {
    const rect = img.getBoundingClientRect();
    console.log("rect", rect);
    if (rect.top < document.body.clientHeight) {
      img.src = img.dataset.src
    }
  })
})
```
```ts
//使用IntersectionObserver API实现懒加载图片
let observer = new IntersectionObserver(
  //检测到元素进入可视区域时执行的回调函数
  (entries) => {
    console.log("交叉了");
    console.log(entries);
    for (const entrie of entries) {
       if (entrie.isIntersecting) {
          const img = entrie.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
       }
    }
  },
  {
    root: null,//要观察的目标元素,与哪个父元素产生交叉，不传或者传null，就表示根元素，即浏览器的视口
    rootMargin: "0px 0px 0px 0px",//表示root元素的偏移量
    threshold: 0.5 //是一个0~1之间的值，表示一个触发的阈值，如果是0，只要目标元素一碰到root元素
  }
);
// 获取所有的图片元素
const imgs = document.querySelectorAll("img");
// 遍历这些元素
imgs.forEach((img) => {
  // 用observe方法观察这些元素
  observer.observe(img);
});
```

## 2024-11-10

[在JS中使用Set生成唯一随机数 FROM 公众号——前端帮](https://mp.weixin.qq.com/s/3ePLNJuam3nr_X5Duzzd0A)
使用集合的原因是集合的元素是唯一,可以迭代地生成并插入随机整数到集合中，直到我们得到我们想要的整数数量
```ts
function generateRandomNumbers(count, min, max) {
  // if 语句检查 `count` 是否小于 `max + 1`
  if (count > max + 1) {
    return "count 不能大于范围的上限";
  } else {
    let uniqueNumbers = new Set();
    while (uniqueNumbers.size < count) {
      // 随机生成一个整数并加入集合
      uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(uniqueNumbers);
  }
}
console.log(generateRandomNumbers(5, 5, 10));
```

## 2024-11-11

[Vue版本神秘名称](https://mp.weixin.qq.com/s/8e43XrQ7bu91yTGqZSAWPg)

| 版本   | 发布时间   | 版本名称                   | 中文                       |
| ------ | ---------- | -------------------------- | -------------------------- |
| 0.6    | 2013.12.8  | VueJS                      | 无                         |
| 0.9    | 2014.2.25  | Animatrix                  | 黑客帝国动画版             |
| 0.10   | 2014.3.23  | Blade Runner               | 银翼杀手                   |
| 0.11   | 2014.11.7  | Cowboy Bebop               | 星际牛仔                   |
| 0.12   | 2015.6.12  | Dragon Ball                | 龙珠                       |
| 1.0    | 2015.10.27 | Evangelion                 | 新世纪福音战士             |
| 2.0    | 2016.9.30  | Ghost in the Shell         | 攻壳机动队                 |
| 2.1    | 2016.11.22 | Hunter X Hunter            | 全职猎人                   |
| 2.2    | 2017.2.26  | Initial D                  | 头文字D                    |
| 2.3    | 2017.4.27  | JoJo's Bizarre Adventure   | JOJO的奇妙冒险             |
| 2.4    | 2017.7.13  | Kill la Kill               | 斩服少女                   |
| 2.5    | 2017.10.13 | Level E                    | 灵异E接触                  |
| 2.6    | 2019.2.4   | Macross                    | 超时空要塞                 |
| 2.7    | 2022.7.1   | Naruto                     | 火影忍者                   |
| 2.7.16 | 2023.12.24 | Swan Song                  | 绝唱，Vue2最终版，停止更新 |
| 3.0    | 2020.9.18  | One Piece                  | 海贼王                     |
| 3.1    | 2021.6.7   | Pluto                      | 冥王星                     |
| 3.2    | 2021.8.5   | Quintessential Quintuplets | 五等分的新娘               |
| 3.3    | 2023.5.11  | Rurouni Kenshin            | 浪客剑心                   |
| 3.4    | 2023.12.28 | Slam Dunk                  | 灌篮高手                   |
| 3.5    | 2024.9.3   | Tengen Toppa Gurren Lagann | 天元突破 红莲螺岩          |

## 2024-11-12

[基于二分法快速找到有问题的提交 FROM 前端早读课](https://mp.weixin.qq.com/s/KPOJpLNh9kpVOYYCI5rUMA)
比如找到一个readme.md文件中的“bad”字符，当没有问题的时候应该只有good字符；


```ts
// good
// good
// good
// bad
// good
// good
// good
 git bisect start

 git bisect bad HEAD //最后一次提交的时候，项目是坏的，此时的标记为 HEAD

 git bisect good v1.0.0 //第一次提交的时候，项目是好的，当时的标记为 1.0.0

 git bisect run ./test.sh
```
```ts
//当 test.sh 的退出码为 0 时，会自动缩小二分查找的范围，直到退出码为非 0
 # test.sh

 #!/usr/bin/env bash

 # Check if README.md contains the word "bad"
 if grep -q "bad" README.md; then
   echo "README.md contains the word 'bad'"
   exit 1
 else
   echo "README.md does not contain the word 'bad'"
   exit 0
 fi
```

## 2024-11-13

[CSS框架 FROM 前端充电宝](https://mp.weixin.qq.com/s/vdMqBviYwpZ83lw6TmmKPA)

[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss),强调的是原子级的 CSS 类，它将各种样式定义为独立的类，开发者可以轻松地组合和应用这些类来构建出所需的样式

[UnoCSS](https://github.com/unocss/unocss),UnoCSS 是 Anthony Fu（Vue 和 Vite 的核心团队成员之一）开发是一个即时、按需的原子级 CSS 引擎，它专注于提供轻量化、高性能的 CSS 解决方案

[Styled Components](https://github.com/styled-components/styled-components),Styled Components 是目前使用最多的 CSS-in-JS 库，专为 React 和 React Native 设计,Styled Components 允许开发者在 JavaScript 组件中直接编写 CSS 样式，从而实现样式与组件逻辑的紧密集成

[Emotion](https://github.com/emotion-js/emotion),Emotion 是一个流行的 CSS-in-JS 库，专为 React 设计
[vanilla-extract](https://github.com/vanilla-extract-css/vanilla-extract),vanilla-extract 是一个创新性的 CSS-in-JS 库，它的目标是提供一种简单、高效且类型安全的方式来处理样式。相对于上面的两个库，vanilla-extract 的一个显著特点就是无运行时，样式在构建时处理，类似于Sass和Less，不会增加应用的运行时负担

styled-jsx,styled-jsx 是一个用于在 React 项目中编写 CSS 的库，特别设计用于与 JSX 一起使用

[Bootstrap](https://github.com/twbs/bootstrap),老牌 CSS 框架，最初是由Twitter的工程师开发，旨在解决内部项目中快速构建一致且响应式的用户界面的问题,现在，使用 Bootstrap 的人数一直在减少，主要是因为开发者开始倾向于使用更轻量、更易于定制的CSS解决方案，如CSS-in-JS库和原子化的CSS框架，这些工具提供了更高的灵活性和集成度，以适应不断变化的设计趋势和性能要求。同时，开发者对于框架的特定集成和生态系统的需求也在增加，导致他们寻找更符合现代开发实践的替代品.


## 2024-11-14

[中国人才懂的前端工具,FROM 前端充电宝](https://mp.weixin.qq.com/s/ZanVXRdSUnqx3BV1CDL42g)

省市区选择：只需借助 UI 组件库的 Cascader 级联选择以及行政区划数据即可实现地址选择组件
[Administrative divisions of China](https://github.com/modood/Administrative-divisions-of-China)

[汉字拼音转换_pinyin-pro](https://github.com/zh-lx/pinyin-pro)

[全能日历_lunar](https://github.com/6tail/lunar-javascript)

[中文数字和阿拉伯数字互转_nzh](https://github.com/cnwhy/nzh)

[紫微斗数排盘_Iztro](https://github.com/SylarLong/iztro)

[中文分词_nodejieba](https://github.com/yanyiwu/nodejieba)

## 2024-11-15

[NodeJS 性能hooks和度量API FROM 前端早读课](https://mp.weixin.qq.com/s/nPqPFG4sxLhDdYwI5igF8w)

使用performance.now()测量执行时间
```ts
const { performance } = require('node:perf_hooks');
 let start = performance.now();
 // 待测量的代码区块
 let end = performance.now();
 console.log(end - start);
```
使用performance.mark()和performance.measure()测量两个标记的时间差
```ts
performance.mark('loop_start');
 for (let i = 0; i < 10000; i++) {}
 performance.mark('loop_end');
 console.log(performance.measure('loop_time', 'loop_start', 'loop_end'));
```
使用worker_threads模块创建子线程，处理CPU密集型任务
```ts
 const { Worker } = require('node:worker_threads');
 // 主线程
 const worker = new Worker('./worker.js');
 worker.on('message', (data) => {
   // 处理结果
 });
 // 工作线程 (worker.js)
 const { parentPort } = require('node:worker_threads');
 // 执行任务
 parentPort.postMessage(result);
```

## 2024-11-16

[JS新特性 FROM 前端充电宝](https://mp.weixin.qq.com/s/l2o4TJJLCsCm5GeSFZ42nA)

1. Promise.try,这个方法接受一个函数f作为参数，并立即执行该函数。如果f是同步函数并返回一个值，则Promise.try会返回一个解析为该值的Promise。如果f是异步函数并返回一个Promise，则Promise.try会返回该Promise并保持其状态。如果f抛出异常，则Promise.try会返回一个拒绝的Promise，并带有该异常作为拒绝原因
```ts
const f = () => {  
  console.log('Function f is executing');  
  return 42; // 假设这是一个同步函数，返回一个值  
};  
  
Promise.try(f).then(value => {  
  console.log('Received value:', value); // 输出: Received value: 42  
});  
  const asyncF = () => {  
  return new Promise((resolve) => {  
    setTimeout(() => {  
      resolve('Async value');  
    }, 1000);  
  });  
};  
  
Promise.try(asyncF).then(value => {  
  console.log('Received async value:', value); // 一秒后输出: Received async value: Async value  
});
```
2. 全新的Set方法
```ts
Set.prototype.intersection(other)：返回两个集合的交集。
Set.prototype.union(other)：返回两个集合的并集。
Set.prototype.difference(other)：返回第一个集合与第二个集合的差集。
Set.prototype.symmetricDifference(other)：返回两个集合的对称差。
Set.prototype.isSubsetOf(other)：判断第一个集合是否是第二个集合的子集。
Set.prototype.isSupersetOf(other)：判断第一个集合是否是第二个集合的超集。
Set.prototype.isDisjointFrom(other)：判断两个集合是否不相交。
```
3. 导入模型，在 JavaScript 模块导入语句中将支持内联语法，允许指定模块属性，以便支持不同类型的模块。这些属性通过with关键字后跟一个对象字面量来指定，对象中可以包含不同的键值对
```ts
// 导入一个JSON模块
import json from "./foo.json" with { type: "json" };

// 动态导入一个JSON模块
import("foo.json", { with: { type: "json" } });

// 导出一个模块，并指定其类型
export { val } from './foo.js' with { type: "javascript" };
```
4. 迭代器新方法，迭代器原型上将引入一系列新方法，允许更通用的使用和消费迭代器，包括：
```ts
.map(mapperFn)：允许对迭代器返回的每个元素应用一个函数。
.filter(filtererFn)：允许跳过迭代器中未通过过滤器函数的值。
.take(limit)：返回一个迭代器，最多产生底层迭代器产生的给定数量的元素。
.drop(limit)：跳过底层迭代器产生的给定数量的元素，然后产生任何剩余的元素。
.flatMap(mapperFn)：返回一个迭代器，它产生的是应用映射函数到底层迭代器产生的元素所生成的迭代器的所有元素。
.reduce(reducer [, initialValue ])：允许对迭代器返回的每个元素应用一个函数，同时跟踪Reducer的最新结果（memo）。
.toArray()：将非无限迭代器转换为数组。
.forEach(fn)：用于对迭代器执行副作用，接受一个函数作为参数。
.some(fn)：检查迭代器中的任何值是否与给定的谓词匹配。
.every(fn)：检查迭代器生成的每个值是否通过了测试函数。
.find(fn)：用于查找迭代器中第一个匹配的元素。
```

## 2024-11-17

[2024 CSS 现状 FROM 前端充电宝=>原文](https://2024.stateofcss.com/)

1. 使用最多的CSS框架：Tailwind CSS、Bootstrap、Ant Design、Materialize CSS
2. CSS In JS：CSS Modules、Styled Components、Emotion、JSX、vanilla-extract
3. 预/后处理器：Sass/Scss、PostCSS、Less
4. 工具库：Prettier、AutoPrefixer、Stylelint、cssnano、postcss-preset-env、PurgeCSS
5. 浏览器：Chrome、Firefox、Safari、Edge、Safari IOS
  
## 2024-11-18

[NodeJS 更新 原文=>](https://mp.weixin.qq.com/s/id9-_JPSJ4CqIhdyiQ_74A)
1. Node.js 20.0
   1. 权限模型(实验性功能)，允许开发者在程序执行期间限制对特定资源的访问，例如文件系统操作、子进程生成和工作线程创建
   2. 原生测试运行器，test_runner模块被标记为稳定，这意味着它已经准备好用于生产环境。稳定的测试运行器包括编写和运行测试所需的基本组件，如describe、it/test和钩子来构建测试文件、模拟、监视模式以及node --test用于并行运行多个测试文件
2. Node.js 20.6:
   1. 原生支持 .env 文件：引入了对.env文件的原生支持，允许开发者直接在Node.js中使用.env文件配置环境变量，无需依赖第三方模块（如dotenv）
3. Node.js 21：
   1. 内置 WebSocket 客户端（实验性功能）
   2. 自由切换默认模块系统（实验性功能），这一功能允许开发者在ES模块和CommonJS之间灵活切换，以满足不同的项目需求
4. Node.js 21.7：
   1. 内置彩色文本输出： 支持通过console.log间接输出彩色文本，无需再引入第三方库（如 chalk），可以通过util.styleText函数来设置文本的颜色和样式
   2. 环境变量功能增强
      1. process.loadEnvFile(path)用于加载指定路径的.env文件。如果未指定路径，则会自动加载当前目录下的.env文件
      2. util.parseEnv(content)用于解析包含环境变量赋值的字符
5. Node.js 22.0:
   1. 监听模式： 从Node.js 22版本开始，观察模式（node --watch）已经稳定。在监听模式下，当被监视的文件发生变化时，Node.js进程将自动重新启动，不再需要借助第三方模块（如 nodemon）
   2. 内置 WebSocket 客户端（稳定版）： 内置 WebSocket 客户端成为于稳定功能，不再需要--experimental-websocket标志来启用
   3. 支持通过require()引入ESM ：打破了CommonJS与ESM之间的界限，允许开发者使用require()函数来导入ESM 模块
   4. 支持运行 package.json 中的脚本： 添加了一个新命令行标志--run，允许直接从命令行执行package.json中定义的脚本
6. Node.js 22.5:
   1. 支持 SQLite 数据库（实验性功能）：在这个版本中，Node.js自带了SQLite模块，开发者可以直接在程序中使用SQLite数据库，而无需引入第三方库
7. Node.js 22.6:
   1. 原生支持TypeScript（实验性功能）：通过--experimental-strip-types标志，实现了对TypeScript的实验性支持。意味着开发者们现在可以在Node.js环境中直接执行.ts文件，而无需进行额外的编译步骤
   2. 网络检测支持（实验性功能）为 Node.js 引入了网络检查的初步支持。这是一个实验性功能，需要使用--experimental-network-inspection标志来启用它。目前网络检查仅限于http和https模块。
8. Node.js 23.0：
   1. 原生支持 ES 模块，支持通过require()加载 ES 模块（ECMAScript Modules）
   2. 停止支持 32 位Windows系统：不再支持32位Windows，专注于现代环境

## 2024-11-19

[Vue 性能提升 FROM 前端充电宝](https://mp.weixin.qq.com/s/HsvAZlXB1ORrh-yNcEzHCg)
最近，Vue 团队核心成员 Johnson Chu 开源一个全新的信号库：alien-signals，这是一个基于 Vue 3.4 响应式系统重写的研究型信号库，可以使 Vue 3.4 的响应式系统性能提升 400%。目前，alien-signals 是所有信号库中最快的实现。
1. 更低的内存使用
2. 更高的性能
3. 更好的代码抽象

## 2024-11-20















