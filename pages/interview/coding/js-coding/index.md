# JavaScript Codeing

## 数组去重

```js
使用Set; // [!code ++]
const newArr = [...new Set([1, 2, 3, 3, 4, 5, 5, 6, 6])];
```

```js
使用循环; // [!code ++]
const fn = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
};
```

```js
使用filter + indexOf; // [!code ++]
const filterFn = (arr) => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
};
```

```js
使用reduce + includes; // [!code ++]
const reduceArr = (arr) => {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
};
```

```js
使用for循环 + includes; // [!code ++]
const fn = (arr) => {
  let res = [];
  for (let key of arr) {
    if (!res.includes(key)) {
      res.push(key);
    }
  }
  return res;
};
```

```js
使用map; // [!code ++]
const fn = (arr) => {
  let res = [];
  let map = new Map();
  for (let key of arr) {
    if (!map.has(key)) {
      map.set(key, true);
      res.push(key);
    }
  }
  return res;
};
```

## 将数字每千分位隔开

```js
let num = 123456789;
let formatNumber = num.toLocaleString();
```

## 防抖

```js
function debounce(fn, delay) {
  let timer = null;
  return function () {
    let args = arguments;
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
const fn = debounce(function () {}, 250);
window.addEventListener("resize", fn);
```

## 节流

```js
function throttle(fn, delay) {
  let isThrottle = false;
  return function () {
    let args = arguments;
    let context = this;
    if (!isThrottle) {
      fn.apply(context, args);
      isThrottle = true;
      setTimeout(() => {
        isThrottle = false;
      }, delay);
    }
  };
}
```

## 浅拷贝

```js
function shallowCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return Object.assign({}, obj);
}
const original = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};
const copy = shallowCopy(original);
console.log(copy); // { a: 1, b: 2, c: { d: 3, e: 4 } }
copy.c.d = 5;
console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
```

```js
const shallowCopy = (target) => {
  if (typeof target !== "object" || target === null) {
    return target;
  }
  if (
    /^(Function|RegExp|Date|Map|WeakMap|Set|WeakSet)$/i.test(
      target.constructor.name
    )
  )
    return target;
  const copy = Array.isArray(target) ? [] : {};
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      copy[key] = target[key];
    }
  }
  return copy;
};
const original = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};
const copy = shallowCopy(original);
console.log(copy); // { a: 1, b: 2, c: { d: 3, e: 4 } }
copy.c.d = 5;
console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
```

## 深拷贝

```js
let clone = function (obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  let newObj = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];
      newObj[key] = typeof value === "object" ? clone(value) : value;
    }
  }
  return newObj;
};
let obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};
let obj2 = clone(obj);
console.log(obj2); // { a: 1, b: 2, c: { d: 3, e: 4 } }
obj2.c.d = 5;
console.log(obj); // { a: 1, b: 2, c: { d: 3, e: 4 } }
console.log(obj2); // { a: 1, b: 2, c: { d: 5, e: 4 } }
obj2.a = 10;
console.log(obj); // { a: 1, b: 2, c: { d: 3, e: 4 } }
console.log(obj2); // { a: 10, b: 2, c: { d: 5, e: 4 } }
```

```js
const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // { a: 1, b: 2, c: { d: 3, e: 4 } }
obj2.c.d = 5;
console.log(obj); // { a: 1, b: 2, c: { d: 3, e: 4 } }
console.log(obj2); // { a: 1, b: 2, c: { d: 5, e: 4 } }
```

## New 操作符

```js
const myNew = (constructor, ...args) => {
  const newObj = Object.create(constructor.prototype);
  let res = constructor.apply(newObj, args);
  return Object.prototype.toString.call(res) === "[object Object]"
    ? res
    : newObj;
};
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const person = myNew(Person, "zhangsan", 18);
console.log(person); // { name: 'zhangsan', age: 18 }
```

```js
const myNew = (constructor, ...args) => {
  return Reflect.construct(constructor, args);
};
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
const person = myNew(Person, "zhangsan", 18);
console.log(person); // { name: 'zhangsan', age: 18 }
```

## 柯里化

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...args2) {
      return curried.apply(this, [...args, ...args2]);
    };
  };
}
function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

## 使用 Promise 封装 AJAX

```js
function PromiseAjax(url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method === "POST") {
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        }
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  });
}
PromiseAjax("https://jsonplaceholder.typicode.com/posts/1")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

## 交换 a 和 b 的值，不能使用临时变量

```js
let a = 1;
let b = 10;

a = a + b;
b = a - b;
a = a - b;
```

```js
let a = 1;
let b = 10;

[a, b] = [b, a];
```

## 数组元素求和

```js
for循环; // [!code ++]
function sum(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}
```

```js
reduce; // [!code ++]
function sum(arr) {
  return arr.reduce((acc, num) => acc + num, 0);
}
```

## 数组扁平化

```js
使用flat; // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
let flatArr = arr.flat(Infinity);
```

```js
使用递归; // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  let res = [];
  for (let key of arr) {
    if (Array.isArray(key)) {
      res = res.concat(flatten(key));
    } else {
      res.push(key);
    }
  }
  return res;
}
console.log(flatten(arr));
```

```js
使用正则; // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  const reg = /\[|\]/g;
  return JSON.stringify(arr)
    .replace(reg, "")
    .split(",")
    .map((item) => JSON.parse(item));
}
```

```js
使用reduce; // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      return acc.concat(flatten(val));
    } else {
      return acc.concat(val);
    }
  }, []);
}
```

```js
使用扩展运算符; // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

## 实现 add(1)(2)(3)

```js
function add() {
  let sum = 0;
  function innerAdd(num) {
    sum += num;
    return innerAdd;
  }
  innerAdd.toString = () => sum;
  innerAdd.getResult = () => sum;
  return innerAdd;
}
console.log(add()(1)(2)(3).toString()); //6
console.log(add(1)(3)(3).getResult()); // 6
```

## 将类数组转为数组

```js
function toArray(arrLike) {
  return Array.prototype.slice.call(arrLike);
}
```

```js
function toArray(arrLike) {
  return Array.from(arrLike);
}
```

```js
function toArray(arrLike) {
  return [...arrLike];
}
```

## DOM 转对象

```js
const domToTree = (node) => {
  const obj = {};
  obj.tag = node.tagName;
  obj.children = [];
  node.childNodes.forEach((child) => {
    obj.children.push(domToTree(child));
  });
  return obj;
};
```

## 对象转树

```js
const obj = [
  { id: 1, name: "Item1", parentId: null },
  { id: 2, name: "Item1.1", parentId: 1 },
  { id: 3, name: "Item1.2", parentId: 1 },
  { id: 4, name: "Item2", parentId: null },
  { id: 5, name: "Item2.1", parentId: 4 },
  { id: 6, name: "Item2.2", parentId: 4 },
];
const buildTree = (data, parentId = null) => {
  let tree = [];
  for (let item in data) {
    if (data[item].parentId === parentId) {
      const children = buildTree(data, data[item].id);
      if (children.length) {
        data[item].children = children;
      }
      tree.push(data[item]);
    }
  }
  return tree;
};
console.log(buildTree(obj));
```

## 对象转 DOM

```js
funcction _render(vnode){
  // 处理数字节点
  if(typeof vnode === 'number'){
    vnode = String(vnode)
  }
  // 处理文本节点
  if(typeof vnode ==='string'){
    return document.createTextNode(vnode)
  }
  //如果 vnode 是一个对象,首先创建一个对应标签名的 DOM 元素
  const dom = document.createElement(vnode.tag)
  // 处理属性
  if(vnode.attrs){
    Object.keys(vnode.attrs).forEach(key => {
      dom.setAttribute(key,vnode.attrs[key])
    })
  }
  // 处理子节点
  vnode.children.forEach(child => {
    dom.appendChild(_render(child))
  })
  return dom
}
```

## 对象环引用

```js
const cycleDetector = (obj) => {
  const arr = [obj];
  let flag = false;

  const cycle = (o) => {
    const values = Object.values(o);
    for (let value of values) {
      if (typeof value === "object" && value !== null) {
        if (arr.includes(value)) {
          flag = true;
          return;
        }
        arr.push(value);
        cycle(value);
      }
    }
  };

  cycle(obj);

  return flag;
};

const objA = {};
const objB = {};

// 创建环引用
objA.child = objB;
objB.parent = objA;

// 现在 objA 和 objB 互相引用
console.log(cycleDetector(objA)); // { child: { parent: [Circular] } }
console.log(cycleDetector(objB)); // { parent: { child: [Circular] } }
```

## 对象层数

```js
const loopObj = (obj) => {
  let count = 1;
  const loop = (obj, level) => {
    level = level || 0;
    if (typeof obj === "object" && obj !== null) {
      const values = Object.values(obj);
      for (let value of values) {
        if (typeof value === "object" && value !== null) {
          loop(value, level + 1);
        } else {
          count = level + 1 > count ? level + 1 : count;
        }
      }
    } else {
      count = level > count ? level : count;
    }
  };
  loop(obj);
  return count;
};
```

## 查找树形结构中符合要求的节点

```js
function findNodes(tree, fn) {
  const res = [];
  function traverse(node) {
    if (fn(node)) {
      res.push(node);
    }
    for (const child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
  return res;
}
const tree = {
  val: 1,
  children: [
    {
      val: 2,
      children: [
        {
          val: 4,
          children: [],
        },
        {
          val: 5,
          children: [],
        },
      ],
    },
  ],
};
const vertifyNode = (node) => node.val === 4;
console.log(findNodes(tree, vertifyNode));
```

## 用 Promise 实现图片异步加载

```js
function PromiseImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error("图片加载失败"));
    };
    img.src = url;
  });
}
PromiseImg(
  "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
)
  .then((img) => {
    document.body.appendChild(img);
  })
  .catch((error) => {
    console.log(error);
  });
```

## 使用 SetTimeout 模拟 setInterval

```js
function mySetInterval(fn, delay) {
  let lastTime = Date.now();
  fn();
  let timer = setTimeout(() => {
    clearTimeout(timer);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    lastTime = currentTime;
    console.log(`时间差: ${timeDiff}ms`);
    mySetInterval(fn, delay);
  }, delay);
}
mySetInterval(() => {
  console.log("hello");
}, 2000);
```

```js
function SetInterval(fn, time) {
  let lastTime = Date.now();
  let timer = null;
  let isRunning = true;
  function loop() {
    let currentTime = Date.now();
    if (isRunning) {
      fn();
      console.log(`时间差: ${currentTime - lastTime}ms`);
      const delayTime = Date.now() + time;
      timer = setTimeout(loop, delayTime - Date.now());
    }
  }
  timer = setTimeout(loop, time);
  return () => {
    isRunning = false;
    clearTimeout(timer);
  };
}
const stopTimer = SetInterval(() => {
  console.log("hello");
}, 2000);
setTimeout(() => {
  stopTimer();
}, 5000);
```

## 使用 SetInterval 模拟 setTimeout

```js
const mySetTimeout = (fn, delay) => {
  const timer = setInterval(() => {
    fn();
    clearInterval(timer);
  }, delay);
};
```

## 实现一个简单路由

基于 Hash

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <script>
    const routes = {
      "/": () => {
        document.querySelector("#content").textContent = "Home Page";
      },
      "/about": () => {
        document.querySelector("#content").textContent = "About Page";
      },
      "/contact": () => {
        document.querySelector("#content").textContent = "Contact Page";
      },
    };
    const initRoute = () => {
      const hash = window.location.hash.slice(1);
      if (routes[hash]) {
        routes[hash]();
      } else {
        routes["/"]();
      }
    };
    window.onload = initRoute;
    window.onhashchange = initRoute;
  </script>
  <body>
    <nav>
      <a href="#/">Home</a>
      <a href="#/about">About</a>
      <a href="#/contact">Contact</a>
    </nav>
    <div id="content"></div>
  </body>
</html>
```

使用 History

```js
const routes = {
  "/": () => {
    document.querySelector("#content").textContent = "Home Page";
  },
  "/about": () => {
    document.querySelector("#content").textContent = "About Page";
  },
  "/contact": () => {
    document.querySelector("#content").textContent = "Contact Page";
  },
};
let lastUrl = "";
function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
  initRoute();
}
function initRoute() {
  const path = window.location.pathname;
  lastUrl = path;
  if (routes[path]) {
    routes[path]();
  } else {
    routes["/"]();
  }
}
window.onload = initRoute;
window.onpopstate = initRoute;
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("nav").addEventListener("click", (event) => {
    event.preventDefault();
    const path = event.target.getAttribute("href");
    navigateTo(path);
  });
});
```

## LRU

```js
function myLRU(length) {
  this.length = length;
  this.data = new Map();
  this.set = function (key, value) {
    if (this.data.has(key)) {
      this.data.delete(key);
    }
    this.data.set(key, value);
    if (this.data.size > this.length) {
      const dlKey = this.data.keys().next().value;
      this.data.delete(dlKey);
    }
  };
  this.get = function (key) {
    if (!this.data.has(key)) {
      return null;
    } else {
      const value = this.data.get(key);
      this.data.delete(key);
      this.data.set(key, value);
      return value;
    }
  };
}
const lru = new myLRU(4);
```

## 事件缓存

```js
function myCache(fn) {
  let cache = {};
  return function (...args) {
    let key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    } else {
      cache[key] = fn.apply(this, agrs);
      return cache[key];
    }
  };
}
```

## 给对象添加 Symbol.iterator 属性

```js
Object.prototype[Symbol.iterator] = function* () {
  let index = 0;
  let arr = Object.entries(this);
  let length = arr.length;
  while (true) {
    if (index >= length) {
      return false;
    } else {
      let key = arr[index] && arr[index][0];
      let val = arr[index] && arr[index][1];
      let result = { [key]: val };
      index++;
      yield result;
    }
  }
};
const obj = {
  name: "zhangsan",
  age: 18,
  city: "beijing",
};
for (let key of obj) {
  console.log(key); //{ name: 'zhangsan' } { age: 18 } { city: 'beijing' }
}
```

## 给数组对象添加 Symbol.iterator 属性

```js
let arrlike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};
arrlike[Symbol.iterator] = function () {
  let index = 0;
  return {
    next: () => {
      if (index < this.length) {
        const result = { value: this[index], done: false };
        index++;
        return result;
      } else {
        return { value: undefined, done: true };
      }
    },
  };
};

for (let item of arrlike) {
  console.log(item);
}
const iter = arrlike[Symbol.iterator]();
console.log(iter.next());
```

## intersectionObserver 实现懒加载

1. IntersectionObserver 是一个用于异步观察目标元素与其祖先元素或视口交叉状态的 API
2. 回调函数 (entries) => {...} 会在被观察的元素的可见部分发生变化时被调用。entries 是一个包含了所有交叉状态变化的对象数组
3. item.isIntersecting 是一个布尔值，用于判断当前观察到的元素是否在视口中
4. io.unobserve(item.target)，表示停止监听该元素，因为它已经加载过

```js
const imgList = [...document.querySelectorAll("img")];
var io = new IntersectionObserver(
  (entries) => {
    entries.forEach((item) => {
      // isIntersecting是一个Boolean值，判断目标元素当前是否可见
      if (item.isIntersecting) {
        item.target.src = item.target.dataset.src;
        // 图片加载后即停止监听该元素
        io.unobserve(item.target);
      }
    });
  },
  {
    root: document.querySelector(".root"),
  }
);
// observe遍历监听所有img节点
imgList.forEach((img) => io.observe(img));
```

## 实现一个调度器，实现并发控制

1. 执行控制时机，判断是否要等待？
2. 如何让任务挂起？如何让任务恢复？
3. 如何实现并发控制

```js
class Scheduler {
  constructor(max) {
    this.max = max;
    this.queue = [];
    this.running = 0;
  }
  async add(task) {
    if (this.running >= this.max) {
      // 通过await暂停等待，直到有任务resolve完成
      await new Promise((resolve) => {
        this.queue.push(resolve);
      });
    }
    this.running++;
    try {
      let res = await task();
      return res;
    } finally {
      this.running--;
      // 在此处执行resolve
      if(this.queue.length){
        this.queue.shift()();
      }
    }
  }
}

const createTask = (task, delay) => {
  // 返回一个函数,而不是promise
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(task());
      }, delay);
    });
  };
};

const scheduler = new Scheduler(2);
scheduler.add(
  createTask(() => {
    console.log("task1");
  }, 1000)
);
scheduler.add(
  createTask(() => {
    console.log("task2");
  }, 500)
);
scheduler.add(
  createTask(() => {
    console.log("task3");
  }, 300)
);
scheduler.add(
  createTask(() => {
    console.log("task3");
  }, 400)
);
```
