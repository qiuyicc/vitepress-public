# Vue3 再学习

## 使用 Vite 安装项目

```ts
npm create vite@latest
```

## 安装 eslint

```ts
npm init @eslint/config
```

可以在 rules 中配置相应的 eslint 规则

可以直接使用 extends 继承流通规则

```ts
"extends":"eslint:recommended"
```

## 安装 vite-plugin-eslint

```ts
npm install vite-plugin-eslint --save-dev
```

::: code-group

```ts [vite.config.ts]
import eslint from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue(), eslint()],
  server: {
    port: 3000,
  },
});
```

:::

```ts
npm i eslint-plugin-vue --save-dev//vue规则
npm i @vue/eslint-config-typescript --save-dev//typescript规则
//在.elsintrc.js中配置
```

## Vue

### Vue3中的实例
1. 全局应用实例
2. 组件实例
3. 组件内部实例
```ts
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App) //返回应用实例
const vm = app.mount('#app') 
返回组件实例，组件的所有属性props、setup.....都会在实例上面平铺展示，还有一系列的内置或者全局属性，
比如$attrs、 $refs等等， $message、$confirm等  
测试中的wrapper.vm属于组件实例
通过ref拿到的实例也属于组件实例
```
```ts
//组件内部实例
import { getInstance } from 'vue'
const vm = getInstance() //返回组件内部实例，一个混合实例
通过proxy属性可以拿到组件实例上面的属性
通过appContext可以拿到应用实例上面的部分属性
```

### ref 和 reacitve

```ts
<script lang="ts">
import { ref, defineComponent, reactive } from 'vue'
interface Person {
  name: string,
  age: number
}
export default defineComponent({
  name: 'App',
  setup() {
    const count = ref<number | string>(0)
    //ref参数任意，reactive参数必须是对象
    //ref是一种特殊的reactive
    const state: Person = reactive({
      name: '张三',
      age: 20
    })
    const increase = () => {
      if (typeof count.value === 'number') {
        count.value++ //需要加.value
      }
      state.age++//不需要加.value
    }
    return {
      count,
      increase,
      state
    }
  }
})
</script>
```

### computed

1.计算属性的值会基于其响应式依赖被缓存

2.计算属性 moren 是只读的，不能直接修改数据，只能通过修改响应式数据来触发重新计算

```ts
interface computedtType {
  text: string;
  disabled: boolean;
}
const isbutton = computed<computedtType>(() => {
  return {
    text: state.age >= 20 ? "允许点击" : "禁止点击",
    disabled: state.age < 20,
  };
});
```

### watch

```ts
watch(count, (newVal, oldVal) => {
  console.log("newVal", newVal, "oldVal", oldVal);
}); //接受ref响应式对象
watch(
  () => state.age,
  (newVal, oldVal) => {
    console.log("newVal", newVal, "oldVal", oldVal);
  }
); //接受函数
watch(state, (newVal, oldVal) => {
  console.log("newVal", newVal, "oldVal", oldVal);
}); //接受reactive响应式对象
watch([count, () => state.age], (newVal, oldVal) => {
  console.log("newVal", newVal, "oldVal", oldVal);
}); //接受数组
watch(
  count,
  (newVal, oldVal) => {
    console.log("newVal", newVal, "oldVal", oldVal);
    //watch默认是在DOM更新之前触发的，如果想改变触发时机，可以配置flush选项
    //flush: 'pre' 在组件更新之前触发
    //flush: 'post' 在组件更新之后触发
    //flush: 'sync' 在组件更新之后同步触发
  },
  { deep: true, immediate: true, flush: "sync" }
); //开启配置选项
```

### 生命周期

```ts
onBeforeMount(() => {})
onMounted(() => {})
onBeforeUpdate(() => {})
onUpdated(() => {})
onBeforeUnmount(() => {})
onUnmounted(() => {})

const head = ref<null | HTMLHeadElement>(null)//访问DOM元素
<h2 ref="head"></h2>
```

### 组件

```ts
<template>
    <div>
        {{ doubleAge }}
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
interface User {
    name: string;
    age: number;
}
export default defineComponent({
    name: 'Test',
    //定义组件的props
    props: {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            default: 30,
            required: true
        },
        user:{
            type: Object as PropType<User>,//定义Object类型
        }
    },
    setup(props) {
        const doubleAge = computed(() => props.age * 2);
        return {
            doubleAge
        }
    }
});
</script>

<style lang="scss" scoped></style>
```
Vue  组件的三种形式
```ts
1. SFC 单文件组件,混合三种标签，返回vue的template
2. 函数组件，Function Component，函数形式，使用JSX或者h函数
3.render function，对象形式，使用对象上的render函数，使用jsx或者h函数
return defineComponent({
  redner(){
    return <div>hello</div> //render返回
  }
})

return deinfedComponent({
  setup(props){
    return () => <div>hello</div> //setup返回
  }
})
```
::: tip
template语法：
1. 有非常多的指令，可以快速完成任务；
2. 基于DOM结构，更容易理解；
3. vue针对template做了优化，性能更好；
4. 不够灵活

JSX或h函数：
1. 灵活，可以利用JS来表达各种逻辑；
2. 可读性差，需要编译优化
:::


### 自定义事件
::: code-group

```ts [Test.vue]
export default defineComponent({
  name: "Test",
  emits: ["change"],
  setup(props, ctx) {
    const isbutton = ref(false);
    const handleClick = () => {
      isbutton.value = !isbutton.value;
      ctx.emit("change", isbutton.value); //向父组件发送消息
    };
    return {
      handleClick,
    };
  },
});
```

```ts [Parent.vue]
setup() {
      const hanleChange = (value: string) => {
      console.log(value)
    }
  return {
    hanleChange
  }
}
<Test @change="hanleChange"></Test>
```

:::

### 组件通信
1. 父组件访问子组件实例，$refs && ref对象
2. 子组件访问父组件实例， $parent
3. Provide/inject完成子组件到父组件的多级访问，响应式对象也可以传递
4. 使用事件监听器完成子组件的通信,如mitt
::: tip ref运行机制
渲染时Vnode ref属性 === render对象中的响应式对象
对应的DOM节点或组件实例就会被赋值给这个响应式对象
在Vnode的patch或者mount阶段时发生，所有初次渲染完毕才能拿到
:::
```ts
onMounted(() => {
  const instance = getCurrentInstance();
  console.log(instance.proxy.$parent); //访问父组件实例
  $parent可以一直向上访问，直到根组件，最后为null，但是不建议这么做，需要保持单向数据流
})
```
```ts
import mitt from "mitt";
export const emitter = mitt();
...........
//parent.vue
emitter.on("message", (value) => {}) //监听子组件的消息
//son.vue or other component
emitter.emit("message", "hello") //发送消息给父组件
```
```

### 组合式函数

::: tip
与 Mixin 相比

1.清晰的数据来源

2.避免命名冲突

3.脱离组件存在，更好的复用性

4.库：VueUse,Vue 官方维护的 use 库
:::
::: code-group

```ts [useMousePosition.ts]
//hooks文件夹下新建useMousePosition.ts
import { onMounted, onUnmounted, ref } from "vue";
export function useMousePosition() {
  const x = ref(0);
  const y = ref(0);
  const mouseMoveHandler = (event: MouseEvent) => {
    x.value = event.clientX;
    y.value = event.clientY;
  };
  onMounted(() => {
    document.addEventListener("mousemove", mouseMoveHandler);
  });
  onUnmounted(() => {
    document.removeEventListener("mousemove", mouseMoveHandler);
  });
  return {
    x,
    y,
  };
}
export default useMousePosition;
```

```ts [useUrlLoader.ts]
import axios from "axios";
import { reactive, toRefs } from "vue";
interface IUrlLoaderState<T> {
  result: null | T;
  loading: boolean;
  error: any;
}
const useUrlLoader = <T = any>(url: string) => {
  const state: IUrlLoaderState<T> = reactive({
    result: null,
    loading: true,
    error: null,
  });
  axios
    .get(url)
    .then((res) => {
      console.log("111", res);

      state.result = res.data;
    })
    .catch((err) => {
      state.error = err;
    })
    .finally(() => {
      state.loading = false;
    });
  return toRefs(state);
};
export default useUrlLoader;
```

:::

### setup 语法糖

::: tip 1.更少的样板内容，更简洁的代码 2.能够使用纯 ts 声明和 props 和抛出事件 3.更好地运行性能 4.更好的 IDE 类型推断
:::

```ts
<script setup lang="ts">
```

```ts {10-13,15-20}
<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';
interface User {
  name: string;
  age: number;
}
interface IEvents {
  (e: 'change', value: boolean): void;
}
const props = defineProps({
  .... //普通写法
})
const emits = defineEmits(['change']);


//使用interface定义类型
const props = withDefaults(defineProps<{user: User}>(),{
  user:() => ({name: '张三', age: 20}) //使用默认值
})
const emits = defineEmits<IEvents>(); //定义事件类型
</script>
```

### Provide/Inject

::: code-group

```ts [Parent.vue]
<script setup lang="ts">
  import {(provide, inject)} from 'vue'; import {testKey} from './keys' const
  parent = ref(null); provide(testKey, parent);
</script>
```

```ts [son.vue]
<script setup lang="ts">
  import {inject} from 'vue'; import {testKey} from './keys' const parent =
  inject(testKey);
</script>
```

```ts [keys.ts]
//Symbol 可以确保不会与其他变量产生冲突
export const testKey = Symbol();
```

:::
进阶
::: code-group

```ts [keys.ts]
import { InjectionKey, Ref } from "vue";
//进行injectionKey的类型约束
export const testKey = Symbol() as InjectionKey<Ref<string>>;
```

:::

#### 入口文件

::: code-group

```ts [main.ts]
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { userKey } from "./key";
const app = createApp(App);
const app2 = createApp(App);
app.config.globalProperties.test = "test"; //全局属性
app.component("test-component", testComponent); //全局组件
app.provide(userKey, { name: "张三", age: 20 }); //全局注入
app.mount("#app");
app2.mount("#app2"); //可以创建多个app实例,互不干扰
```

```ts [key.ts]
import { InjectionKey } from "vue";
export const userKey = Symbol() as InjectionKey<{ name: string; age: number }>;
```

:::

### SPA 应用

普通网页：跳转到新页面，每次重新加载所有资源，HTML、CSS、JS、图片等，速度慢，不流畅。

通过 Hsitory API 实现单页面应用的路由功能,不跳转，js 拦截跳转，修改 URL，实现页面的切换

## Vuex

状态管理模式，集中式管理应用的所有组件的状态，简化组件间的通信，并提供一个集中存储的状态空间，使得状态变化可预测，可追踪。
::: code-group

```ts [index.ts]
import { createStore } from "vuex";
import templates, { TemplatesProps } from "./templates";
import user, { UserDataProps } from "./user";

export interface GlobalProps {
  user: UserDataProps;
  templates: TemplatesProps;
}
const store = createStore({
  modules: {
    templates,
    user,
  },
});

export default store;
```

```ts [user.ts]
import { Module } from "vuex";
import { GlobalProps } from "./index";

export interface UserProps {
  isLogin: boolean;
  username: string;
}
export interface UserDataProps {
  data: UserProps;
}
const userData = {
  isLogin: false,
  username: "",
};
const user: Module<UserDataProps, GlobalProps> = {
  state: {
    data: userData,
  },
  mutations: {
    login(state) {
      state.data = { ...state.data, isLogin: true, username: "秋忆" };
    },
    logout(state) {
      state.data = { ...state.data, isLogin: false, username: "" };
    },
  },
};
export default user;
```

:::

## Vue Router

```ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Editor from "../views/Editor.vue";
import TemplateDetail from "../views/TemplateDetail.vue";
import Index from "../views/Index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      meta: {
        withHeader: true,
      },
      children: [
        { path: "", name: "home", component: Home },
        {
          path: "template/:id",
          name: "templatedetail",
          component: TemplateDetail,
        },
      ],
    },
    {
      path: "/editor",
      name: "editor",
      component: Editor,
    },
  ],
});

export default router;
```

```ts
//用于进行路由导航和访问路由实例的方法。
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const goHome = () => {
            router.push('/home'); // 导航到 '/home' 路径
        };
        return { goHome };
    }
}

//获取当前路由信息,包括name,path,params,query,hash,fullPath,meta等，进行组件逻辑处理
import { useRoute } from 'vue-router';
export default {
    setup() {
        const route = useRoute();
        console.log(route.path); // 输出当前路由的路径
        return { route };
    }
}
```

## 插件系统
一段代码，给Vue应用实例添加全局功能，它的格式是一个object暴露出一个install方法或者为一个function  
1. 添加全局方法或属性；
2. 添加全局资源：指令、过滤等；
3. 通过全局混入来添加一些组件选型；
4. 通过config.globalProperties来添加实例方法

::: code-group
```ts [testPlugin.ts]
import { App } from 'vue'
import HelloWorld from './HelloWorld.vue'
const testPlugin = {
    install(app: App) {
        app.config.globalProperties.$test = 'Hello World'
        app.component('HelloWorld', HelloWorld)
        app.provide('test', 'Hello World')
    }
}
export default testPlugin
```
:::

## 组件库

### 组件库的入口文件
::: tip
所有组件一次性全部导入并作为插件使用；
:::
1. 建立一个入口文件index.ts
2. 将所有默认组件导入，作为一个数组，创建一个install方法，循环调用app.component方法注册组件；
3. 导出默认插件(install方法)

::: tip
单个组件导入并作为插件使用
:::
1. 每个组件新建一个文件夹，并且创建一个单独的index.ts文件作为入口文件；
2. 每个组件设计为一个插件(一个object拥有install方法)
3. 在全局入口文件导出
::: code-group
```ts [index.ts]
//  组件入口文件
import { App } from "vue";
import LText from "./LText.vue";

LText.install = (app: App) => {
  app.component(LText.name as string, LText);
};

export default LText;

```
```ts [index.ts]
//  全局入口文件
import { App } from 'vue';

import  LText from './components/LText';

const components = [
    LText
]

const install = (app: App) => {
    components.forEach(component => {
        app.component(component.name as string, component)
    })
}
//单个导出注册
export {
    LText,
    install
}
//全部导出注册
export default {
    install
}
```
:::

### 组件库的打包和配置
1. 组件库使用Rollup打包，配置打包入口文件和输出文件，详情转移至Rollup笔记；
2. 打包后的文件可在dist目录下查看;
3. 打包完成后在组件库的package.json添加配置
```json
  "main":"dist/test.umd.js",
  "module": "dist/test.esm.js", 
  "types":"dist/index.d.ts", 
```
4. 在组件库下执行命令npm link，链接到全局npm中
5. 在需要使用的组件库的项目下执行npm link PackageName,创建一个指向你本地组件库的符号链接，使得在该项目中能够使用你正在开发的组件库。
6. 在你需要的组件中引入使用
```ts [main.ts]
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import MyComponent from 'test' // [!code ++]
const app = createApp(
app.use(MyComponentApp))
app.mount('#app')
```
```ts
npm unlink <package-name> //解除链接
```
```ts
npm ls -g --depth=0 //查看全局安装的包及其链接状态
```

### 组件库的发布

1. 组件库在发布之前需要进行代码检查和测试，确保组件库的功能正常；
```ts
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "npm run clean && npm run build:esm && npm run build:umd",
  "test:watch": "vue-cli-service test:unit --watch"
  "test": "vue-cli-service test:unit"
  "lint": "vue-cli-service lint --max-warnings 5",
  "build:esm": "rollup --config rollup.config.esm.js",
  "build:umd": "rollup --config rollup.config.umd.js",
  "clean": "rimraf ./dist",
  "prepublishOnly": "npm run lint && npm run test &&npm run build" // 发布前的检查 // [!code ++]
}
```
2. 可以使用husky工具来进行git hooks，在commit和push前进行代码检查和测试；
```ts
npm i husky@4 --save-dev
```
```ts
//package.json
"husky":{
  "hooks":{
    "pre-commit":"npm run lint && npm run test",
  }
}
```

### CI/CD

1. 本地commit钩子函数完成commit验证；
2. 代码push到远端；
3. 跑特定的test，不仅是本机的，也有可能是时间长的E2E test；
4. test通过后可能还会检查是否有新的tag，假如有就自动push一个新的版本
5. 自动部署文档站点.....

这些任务，如果手动操作，耗时耗力，还容易出错，所以需要自动化工具来完成这些工作。

**CI**：持续集成，频繁地将代码集成到主干，一旦开发人员对应用所作的更改被合并，系统就会通过自动构建应用并运行不同级别的自动化测试(通常是单元测试和集成测试)来验证这些更改，确保这些应用无害。其目的就是让产品可以快速迭代，同时还能保持高质量

**CD**：持续交付，频繁地将软件的新版本，交付给质量团队或用户，以供评审

**CD**：持续部署，持续交付的下一步，指的是代码通过评审之后，自动部署到生产环境，以实现应用的快速更新。

### Travis CI

每次push之后，Travis CI会自动拉取代码，安装依赖，运行测试
```ts
//.travis.yml
language: node_js
node_js:
  - node
```
travis更多配置
```ts
language: node_js
node_js:
  - node
deploy: //部署到npm
  provider: npm
  email: "YOUR_EMAIL"
  api_key: "YOUR_Auth_TOKEN" //npm Access Token
  on:
    tags: true //只有打了tag才会发布
  skip_cleanup: true //保留dist目录
```
对私密信息加密，travis提供加密
```ts
gem install travis
```
```ts
travis login --pro
```
```ts
travis encrypt "YOUR_SECRET_INFO" --add deploy.api_key //在项目根目录下运行
```
```ts
git commit -m "add travis config"
git tag v1.0.1 -m "release v1.0.1"
git push --tags
```