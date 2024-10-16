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


class Observe {
  caches = {}

  on(eventName,fn){
     this.caches[eventName] = this.caches[eventName] || []
    this.caches[eventName].push(fn)
  }

  emit(eventName,data){
    if(this.caches[eventName]){
      this.caches[eventName].forEach(fn => fn(data))
    }
  }

  off(eventName,fn){
    if(this.caches[eventName]){
      const newFns = fn?this.caches[eventName].filter(item => item!== fn):[]
      this.caches[eventName] = newFns
    }
  }
}

const observe = new Observe()

const fn1 = (data) => {
  console.log('fn1',data)
}
const fn2 = (data) => {
  console.log('fn2',data)
}
observe.on('click1',fn1)
observe.on('click2',fn2)

observe.emit('click1','data') // click1 data
observe.off('click1',fn1)



