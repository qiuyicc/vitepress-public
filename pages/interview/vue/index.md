# Vue

## Vue生命周期

1. beforeCreate是new Vue()之后触发的第一个钩子，在当前阶段data、methods、computed以及watch上的数据和方法都不能访问
2. created是new Vue()之后触发的第二个钩子，在当前阶段可以访问data、methods、computed以及watch上的数据和方法，但是DOM还没有渲染，$el还没有被挂载
3. beforeMount是组件挂载之前触发的钩子，在这之前template模板已导入渲染函数编译，当前阶段虚拟DOM已经创建完成，可以对数据进行更改
4. mounted，在挂载完成后发生，当前阶段可以访问DOM元素，数据完成双向绑定
5. beforeUpdate，响应式数据更新之前触发，虚拟DOM还未渲染，当前阶段还可以更新数据
6. updated，响应式数据更新之后触发，虚拟DOM已经渲染，应该避免在此时更新数据，可能导致无限循环
7. beforeDestroy，组件销毁之前触发，当前阶段可以执行一些清理工作，比如销毁定时器、取消网络请求等
8. destroyed，组件销毁之后触发，当前阶段组件已经从DOM中移除，不再可用，数据绑定卸除、监听移除、子实例销毁

## Vue2响应式原理，与vue3区别

Vue在初始化数据时，会使用Object.defineProperty()方法来对数据进行劫持，当页面使用对应属性时，首先会进行依赖收集(收集当前组件的watcher)如果属性发生变化会通知相关依赖进行更新操作。  
Vue3改用proxy替代Object.defineProperty()来实现数据劫持，proxy可以监听数组和对象，并且可以拦截属性的访问、设置、删除等操作，从而实现数据响应式。   
解决proxy只代理对象第一层问题：判断当前Reflect.get的返回值是否为Object，如果是再通过reactive方法做代理  
监测数组的时候可能触发多次get/set，如何防止触发多次：判断key是否为代理对象target的自身属性，或者判断新值与旧值是否相等

## Vue3和Vue2的区别

1. 源码使用TS重构
2. 支持Composition API
3. 响应式系统更改
4. 编译优化，vue2通过标记静态根节点优化diff，vue3标记和提升所有静态根节点，diff的时候只需要对比动态节点内容
5. 打包体积优化
6. 生命周期变化，使用setup代替了之前的beforeCreate、created
7. Vue3的template支持多个根节点
8. 创建实例方式改变，vue2通过new Vue()创建实例，vue3通过createApp()创建实例
9. Route获取方式改变，vue2通过this.$route获取，vue3通过useRoute()获取

## MVVM模式

MVVM模式是Model-View-ViewModel的缩写，把MVC模式中的Controller替换成ViewModel，Model代表数据模型，View代表视图，ViewModel是View和Model层的桥梁。数据会绑定到viewModel层并自动将数据渲染到页面，视图变化的时候也会通知viewModel更新数据

## Vue2中如何检测数组变化

使用函数劫持，重写了数据的方法，Vue将data中的数组进行了原型链重写，指向了自己定义的 数组原型方法，如果数组中包含了引用类型，会对数组中的引用类型再次递归遍历进行监控。

## v-model双向绑定的原理

v-model是一个语法糖，是value+input方法的语法糖

## Vue2和vue3的diff

正常比较两个树的时间复杂度是O(n^3),但实际情况下很少进行跨层级移动DOM，所以vue将diff进行了优化 -> O(n),只有当新旧children都为多个子节点时才需要核心diff算法去比较
1. 同级比较，再比较子节点
2. 如果一方有子节点一方没有(新的children没有子节点，将旧的子节点移除)
3. 比较都有子节点的情况(核心diff)
4. 递归比较子节点
5. 核心diff采用双端比较算法，同时从新旧的两端开始进行比较，并借助key找到可复用的节点，进行相关操作。

1. vue3借鉴了ivi算法和inferno算法，在创建VNode的时候，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个基础上再配合核心的diff算法，提高了性能。

## Vue和React虚拟DOM的区别

### 1. 更新策略
- **Vue**：采用**依赖追踪**的方式，通过响应式系统精确知道哪些组件需要更新，可以做到**组件级别的细粒度更新**。当数据变化时，Vue会精确地知道哪些组件依赖了这些数据，只更新相关的组件。
- **React**：采用**自顶向下的递归diff**，当状态改变时，会从根组件开始重新渲染整个组件树，然后通过diff算法找出需要更新的部分。React 16引入Fiber架构后，可以中断和恢复渲染过程。

### 2. Diff算法
- **Vue**：
  - Vue2使用**双端比较算法**，同时从新旧列表的两端开始比较，通过key找到可复用的节点
  - Vue3优化为**快速diff算法**，先处理相同的前置和后置节点，然后处理中间部分
  - 时间复杂度：O(n)
- **React**：
  - 使用**单端diff算法**，从列表头部开始逐个比较
  - 通过key优化，但算法相对简单
  - 时间复杂度：O(n)

### 3. 更新粒度
- **Vue**：
  - 组件级别的更新，通过依赖追踪，只有依赖数据变化的组件才会重新渲染
  - 使用Object.defineProperty(Vue2)或Proxy(Vue3)进行依赖收集
- **React**：
  - 默认情况下，父组件更新会导致所有子组件重新渲染（除非使用React.memo、useMemo等优化）
  - 需要手动优化来避免不必要的渲染

### 4. 编译时优化
- **Vue**：
  - 编译时进行静态分析，标记静态节点和动态节点
  - Vue3中会**提升静态节点**，diff时跳过静态内容
  - 支持**Block Tree**优化，只追踪动态节点
- **React**：
  - 编译时优化较少，主要依赖运行时优化
  - 通过Fiber架构实现可中断的渲染

### 5. 虚拟DOM结构
- **Vue**：
  - VNode包含更多信息，如静态标记、动态属性标记等
  - Vue3使用**patchFlag**标记节点类型，优化diff过程
- **React**：
  - React元素结构相对简单
  - 通过Fiber节点保存更多信息，支持时间切片

### 6. 更新时机
- **Vue**：
  - 同步更新，但通过nextTick批量处理DOM更新
  - 更新是**同步的**，但DOM更新是**异步的**
- **React**：
  - React 18之前主要是同步更新
  - React 18引入**并发渲染**，支持可中断的异步更新

### 7. 性能特点
- **Vue**：
  - 依赖追踪机制使得更新更精确，减少不必要的渲染
  - 编译时优化较多，运行时开销相对较小
  - 适合中小型应用，性能表现稳定
- **React**：
  - Fiber架构支持时间切片，可以处理大量DOM更新而不阻塞主线程
  - 适合大型复杂应用，可以更好地处理复杂交互

### 8. 开发体验
- **Vue**：
  - 自动依赖追踪，开发者无需关心优化细节
  - 模板语法，更容易上手
- **React**：
  - 需要手动使用useMemo、useCallback、React.memo等进行优化
  - JSX语法，更灵活但需要更多优化知识

### 总结
- **Vue**的优势在于**精确的依赖追踪**和**编译时优化**，更新更精确，性能更可预测
- **React**的优势在于**Fiber架构**和**并发渲染**，适合处理复杂的大型应用，但需要更多手动优化

## Vue通信

1. props：父组件向子组件传递数据，子组件通过props接收数据，子组件修改props不会影响父组件的数据。
2. $on、$emit：父组件向子组件发送消息，子组件通过$on监听消息，并通过$emit触发消息，父组件通过$on监听消息并处理消息。
3. 获取父子组件实例，$parent、$children：通过$parent可以获取父组件实例，通过$children可以获取子组件实例。
4. ref, $refs：ref可以获取组件实例，$refs可以获取组件的子组件实例。
5. provide/inject：父组件向子组件提供数据，子组件通过inject注入数据。
6. eventBus：通过eventBus可以实现跨组件通信。
7. $attrs、$listeners：$attrs可以获取不被props监听的属性，$listeners可以获取父组件传递的事件。
8. Vuex：Vuex是一个专门用于管理状态的库，可以实现多个组件之间的数据共享。
9. Pinia：Pinia是一个状态管理库，可以实现多个组件之间的数据共享。

## Vue路由

## 父组件监听子组件的生命周期

1. 使用事件，当子组件生命周期加载的时候emit出去
::: code-group
```ts [Father.vue]
<template>
  <div>
    <Children @mounted="sonMounted" />
  </div>
</template>

<script>
import Children from './Children.vue'
export default {
    components:{
        Children
    },
    setup () {
        const sonMounted = (data) =>{
            console.log(data);
        }
        return {
            sonMounted
        }
    }
}
</script>
```
```ts [Children.vue]
<template>
    <div>
        11111
    </div>
</template>

<script>
import { onMounted } from 'vue';
export default {
    emits:['mounted'],
    setup (props,ctx) {
        onMounted(() => {
            ctx.emit('mounted',"son mounted")
        })
        return {

        }
    }
}
</script>
```
:::
2. 使用钩子函数
::: code-group
```ts [Father.vue]
<template>
  <div>
    <Children @vue:mounted="sonMounted" />
  </div>
</template>

<script>
import Children from './Children.vue'
export default {
    components:{
        Children
    },
    setup () {
        const sonMounted = (data) =>{
            console.log('get son mounted')
        }
        return {
            sonMounted
        }
    }
}
</script>
```
```ts [Children.vue]
<template>
    <div>
        11111
    </div>
</template>

<script>
import { onMounted } from 'vue';
export default {
    emits:['mounted'],
    setup (props,ctx) {
        onMounted(() => {
            console.log('son mounted');
            
        })
        return {

        }
    }
}
</script>
```
:::

## Vue v-if和v-show的区别
1. v-if是真正的条件渲染，只有在条件为真时才会渲染，
2. v-show只是简单地切换元素的display属性，无论条件是否为真，元素总是会被渲染。

## Vue keep-alive组件

keep-alive组件可以缓存组件的状态，避免重新渲染，提高性能。
1. include：字符串或正则表达式，只有匹配的组件会被缓存。
2. exclude：字符串或正则表达式，匹配的组件不会被缓存。
3. max：缓存组件的最大数量。
4. activated/deactivated：两个生命周期，组件激活和失活时触发的事件。
5. keep-alive采用了LRU算法

## Vue NextTick

在下次DOM更新之后循环结束之后执行的延迟回调，nextTick主要使用了宏任务和微任务。根据执行环境分别采用：
1. Promise
2. MutationObserver
3. SetImmediate
4. 以上都不行采用SetTimeout

## Vue SSR

SSR是Server-Side Rendering的缩写，是一种服务端渲染的技术，可以将Vue组件渲染成HTML字符串，然后将其直接发送给浏览器，实现了服务端渲染。SSR有更好地SEO、并且首屏加载速度更快等特点。不过Vue在服务端会受到限制，不能支持beforeCreate、created两个钩子，当需要一些外部扩展库时，服务器也会有更大的负载压力。

## Vue组件的data为什么是函数

一个组件被复用多次时，会创建多个实例。本质上，这些实例使用的都是同一个构造函数。如果data是对象的话，会引用同一个对象，影响所有实例。

## Vue的Computed

当组件实例触发生命周期函数beforeCreate后，会对computed进行处理。
1. 遍历computed配置中的所有属性，为每一个属性创建一个Watcher对象，并传入一个函数，该函数的本质是computed配置中的getter，这样，getter运行过程中就会进行依赖收集。
2. 为计算属性设置的Watcher不会立即执行，因为计算属性不一定被渲染函数使用。因此在创建Watcher时，使用了lazy选项，只有当计算属性被渲染函数使用时，才会执行。
3. 受到lazy影响，Watcher内部会保存两个关键属性来实现缓存，一个是value，一个是dirty。value用于保存Watcher运行的结果，一开始为undefined，dirty用于标记是否需要重新计算，也就是指示当前value是否过时，一开始为true
4. Watcher创建好后，vue使用代理将计算属性挂载到实例上，当读取计算属性时，vue检查当前对应的Watcher的dirty是否过时，如果是则运行defineComputed函数，计算依赖，保存结果到value中并设置dirty为false，然后返回。如果dirty为false，直接返回Watcher中的value
5. 在依赖收集时，不仅会收集到计算属性的Watcher，还会收集到组件的Watcher，当计算属性的依赖发生变化，会先触发计算属性的Watcher执行，只需要设置dirty为true，然后不做任何处理。由于收集到了组件的Watcher，因此组件会重新渲染，而重新渲染时又读取计算属性，由于前面设置了dirty为true，因此会重新计算，并更新Watcher的value。
6. 对于计算属性的setter，当设置setter时，直接运行即可

## Vue的watch与computed的区别

区别：
   1. 都是观察数据变化
   2. 计算属性监听自定义变量，watch监听data、props里面的数据变化
   3. computed有缓存，watch没有缓存
   4. watch可以异步，computed不可以
   5. watch一对多(监听一个值)，computed多对一(监听属性依赖于其他属性)
   6. watch接受两个参数，一个新值，一个旧值
   7. computed可以返回值，watch只能执行函数
   8. computed是函数时，都有get、set方法，默认走get方法，必须有返回值
   9. watche可以开启deep深度监听，immediate是否立即执行，computed没有

## Vue complier

使用Vue创建HTML的两大方式：
1. template：使用template创建的HTML，会被编译成render函数，然后渲染成虚拟DOM。
2. render函数：使用render函数创建的HTML，会被编译成虚拟DOM。

complier的作用是将template或者render函数编译成渲染函数，渲染函数的作用是将虚拟DOM渲染成真实的DOM。
1. parse，接受template原始模板，按模板的节点和数据生成对应的ast
2. optimize，优化ast，遍历ast的节点，标记静态节点，方便后续diff减少对比，提高性能
3. generate，把前两步生成完善的ast，组成render字符串，然后将reder字符串通过new Function()创建渲染函数

## Vue修饰符

1. 事件修饰符
   1. .stop,阻止冒泡
   2. .prevent,阻止默认事件
   3. .capture,事件捕获
   4. .self,只触发当前元素自身的事件
   5. .once,只触发一次
   6. .passive,事件的默认行为立即执行，不会等待事件回调执行完毕
2. 按键修饰符
   1. .left,按下左键
   2. .right,按下右键
   3. .middle,按下中键
   4. .ctrl,按下ctrl键
   5. .shift,按下shift键
   6. .alt,按下alt键
   7. .meta,按下meta键
   8. .enter,按下回车键
   9. .tab,按下tab键
   10. .delete,按下delete键
   11. .esc,按下esc键
   12. .space,按下空格键
   13. .up,按下上方向键
   14. .down,按下下方向键
   15. .left,按下左方向键
   16. .right,按下右方向键
3. 表单修饰符
   1. .lazy,输入框失去焦点时才会更新
   2. .number,输入框只能输入数字
   3. .trim,输入框输入内容前后自动去除空格
   4. .debounce,输入框输入内容后，等待一段时间后才会更新

## Vue项目性能优化

1. 编码阶段
   1. 减少data中不必要的数据，data中的数据会增加getter、setter函数，收集watcher，增加内存占用
   2. v-if和v-show不连用，更多情况下，使用v-show
   3. 使用v-for给每项元素绑定事件时使用事件代理
   4. SPA页面采用keep-alive组件缓存组件状态，减少页面切换的开销
   5. key值保证唯一且必须要书写
   6. 使用路由懒加载和异步组件
   7. 防抖、节流
   8. 第三方模板按需导入
   9. 长列表区域动态加载
   10. 图片懒加载
2. SEO优化
    1. 预渲染
    2. SSR
3. 打包优化
   1. 压缩代码
   2. Tree-Shaking/Scope-Hoisting
   3. CDN加载第三方模板
   4. 多线程打包happypack
   5. splitChunks抽离公共文件
   6. sourceMap
4. 用户体验
   1. 骨架屏
   2. PWA
5. 服务器
   1. 缓存优化(服务端缓存、客户端缓存)
   2. gzip压缩 

## Vue优化SPA首批加载速度

1. 请求优化，将第三方类库放到CDN上，减少项目体积，另外CDN可以实现负载均衡，提高响应速度。
2. 缓存，将长时间不改变的第三方类库或者静态资源设置为强缓存，将max-age设置一个长时间，将访问路径加上hash，hash变化再获取最新资源
3. gzip，开启gzip，减少传输资源大小
4. http2，chrome浏览器对同域名的tcp链接数量有限制，6个，超过连接数，必须等到之前的请求收到响应后才能继续发送，而http2则可以在tcp链接中并发多个请求没有限制。
5. 懒加载，当url匹配到相应的路由时，才通过import动态加载相应的组件，这样首屏加载的速度会更快
6. 预渲染，由于浏览器在渲染出页面时，需要先加载html、css、js等资源，因此会有一段白屏时间，可以添加loading、或者骨架屏减少白屏对用户的影响
7. 第三库打包，对于一些UI、类库，尽量使用按需加载，减少打包体积
8. 使用可视化工具分析打包后的体积，webpack-bundle-analyzer、webpack-visualizer-plugin等，对其中比较大的模板进行优化
9. 提交代码使用率，利用代码分割，将脚本中无需立即调用的代码在代码构建时转变为异步加载的过程
10. 封装，构建良好的项目架构，按照项目的需求进行全局组件、过滤器、指令、utils等进行公共封装，减少代码冗余，提高代码复用性
11. 图片懒加载，使用图片懒加载可以优化减少http请求开销
12. 使用svg图标，使用svg作为图标，相比于普通的图片拥有更好的质量和更少的体积，并且不需要额外的http请求
13. 压缩图片，使用image-webpack-loader压缩图片，可以减少体积，提高加载速度


## Vue中的key

key的作用是更加高效地更新虚拟DOM，提高渲染效率。
![diff](/diff.png)

## 组件中写name的好处

1. 可以通过name直接找到对应组件(递归组件：组件自身调用自身)
2. 可以通过name属性实现缓存功能(keep-alive)
3. 可以通过name来识别组件(跨级通信时)
4. 使用vue-devtools可以更方便地查看组件的依赖关系

## Vue中的ref

ref的作用是用来给元素或子组件注册引用信息，引用信息将会注册在父组件的$refs对象上。
1. 如果在普通的DOM上，引用指向DOM元素
2. 如果在子组件上，引用指向子组件实例

## 请求数据一般在哪个生命周期中

请求数据可以在created、beforeMount、mounted生命周期中进行，因为这几个钩子中，data已被创建，可以对数据进行操作。推荐在created中进行请求：
1. 更快地获取服务端数据，减少页面的loading时间
2. SSR不支持beforeMount、mounted钩子函数，放在created中有助于代码一致性
3. created是在模板渲染成html之前调用，而如果在mounted中调用请求数据，可能会导致页面闪屏

## 虚拟列表

只对可见区域进行渲染，对非可见区域不渲染或部分渲染，从而提高性能

虚拟列表的几个步骤：
1. 计算当前可视区域的起始数据索引
2. 计算当前可视区域的结束数据索引
3. 计算当前可视区域的数据，渲染到页面
4. 计算startIndex对应的数据在整个列表中的偏移量startOffset
```html
<div class="infinite-list-container"> 可视区域容器
    <div class="infinite-list-phantom"> 容器占位，高度为列表总高度，用于形成滚动条
        <div class="infinite-list"></div> 渲染区域
    </div>
</div>
```
1. 监听infinite-list-container的滚动scroll事件，获取滚动位置scrollTop
2. 假设可视区域高度固定，为screenHeight
3. 假设列表每项高度固定，为itemHeight
4. 假设列表数据为listData
5. 假设当前滚动位置为scrollTop
 
则有：
1. 列表总高度listHeight = listData.length * itemHeight
2. 可显示的列表项数visibleItemCount = Math.ceil(screenHeight / itemHeight)
3. 数据的起始索引startIndex = Math.floor(scrollTop / itemHeight)
4. 数据的结束索引endIndex = startIndex + visibleItemCount
5. 列表显示数据为visibleListData = listData.slice(startIndex, endIndex)
6. 偏移量startOffset = scrollTop % itemHeight

优化：
1. 使用监听scroll的方式触发更新，当滚动发生后，scroll会频繁触发，很多时候会造成重复计算的问题
2. 可以使用IntersectionObserver API，当元素进入可视区域时，触发更新，可以更加精准地触发更新，并且监听回调是异步触发，不随着目标元素滚动而触发


## 懒加载

1. 减少无用的资源加载，减少了服务器的压力和流量；
2. 提高了用户体验，如果同时加载较多图片，可能等待的事件比较长
3. 防止加载过多的图片而影响其他资源文件的加载

实现原理：  
当对图片的src赋值的时候，浏览器就会请求资源。根据这个原理可以使用HTML5的data-xxx属性来存储图片的路径，在需要图片的时候把data-xxx路径赋值给src属性。懒加载的重点是确定需要加载哪张图片，也就是确定可视区域内的图片。

Vue3实现懒加载：
```js
导入VueUse插件，使用vueuse封装的useIntersectionObserver监听DOM元素是否进入可视区域
app.directive('lazy', {
    mounted(el:HTMLImageElement, {value}) {
        const {stop} = useIntersectionObserver(el, ([{isIntersecting}])=>{
            if(isIntersecting){
                stop() //取消监听
                el.src = value
                el.onerror = () => {
                    el.src = defaultImg
                }
            }
        })
    }
})
```
```js
实现列表数据懒加载，在hooks里面封装通用数据懒加载api
export function useLazyData(callback:() => void) {
    const target = ref(null)
    const {stop} = useIntersectionObserver(target, ([{isIntersecting}])=>{
        if(isIntersecting){
            stop() //取消监听
            callback()
        }
    })
    return target
}
//组件中
import useStore from '@/store'
import { useLazyData } from '@/utls/hooks'
const {home} = useStore()
const target = useLazyData(() => home.fetchList())
```

懒加载和预加载的区别：
1. 懒加载是延迟加载，当用户需要访问时，再去加载，可以提交网站的首屏加载速度，减少服务器压力
2. 预加载是将所需的资源提前请求加载到本地，这样后面在需要用到时旧直接从缓存冲取，预加载能减少用户等待时间，比如图片的src属性


## 组合式API的优缺点
1. 更好的逻辑复用：可以把相关逻辑抽成独立的函数（Composable），避免 mixin 的命名冲突和来源不明的问题，复用粒度更细、可读性更好。
2. 逻辑更聚合：同一功能的状态、计算、方法可以放在一起，减少在 data/computed/methods/watch 之间来回跳转，复杂组件更易维护。
3. 类型推导友好：与 TypeScript 配合更自然，使用 ref、computed 等可得到更准确的类型提示。
4. Tree-shaking 更好：按需引入 API，编译器可以去掉未使用的代码，打包体积更小。

逻辑分散风险：如果组织不当，组合函数过多可能反而导致代码零散、难以追踪。  
调试难度：由于逻辑可以动态组合，代码堆栈和调试流程更复杂，需要借助 Vue Devtools 的新能力。
