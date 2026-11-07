# Nuxt

Nuxt 学习

## 路由即页面

### 路由

在app下面创建一个pages文件夹，里面的文件就是路由，路径遵循文件夹/文件；
```ts
app
    pages
        about.vue   ---> /about
        articles
            article1.vue  --->articles/aticle1
```
在app下使用nuxt-page组件，它会自动引入pages下的路由，类似router-view
```ts
<template>
  <div>
    <nuxt-page />
  </div>
</template>
```

1. SSR：服务端渲染 (SSR): 所有的内容（标题、段落、数据）在离开服务器之前就已经填入到 HTML 页面中。浏览器拿到的是一个已经可以阅读的完整文档，右键“查看网页源代码”能看到完整内容。
2. CSR：客户端渲染 (CSR): 页面本身是一个空的“骨架”，内容需要依靠 JavaScript 在用户浏览器（客户端）内执行并请求数据后才能显示。右键“查看网页源代码”只能看到一个空的占位符

### 动态路由

有些页面可能会动态的拼接参数，如article/1,article/2.....

::: code-group

```ts [pages]
pages
    article
        [id].vue
```
```ts [id.vue]
<script setup lang="ts">
import {useRoute} from "vue-router";
const route = useRoute()
const articleId = route.params.id

</script>

<template>
  <div>
    文章详情页面： 文章id {{ articleId }}
  </div>
</template>
```
:::

有些时候用户可能传递的不是期望的类型，如article/1 ---> article/abc，这时候可以使用definePageMeta
```ts
// 检查文章传递的id是否为数字
definePageMeta({
  validate: async (route) => {
    // 检查 id 是否为数字
    return /^\d+$/.test(route.params.id as string) // 匹配失败会跳转到404页面
  }
})
```

对于多个路由参数，如/article/1/comment/1
```ts
pages
  article
    [articleID]
      comment
        [commentID].vue
    [id].vue
```

### 嵌套路由

特殊的页面 表示 /

pages/index.vue 表示 /

pages/user/index.vue 表示 /user

如果存在pages/parent.vue和pages/parent/child.vue，那么parent.vue内部也需要一个 `<NuxtPage />` 来承载子页面内容。

### useHead
管理页面元数据，动态地修改 HTML 文档里的 `<head>` 部分
优先级：如果页面有useHead的配置，就用自己的，没有就找父级，直到app.vue

#### title
```ts
<script setup lang="ts">

// 直接写就行，这些声明已经在.nuxt里面了
useHead({
  title: '关于我们',
  meta: [
    { name: 'description', content: '这是关于页面的描述，对 SEO 非常友好' }
  ]
})
</script>
```

#### 添加属性
```ts
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  bodyAttrs: {
    class: 'article-theme-dark'
  }
})
```

#### 插入外部资源
```ts
useHead({
  script: [
    {
      src: 'https://example.com/map-sdk.js',
      defer: true, // 延迟加载
      tagPosition: 'bodyClose' // 放到 body 结束标签前，避免阻塞渲染
    }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' }
  ]
})
```

在nuxt.config.js中配置全局设置
```ts

// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - learnNuxt', // %s 会被页面里定义的 title 替换
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
})
```

### seo优化

Nuxt推荐使用useSeoMeta，它是useHead的“快捷方式”，专门为meta标签设计。
```ts
useSeoMeta({
  title: '我的文章标题',
  ogTitle: '我的文章标题',
  description: '这是文章的详细描述',
  ogDescription: '这是在社交媒体上显示的详细描述',
  ogImage: 'https://example.com/cover.jpg',
  twitterCard: 'summary_large_image',
})
```
基础SEO属性：
1. title: 页面标题。这是 SEO 最核心的指标，会显示在搜索结果的第一行蓝色文字上。
2. description: 页面描述。通常是搜索结果标题下方的摘要文字。字数建议控制在 150 个字符左右。
3. keywords: 关键词。虽然现在主流搜索引擎（如 Google）已经不再将其作为排名依据，但国内某些搜索引擎依然会参考。
4. author: 作者名。标明文章的原创者。

Open Graph 属性 (OG 协议)：这些属性以og开头，由 Facebook 推出，现在已成为行业标准。当有人在微信、Discord、Telegram 等社交软件分享你的链接时，显示的“卡片预览”就是靠它们。

1. ogTitle: 分享卡片上的标题（通常和title 一致）。
2. ogDescription: 分享卡片上的描述。
3. ogImage:极其重要！这是分享卡片上的预览图。如果没有它，分享链接只会显示一段枯燥的文字。
4. ogUrl: 页面的规范链接。
5. ogType: 页面类型，常用的是website或article

```ts
useSeoMeta({
  // 基础信息
  title: 'Nuxt 3 实战教程：从零重构博客',
  description: '这是一门关于如何使用 Nuxt 3 解决前后端分离 SEO 痛点的课程...',
  keywords: 'Nuxt3, Vue3, SSR, SEO优化',
  
  // 社交分享 (微信、QQ、Discord等)
  ogTitle: 'Nuxt 3 实战教程：从零重构博客',
  ogDescription: '这是一门关于如何使用 Nuxt 3 解决前后端分离 SEO 痛点的课程...',
  ogImage: 'https://api.fengfeng.com/covers/nuxt-tutorial.png', // 必须是绝对路径
  ogType: 'article',
  
  // Twitter 优化
  twitterCard: 'summary_large_image',
  twitterSite: '@fengfeng_zhidao',
})
```

## 布局系统

### 默认布局

在app目录下创建一个layouts目录（如果还没有的话），并新建一个default.vue。这个名字是特殊的，它是默认布局。
在 app.vue 中使用了 `<NuxtLayout>` 组件，它会自动包裹住页面内容
```ts
<template>
  <div class="my-blog-layout">
    <header>
      <nav>
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>© 开启 SSR 之旅</p>
    </footer>
  </div>
</template>

<style scoped>
/* 这里写全局通用的样式 */
header { border-bottom: 1px solid #eee; padding: 1rem; }
footer { margin-top: 2rem; text-align: center; color: #888; }
</style>
```
```ts
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 自定义布局
有些页面可能不需要导航栏，或者需要不同的侧边栏（比如后台管理界面）。你可以创建多个布局文件
```ts
<template>
  <div class="admin-container">
    <aside>后台管理侧边栏</aside>
    <section>
      <slot />
    </section>
  </div>
</template>
```
在特定页面启用它：**比如在pages/admin/index.vue中，通过definePageMeta指定
```ts
<script setup lang="ts">
definePageMeta({
  layout: 'admin' // 对应 layouts/admin.vue 的文件名
})
</script>

<template>
  <h1>欢迎回来，管理员枫枫</h1>
</template>
```

### 动态切换布局
如果你想根据某些逻辑（比如用户是否登录）动态改变布局，可以使用 `<NuxtLayout :name="layoutName">` 或者 setPageLayout 函数。
```ts
<script setup lang="ts">
// 某种条件下动态切换到 admin 布局
function enableAdminMode() {
  setPageLayout('admin')
}
</script>
```
## 组件自动导入

只要你在app/components/文件夹中创建.vue文件，Nuxt 就会自动扫描并生成类型提示，你在任何页面或布局中都可以直接使用
```ts
app/
  components/
    AppHeader.vue
    User/
      Avatar.vue
  pages/
    index.vue
```
Nuxt 会根据目录层级自动命名。components/User/Avatar.vue自动变为`<UserAvatar />`。如果你不喜欢这种拼接，也可以直接在components/下扁平化存放
1. 文件名尽量遵循大写命名法约定
2. 开发的时候尽量避免文件目录和文件重名的情况，比如UserAvatar.vue和User/Avatar.vue
```ts
<template>
  <div>
    <AppHeader /> 
    
    <UserAvatar />
  </div>
</template>
```

### 懒加载组件
这是优化网站性能的利器。如果你有一个组件（比如“评论弹窗”或“感谢信”）不是页面一加载就需要的，你可以通过在组件名前加 Lazy 前缀来激活懒加载。SEO非常有帮助：它减小了初始 HTML 的 JS 体积，让搜索引擎和用户的首屏加载速度更快
```ts
<template>
  <div>
    <h1>文章标题</h1>
    <LazyArticleCommentBox v-if="showComment" />
    <button @click="showComment = true">查看评论</button>
  </div>
</template>

<script setup>
const showComment = ref(false)
</script>
```

### ClientOnly
有些第三方组件（比如富文本编辑器、图表库）可能不支持服务器端渲染（因为它们依赖浏览器的window或document 对象）,这时可以包裹在ClientOnly中。
```ts
<template>
  <div>
    <ClientOnly>
      <VisualChart />
      
      <template #fallback>
        <p>图表加载中...</p>
      </template>
    </ClientOnly>
  </div>
</template>
```
### 显式导入
如果你需要动态组件（例如使用`<component :is="...">`），你还是需要手动导入，或者使用 Nuxt 提供的resolveComponent辅助函数
```ts
<script setup lang="ts">
import Avatar from "~/components/Avatar.vue";

</script>

<template>
  <component :is="Avatar"></component>
</template>
```
```ts
<script setup>
// 如果需要动态切换
const MyIcon = resolveComponent('IconHome')
</script>

<template>
  <component :is="MyIcon" />
</template>
```

## 生命周期

### 同构渲染

指代码可以同时运行在服务器端和客户端的能力
1. 第一阶段：服务端渲染 (SSR)
当你第一次访问页面（或刷新页面）时：

    服务器执行 Vue 代码，将数据填充进组件。  
    生成完整的HTML 字符串。  
    将 HTML 直接发送给浏览器。  
    好处： 用户能立即看到内容，SEO 友好（搜索引擎爬虫能抓取到完整的 HTML）。  
2. 第二阶段：客户端激活 (Hydration)
HTML 到达浏览器后：

    浏览器下载并执行项目中的 JavaScript。  
    Vue 会在浏览器中重新运行，接管服务器生成的静态 HTML，使其恢复响应式（比如绑定点击事件、表单交互）。  
    这个过程被称为**“注水” (Hydration)**。  
    好处： 页面后续的跳转不再需要请求服务器生成 HTML，而是像 SPA 一样丝滑，只请求数据。

```ts
// 区分环境
if (import.meta.server) {
  console.log('这段代码只在服务器跑，比如读文件、查数据库')
}

if (import.meta.client) {
  console.log('这段代码只在浏览器跑，比如 window.alert()')
}
```
### 注意
1. Window/Document 对象：**在setup()或created()生命周期中，代码会在服务端运行。此时没有浏览器环境，直接访问window或localStorage会报错。你需要通过process.client判断或在onMounted 中执行
2. 状态同步：服务器获取的数据必须“脱水”传给客户端，客户端再“注水”还原，否则会导致客户端渲染结果与服务端不一致
3. 服务器压力：相比于纯静态文件分发，服务器需要运行 Node.js 环境来渲染页面，对 CPU 有一定消耗
4. setup()** 期间**：服务端和客户端都会执行。绝对不能在这里访问window、document或localStorage
5. onMounted()：仅在客户端执行。如果你要操作 DOM、初始化地图 SDK、或者读取 Cookie/Token，请务必放在这里。

<span style="color:red">什么时候SSR or CSR？</span>

情况 A：服务端渲染 (SSR)  
动作： 你在浏览器地址栏输入网址敲回车，或者手动刷新页面。  
过程： 请求发送到 Node.js 服务器，Nuxt 执行所有初始化和数据获取钩子，生成 HTML 返回。  
表现： 右键查看源代码，可以看到完整的页面文字内容。  
情况 B：客户端渲染 (CSR)  
**动作：**页面加载完成后，你点击了`<NuxtLink>` 进行站内跳转。  
过程： 浏览器不会重新请求服务器拿 HTML，而是通过 JS 拦截路由，直接在浏览器里下载新页面的数据并渲染组件。  
表现： 体验像单页应用（SPA），没有白屏，速度极快。

### 水合现象
服务器返回的是“干”的 HTML（纯文本，没有交互逻辑，就像脱水的蔬菜）。浏览器下载了 Vue 的 JavaScript 束后，Vue 会在后台运行，将这些 JS 逻辑挂载到现有的 HTML 结构上，让页面变得“湿润”起来（可点击、有动画、响应式）
水合的过程：

1. 下载 JS：浏览器显示 HTML 后，开始下载框架代码。
2. 激活阶段：Vue 在客户端扫描服务器传来的 DOM 结构。
3. 对比与挂载：Vue 创建虚拟 DOM，并尝试将其与现有的真实 DOM 匹配。如果匹配成功，Vue 接管 DOM，绑定事件监听器。


## 数据获取

Nuxt 提供了四个核心工具：useFetch、useAsyncData、$fetch 和useLazyFetch

### useFetch

它是 Nuxt 获取数据最简单的方式，会自动处理服务端渲染序列化（即：在服务器请求一次，把结果塞进 HTML，客户端直接复用，不会在浏览器里重复请求；
```ts
// 配置baseUrl
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    devProxy: {
      // 当你请求 /api 时，Nitro 会自动转发到你的 Mock 地址，只在csr下生效
      "/api": {
        target: "http://127.0.0.1:4523/m1/8122291-7879433-default/api",
        changeOrigin: true,
      }
    },
    // 如果是线上环境，使用 routeRules 进行转发 (SSR 模式下非常强)，ssr和csr都生效 
    routeRules: {
      '/api/**': { proxy: 'http://127.0.0.1:4523/m1/8122291-7879433-default/api/**' }
    }
  }
})
```
```ts
const { data } = await useFetch('/api/article/update', {
  method: 'POST',
  query: { id: 100 }, // URL 参数
  body: {
    title: '更新后的标题' // Body 参数
  }
})
```
使用pick选取需要的数据
```ts
const { data } = await useFetch('/api/article', {
pick: ['title', 'content', 'id'] // 只保留这三个字段进入 HTML
})
```
使用transform转换需要的数据
```ts
const { data } = await useFetch('/api/article', {
  transform: (res) => ({
    title: res.data.title,
    content: res.data.content
  })
})
// 此时 HTML 里的 __NUXT_DATA__ 只会存：{ title: "...", content: "..."
```
useFetch的第一个参数是它的key，如果在同一个页面多次调用同一个接口，由于key相同，数据可能不会刷新，此时应该调用refresh
```ts
const { data, refresh } = await useFetch('/api/article')
// 当点击“刷新”按钮时调用 refresh()
```
### useLazyFetch

useLazyFetch会先跳转页面，后加载数据。一般情况下使用await useFetch会阻塞加载，先去请求数据，然后渲染；useLazyFetch会导致路由立刻切换，组件会立即挂载，数据在后台异步抓取。返回的pending会从true变为false，可以根据这个来展示加载动画。
```ts
<script setup>
const { pending, data: posts } = useLazyFetch('/api/posts')
</script>

<template>
  <div v-if="pending">
    加载中... (或者显示骨架屏)
  </div>
  
  <div v-else>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
  </div>
</template>
```
注意：
1. 使用lazyfetch要注意数据为空的情况，因为组件渲染是立刻的；
2. 如果你需要对数据做处理，可能需要watch，因为setup时，数据还未请求到。

| 需求 | 推荐工具 |
| --- | --- |
| seo 优先，数据必须在首屏渲染 | useFetch |
| 追求跳转速度 | useLazyFetch |
| 数据请求很快 | useFetch |
| 数据请求很慢 | useLazyFetch |

如果你需要这个请求在csr阶段，可以加一个server:false
```ts
const {data, pending, status, error, refresh} =  useLazyFetch<userType>("/api/user/await", {
   server: false,
})
```

### useAsyncData
useAsyncData是一个底层的数据获取工具。它不限制你获取数据的方式，你可以用它包裹任何返回 Promise 的逻辑（比如数据库查询、调用第三方 SDK 或甚至是定时器）一般用它处理复杂的聚合逻辑
```ts
const { data, pending, error, refresh } = await useAsyncData(
  'key-unique', // 唯一的键，用于确保跨请求的数据缓存
  () => $fetch('https://api.example.com/data') // 异步逻辑
)
```
```ts
const { data } = await useAsyncData('composite-data', async () => {
  const user = await $fetch('/api/user')    
  const posts = await $fetch(`/api/posts/${user.id}`)
  return { user, posts }
})
```

### $fetch

只要这个请求不是为了在页面一打开时就把内容渲染出来，而是为了响应某个动作，那就该$fetch 上场了

<span style="color:red">注意：不要在setup顶层直接写$fetch。这会导致 SSR 和客户端各跑一次请求！</span>

1. 提交数据，这是$fetch 最经典的操作。比如用户注册、发表评论或删除订单。这些操作不需要 SSR（服务器渲染），只需要在点击时执行一次。
```ts
const submitForm = async () => {
  const response = await $fetch('/api/register', {
    method: 'POST',
    body: { username: 'Gemini', password: '123' }
  })
  // 处理注册成功逻辑
}
```
2. 在中间件（Middleware）或插件（Plugins）中，如果你需要在路由跳转时验证权限，或者在应用启动时初始化一些数据，由于这些地方不在 Vue 组件的setup生命周期内，useFetch无法工作，必须使用$fetch。
```ts
// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await $fetch('/api/check-auth')
  if (!user.isLoggedIn) {
    return navigateTo('/login')
  }
})
```
3. server内部调用，在 Nuxt 的 server/api 目录下编写后端接口时，如果你想在一个接口里调用另一个接口，你也应该使用 $fetch（Nuxt 会智能地进行内部调用，而不产生实际的 HTTP 开销；

4. $fetch是基于ofetch构建的，它非常智能。处理文件上传时，它会自动识别FormData并设置正确的Content-Type；处理下载时，则需要结合二进制流处理，如果后端接口直接吐出文件二进制流，你需要将响应类型设为blob

### 获取原始响应
如果你需要获取原始响应的数据，有两种方法：onResponse属性，$raw

```ts
<script setup lang="ts">

const {data} = await useFetch("/api/user", {
  onResponse: (res) => {
    const response = res.response
    console.log(response.status, response._data, response.headers)
  }
})

function getResponse(){
  $fetch("/api/user", {
    onResponse: (res) => {
      const response = res.response
      console.log(response.status, response._data, response.headers)
    }
  })
}

async function getResponse1(){
  const response = await $fetch.raw("/api/user")
  console.log(response.status, response._data, response.headers)
}
</script>

<template>
  <div>原始响应
    <button @click="getResponse">获取响应</button>
    <button @click="getResponse1">获取响应1</button>
  </div>
</template>

<style scoped>

</style>
```

## 状态管理

SSR（服务端渲染）的特殊性：数据脱水与注水： 服务器算好了数据（脱水），得原封不动传给浏览器（注水）。如果没有统一的状态管理，浏览器会重新计算，导致页面闪烁（水合错误）。

传统的全局变量在服务器上是“共享”的。如果不使用 Nuxt 提供的状态工具，A 用户的信息可能会被 B 用户看到

### useState
useState是 Nuxt 专门为SSR（服务端渲染） 环境设计的响应式状态管理钩子

1. 防止状态污染：确保每个用户的请求都有独立的状态，不会把 A 用户的登录信息发给 B 用户
2. 解决水合不匹配 (Hydration Mismatch)：确保服务器生成的 HTML 和浏览器渲染的结果完全一致，避免页面闪烁或报错
3. 跨组件同步简单的数据，如：用户头像、弹窗开关、当前主题；
4. 替代普通的ref()，处理那些在 SSR 阶段就需要确定的随机数或时间戳
```ts
<script setup lang="ts">
// ❌ 错误做法：直接在 SSR 环境下用 ref 配合随机逻辑
const randomNumber = ref(Math.random())
//会导致页面随机数闪烁
</script>

<template>
  <div>
    <h2>当前随机数：{{ randomNumber }}</h2>
  </div>
</template>
```
1. 服务器端：运行Math.random()得到了0.123，生成的 HTML 源码是`<h2>0.123</h2>`
2. 浏览器端：代码下载后重新运行，Math.random()变成了0.456。
3. 水合冲突：浏览器发现 HTML 里的文字是0.123，但内存里的响应式数据是0.456。

```ts
其中key是唯一标识符。Nuxt 靠这个 Key 来确保服务器的数据能精准地“投喂”给客户端对应的变量。如果 Key 重复，不同组件会共享同一个状态。

init是可选的，表示初始化函数。仅在状态尚未创建时执行。它必须返回一个初始值
如果服务器已经运行过init并把值传给了浏览器，浏览器在执行同一行代码时，会直接跳过**init**** 函数**，直接从NUXT_DATA里拿值
// 建议加上泛型
const state = useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>

const color = useState('color', () => 'red')

如果你在app.vue里已经初始化了某个状态，在子组件里可以省略第二个参数，直接通过 Key 获取
// 假设 'user' 已经在别处初始化过了
const user = useState('user')
```
#### 组件内共享
```ts
<script setup lang="ts">
// 'counter' 是唯一键，防止数据混淆
const counter = useState('counter', () => Math.round(Math.random() * 100))
</script>

<template>
  <div>
    <p>初始化随机数（SSR 安全）：{{ counter }}</p>
    <button @click="counter++">增加</button>
  </div>
</template>
```

#### 跨组件共享
利用 Nuxt 的composables目录实现自动导入，达到类似 Vuex/Pinia 的效果。
```ts
// 定义一个全局的用户状态
export const useUser = () => useState('user', () => ({
  nickname: '枫枫',
  isLogin: false
}))
// 其他组件使用
<script setup lang="ts">
const user = useUser() // 自动导入，无需 import

const login = () => {
  user.value.isLogin = true
  user.value.nickname = '测试'
}
</script>
```

### Pinia

你的项目很复杂时，useState的管理成本会变高，这时我们需要Pinia。直接使用原生 Pinia 在 Nuxt 中会导致单例模式下的内存泄漏和状态污染。@pinia/nuxt 模块会自动为每个 SSR 请求创建独立的 Store 实例

```ts
// 安装
npm install @pinia/nuxt
```
```ts
// 注册
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})
```
```ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: 'xxxx',
        userInfo: {
            name: "ces",
            addr: "成都"
        }
    }),
    actions: {
        async fetchUser() {
            // 在这里可以写异步登录逻辑
            // Nuxt 会在服务器端运行此逻辑并把结果同步给客户端
            console.log("fetchUser")
            // 如果在action里面请求数据，需要使用$fetch
            return $fetch("/api/user")
        }
    },
    getters: {
        name: (state) => {
            return state.userInfo.name
        }
    }
})
```
```ts
// 使用
<script setup lang="ts">
const authStore = useAuthStore() // 直接用就好，不需要导入
async function getUser(){
  const data = await authStore.fetchUser()
  console.log("data", data)
}

</script>
```

### useCookie
useCookie 是 Nuxt 提供的 SSR 友好的 Cookie 管理工具。

```ts
<script setup lang="ts">
// 创建一个名为 'counter' 的 cookie，默认值 0
const counter = useCookie('counter', { default: () => 0 })

const add = () => counter.value++
</script>

<template>
  <div>
    <h1>计数器（刷新不重置）：{{ counter }}</h1>
    <button @click="add">+1</button>
    <button @click="counter = 0">重置</button>
  </div>
</template>
```
```ts
// app/composables/useAuth.ts
export const useToken = () => {
  // 1. 定义一个 cookie
  const tokenCookie = useCookie('auth-token', {
    maxAge: 60 * 60 * 24 * 7, // 设置有效期 7 天
    path: '/'
  })

  // 2. 用 useState 包装，确保全应用响应式同步
  const token = useState('token', () => tokenCookie.value)

  // 3. 监听 token 变化，自动同步回 cookie
  watch(token, (newToken) => {
    tokenCookie.value = newToken
  })

  return token
}
```

| 层次 | 技术工具 | 使用场景 |
| --- | --- | --- |
| 局部状态 | `ref()` / `reactive()` | 仅在单个 `.vue` 文件内部使用（如：输入框内容）。 |
| 简单全局状态 | `useState()` | 跨页面/组件共享，且需要兼容 SSR（如：当前用户信息、主题开关）。 |
| 复杂全局状态 | Pinia | 大型项目、有复杂的异步逻辑、需要 DevTools 调试（如：购物车系统、权限控制）。 |
| 持久化状态 | `useCookie()` | 刷新页面或关闭浏览器后仍需保留的数据（如：登录 Token）。 |

## 中间件

它的主要任务是：在进入页面之前执行代码。

常见的应用场景包括：

1. 权限验证：检查用户是否登录，没登录就踢回登录页。
2. 路由守卫：比如 VIP 视频页面，非会员禁止进入。
3. 埋点统计：记录用户从哪个页面跳到了哪个页面。
4. 动态重定向：比如根据用户的语言偏好，自动跳转到/zh或/en。

| 类型 | 文件位置 | 影响范围 | 场景举例 |
| --- | --- | --- | --- |
| 全局 (Global) | `middleware/*.global.ts` | 所有页面跳转都会触发 | 统计所有页面的访问量 |
| 命名 (Named) | `middleware/auth.ts` | 只有指定的页面才会触发 | 仅在「个人中心」开启登录检查 |
| 匿名 (Inline) | 写在 `pages/*.vue` 里 | 仅该当前页面有效 | 某个特定页面的临时逻辑 |

中间件运行的时机非常关键。它发生在路由匹配之后，渲染页面之前。

首次访问（SSR）：你在浏览器输入网址回车，中间件在服务器上运行。  
后续跳转（SPA）：你在页面点击`<NuxtLink>`，中间件在浏览器中运行。

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = false // 模拟登录状态获取逻辑

  // 如果要去管理页且没登录
  if (to.path.startsWith('/admin') && !isLoggedIn) {
    // 强制跳转到登录页
    return navigateTo('/login')
  }
})

<script setup>
definePageMeta({
  middleware: 'auth' // 告诉 Nuxt：进这个页面前，先让 auth 保安查一下
})
</script>
```
```ts
export default defineNuxtRouteMiddleware((to, from) => {
    console.log("全局中间件", to.path)
    return
})
```
1. 先将token存入cookie；
2. 在pinia中同步状态
3. 在全局中间件里面判断

匿名中间件使用场景：
1. 某个逻辑只在这一特定页面有用，且永远不会被其他页面复用；
2. 临时快速拦截：比如一个特殊的营销活动页，只在特定时间内需要一个简单的校验，没必要去middleware/ 目录增加文件负担。
3. 强耦合逻辑：逻辑与该页面的业务紧密相关，放在一起更方便维护
```ts
<script setup>
definePageMeta({
  // 这里的匿名函数就是一个中间件
  middleware: [
    function (to, from) {
      const config = useRuntimeConfig()
      const isEventEnded = true // 假设这是从某处获取的逻辑

      if (isEventEnded) {
        // 如果活动结束，禁止进入该页面，直接回首页
        console.log('匿名中间件拦截：活动已结束')
        return navigateTo('/')
      }
    },
    // 你甚至可以同时混合使用“命名中间件”
    'auth' 
  ]
})
</script>

<template>
  <div>
    <h1>超级限时活动页</h1>
  </div>
</template>
```

## 运行时配置

### runtimeConfig
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 1. 私密配置：仅在服务端（Node.js）可用
    apiSecret: '12345', 

    // 2. 公开配置：服务端和客户端（浏览器）均可用
    public: {
      apiBase: 'https://www.fengfengzhidao.com',
      siteName: '枫枫知道'
    }
  }
})
```

| 区域 | 访问权限 | 典型用途 |
| --- | --- | --- |
| `runtimeConfig` **(顶层)** | 仅服务端 | 数据库密码、支付密钥、私有 Token |
| `public` **(子项)** | 服务端 + 客户端 | API 根地址、公开的 CDN 路径、SEO 信息 |

获取变量
```ts
<script setup>
// useRuntimeConfig()返回的对象是**只读 (Read-only)**的。你不能在代码里动态修改config.public.apiBase = 'xxx'，它只能通过环境变量在启动时改变。
const config = useRuntimeConfig()

// 客户端只能看到 public 里的内容
console.log(config.public.apiBase) 

// 只有在 server/api 或 SSR 阶段（服务端）才能看到 apiSecret
if (import.meta.server) {
  console.log(config.apiSecret)
}
</script>
```

### env加载
在开发环境下（nuxt dev），你不需要手动在终端输入命令。Nuxt 会自动读取根目录下的.env 文件
1. **命名约定：**必须以NUXT_ 开头；
2. **优先级：**环境变量 >.env文件 >nuxt.config.ts 中的默认值

根据环境读取不同的环境变量文件
```ts
{
  "scripts": {
    "dev": "nuxi dev", 
    "dev:staging": "nuxi dev --dotenv .env.staging",
    "build:staging": "nuxi build --dotenv .env.staging",
    "preview:staging": "nuxi preview --dotenv .env.staging"
  }
}
```

变量优先级：
当同一个配置项在多个地方出现时，Nuxt 会按照以下顺序进行覆盖（数字越大，优先级越高）：

1. **默认值：**在nuxt.config.ts的runtimeConfig 中定义的初始值。
2. .env 文件：项目根目录下的.env文件（在dev 模式或手动加载时有效）。
3. **系统环境变量：**直接在 Linux 终端通过export 定义，或在 Docker 启动脚本中传入的变量。
4. **命令行注入：**启动命令前的临时赋值（如NUXT_API_KEY=xxx node ...）。


## 项目部署

| 模式 | 命令 | 产物 | 适用场景 |
| --- | --- | --- | --- |
| SSR (服务端渲染) | `npm run build` | `.output/` (Node.js 运行) | 动态内容多、SEO 要求极高、有后端 API 逻辑。 |
| SSG (静态生成) | `npm run generate` | `dist/` (纯静态文件) | 博客、文档、内容不常变动的官网。可以托管在任何 CDN。 |

### SSR

1. 启动服务，将.output文件夹上传到服务器，执行：
```ts
# 使用 Node 运行入口文件
node .output/server/index.mjs
```
2. 使用 PM2 进行进程管理
```ts
# ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'MyNuxtApp',
      port: '3000',
      exec_mode: 'cluster', // 开启集群模式，利用多核 CPU
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
// pm2 start ecosystem.config.js
```
3. Nginx
```ts
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000; # 转发到 Nuxt 运行端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

如果装不上高版本node，可以使用docker
```ts
docker pull node:24-slim

docker run -itd --name node -v /opt/nuxt-study/:/app -p 3000:3000 node:24-slim   bash
docker run -itd --name node -v /opt/nuxt-study/:/app  -p 3000:3000 node:24-slim  node /app/.output/server/index.mjs
```

### SSG
1. 预渲染 (Prerendering)：Nuxt 会启动一个临时的 Nitro 服务，爬取你项目中的所有路由。
2. 生成文件：它会将每个页面生成对应的.html 文件，并将资源（JS/CSS）放入特定的目录。
3. 产物位置：生成的静态文件全部存放在项目根目录下的.output/public文件夹中（在某些旧版本或配置下也可能指向dist/，但 Nuxt 4/Nitro 统一建议查看.output/public）。
4. 你只需要把.output/public文件夹里的所有内容上传到服务器的某个目录（例如/var/www/my-nuxt-site），然后配置 Nginx。
```ts
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/my-nuxt-site; # 你存放静态文件的路径
    index index.html;

    location / {
        # 核心配置：尝试寻找文件，如果找不到则返回 404
        # 或者是单页面应用(SPA)模式下指向 index.html
        try_files $uri $uri/ /index.html;
    }

    # 可选：设置静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```
docker
```ts
# 假设你的项目在 /opt/nuxt-study
docker run -itd --name nuxt-ssg -p 80:80 -v /opt/nuxt-study/.output/public:/usr/share/nginx/html nginx:alpine
```

## 混合架构

虽然 Nuxt 理论上可以处理一切，但「全栈 Nuxt」并不一定是所有场景的最优解。

我们可以把前台页面需要 SEO 的部分使用 Nuxt 去编写，利好 SEO；而后台那些本身不需要 SEO 的，还是使用原来的 SPA 单页面开发。

### 前台门户：为什么要用 Nuxt？

1. **SEO（搜索引擎优化）**：这是 Nuxt 的看家本领。Google 或百度能直接抓取到你渲染好的 HTML 内容。
2. **首屏渲染 (FCP)**：用户点开链接，HTML 瞬间呈现，不需要像纯 Vue 项目那样等一大堆 JS 加载完再白屏渲染，体验极佳。
3. **社交分享**：当链接分享到微信、Twitter 等平台时，Nuxt 能生成精美的卡片预览。

### 后台管理：为什么建议用纯 Vue/React (SPA)？

1. **SEO 无关**：后台通常需要登录才能进入，搜索引擎爬虫根本进不去，SSR 毫无意义。
2. **开发负担小**：SSR 环境下需要处理「水合」问题、Cookie 转发问题、服务器端没有 `window` 的报错问题。在不需要 SEO 的后台，直接用纯 Vue 写，代码逻辑更简单。
3. **减轻服务器压力**：后台操作频繁，如果每次点击都让服务器渲染一遍页面，会浪费昂贵的服务器 CPU 资源。纯客户端渲染直接消耗用户的浏览器资源。

### 部署方案

当你采用「混合模式」时，通常会通过 Nginx 来做流量的分流：

| 访问路径 | 映射目标 | 技术栈 |
| --- | --- | --- |
| `example.com/` | Nuxt 运行地址 | Nuxt 4 (SSR) |
| `example.com/admin` | 后台静态资源目录 | 纯 Vue/Vite (SPA) |
| `example.com/api` | 后端真实 API | Java / Python / Go / Node.js |
