// //全排列
// function permute(nums) {
//   const result = [];

//   const backtrack = (current, remaining) => {
//     // 如果没有剩余元素，说明当前排列已完成
//     if (remaining.length === 0) {
//       result.push(current);
//       return;
//     }

//     for (let i = 0; i < remaining.length; i++) {
//       // 选择第 i 个元素
//       const nextCurrent = [...current, remaining[i]];
//       // 递归选择剩余元素
//       const nextRemaining = remaining.filter((_, index) => index !== i);
//       backtrack(nextCurrent, nextRemaining);
//     }
//   };

//   backtrack([], nums);
//   return result;
// }

// // 示例使用
// const array = [1, 2, 3, 4];
// const permutations = permute(array);
// console.log(permutations);

// function getAllSort(numArr) {
//   let result = [];
//   function per(current, remain) {
//     if (remain.length === 0) {
//       result.push(current);
//       return;
//     }
//     for (let i = 0; i < remain.length; i++) {
//       const newCurrent = [...current, remain[i]];
//       const reaminNum = remain.filter((_, index) => index !== i);
//       per(newCurrent, reaminNum);
//     }
//   }
//   per([], numArr);
//   return result;
// }

// console.log(getAllSort([1, 2, 3]));

// console.log((2).constructor === Number);
// console.log(('').constructor === String);
// console.log((true).constructor === Boolean);
// console.log(({}).constructor === Object);
// console.log(([]).constructor === Array);
// console.log((function(){}).constructor === Function);
// const fn = function(){}
// fn.prototype = new Array();
// const f1 = new fn();
// console.log((fn).constructor); //[Function: Function]
// console.log((f1).constructor);//[Function: Array]
// console.log((fn).constructor === Function); //true
// console.log((fn).constructor === Array); //false
// console.log((f1).constructor === Function); //false
// console.log((f1).constructor === Array); //true

// console.log(Object.prototype.toString.call([]) === '[object Array]');
// console.log([].toString === Array.prototype.toString);
// console.log(Array.isArray([]));
// console.log([] instanceof Array);
// console.log(Array.prototype.isPrototypeOf([]));

// let str = [1,2,3]
// for(let key of str){
//   console.log(key);
// }

// function Person(name){
//   this.name = name;
// }

// Person.prototype = {
//   sayHello: function(){}
// }
// let p = new Person('zhangsan');

// console.log(p.__proto__);//{ sayHello: [Function: sayHello] }
// console.log(p.constructor);//[Function: Object]
// console.log(p.constructor.prototype);//[Object: null prototype] {}
// console.log(p.__proto__ === Person.prototype); //true
// console.log(p.__proto__.__proto__ === Object.prototype); //true
// console.log(p.constructor.prototype === Object.prototype);// true
// console.log(p.__proto__ === p.constructor.prototype); //false

// p.constructor = Person
// console.log(p.__proto__ === Person.prototype); //true
// console.log(p.__proto__ === p.constructor.prototype);//true
// console.log(p.__proto__.__proto__ === Object.prototype);//true
// console.log(p.constructor.prototype === Person.prototype); //true
// console.log(p.constructor.prototype.__proto__ === Object.prototype);// true

// for(var i=0;i<5;i++){
//     setTimeout((j)=>{
//       console.log(j);
//     },1000,i)
// }

// let obj = {
//   name:"zhangsan"
// }

// function fn(obj){
//   console.log(obj.name);
// }
// fn(obj)
// fn.call(this,{name:"lisi"})
// Function.prototype.myCall = function(context) {
//   let args = [...arguments].slice(1);
//   console.log('context', context);
//   context = context || window;
//   console.log('this', this);
//   context.fn = this;
//   let result = context.fn(...args);
//   delete context.fn;
//   return result;
// }

// fn.myCall(this,{name:"wangwu"})

// let createInstance = (function(){
//   let instance = null;
//   return function(name){
//     if(instance){
//       return instance;
//     }
//     this.name = name;
//     return instance = this
//   }
// })()

// createInstance.prototype.getName = function(){
//   console.log(this.name);
// }
// let instance1 = new createInstance('zhangsan');
// let instance2 = new createInstance('lisi');
// console.log(instance1 === instance2);
// instance1.getName()
// instance2.getName()

// class CreateInstance {
//   constructor(name) {
//     this.name = name;
//     if(CreateInstance.instance){
//       return CreateInstance.instance;
//     }
//     CreateInstance.instance = this
//   }
//   getName() {
//     console.log(this.name);
//   }
// }
// let instance3 = new CreateInstance('wangwu');
// let instance4 = new CreateInstance('zhaoliu');
// console.log(instance3 === instance4);
// instance3.getName()
// instance4.getName()

// const ObserveQueue = new Set()
// const observe = function(){
//   [...arguments].forEach(fn => ObserveQueue.add(fn))
// }

// const ObserveAble = obj => new Proxy(obj, {
//   set(target, key, value, receiver) {
//     const result = Reflect.set(target, key, value, receiver)
//     // 通知所有监听器
//     ObserveQueue.forEach(fn => fn())
//     return result
//   }
// })

// observe(function(){
//   console.log('监听器1触发')
// },function(){
//   console.log('监听器2触发')
// })
// const obj = ObserveAble({
//   name: 'zhangsan'
// })

// obj.name = 'lisi'
// //监听器1触发
// //监听器2触发

// function Subject(){
//   this.state = null;
//   this.observers = [];

//   this.getState = function(){
//     return this.state
//   }

//   this.notify = function(){
//     this.observers.forEach(observer => {
//       observer.update(this.state)
//     });
//   }

//   this.setState = function(state){
//     this.state = state;
//     this.notify()
//   }

//   this.addOberver = function(observer){
//     this.observers.push(observer)
//   }
// }

// function Observer(name,subject){
//   this.name = name
//   this.subject = subject
//   this.subject.addOberver(this)
//   this.update = function(state){
//     console.log(`${this.name}收到新状态`, state)
//   }
// }
// let subject = new Subject()
// let observer1 = new Observer('observer1',subject)
// let observer2 = new Observer('observer2',subject)

// subject.setState('new state')
// // observer1收到新状态 new state
// // observer2收到新状态 new state

// class Subject2 {
//   constructor() {
//     this.state = null;
//     this.observers = [];
//   }
//   getState() {
//     return this.state;
//   }
//   notify() {
//     this.observers.forEach(observer => {
//       observer.update(this.state);
//     });
//   }
//   setState(state) {
//     this.state = state;
//     this.notify();
//   }
//   addOberver(observer) {
//     this.observers.push(observer);
//   }
// }
// class Observer2 {
//   constructor(name, subject) {
//     this.name = name;
//     this.subject = subject;
//     this.subject.addOberver(this);
//   }
//   update(state) {
//     console.log(`${this.name}收到新状态`, state);
//   }
// }

// let subject2 = new Subject2();
// let observer3 = new Observer2('observer3', subject2);
// let observer4 = new Observer2('observer4', subject2);

// subject2.setState('new state2');
// // observer3收到新状态 new state2
// // observer4收到新状态 new state2

// class Observe {
//   caches = {}

//   on(eventName,fn){
//      this.caches[eventName] = this.caches[eventName] || []
//     this.caches[eventName].push(fn)
//   }

//   emit(eventName,data){
//     if(this.caches[eventName]){
//       this.caches[eventName].forEach(fn => fn(data))
//     }
//   }

//   off(eventName,fn){
//     if(this.caches[eventName]){
//       const newFns = fn?this.caches[eventName].filter(item => item!== fn):[]
//       this.caches[eventName] = newFns
//     }
//   }
// }

// const observe = new Observe()

// const fn1 = (data) => {
//   console.log('fn1',data)
// }
// const fn2 = (data) => {
//   console.log('fn2',data)
// }
// observe.on('click1',fn1)
// observe.on('click2',fn2)

// observe.emit('click1','data') // click1 data
// observe.off('click1',fn1)

// const filterFn = (arr) =>{
//   return arr.filter((item,index) => {
//     return arr.indexOf(item) === index
//   })
// }

// console.log(filterFn([1,1,1,2,2]));

// const reduceArr = (arr) =>{
//   return arr.reduce((acc,item) => {
//     if(!acc.includes(item)){
//       acc.push(item)
//     }
//     return acc
//   },[])
// }

// console.log(reduceArr([1,1,1,2,2]));

// const fn = (arr) => {
//   let res = []
//   for(let key of arr){
//     if(!res.includes(key)){
//       res.push(key)
//     }
//   }
//   return res
// }

// console.log(fn([1,1,1,2,2]));

// console.log([...new Set([1,2,3,3,4,5,5,6,6])]);
// let num = 123456789;

// let formatNumber = num.toLocaleString()

// console.log(formatNumber);

// function debounce(fn, delay) {
//   let timer = null;
//   return function () {
//     let args = arguments;
//     let context = this
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(context, args);
//     }, delay)
//   }
// }

// function throttle(fn, delay) {
//   let isThrottle = false;
//   return function () {
//     let args = arguments;
//     let context = this;
//     if (!isThrottle) {
//       fn.apply(context, args);
//       isThrottle = true;
//       setTimeout(() => {
//         isThrottle = false;
//       }, delay);
//     }
//   };
// }

function shallowCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  return Object.assign({}, obj);
}

// const original = {
//   a: 1,
//   b: 2,
//   c: {
//     d: 3,
//     e: 4,
//   },
// };
// const copy = shallowCopy(original);
// console.log(copy); // { a: 1, b: 2, c: { d: 3, e: 4 } }
// copy.c.d = 5
// console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
// copy.a = 10
// console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
// console.log(copy);

// const shallowCopy = (target) => {
//   if (typeof target !== 'object' || target === null) {
//     return target;
//   }
//   if(/^(Function|RegExp|Date|Map|WeakMap|Set|WeakSet)$/i.test(target.constructor.name)) return target
//   const copy = Array.isArray(target) ? [] : {};
//   for (let key in target) {
//     if (target.hasOwnProperty(key)) {
//       copy[key] = target[key];
//     }
//   }
//   return copy;
// }

// const original = {
//   a: 1,
//   b: 2,
//   c: {
//     d: 3,
//     e: 4,
//   },
// }

// const copy = shallowCopy(original);
// console.log(copy); // { a: 1, b: 2, c: { d: 3, e: 4 } }
// copy.c.d = 5
// console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
// copy.a = 10
// console.log(original); // { a: 1, b: 2, c: { d: 5, e: 4 } }
// console.log(copy);

// let clone = function(obj){
//   if(typeof obj !== 'object' || obj === null) return obj
//   if(obj.constructor === Date) return new Date(obj)
//   if(obj.constructor === RegExp) return new RegExp(obj)
//   let newObj = new obj.constructor
//   for( let key in obj){
//       if(obj.hasOwnProperty(key)){
//           let value = obj[key]
//           newObj[key] = typeof value === 'object'?clone(value):value
//       }
//   }
//   return newObj
// }

// let obj = {
//   a: 1,
//   b: 2,
//   c: {
//     d: 3,
//     e: 4,
//   },
// }

// let obj2 = clone(obj)
// console.log(obj2) // { a: 1, b: 2, c: { d: 3, e: 4 } }
// obj2.c.d = 5
// console.log(obj) // { a: 1, b: 2, c: { d: 3, e: 4 } }
// console.log(obj2);// { a: 1, b: 2, c: { d: 5, e: 4 } }
// obj2.a = 10
// console.log(obj); // { a: 1, b: 2, c: { d: 3, e: 4 } }
// console.log(obj2); // { a: 10, b: 2, c: { d: 5, e: 4 } }

// const obj = {
//   a: 1,
//   b: 2,
//   c: {
//     d: 3,
//     e: 4,
//   },
// }
// const obj2 = JSON.parse(JSON.stringify(obj))
// console.log(obj2) // { a: 1, b: 2, c: { d: 3, e: 4 } }
// obj2.c.d = 5
// console.log(obj) // { a: 1, b: 2, c: { d: 3, e: 4 } }
// console.log(obj2) // { a: 1, b: 2, c: { d: 5, e: 4 } }

// const myNew = (constructor, ...args) => {
//   // return Reflect.construct(constructor, args);
//   const newObj = Object.create(constructor.prototype);
//   let res = constructor.apply(newObj, args);
//   return Object.prototype.toString.call(res) === '[object Object]'
//     ? res
//     : newObj;
// };

// // class Person {
// //   constructor(name, age) {
// //     this.name = name;
// //     this.age = age;
// //   }
// // }

// function Person(name, age) {
//   this.name = name;
//   this.age = age;
// }

// const person = myNew(Person, 'zhangsan', 18);
// console.log(person); // { name: 'zhangsan', age: 18 }

// function curry(fn){
//   return function curried(...args){
//     if(args.length >= fn.length){
//       return fn.apply(this,args)
//     }
//     return function(...args2){
//       return curried.apply(this,[...args,...args2])
//     }
//   }
// }

// function add(a,b,c){
//   return a+b+c
// }

// const curriedAdd = curry(add)
// console.log(curriedAdd(1)(2)(3)) // 6
// console.log(curriedAdd(1,2)(3)) // 6

// function PromiseAjax(url, method = 'GET', data = null) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//     if (method === 'POST') {
//       xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     }
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//           resolve(xhr.responseText);
//         }
//         reject(new Error(xhr.statusText));
//       }
//     };
//     xhr.onerror = function () {
//       reject(new Error('Network Error'));
//     };
//     if (data) {
//       xhr.send(data);
//     } else {
//       xhr.send();
//     }
//   });
// }
// PromiseAjax('https://jsonplaceholder.typicode.com/posts/1').then(data=>{
//   console.log(data)
// }).catch(error=>{
//   console.log(error)
// })
// let a = 1;
// let b = 10;

// a = a + b
// b = a - b
// a = a - b

// let arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
// // function flatten(arr) {
// //   return arr.reduce((acc, val) => {
// //     if (Array.isArray(val)) {
// //       return acc.concat(flatten(val));
// //     }else {
// //       return acc.concat(val);
// //     }
// //   },[])
// // }
// function flatten(arr) {
//   while(arr.some(item => Array.isArray(item))){
//     arr = [].concat(...arr)
//   }
//   return arr
// }
// console.log(flatten(arr));
// function flatten(arr) {
//   const reg = /\[|\]/g;
//   return JSON.stringify(arr)
//     .replace(reg, '')
//     .split(',')
//     .map((item) => JSON.parse(item));
// }

// console.log(flatten(arr));

// function flatten(arr) {
//   let res = []
//   for(let key of arr){
//     if(Array.isArray(key)){
//       res = res.concat(flatten(key))
//     }else {
//       res.push(key)
//     }
//   }
//   return res
// }
// console.log(flatten(arr))
// [
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   [ 7, 8 ],
//   [ 5, 6, [ 7, 8 ] ],
//   [ 3, 4, [ 5, 6, [Array] ] ]
// ]

// function add(){
//   let sum = 0
//   function innerAdd(num){
//     sum += num
//     return innerAdd
//   }
//   innerAdd.toString = () => sum
//   innerAdd.getResult = () => sum
//   return innerAdd
// }
// console.log(add()(1)(2)(3).toString()); //6
// console.log(add(1)(3)(3).getResult()); // 6

// function toArray(arrLike){
//   return Array.prototype.slice.call(arrLike)
// }

// function toArray(arrLike){
//   return Array.from(arrLike)
// }

// function toArray(arrLike){
//   return [...arrLike]
// }

// function PromiseImg(url){
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => {
//       resolve(img)
//     }
//     img.onerror = () => {
//       reject(new Error('图片加载失败'))
//     }
//     img.src = url
//   })
// }
// PromiseImg('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png')
// .then(img=>{
//   document.body.appendChild(img)
// }).catch(error=>{
//   console.log(error)
// })

// const obj = [
//   {id:1,name:'Item1',parentId:null},
//   {id:2,name:'Item1.1',parentId:1},
//   {id:3,name:'Item1.2',parentId:1},
//   {id:4,name:'Item2',parentId:null},
//   {id:5,name:'Item2.1',parentId:4},
//   {id:6,name:'Item2.2',parentId:4},
// ]

// const buildTree = (data,parentId=null) => {
//   let tree = []
//   for(let item in data){
//     if(data[item].parentId === parentId){
//       const children = buildTree(data,data[item].id)
//       if(children.length){
//         data[item].children = children
//       }
//       tree.push(data[item])
//     }
//   }
//   return tree
// }

// console.log(buildTree(obj));

// function SetInterval(fn, time) {
//   let lastTime = Date.now();
//   let timer = null;
//   let isRunning = true;
//   function loop() {
//     let currentTime = Date.now();
//     if (isRunning) {
//       fn();
//       console.log(`时间差: ${currentTime - lastTime}ms`);
//       lastTime = currentTime;
//       const delayTime = Date.now()+time;
//       timer = setTimeout(loop, delayTime - Date.now());
//     }
//   }
//   timer = setTimeout(loop, time);
//   return () =>{
//     isRunning = false;
//     clearTimeout(timer)
//   }
// }
// const stopTimer = SetInterval(()=>{
//   console.log('hello');
// },2000)
// setTimeout(()=>{
//   stopTimer()
// },5000)

// function mySetInterval(fn, delay) {
//   let lastTime = Date.now()
//   fn()
//   let timer = setTimeout(()=>{
//     clearTimeout(timer)
//     const currentTime = Date.now()
//     const timeDiff = currentTime - lastTime
//     lastTime = currentTime
//     console.log(`时间差: ${timeDiff}ms`);
//     mySetInterval(fn,delay)
//   },delay)
// }

// mySetInterval(() => {
//   console.log('hello')
// },2000)

// function fibonacci(n) {
//   if(n<=1){
//     return n
//   }else {
//     return fibonacci(n-1)+fibonacci(n-2)
//   }
// }

// console.log(fibonacci(10));//5

// function fibonacci(n) {
//   let a = 0, b = 1, sum;
//   for(let i=2;i<=n;i++){
//     sum = a + b;
//     a = b;
//     b = sum;
//   }
//   return b
// }
// function fibonacci(n) {
//   let dp = new Array(n+1).fill(0)
//   dp[1] = 1
//   for(let i=2;i<=n;i++){
//     dp[i] = dp[i-1] + dp[i-2]
//   }
//   return dp[n]
// }
// console.log(fibonacci(10));//55

// function findMaxNoRepeatStrLength(str){
//   let maxLength = 0
//   let startIndex = 0; // 记录当前子串的起始位置
//   let set = new Set() // 记录当前子串中出现过的字符
//   for(let i=0;i<str.length;i++){
//     //滑动窗口右移
//     while(set.has(str[i])){
//       set.delete(str[i])
//       startIndex++;
//     }
//     set.add(str[i])
//     maxLength = Math.max(maxLength,i-startIndex+1)
//   }
//   return maxLength
// }

// console.log(findMaxNoRepeatStrLength('abcabcbb'));

// function twoSum(nums, target) {
//   let map = new Map()
//   for(let i=0;i<nums.length;i++){
//     let complement = target - nums[i]
//     if(map.has(complement)){
//       return [map.get(complement),i]
//     }
//     map.set(nums[i],i)
//   }
//   return []
// }
// console.log(twoSum([2,7,11,15],9)) // [0,1]

// function threeSum(nums, target) {
//   let res = [];
//   //首先要经过排序
//   nums.sort((a, b) => a - b);
//   for (let i = 0; i < nums.length - 2; i++) {
//     // 去除重复的元素
//     if (i > 0 && nums[i] === nums[i - 1]) {
//       continue; 
//     }
//     //双指针
//     let left = i + 1;
//     let right = nums.length - 1;
//     while (left < right) {
//       let sum = nums[i] + nums[left] + nums[right];
//       if (sum === target) {
//         res.push([nums[i], nums[left], nums[right]]);
//         left++;
//         right--;
//         // 去除重复的三数组合
//         while (left < right && nums[left] === nums[left - 1]) {
//           left++;
//         }
//         while (left < right && nums[right] === nums[right + 1]) {
//           right--;
//         }
//       } else if (sum < target) {
//         left++;
//       } else {
//         right--;
//       }
//     }
//   }
//   return res;
// }
// console.log(threeSum([-1,0,1,2,-1,-4], 0)); /// [[-1, -1, 2], [-1, 0, 1]]
// console.log(threeSum([-2,0,0,2,2], 0));// [[-2, 0, 2]]


// function findFirstNoRepeatCharIndex(str) {
//   let map = new Map()
//   for(let key of str){
//     if(map.has(key)){
//       map.set(key,map.get(key)+1)
//     }else {
//       map.set(key,1)
//     }
//   }
//   for(let i=0;i<str.length;i++){
//     if(map.get(str[i])===1){
//       return i
//     }
//   }
//   return -1
// }
// console.log(findFirstNoRepeatCharIndex('abcabcbbd')); // 8

// function findAllSortStr(str,temp=[],res=[]) {
//   if(temp.length===str.length){
//     res.push(temp.join(''))
//     return
//   }
//   for(let i=0;i<str.length;i++){
//     if(temp.includes(str[i])){
//       continue
//     }
//     temp.push(str[i])
//     findAllSortStr(str,temp,res)
//     temp.pop()
//   }
//   return res
// }
// console.log(findAllSortStr('abc')); // ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
// console.log(findAllSortStr('aaa')); // []



// function findAllSortStr(str) {
//   const res = [];
//   const count = {};  
//   for (let char of str) {
//     count[char] = (count[char] || 0) + 1;  // 统计每个字符的出现次数
//   }
  
//   function backtrack(temp) {
//     if (temp.length === str.length) {
//       res.push(temp.join(''));
//       return;
//     }
    
//     for (let char in count) {
//       if (count[char] > 0) {
//         temp.push(char);
//         count[char]--;  // 使用一个字符，减少其计数
//         backtrack(temp);
//         count[char]++;  // 回溯，恢复计数
//         temp.pop();     // 移除最后一个字符
//       }
//     }
//   }
  
//   backtrack([]);
//   return res;
// }

// console.log(findAllSortStr('abc')); // ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']



// function minParkingSpaces(times) {
//   const events = [];

//   // 将停车和离开的时间都记录为事件
//   times.forEach(time => {
//     events.push([time[0], 1]); // 停车事件
//     events.push([time[1], -1]); // 离开事件
//   });
//   console.log(events);
  
//   // 按时间排序，如果时间相同，停车事件优先
//   events.sort((a, b) => {
//     if (a[0] === b[0]) {
//       return a[1] - b[1]; // 停车(1) 优先级高于离开(-1)
//     }
//     return a[0] - b[0];
//   });
//   console.log(events);
  
//   let currentParking = 0; // 当前停车位占用数量
//   let maxParking = 0; // 最大占用停车位

//   // 遍历所有事件
//   events.forEach(event => {
//     currentParking += event[1];
//     maxParking = Math.max(maxParking, currentParking);
//   });

//   return maxParking;
// }

// const parkingTimes = [[0, 30], [5, 15], [20, 30],[0,40],[0,5],[5,10]];
// console.log(minParkingSpaces(parkingTimes)); // 输出 4

// function bubblesort(arr) {
//   let len = arr.length;
//   for(let i=0;i<len-1;i++){
//     for(let j=0;j<len-1-i;j++){
//       if(arr[j] > arr[j+1]){
//         let temp = arr[j];
//         arr[j] = arr[j+1];
//         arr[j+1] = temp;
//       }
//     }
//   }
//   return arr;
// }
// function selectSort(arr) {
//   let len = arr.length;
//   for(let i=0;i<len-1;i++){
//     let minIndex = i;
//     for(let j=i+1;j<len;j++){
//       if(arr[j] < arr[minIndex]){
//         minIndex = j;
//       }
//     }
//     let temp = arr[i];
//     arr[i] = arr[minIndex];
//     arr[minIndex] = temp;
//   }
//   return arr;
// }
// console.log(selectSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]


// function quickSort(arr) {
//   let len = arr.length
//   for(let i=0;i<len-1;i++){
//     let minMaxIndex = i
//     for(let j=i+1;j<len-1;j++){
//       if(arr[j]<arr[minMaxIndex]){
//         minMaxIndex = j
//       }
//     }
//     let temp = arr[i]
//     arr[i] = arr[minMaxIndex]
//     arr[minMaxIndex] = temp
//   }
//   return arr
// }
// console.log(quickSort([3, 4, 1, 5, 2]));

// function insertSort(arr) {
//   let len = arr.length;
//   for(let i=1;i<len;i++){
//     let temp = arr[i];
//     let j = i-1;
//     while(j>=0 && arr[j]>temp){
//       arr[j+1] = arr[j];
//       j--;
//     }
//     arr[j+1] = temp;
//   }
//   return arr;
// }
// console.log(insertSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]


// function insertSort(arr){
//   let len = arr.length;
//   for(let i=1;i<len;i++){
//     let temp = arr[i]
//     let j = i-1;
//     while(j>=0 && arr[j]>temp){
//       arr[j+1] = arr[j]
//       j--
//     }
//     arr[j+1] = temp
//   }
//   return arr;
// }
// console.log(insertSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]

// function quickSort(arr) {
//   let len = arr.length;
//   if(len<=1){
//     return arr;
//   }
//   let pivot = arr[Math.floor(len/2)];
//   let left = [];
//   let right = [];
//   for(let i=0;i<len;i++){
//     if(arr[i]<pivot){
//       left.push(arr[i]);
//     }else if(arr[i]>pivot){
//       right.push(arr[i]);
//     }
//   }
//   return quickSort(left).concat(pivot,quickSort(right));
// }
// console.log(quickSort([3, 4, 2, 5, 1])); // [1, 2, 3, 4, 5]


// function breadthFirstSearch(root) {
//   if(root === null){
//     return 
//   }
//   const queue = [root];
//   while(queue.length){
//     const node = queue.shift();
//     console.log(node.val);
//     for(let child of node.children){
//       queue.push(child);
//     }
//   }
// }

// const root = {
//   val: 1,
//   children: [
//     {
//       val: 2,
//       children: [
//         {
//           val: 4,
//           children: []
//         },
//         {
//           val: 5,
//           children: []
//         }
//       ]
//     },
//     {
//       val: 3,
//       children: [
//         {
//           val: 6,
//           children: []
//         },
//         {
//           val: 7,
//           children: []
//         }
//       ]
//     }
//   ]
// }
// breadthFirstSearch(root); // 1 2 3 4 5 6 7


// function findNodes(tree,fn){
//   const res =  []
//   function traverse(node){
//     if(fn(node)){
//       res.push(node)
//     }
//     for(const child of node.children){
//       traverse(child)
//     }
//   }
//   traverse(tree)
//   return res
// }
// const tree = {
//   val: 1,
//   children: [
//     {
//       val: 2,
//       children: [
//         {
//           val: 4,
//           children: []
//         },
//         {
//           val: 5,
//           children: []
//         }
//       ]
//     },
//   ]
// }
// const vertifyNode = node => node.val === 4

// console.log(findNodes(tree,vertifyNode));



// Object.prototype[Symbol.iterator] = function*() {
//   let index = 0;
//   let arr = Object.entries(this);

  
//   let length = arr.length;
//   while (true) {
//       if (index >= length) {
//           return false
//       } else {
//           let key = arr[index] && arr[index][0];
//           let val = arr[index] && arr[index][1];
//           let result = { [key]: val };
//           index++;
//           yield result 
//       }
//   }
// }

// const obj = {
//   name: 'zhangsan', 
//   age: 18,
//   city: 'beijing'
// }
// for (let key of obj) {
//   console.log(key); //{ name: 'zhangsan' } { age: 18 } { city: 'beijing' }
// }

// let  arrlike = {
//   0:'a',
//   1:'b',
//   2:'c',
//   length:3
// }
// arrlike[Symbol.iterator] = function(){
//   let index = 0;
//   return {
//       next:()=>{
//           if(index < this.length){
//               const result = {value:this[index],done:false}
//               index++;
//               return result
//           }else {
//               return {value:undefined,done:true}
//           }
//       }
//   }
// }

// for(let item of arrlike){
//   console.log(item)
// }
// const iter = arrlike[Symbol.iterator]()
// console.log(iter.next());

// const imgList = [...document.querySelectorAll('img')]

// var io = new IntersectionObserver((entries) =>{
//   entries.forEach(item => {
//     // isIntersecting是一个Boolean值，判断目标元素当前是否可见
//     if (item.isIntersecting) {
//       item.target.src = item.target.dataset.src
//       // 图片加载后即停止监听该元素
//       io.unobserve(item.target)
//     }
//   })
// }, {
//   root: document.querySelector('.root')
// })
// // observe遍历监听所有img节点
// imgList.forEach(img => io.observe(img))


// function isTrueTree(arr){
//   if(arr.length === 0){
//     return true
//   }
//   let rootValue = arr[0]
//   let leftTree = []
//   let rightTree = []
//   for(let i=1;i<arr.length;i++){
//     if(arr[i] < rootValue){
//       leftTree.push(arr[i])
//     }else {
//       rightTree.push(arr[i])
//     }
//   }
//   return (isTrueTree(leftTree) && isTrueTree(rightTree) && rightTree.every(item => item > rootValue))
// }
// console.log(isTrueTree([8,5,17,10,12])) 
// console.log(isTrueTree([8,5,10,1,7,12]))


// function findMaxProfit(prices,fee) {
//   if(prices.length <= 1){
//     return 0
//   }
//   let maxProfit = 0 // 最大利润
//   let holdProfit = -prices[0] // 持有股票的最大利润
//   for(let i=1;i<prices.length;i++){
//     maxProfit = Math.max(maxProfit,holdProfit + prices[i] - fee) // 计算卖出股票的最大利润
//     holdProfit = Math.max(holdProfit,maxProfit   - prices[i]) // 计算持有股票的最大利润
//   }
//   return maxProfit
// }
// console.log(findMaxProfit([1,3,2,8,4,9],2)) // 8

function maxSildingWindow(arr,k){
  let res = []
  let deque = []
  function removeOUtdated(index){
    while(deque.length && deque[0] <= index - k){
      deque.shift()
    }
  }
  function maintainDeque(index){
    while(deque.length && arr[index] > arr[deque[deque.length - 1]]){
      deque.pop()
    }
  }
  for(let i=0;i<arr.length;i++){
    removeOUtdated(i)
    maintainDeque(i)
    deque.push(i)
    if(i >= k-1){
      res.push(arr[deque[0]])
    }
  }
  return res
}
console.log(maxSildingWindow([1,3,-1,-3,5,3,6,7],3))