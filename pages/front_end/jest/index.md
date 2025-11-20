# Jest 测试

Jest 单元测试学习

## 测试的优点

测试框架：Mocha、Jasmine、Jest
::: tip

1.  自动化流程，保证代码的运行结果；
2.  更早的发现 bug；
3.  重构和升级更容易可靠；
4.  unit 测试 > Service 测试 > UI 测试<br/>
    Vue 和 React 适合写单元测试：
5.  组件化，独立单元，互不影响；
6.  属性和界面的映射，固定输入输出；
7.  单向数据流；
8.  状态管理工具的 store 可以单独测试；
:::

## 测试的几大功能

::: tip
1. 断言，验证测试结果是否符合预期；Jest 内置，Mocha 需要安装插件，如 Chai；
2. 异步支持，模拟异步操作；
3. Mock，模拟依赖的模块，隔离测试环境；Jets 内置，Mocha 需要安装插件，如 Sinon；
4. 代码覆盖率，测试覆盖率；Jest 内置，Mocha 需要安装插件，如 Istanbul；
:::

## 安装 Jest

```ts
npm install --save-dev jest
```

```ts
npx jest --version //查看版本
```

::: tip
在 Jest 测试框架中，it 和 test 实际上是可以互换使用的，两者的作用和功能是一样的。它们都用来定义一个测试用例，语法上也非常相似

1. it 更加自然语言化，通常用于描述测试的预期行为，像 "it should do something"（它应该做某事）这样的表达。
2. test 则更加直白，强调测试本身。
   :::

## 测试的简单用法

::: code-group

```ts [expect.test.js]
//断言
test("test common matcher", () => {
  expect(2 + 2).toBe(4);
  expect(2 + 2).not.toBe(5);
});

test("test not equal", () => {
  expect(2 + 2).not.toEqual(5);
});

test("test to be true or false", () => {
  expect(true).toBe(true);
  expect(false).not.toBe(true);
});

test("test number matcher", () => {
  expect(2).toBeGreaterThan(1);
  expect(2).toBeGreaterThanOrEqual(2);
  expect(1).toBeLessThan(2);
});

test("test object", () => {
  expect({ name: "Jest" }).toEqual({ name: "Jest" });
});
```

:::

```ts
npx jest //运行测试
```

## 异步支持

```ts
npx jest ./async.test.js --watch //运行测试，并监听文件变化
```

### 回调函数

```ts
//支持callback
const fetchUser = async (cb) => {
  setTimeout(() => {
    cb({ name: "John Doe" });
  }, 1000);
};

it("test callback", (done) => {
  fetchUser((data) => {
    expect(data.name).toBe("John Doe");
    done(); //注意这里的done()，它是用来结束测试的，不然测试不会等待异步操作完成
  });
});
```

### Promise

```ts
//支持Promise
const fetchUserPromise = () => {
  return new Promise((resolve, reject) => resolve("hello"));
};
it("test promise", () => {
  fetchUserPromise().then((data) => {
    expect(data).toBe("hello1"); //报错但是不会阻塞测试
  });
});
it("test promise", () => {
  //此处需要return，否则测试不会等待异步操作完成
  return fetchUserPromise().then((data) => {
    expect(data).toBe("hello");
  });
});
```

### async/await

```ts
// 支持async await
it("test promise", async () => {
  const data = await fetchUserPromise();
  expect(data).toBe("hello");
});
// resolves 和 rejects 用于测试Promise是否成功或失败
it("test promise", () => {
  return expect(fetchUserPromise()).resolves.toBe("hello");
});

it("test promise", () => {
  return expect(fetchUserPromise()).rejects.toBe("error");
});
```

## Mock

1. mock 可以创建 mock function，在测试中使用，用来测试回调；
2. 手动 mock，覆盖第三方实现

### mock function

```ts
function mockTest(shouldCall, cb) {
  if (shouldCall) {
    return cb(4);
  }
}

it("test mock", () => {
  const mockCb = jest.fn();
  mockTest(true, mockCb);
  expect(mockCb).toHaveBeenCalledWith(); //测试传入的调用参数
  expect(mockCb).toHaveBeenCalled(); //测试是否被调用过
  expect(mockCb).toHaveBeenCalledTimes(1); //测试调用次数
  console.log(mockCb.mock.calls); //打印调用参数，二维数组
  console.log(mockCb.mock.results); //打印调用结果,对象数组
});

it("test mock", () => {
  // const mockCb = jest.fn(x => x*2);//传入函数作为mock返回值
  const mockCb = jest.fn().mockReturnValue(20); //直接mock返回值
  mockTest(true, mockCb);
  expect(mockCb).toHaveBeenCalledWith(4);
  console.log(mockCb.mock.calls);
  console.log(mockCb.mock.results);
});
```

### 手动 mock

::: code-group

```ts [mock.test.js]
//mock第三方实现
const getUser = require("./user");
const axios = require("axios");
it("test mock", () => {
  return getUser(1).then((res) => {
    console.log(res); // { data: 'Hello, World!' }
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
```

```ts [user.js]
//发送请求
const axios = require("axios");
module.exports = function getUser(id) {
  const data = axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  console.log(data);
  return Promise.resolve(data);
};
```

```ts{2} [axios.js]
//第三方实现拦截请求，mock数据
//在根目录下创建__mocks__文件夹，文件夹下面创建同名文件axios.js
const axios = {
    get: jest.fn(() => Promise.resolve({ data: 'Hello, World!' }))  ,
};
module.exports = axios;
```

:::

### timer mock

::: code-group

```ts [example.test.js]
//测试定时器,注意不要命名文件为timer.test.js,原因未知
//No tests found, exiting with code 0
const fetchUser = (cb) => {
  setTimeout(() => {
    cb("hello");
  }, 1000);
};

const fetchPosts = (cb) => {
  setTimeout(() => {
    cb("yes");
    setTimeout(() => {
      cb("no");
    }, 2000);
  }, 1000);
};
jest.useFakeTimers(); //使用faketimer接管所有定时器
it('test timer functions',() =>{
    const callback = jest.fn();
    fetchUser(callback)
    expect(callback).not.toHaveBeenCalled()
    jest.runAllTimers()；//运行所有定时器
    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith("hello")
})

test('test timer functions',() =>{
    const callback = jest.fn();
    fetchPosts(callback)
    expect(callback).not.toHaveBeenCalled()
    jest.runOnlyPendingTimers() //运行所有未运行的定时器
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith('yes')
    jest.runOnlyPendingTimers()
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith('no')
})

it('test timer functions',() =>{
    const callback = jest.fn();
    fetchPosts(callback)
    expect(callback).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500) //前进500ms
    jest.advanceTimersByTime(500)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith('yes')
})
```

:::

## 事件

```js
it('press enter should render to default layout with new value',async ()=>{
  await wrapper.get('input').setValue('newValue')
  //键盘事件
  const event = new KeyboardEvent('keydown',{ key:'Enter' }) // [!code ++]
  //通过dispatchEvent派发事件到target
  document.dispatchEvent(event)
  await nextTick()
  expect(wrapper.find('span').exists()).toBeTruthy()
  expect(wrapper.get('span').text().toBe('newValue'))
  const events = wrapper.emitted('change')
  expect(event[0]).toEqual(['newValue'])
})
```

## Vue Test Utils

如果一开始没有安装 Vue Test Utils，则可以运行：

```ts
vue add unit-jest
安装完毕后，在package.json中可以看到：
"test:unit": "vue-cli-service test:unit",//新命令
"@vue/cli-plugin-unit-jest"
"@vue/vue3-jest"
"babel-jest"
"jest"
"ts-jest"
```

::: tip
vue-cli-service test:unit

1. 运行测试，会自动查找 tests/unit 目录下所有.spec.(js|jsx|ts|tsx)文件，并运行测试。
2. 或者 Any js(x) | ts(x) files in \_\_tests\_\_ 文件目录下
   :::
   Vue-jest 转换：
   ::: tip
3. 将 vue SFC 文件转换为对应的 ts 文件；
4. 将 ts 通过 presets/typescript-babel 转换为 js 文件；
   :::

### 初步测试

安装完成后会自动生成 tests/unit 目录，并在其中生成示例测试文件。
::: tip 使用 mount 和 shallowMount 的区别

1. mount 会渲染全部 DOM，包括子组件；
2. shallowMount 只渲染当前组件，不渲染子组件,子组件会用虚假的标签代替
3. shallowMount 更快更适合测试单个组件的逻辑，而 mount 更适合测试组件的整体渲染情况
   :::

#### mount 和 shallowMount

::: code-group

```ts [example.spec.ts]
import { mount, shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    // const wrapper = mount(HelloWorld,{
    //   props:{
    //     msg //使用mount挂载组件
    //   }
    // })
    const wrapper = shallowMount(HelloWorld, {
      props: {
        msg, //使用shallowMount挂载组件
      },
    });
    //wrapper其声明文件在VueWrapper.d.ts文件中以及baseWrapper.d.ts文件中
    console.log(wrapper.html({ raw: false }));
  });
});
```

```ts [HelloWorld.vue]
<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <hello msg="1234"></hello>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  setup() {
    const count = ref(1)
    const setCount = () => {
      count.value++
    }
    return {
      count,
      setCount,
    }
  }
})
</script>
```

```ts [Hello.vue]
<template>
  <h1 class="hello">{{msg}}</h1>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Hello',
  props: {
    msg: String
  }
})
</script>
```

:::

#### find 和 get

API:get,getAll,find,findAll,getComponent,findComponent...
:::tip

1. find 方法用于查找匹配指定选择器的第一个节点。它返回一个 Wrapper 实例,如果没有找到匹配元素，则返回一个空的 Wrapper 对象,不会报错
2. 该方法适用于希望检查和操作找到的元素的场景
3. 如果找到了匹配的元素，wrapper.get 将返回一个 Wrapper 对象；如果未找到匹配元素，则抛出一个错误。

<span style="color:red">4. 总是使用 get，除了一些判断元素是否存在的场景</span>
:::

```ts
console.log(wrapper.get("h1").text()); // new message
console.log(wrapper.get("h2")); // 直接抛出错误
console.log(wrapper.find("h1").text()); // new message
console.log(wrapper.find("h2")); //  [Object: null prototype] {}不会报错
```

```ts
console.log(wrapper.getComponent(Hello)); //返回 VueWrapper实例，可以继续调用其方法
console.log(wrapper.findComponent(Hello).props()); //{ msg: '1234' }
```

::: tip getComponent 的意义
让我们不必测试子组件里面的内容，只需要测试子组件的 props，这就是单元测试的意义，独立，互不影响
:::

### 进阶测试

#### 按钮点击测试

::: tip
使用 wrapper.find('button').trigger('click') 方法可以触发按钮的点击事件。
:::
::: code-group

```ts [example.spec.ts]
it("should update the count when button is clicked", async () => {
  const msg = "new message";
  const wrapper = shallowMount(HelloWorld, {
    props: {
      msg,
    },
  });
  expect(wrapper.get("h1").text()).toBe(msg);
  expect(wrapper.findComponent(Hello).exists()).toBeTruthy(); //toBeTruthy验证前面的表达式是否为真值
  const button = wrapper.find("button");
  await button.trigger("click"); //注意async/await的使用，点击之后界面还没有更新
  expect(wrapper.get("button").text()).toBe("2");
});
```

```ts [HelloWorld.vue]
<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <hello msg="1234"></hello>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  setup(props, context) {
    const count = ref(1)
    const setCount = () => {
      count.value++
    }
    return {
      count,
      setCount,
      todo,
    }
  }
})
</script>
```

:::

#### input 表单测试

::: tip
使用 wrapper.get('input').setValue 方法可以设置 input 元素的值，并触发 change 事件。
:::
::: code-group

```ts [example.spec.ts]
it("shold update the input value when button is clicked", async () => {
  const msg = "new message";
  const todoContent = "todo content";
  const wrapper = shallowMount(HelloWorld, {
    props: {
      msg,
    },
  });
  await wrapper.get("input").setValue(todoContent);
  expect(wrapper.get("input").element.value).toBe(todoContent);
  await wrapper.get(".addTodo").trigger("click");
  expect(wrapper.findAll("li")).toHaveLength(1);
  expect(wrapper.get("li").text()).toBe(todoContent);
});
```

```ts [HelloWorld.vue]

<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <input type="text" v-model="todo"/>
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{todo}}</li>
  </ul>
  <hello msg="1234"></hello>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup(props, context) {
    const todo = ref('')
    const count = ref(1)
    const setCount = () => {
      count.value++
    }
    return {
      count,
      setCount,
      todo,
    }
  }
})
</script>
```

:::

#### 事件测试

::: tip
使用 wrapper emitted 方法可以获取组件触发的事件，返回一个数组，数组的每一项是一个事件对象，包含事件名称和参数。
:::
::: code-group

```ts [example.spec.ts]
it("shold update the input value when button is clicked", async () => {
  const msg = "new message";
  const todoContent = "todo content";
  const wrapper = shallowMount(HelloWorld, {
    props: {
      msg,
    },
  });
  await wrapper.get("input").setValue(todoContent);
  expect(wrapper.get("input").element.value).toBe(todoContent);
  await wrapper.get(".addTodo").trigger("click");
  expect(wrapper.findAll("li")).toHaveLength(1);
  expect(wrapper.get("li").text()).toBe(todoContent);
  console.log(wrapper.emitted()); // { send: [ [ 'todo content' ] ] }
  expect(wrapper.emitted()).toHaveProperty("send");
  const events = wrapper.emitted("send")!;
  // expect(events[0]).toBe([todoContent])// 报错，[]不能直接比较，内存地址不一样，toBe是严格检查
  expect(events[0]).toEqual([todoContent]); // 正确
});
```

```ts [HelloWorld.vue]
<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <input type="text" v-model="todo"/>
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{todo}}</li>
  </ul>
  <hello msg="1234"></hello>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup(props, context) {
    const todo = ref('')
    const todos = ref<string[]>([])
    const count = ref(1)
    const setCount = () => {
      count.value++
    }
    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value)
        context.emit('send', todo.value)
      }
    }
    return {
      count,
      setCount,
      todo,
      todos,
      addTodo,
    }
  }
})
</script>
```

:::

#### 异步请求测试

::: code-group

```ts{7,10,23} [example.spec.ts]
import axios from "axios";
import { mount, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>; //将mock对象断言为特定类型，以便于类型检查和类型推断
// mockAxios.get.xxx
describe("HelloWorld.vue", () => {
  //only表示只运行该测试用例，其他用例不运行
  //成功测试
  it.only("should load user when button is clicked", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: {
        msg,
      },
    });
    mockAxios.get.mockResolvedValueOnce({ data: { username: "test" } });
    await wrapper.get(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises(); //将所有Promise pending状态的回调函数都执行完毕
    //界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.get(".userName").text()).toBe("test");
  });
  // 失败测试
  it.only("should load error when button is clicked", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: {
        msg,
      },
    });
    mockAxios.get.mockRejectedValueOnce(new Error("error"));
    await wrapper.get(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.find(".error").exists()).toBeTruthy();
    expect(wrapper.get(".error").text()).toBe("error!");
  });
});
```

```ts [HelloWorld.vue]
<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <input type="text" v-model="todo"/>
  <button class="addTodo" @click="addTodo">add</button>
  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading</p>
  <div v-else class="userName">{{user.data && user.data.username}}</div>
  <p v-if="user.error" class="error">error!</p>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{todo}}</li>
  </ul>
  <hello msg="1234"></hello>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
import axios from 'axios'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup(props, context) {
    const todo = ref('')
    const todos = ref<string[]>([])
    const user = reactive({
      data: null as any,
      loading: false,
      error: false
    })
    const count = ref(1)
    const setCount = () => {
      count.value++
    }
    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value)
        context.emit('send', todo.value)
      }
    }
    const loadUser = () => {
      user.loading = true
      axios.get('https://jsonplaceholder.typicode.com/users/1').then(resp => {
        console.log(resp)
        user.data = resp.data
      }).catch(() => {
        user.error = true
      }).finally(() => {
        user.loading = false
      })
    }
    return {
      count,
      setCount,
      todo,
      todos,
      addTodo,
      user,
      loadUser,
    }
  }
})
</script>
```

:::

#### 测试准备和结束

::: tip
每次在 describe 块的测试用例中，都重复的写了一些代码，我们可以使用 Jest 的钩子函数去优化：<br/>
一次性完成准备测试工作：

1. beforeAll：在所有测试用例之前运行；
2. afterAll：在所有测试用例之后运行；<br/>
   这样所有的测试用例都可以共用这部分代码，减少重复代码，提高测试效率，不过会互相影响，需要注意。<br/>
3. beforeEach：在每个测试用例之前运行；
4. afterEach：在每个测试用例之后运行；<br/>
5. 可以使用 mockReset 方法重置 mock 对象，避免影响其他测试用例；<br/>
   :::

```ts
const msg = "new message";
let wrapper: VueWrapper<any>;
describe("HelloWorld.vue", () => {
    //所有case跑之前运行
  //注意所有case共用一个实例，可能会有影响
  beforeAll(() => {
    wrapper = shallowMount(HelloWorld, {
      props: {
        msg,
      }
    })
    //所有case跑之后运行
    // afterAll(()=>{})
    it.only()//可以单独运行某个case
    it.skip()//跳过某个case
    afterEach(() => {
      mockAxios.get.mockReset(); //重置mock对象
    })
})
```

### 全局组件Mock
```ts
//这里的 -- 表示结束 npm 选项，后面的选项是直接传递给测试框架（如 Jest）
npm run test:unit -t userPriofile.spec.ts -- --watch //运行单个文件
npm run test:unit -t userPriofile.spec.ts -- --coverage //生成测试覆盖率报告
```
::: code-group
```ts [userProfile.spec.ts]
import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/components/UserProfile.vue";
let wrapper: VueWrapper<any>;
jest.mock('ant-design-vue')
jest.mock('vuex')
jest.mock('vue-router');
const mockCompoents = {
    //实现mock标签结构
    template: '<div><slot></slot></div>',
}
const mockCompoents2 = {
    template:'<div><slot></slot><slot name="overlay"></slot></div>'
}
const globalComponents = {
    'a-button':mockCompoents,
    'a-dropdown-button':mockCompoents2,
    'a-menu':mockCompoents,
    'a-menu-item':mockCompoents,
    'router-link':mockCompoents,
}
describe("UserProfile.vue", () => {
    beforeAll(()=>{
      //注意使用mount挂载，使用shalloMount会渲染不出来子组件
        wrapper = mount(UserProfile, { // [!code ++]
            props:{
                user:{isLogin:false}
            },
            global:{
                components:globalComponents //全局组件的注册,不注册jest不认识a-button等标签
            }
        })
    })
    it('should render login button when user is not login',() =>{
        console.log(wrapper.html())
      // <div to="/login">
      //   <div type="primary" class="user-profile-component">登录</div>
      // </div>
      // <div>
      //   <div class="user-profile-component">
      //     <div to="/setting"></div>
      //   </div>
      // </div>
        expect(wrapper.get('div[type="primary"]').text()).toBe('登录')
    })
    it('should render username  when user is  login',async () =>{
        await wrapper.setProps({
            user:{isLogin:true,username:'test'}
        })
        console.log(wrapper.html()); 
  //  <!--v-if-->
  //   <div>
  //     <div class="user-profile-component">
  //       <div to="/setting">test</div>
  //       <div class="user-profile-dropdown">
  //         <div>创建作品</div>
  //         <div>
  //           <div to="/works">我的作品</div>
  //         </div>
  //         <div>登出</div>
  //       </div>
  //     </div>
  //   </div>
        expect(wrapper.get('div[to="/setting"]').text()).toBe('test')
        expect(wrapper.get('.user-profile-component').html()).toContain('test')
        expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
    })
});

``` 
```ts [UserProfile.vue]
<template>
  <router-link to="/login" v-if="!user.isLogin">
    <a-button type="primary" class="user-profile-component">登录</a-button>
  </router-link>
  <div>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.username }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item>
          <a-menu-item key="1"
            ><router-link to="/works">我的作品</router-link></a-menu-item
          >
          <a-menu-item key="2" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
// import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'
.............
</script>
```
:::

### 第三方库Mock
目标：实现message.success的mock，实现store.commit的mock,实现vue-router的push的mock<br/>
结构：Ant-Design-Vue => message => success()，Vuex => useStore() => commit()，Vue-Router => useRouter() => push()<br/>
::: tip
1. 直接使用jest.mock('ant-design-vue',()=>({})),在第二个函数参数中可以实现mock,注意是返回一个对象
2. 而对于store，已经使用app.use全局注册过，jest提供了API可以直接使用真实的store数据，可以按照第一种方法进行mock
:::
::: code-group
```ts{6-10} [使用第一种方法]
import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/components/UserProfile.vue";
import { message  } from "ant-design-vue";
import { useStore } from 'vuex'
let wrapper: VueWrapper<any>;
jest.mock('ant-design-vue',() =>({
    message:{
        success:jest.fn()
    }
}))
const mockCommit = jest.fn()
jest.mock('vuex',()=>({
    useStore:() => {
        return {
            commit:mockCommit
        }
    }
}))
jest.mock('vue-router');
const mockCompoents = {
    template: '<div><slot></slot></div>',
}
const mockCompoents2 = {
    template:'<div><slot></slot><slot name="overlay"></slot></div>'
}
const globalComponents = {
    'a-button':mockCompoents,
    'a-dropdown-button':mockCompoents2,
    'a-menu':mockCompoents,
    'a-menu-item':mockCompoents,
    'router-link':mockCompoents,
}
describe("UserProfile.vue", () => {
    beforeAll(()=>{
        wrapper = mount(UserProfile, {
            props:{
                user:{isLogin:false}
            },
            global:{
                components:globalComponents, //全局组件的注册
            }
        })
    })
    it('should render login button when user is not login',async () =>{
        expect(wrapper.get('div[type="primary"]').text()).toBe('登录')
        await wrapper.get('div[type="primary"]').trigger('click')
        expect(message.success).toHaveBeenCalled()
        expect(useStore().commit).toHaveBeenCalled()
        expect(mockCommit).toHaveBeenCalled()
    })
});

```
```ts [使用第二种方法]
import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/components/UserProfile.vue";
import { message  } from "ant-design-vue";
import store from "@/store";
let wrapper: VueWrapper<any>;
jest.mock('ant-design-vue',() =>{
    return {
        message:{
            success:jest.fn()
        }
    }
})
jest.mock('vue-router');
const mockCompoents = {
    template: '<div><slot></slot></div>',
}
const mockCompoents2 = {
    template:'<div><slot></slot><slot name="overlay"></slot></div>'
}
const globalComponents = {
    'a-button':mockCompoents,
    'a-dropdown-button':mockCompoents2,
    'a-menu':mockCompoents,
    'a-menu-item':mockCompoents,
    'router-link':mockCompoents,
}
describe("UserProfile.vue", () => {
    beforeAll(()=>{
        wrapper = mount(UserProfile, {
            props:{
                user:{isLogin:false}
            },
            global:{
                components:globalComponents, //全局组件的注册
                provide:{ // [!code ++]
                  //provide全局注册store
                  store
                }
            }
        })
    })
    it('should render login button when user is not login',async () =>{
        expect(wrapper.get('div[type="primary"]').text()).toBe('登录')
        await wrapper.get('div[type="primary"]').trigger('click')
        expect(message.success).toHaveBeenCalled()
        expect(store.state.user.data.isLogin).toBe(true)
        expect(store.state.user.data.username).toBe('秋忆')
    })
});

```
```ts [实现vue-router的push的mock]
import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/components/UserProfile.vue";
import { message } from "ant-design-vue";
import store from "@/store";
let wrapper: VueWrapper<any>;
jest.mock("ant-design-vue", () => {
  return {
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});
const mockRouterArr: string[] = []; // [!code ++]
jest.mock("vue-router", () => ({
  useRouter: () => {
    return {
      push: (url: string) => mockRouterArr.push(url),
    };
  },
}));
const mockCompoents = {
  template: "<div><slot></slot></div>",
};
const mockCompoents2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
};
const globalComponents = {
  "a-button": mockCompoents,
  "a-dropdown-button": mockCompoents2,
  "a-menu": mockCompoents,
  "a-menu-item": mockCompoents,
  "router-link": mockCompoents,
};
describe("UserProfile.vue", () => {
  beforeAll(() => {
    jest.useFakeTimers()
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false },
      },
      global: {
        components: globalComponents, //全局组件的注册
        provide: {
          store,
        },
      },
    });
  });
  //先进性登录测试
  it("should render login button when user is not login", async () => {
    expect(wrapper.get('div[type="primary"]').text()).toBe("登录");
    await wrapper.get('div[type="primary"]').trigger("click");
    expect(message.success).toHaveBeenCalled();
    expect(store.state.user.data.isLogin).toBe(true);
    expect(store.state.user.data.username).toBe("秋忆");
  });
  //登出测试
  it('should render logout button when user is login',async () => {
    await wrapper.get('.user-profile-dropdown div:nth-child(3)').text();//登出
    await wrapper.get('.user-profile-dropdown div:nth-child(3)').trigger("click");
    expect(store.state.user.data.isLogin).toBe(false);
    expect(store.state.user.data.username).toBe("");
    expect(message.success).toHaveBeenCalledTimes(1);
    jest.runAllTimers() //等待定时器跑完 // [!code ++]
    //一旦你在点击事件中触发了push方法,那么push方法就会被间接调用，而不需要在测试代码中手动调用它。 // [!code ++]
    expect(mockRouterArr).toEqual(['/'])//只需要判断数组是否正确push
    expect(mockRouterArr).toContain('/')
  })
  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
});

```
```ts [UserProfile.vue]
    const login = () => {
      store.commit('login')
      message.success('登录成功',2)
    }，
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到首页', 2)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
     
```
:::

### Store 测试
Vue store是脱离组件存在的，当项目变得复杂之后，可以脱离界面测试store的状态，比如actions，mutations，getters等，最大限度地保证功能正常运转。
```ts [store.spec.ts]
import store from "@/store/index";
import { testData } from "@/store/templates";
import { testComponents } from "@/store/editor";
import { TextComponentProps } from "@/defaultProps";
import clone from "clone";
import { last } from 'lodash-es'; //这里有报错问题，查看报错记录第二条解决方案 // [!code ++]
const cloneTestData = clone(testComponents)

describe("Store", () => {
  it("should have a state", () => {
    expect(store.state).not.toBeNull();
    expect(store.state).toHaveProperty("user");
    expect(store.state).toHaveProperty("templates");
    expect(store.state).toHaveProperty("editor");
  });
  describe("user login", () => {
    it("should login", () => {
      store.commit("login");
      expect(store.state.user.data.isLogin).toBe(true);
      expect(store.state.user.data.username).toBe("秋忆");
    });
  });

  describe("user unlogin", () => {
    it("should unlogin", () => {
      store.commit("logout");
      expect(store.state.user.data.isLogin).toBe(false);
      expect(store.state.user.data.username).toBe("");
    });
  });

  describe("templates module", () => {
    it("test default templates", () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });

    it("should get current id", () => {
      const res = store.getters.getTemplatesById(1);
      expect(res.title).toBe("模板标题1");
    });
  });

  describe("edior module", () => {
    it("test editor", () => {
      expect(store.state.editor.components).toHaveLength(cloneTestData.length);
    });
    it("test setAvtive", () => {
      store.commit("setActive", cloneTestData[0].id);
      expect(store.state.editor.currentElement).toBe(cloneTestData[0].id);
      const currentE = store.getters.getCurrentElement;
      expect(currentE.id).toBe(cloneTestData[0].id);
    });

    it("add element", () => {
      const payload: Partial<TextComponentProps> = {
        text: "test",
      };
      store.commit('addComponent',payload)
      expect(store.state.editor.components).toHaveLength(cloneTestData.length+1)
      const lastItem = last(store.state.editor.components)
      expect(lastItem?.props.text).toBe('test')
    });
    it('update element',() =>{
        const newProps = {
            key:'text',
            value:'update'
        }
        store.commit('updateComponent',newProps)
        const currentE = store.getters.getCurrentElement;
        expect(currentE.props.text).toBe('update')
    })
  });
});

```


## TDD 开发 
正常开发：需求 -> 编码 -> 测试 -> 重构 -> 发布<br/>
TDD开发：需求 -> 测试 -> 编码 -> 重构 -> 发布<br/>
1. 根据需求写测试用例；
2. 测试用例失败
3. 开始写代码，使测试用例通过；

### TDD 测试用例
```ts [colorPicker.spec.ts]
import { mount, VueWrapper } from '@vue/test-utils'
import rgbHex from 'rgb-hex'
import ColorPick from '@/components/ColorPick.vue'
const defaultColors = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']
let wrapper: VueWrapper<any>
describe('UserProfile component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPick, {
      props: {
        value: '#ffffff'
      },
    })
  })
  it('should render the correct interface', () => {
    // <div><input></div>
    // <ul class="picked-color-list">
    //  <li class="item-0" or class="transparent-back">
    //      <div></div>
    //  </li>
    //</ul>
    
    // 测试左侧是否为 input，类型和值是否正确
    expect(wrapper.find('input').exists()).toBeTruthy()
    expect(wrapper.get('input').element.type).toBe('color')
    expect(wrapper.get('input').element.value).toBe('#ffffff')
    // 测试右侧是否有颜色的列表
    expect(wrapper.find('.picked-color-list')).toBeTruthy()
    expect(wrapper.findAll('.picked-color-list li').length).toBe(defaultColors.length)
    // 检查一个元素的 css backgroundColor属性是否相等对应的颜色
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement
    expect('#'+ rgbHex(firstItem.style.backgroundColor)).toBe(defaultColors[0])
    // 测试最后一个元素是否有特殊的类名
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement
    expect(lastItem.classList.contains('transparent-back')).toBeTruthy()
  })
  it('should send the correct event when change input', async () => {
    // 测试 input 修改以后，是否发送对应的事件和对应的值
    const blackHex = '#000000'
    const input = wrapper.get('input')
    await input.setValue(blackHex)
    expect(wrapper.emitted()).toHaveProperty('change')
    const events = wrapper.emitted('change')!
    expect(events[0]).toEqual([blackHex])
  })
  it('should send the correct event when clicking the color list', async () => {
    // 测试点击右侧颜色列表以后，是否发送对应的值
    const firstItem = wrapper.get('li:first-child div')
    await firstItem.trigger('click')
    const events = wrapper.emitted('change')!
    expect(events[1]).toEqual([defaultColors[0]])
  })
})
```


## 上传文件测试
```ts [upload.spec.ts]
import Uploader from "@/components/Uploader.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import axios from "axios";
import flushPromises from "flush-promises";
const mockFile = new File(["hello"], "hello.txt", { type: "text/plain" });
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
describe("Uploader.vue", () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "",
      },
    });
  });

  it("should render", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("button span").text()).toBe("点击上传");
    expect(wrapper.get('input[type="file"]').isVisible()).toBeFalsy();
  });
  it("should upload file", async () => {  
    mockAxios.post.mockResolvedValueOnce({ status: 'success' });  
    const fileInput = wrapper.get('input[type="file"]').element as HTMLInputElement;  
         const files = [mockFile] as any;  
    Object.defineProperty(fileInput, 'files', {  
        value: files,  
        writable: false,  
    });  
    await wrapper.get('input[type="file"]').trigger('change');   
    expect(mockAxios.post).toHaveBeenCalledTimes(1);  
    //expect(wrapper.get('button span').text()).toBe('正在上传');  //这里报错，直接就上传成功了
    await flushPromises();  
    expect(wrapper.get('button span').text()).toBe('上传成功');  
});
});

```


## Jest 报错

### axios 错误

::: danger
"Object.< anonymous >":function(module,exports,require,**dirname,**filename,jest)import axios from './lib/axios.js';<br/>
SyntaxError: Cannot use import statement outside a module<br/>
import axios from 'axios'<br/>
axios 产生错误；<br/>
原因：Axios 构建为 ES 模块，而不是在 Node 中运行时的 CommonJs。Jest 的问题是它在 Node 中运行代码。这就是为什么告诉 Jest 转换 Axios 有效的原因。
:::
::: code-group

```ts [解决]
在jest.config.js中配置
"moduleNameMapper": {
  "^axios$": "axios/dist/node/axios.cjs"
}
```

:::

### export 错误
在Jest测试文件中使用import { clone } from 'lodash-es'时报错
::: danger
export { default as add } from './add.js';<br/>
^^^^^^<br/>
SyntaxError: Unexpected token 'export'<br/>
原因：Jest 无法解析 ES6 模块语法，Jest 的默认配置基于 CommonJS
:::
尝试解决：
::: code-group
```ts [在jest.config.js中配置]
//无效 // [!code ++]
transform: {
  '^.+\\.jsx?$': 'babel-jest',
  '^.+\\.ts$': 'ts-jest', // 如果使用 TypeScript
},  
```
```ts [使用lodash]
//有效 // [!code ++]
//直接使用lodash，而不是lodash-es
import { clone } from 'lodash';
```
```ts [在jest.config.js中配置]
//有效 // [!code ++]
//默认情况下，Jest 会将测试文件转化为 CommonJS 模块语法
//忽略转化配置项
 transformIgnorePatterns: ["/!node_modules\\/lodash-es/"],
```
```ts [直接引入clone]
//有效 // [!code ++]
// import clone from "clone";
```
:::