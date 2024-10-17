# JavaScript Codeing

## 数组去重

```js
使用Set // [!code ++]
const newArr = [...new Set([1,2,3,3,4,5,5,6,6])]
```
```js
使用循环 // [!code ++]
const fn = (arr)=>{
    for(let i=0;i<arr.length;i++){
        for(let j=i+1;j<arr.length;j++){
            if(arr[i] === arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr
}
```
```js
使用filter+indexOf // [!code ++]
const filterFn = (arr) =>{
  return arr.filter((item,index) => {
    return arr.indexOf(item) === index
  })
}
```
```js
使用reduce+includes // [!code ++]
const reduceArr = (arr) =>{
  return arr.reduce((acc,item) => {
    if(!acc.includes(item)){
      acc.push(item)
    }
    return acc
  },[])
}
```
```js
使用for循环+includes // [!code ++]
const fn = (arr) => {
  let res = []
  for(let key of arr){
    if(!res.includes(key)){
      res.push(key)
    }
  }
  return res
}
```
```js
使用map // [!code ++]
const fn = (arr) => {
  let res = []
  let map = new Map()
  for(let key of arr){
    if(!map.has(key)){
      map.set(key,true)
      res.push(key)
    }
  }
  return res
}
```

## 将数字每千分位隔开

```js
let num = 123456789;
let formatNumber = num.toLocaleString()
```

## 防抖

```js
function debounce(fn, delay) {
  let timer = null;
  return function () {
    let args = arguments;
    let context = this
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay)
  }
}
const fn = debounce(function () {},250)
window.addEventListener('resize',fn)
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
  if (typeof obj !== 'object' || obj === null) {
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
copy.c.d = 5
console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
```
```js
const shallowCopy = (target) => {
  if (typeof target !== 'object' || target === null) {
    return target;
  }
  if(/^(Function|RegExp|Date|Map|WeakMap|Set|WeakSet)$/i.test(target.constructor.name)) return target
  const copy = Array.isArray(target) ? [] : {};
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      copy[key] = target[key];
    }
  }
  return copy;
}
const original = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
}
const copy = shallowCopy(original);
console.log(copy); // { a: 1, b: 2, c: { d: 3, e: 4 } }
copy.c.d = 5
console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
```

## 深拷贝

```js
let clone = function(obj){
  if(typeof obj !== 'object' || obj === null) return obj
  if(obj.constructor === Date) return new Date(obj)
  if(obj.constructor === RegExp) return new RegExp(obj)
  let newObj = new obj.constructor
  for( let key in obj){
      if(obj.hasOwnProperty(key)){
          let value = obj[key]
          newObj[key] = typeof value === 'object'?clone(value):value
      }
  }
  return newObj
}
let obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
}
let obj2 = clone(obj)
console.log(obj2) // { a: 1, b: 2, c: { d: 3, e: 4 } }
obj2.c.d = 5
console.log(obj) // { a: 1, b: 2, c: { d: 3, e: 4 } }
console.log(obj2);// { a: 1, b: 2, c: { d: 5, e: 4 } }
obj2.a = 10
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
}
const obj2 = JSON.parse(JSON.stringify(obj))
console.log(obj2) // { a: 1, b: 2, c: { d: 3, e: 4 } }
obj2.c.d = 5
console.log(obj) // { a: 1, b: 2, c: { d: 3, e: 4 } }
console.log(obj2) // { a: 1, b: 2, c: { d: 5, e: 4 } }
```

## New 操作符

```js
const myNew = (constructor, ...args) => {
  const newObj = Object.create(constructor.prototype);
  let res = constructor.apply(newObj, args);
  return Object.prototype.toString.call(res) === '[object Object]'? res: newObj;
};
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const person = myNew(Person, 'zhangsan', 18);
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
const person = myNew(Person, 'zhangsan', 18);
console.log(person); // { name: 'zhangsan', age: 18 }
```

## 柯里化

```js
function curry(fn){
  return function curried(...args){
    if(args.length >= fn.length){
      return fn.apply(this,args)
    }
    return function(...args2){
      return curried.apply(this,[...args,...args2])
    }
  }
}
function add(a,b,c){
  return a+b+c
}
const curriedAdd = curry(add)
console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1,2)(3)) // 6
```

## 使用Promise封装AJAX

```js
function PromiseAjax(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
      reject(new Error('Network Error'));
    };
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  });
}
PromiseAjax('https://jsonplaceholder.typicode.com/posts/1').then(data=>{
  console.log(data)
}).catch(error=>{
  console.log(error)
})
```

## 交换a和b的值，不能使用临时变量

```js
let a = 1;
let b = 10;

a = a + b
b = a - b
a = a - b
```
```js
let a = 1;
let b = 10;

[a, b] = [b, a]
```

## 数组元素求和

```js
for循环 // [!code ++]
function sum(arr) {
    let sum = 0;
    for(let num of arr){
        sum += num
    }
    return sum
}
```
```js
reduce // [!code ++]
function sum(arr) {
    return arr.reduce((acc,num) => acc + num,0)
}
```

## 数组扁平化

```js
使用flat // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
let flatArr = arr.flat(Infinity);
```
```js
使用递归 // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  let res = []
  for(let key of arr){
    if(Array.isArray(key)){
      res = res.concat(flatten(key))
    }else {
      res.push(key)
    }
  }
  return res
}
console.log(flatten(arr))
```
```js
使用正则 // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  const reg = /\[|\]/g;
  return JSON.stringify(arr)
    .replace(reg, '')
    .split(',')
    .map((item) => JSON.parse(item));
}
```
```js
使用reduce // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      return acc.concat(flatten(val));
    }else {
      return acc.concat(val);
    }
  },[])
}
```
```js
使用扩展运算符 // [!code ++]
let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
function flatten(arr) {
  while(arr.some(item => Array.isArray(item))){
    arr = [].concat(...arr)
  }
  return arr
}
```

## 实现add(1)(2)(3)

```js

function add(){
  let sum = 0
  function innerAdd(num){
    sum += num
    return innerAdd
  }
  innerAdd.toString = () => sum
  innerAdd.getResult = () => sum
  return innerAdd
}
console.log(add()(1)(2)(3).toString()); //6
console.log(add(1)(3)(3).getResult()); // 6
```

## 将类数组转为数组

```js
function toArray(arrLike){
  return Array.prototype.slice.call(arrLike)
}
```
```js
function toArray(arrLike){
  return Array.from(arrLike)
}
```
```js
function toArray(arrLike){
  return [...arrLike]
}
```

## 