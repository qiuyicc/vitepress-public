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
