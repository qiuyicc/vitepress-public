# JS

## JS数组类型

1. undefined,Null,Boolean,Number,String,Symbol,BigInt,Object
2. Symbol类型是ES6新增的数据类型，可以用来创建独一无二的标识符,解决全局变量冲突问题。
3. BigInt类型是ES10新增的数据类型，可以用来表示任意精度的整数，可以用于任意大的整数运算。
4. 栈:原始类型(undefined,Null,Boolean,Number,String),堆：引用类型(对象、数组、函数，Symbol,BigInt)，在栈中存储指针，该指针指向堆中该实体的起始地址。
5. 栈区：内存由编译器自动分配释放，粗放函数的值、参数值等；
6. 堆区：内存由开发者分配释放，若开发者不释放，程序结束时可能由操作系统回收；

## 数据的检测方式

1. typeof：检测基本数据类型，数组、对象、null都会被判断为object；
2. instanceof：检测对象类型，可以检测对象是否属于某个类,运行机制是判断对象的原型链是否指向该类原型；instanceof只能判断对象类型，不能判断基本数据类型，因为基本数据类型没有原型链；
3. constructor：检测对象构造函数，可以判断基本类型和引用类型，但要注意如果改变了一个对象的原型，就不能准确判断
```js
console.log((2).constructor === Number);
console.log(('').constructor === String);
console.log((true).constructor === Boolean);
console.log(({}).constructor === Object);
console.log(([]).constructor === Array);
console.log((function(){}).constructor === Function);

const fn = function(){}
fn.prototype = new Array();
const f1 = new fn();
console.log((fn).constructor); //[Function: Function]
console.log((f1).constructor);//[Function: Array]
console.log((fn).constructor === Function); //true
console.log((fn).constructor === Array); //false
console.log((f1).constructor === Function); //false
console.log((f1).constructor === Array); //true
```
4. Object.prototype.toString.call()：可以检测任意类型的数据，返回一个字符串，其中包含了该数据的类型信息，如"[object Array]"。注意Array，function等类型都重写了toString()方法，要得到正确的类型信息，需要使用原生Object.prototype.toString.call()方法。
```js
console.log(['1'].toString()); // "1"
console.log(Object.prototype.toString.call([])) // "[object Array]"
console.log(function(){}.toString()) // "function(){}"
console.log(Object.prototype.toString.call(function(){})); // "[object Function]"
```

## 判断数组的方式

1. Object.prototype.toString.call()
```js
Object.prototype.toString.call([]) === '[object Array]'
```
2. 原型链判断
```js
[].toString === Array.prototype.toString
```
3. Array.isArray()
4. instanceof
5. Array.prototype.isPrototypeOf()

## JS中的this

this执行上下文中的一个属性，指向最后调用这个方法的对象
1. 函数调用，当函数不是一个对象的属性，直接作为函数调用时，this指向全局对象window；
2. 方法调用，，如果一个函数作为对象的方法调用，this指向该对象；
3. 构造器调用模式，如果一个函数使用new关键字调用，this指向新创建的对象；
4. apply、call、bind，改变this指向，改变this指向后
5. 构造器调用模式优先级最高，然后是apply、call、bind，然后是方法调用，最后是函数调用；

## 箭头函数和普通函数的区别

1. 箭头函数比普通函数简洁，如果没有参数，可以省略括号；
2. 如果只有一个参数，可以省略括号，如果函数体只有一行，可以省略大括号，return可以省略
3. 箭头函数没有自己的this，继承外层作用域的this
4. 箭头函数继承来的this永远不会改变，apply、call、bind不会改变箭头函数的this指向
5. 箭头函数不能作为构造函数使用
6. 箭头函数没有arguments对象
7. 箭头函数没有prototype
8. 箭头函数不能使用Generator函数，不能使用yield关键字

## AMD和CommonJS的区别

AMD(Asynchronous Module Definition)异步模块定义，CommonJS(CommonJS Modules/1.0)模块规范，commonjs是同步的，而AMD是异步的。

## ES6和CommonJS的区别

1. CommonJS是对模块的浅拷贝，ES6是对模块的引用，ES6值只读，不能改变其指针指向
2. import的接口是read-only，不能修改其变量值，即不能修改变量的指针指向，但是内部的变量是可以修改的；

## let const var的区别

1. 块级做作用域，var没有块级作用域，块级作用域解决了内层变量可能覆盖外层变量的问题和用来计数的循环变量泄露为全局变量的问题
2. 变量提升。var存在变量提升，let和const不存在
3. 重复声明，var变量允许重复声明，let和const不允许重复声明
4. 暂时性死区，在使用let、const声明变量之前，不能使用该变量，否则会报错
5. 初始值设置，var、let可以不用设置初始值，而const声明的变量必须设置初始值
6. 指针指向，let、var可以改变指针指向，const不行

## 数组原生方法

字符串转换方法：toString()、toLocalString()、join()
数组操作方法：pop()、push()、shift()、unshift()、splice()、slice()、concat()、reverse()、sort()、map()、filter()、reduce()、forEach()、some()、every()

## 数组的遍历方法

1. forEach，不改变原数组，无返回值，不能改变当前元素的地址值，如果当前元素是一个引用对象，其内部的值是可以改变的
2. map，不改变当前数组，返回新数组；
3. filter，不改变原数组，返回过滤后的新数组
4. for...of，返回数组的元素、对象的属性值，不能遍历普通的对象，将异步循环变为同步循环
5. every和some
6. find和findIndex
7. reduce和reduceRight，一个正序，一个逆序

## 原型和原型链

在JS中，通过构造函数来新建一个对象，每一个构造函数内部都有一个prototype属性，这个属性是一个对象，包含了可以由该构造函数实例化的对象的原型，而实例对象都可以通过__proto__属性来访问原型对象，原型对象也可能有自己的原型，这样一层一层地连接起来，就构成了原型链，这样一直向上查找就可以找到Object，这也是为什么新建对象可以访问toString()等方法的原因，Object的原型链的末端是null。JS对象是通过引用来传递的，当修改原型时，与之相关的的对象也会改变。

## for...in...循环和for...of...循环的区别

1. for...of是ES6新增的遍历方式，允许遍历一个含有iterator接口的数据结构，并返回各项的值；
2. for...of遍历获取的是对象的键值，for...in遍历获取的是对象的键名
3. for...in会遍历对象整个原型链，性能比较差，不建议使用；
4. 对于数组的遍历，for...in会返回数组中所有可枚举的属性，包括原型链上的，for...of只返回数组对应的下标属性值
5. for...in主要是为了遍历对象，for...of可以用来遍历数组、对象、字符串、Set、Map以及Generator对象等。


## 原型修改和重写

```js{5-7}
function Person(name){
  this.name = name;
}

Person.prototype = {
  sayHello: function(){} //注意此时改写了prototype为普通对象
}
let p = new Person('zhangsan');

console.log(p.__proto__);//{ sayHello: [Function: sayHello] }
console.log(p.constructor);//[Function: Object]
console.log(p.constructor.prototype);//[Object: null prototype] {}
console.log(p.__proto__ === Person.prototype); //true
console.log(p.__proto__.__proto__ === Object.prototype); //true
console.log(p.constructor.prototype === Object.prototype);// true
console.log(p.__proto__ === p.constructor.prototype); //false
--------------------------------------------------------------------------
p.constructor = Person //指回原来的构造函数 // [!code ++]
console.log(p.__proto__ === Person.prototype); //true
console.log(p.__proto__ === p.constructor.prototype);//true
console.log(p.__proto__.__proto__ === Object.prototype);//true
console.log(p.constructor.prototype === Person.prototype); //true
console.log(p.constructor.prototype.__proto__ === Object.prototype);// true
```

## 获取对象非原型链上的属性

```js
function getProps(obj){
    let arr = [];
    for(let key in obj){
        if(hasOwnProperty(key)){
            arr.push(key+':'+obj[key])
        }
    }
    return arr
}
```

## 对闭包的理解

闭包：闭包指有权访问另一个函数作用域中变量的函数，创建闭包最常见的方式是在一个函数内部再创建一个函数，通过这个内部函数访问外部函数的变量，就创建了闭包。  
闭包的两个用途：
1. 闭包可以让我们在函数外部访问函数内部的变量，可以使用这种方法来创建私有变量；
2. 使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包函数保留了这个变量对象的引用，所以它并没有被垃圾回收机制回收。

解决循环变量泄露为全局变量的问题：

```js
for(var i=0;i<5;i++){
    setTimeout(function(){
        console.log(i);//5 5 5 5 5
    },1000)
}
```
1. 第一种解决方式：使用立即执行函数表达式(IIFE),闭包解决
```js
for(var i=0;i<5;i++){
  (function(j){
    setTimeout(()=>{
      console.log(j) // 0 1 2 3 4
    },1000)
  })(i)
}
```
2. 第二种解决方式：使用let关键字声明变量
```js
for(let i=0;i<5;i++){
    setTimeout(function(){
        console.log(i);//0 1 2 3 4
    },1000)
}
```
3. 第三种解决方式，将参数传入setTimeout第三个参数
```js
for(var i=0;i<5;i++){
    setTimeout((j)=>{
      console.log(j);
    },1000,i)
}
```

## 对作用、作用域链的理解

全局作用域：
1. 最外层函数和最外层函数外面定义的变量拥有全局作用域；
2. 所有未定义直接赋值的变量自动声明为全局作用域；
3. 所有window对象的属性拥有全局作用域
4. 过多的全局作用变量会污染全局命名空间，造成命名冲突，不利于代码的维护和管理。

函数作用域：
1. 函数作用域是声明在函数内部的变量，一般只有函数内部的代码片段才可以访问的到
2. 作用域是分层的，内层可以访问外层，反之不行

块级作用域：
1. 使用ES6新增的let和const指令可以声明块级作用域，块级作用域可以嵌套在函数中创建或者在一个代码块片段中创建{}

作用域链：在当前作用域中查找所需变量，找不到就向上一级作用域查找，直到全局作用域，如果全局作用域中也没有找到，则报错。作用域链的本质是一个指向对象的指针列表，变量对象一个包含了执行环境中所有变量和函数的对象，作用域链的前端当前执行上下文的变量对象，全局执行上下文处于末端

## 执行上下文

1. 全局执行上下文，任何不在函数内部的代码都在全局作用域中运行，会创建一个window对象，并且设置this的值等于这个全局对象，一个程序只有一个全局执行上下文；
2. 函数执行上下文，一个函数被调用时，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个
3. eval函数执行上下文，如果在全局作用域中调用 eval，则在 eval 中执行的代码会在全局上下文中执行。如果在一个函数内部调用 eval，那么 eval 中执行的代码会在该函数的执行上下文中执行。

4. 执行上下文栈：当代码在执行时，首先会创建一个全局执行上下文，并压入执行栈，没遇到一个函数调用，就为该函数创建一个新的执行上下文，并压入执行栈，当函数执行完毕，该上下文会从执行栈中弹出，当所有代码执行完毕后，全局执行上下文也会从执行栈中弹出。
5. 创建执行上下文：
   1. 创建阶段：
      1. this绑定：
         1. 在全局上下文中，this执行全局对象；在函数执行上下文中，
         2. this取决于函数如何调用，this有可能是引用对象、全局对象、undefined
      2. 创建词法环境组件：
         1. 词法环境是一种有标识符——变量映射的数据结构，标识符指变量/函数名，变量实际上是对实际对象或原始数据的引用；
         2. 词法环境内部有两个组件：环境记录器，用来存储变量和函数声明的实际位置；外部环境引用，指向外部环境的引用
      3. 创建变量环境组件
   2. 执行阶段，完成对变量的分配等工作

## 异步编程的实现方式

1. 回调函数：缺点，多个回调函数嵌套会造成回调地狱，代码耦合度太高，可读性差；
2. Promise，使用Promise的方式可以将嵌套的回调函数进行链式调用，但是也会造成多个then的链式调用
3. generator，可以在函数执行的过程中，将函数的执行权转移出去，在函数外部还可以转移回来。因此当遇到异步函数的时候可以将函数的执行权转移出去，等到异步函数执行完毕后再将控制权转移回来。在generator内部，可以用同步的方式书写，只需要考虑何时将执行权转移出去和转移回来。
4. async/await，async/await是generator和promise的语法糖，内部自带执行器，当遇到await时，语句会返回一个promise对象，函数会等待promise对象状态变成resolve之后才会继续执行，因此可以将异步操作写成同步的形式。

## SetTimeout、Promise、Async/Await的执行顺序

1. SetTimeout是全局函数，可以将函数推迟到指定的时间执行，但是不推荐使用，因为它无法保证函数的执行顺序；
```js
console.log('time start')
setTimeout(() => {
    console.log('time')
})
console.log('time end')
// time start
// time end
// time
```
2. Promise本身是同步的立即执行函数，但当executor函数执行resolve或reject的时候，此时是异步操作，会先执行then/catch等，当主栈完成后，才会区调用resolve或者reject中的方法执行.promise.then()是一个回调task，promise是resolved或者reject时，这个task会放入当前事件循环回合的microtask queue中，如果是pending，这个task会被放入事件循环的未来某个可能的microtask queue中。
```js
console.log('time start');
let p = new Promise((resolve, reject) => {
console.log('promise start');
resolve()
console.log('promise end');
})
p.then(() => {
console.log('promise then start');
})
setTimeout(() => {
console.log('setTimeout start');
})
console.log('time end');
// time start
// promise start
// promise end
// promise then start
// time end
//setTimeout start
```
3. async返回一个Promise对象，当函数执行的时候，遇到await就会先返回，等到异步操作完成后，才会继续执行。await后面可以跟一个Promise对象，等待Promise的返回结果
```js
async function f1(){
return 1
}
console.log(f1() instanceof Promise);// true
console.log(f1());//Promise {<fulfilled>: 1}
f1().then(res=>{
console.log(res); // 1
})
```
```js
async function f2() {
console.log('f2 start');
await new Promise((resolve, reject) => {
    console.log('await promise start');
    resolve('test');
    console.log('await promise end');
})
.then((data) => {
    console.log('await promise then ' + `${data}`);
})
.then(()=>{
    console.log('await promise next then');
})    
console.log('f2 end');
}
f2();
// f2 start
// await promise start
// await promise end
// await promise then test
// await promise next then
// f2 end
```

## Promise.all()和Promise.race()的区别

1. Promise.all()是当所有Promise都resolve或reject的时候才会resolve，只要有一个失败就会reject；成功的时候返回一个数组，失败的原因是第一个失败的Promise的原因；Promise.all()接收一个数组，返回的也是一个数组，并且返回的结果在数组里面也是一一顺序排列好的，但是他们的执行顺序是不确定的；
2. Promise.race()接收的也是一个promise实例数组，但是只要有一个Promise resolve或reject，就立即resolve或reject；可以应用在超时处理，比如某个请求超时，可以用Promise.race()来处理；

## await/async的理解

await/async是Generator和Promise的语法糖，它能实现的效果都可以用then链来实现，它是为优化then链而开发出来的。
1. async返回一个promise对象，async 函数语句、函数表达式、Lambda表达式(箭头函数)
2. 如果在函数中返回一个直接量，那么async会把这个直接量通过Promise.resolve()包装成一个promise对象
3. async返回一个promise，最外层不能使用await获取其值，可以使用then链
4. await只能出现在async函数中
5. 如果async没有返回值，返回Promise.resolve(undefined)
6. Promise.resolve(xxx)可以看作new Promise(resolve => resolve(xxx))的语法糖

## 垃圾回收机制

JS具有自动回收垃圾的机制，当变量不再被引用时，会被自动回收。
1. 标记清除，当变量进入这个执行环境，就标记这个变量“进入环境”，被标记的变量是不能被回收的，当变量离开环境，就会被标记为“离开环境”，被标记的变量会被回收。
2. 引用计数，跟踪每个值被引用的次数，当声明一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数+1，如果包含这个值的引用取得了另一个值，则这个值-1，当引用次数为0，则回收这个值。
但是这个方法会有循环引用问题。  
减少垃圾回收：
1. 虽然浏览器可以自动进行垃圾回收机制，但是当代码量比较庞大时，垃圾回收的代价也比较大，应该尽量减少垃圾回收，优化代码
2. 对数组优化，当清空一个数组时，最简单的是直接赋值一个空[]，但是会创建另一个空对象，可以将数组的长度length设置为0
3. 对object优化，对对象应该尽量复用，对不用的对象应该设置为null
4. 对函数优化，在循环中的函数表达式和变量，如果可以复用，应该尽量放在函数外部


## 内存泄露

1. 意外的全局变量，由于使用未声明的变量，意外地创建了一个全局变量，而使这个变量一直留在内存中无法回收
2. 被遗忘的计时器或回调函数，设置了setInterval或setTimeout，但没有清除，如果循环函数或有对外部函数的引用的化，那么这个变量会一直留在内存中，造成内存泄露
3. 脱离DOM的引用，获取一个DOM元素的引用，而后这个元素被删除，由于保留了对这个元素的引用，所以它也无法被回收
4. 闭包，不合理的闭包，导致某些变量一直被留在内存中，造成内存泄露


## ES6新特性

1. 箭头函数
2. 解构
3. 模板字符串
4. promise
5. Symbol，BigInt
6. let、const
7. export、import
8. class
9. for...of
10. 扩展运算符
11. Map、Set、WeakMap、WeakSet
12. Proxy、Reflect
13. 默认参数

## 匿名函数的应用场景

1. IIFE，封装私有变量
```js
(function(){})()
```
2. 使用在setTimeout、setInterval、addEventListener、removeEventListener等一次性函数中
```js
setTimeout(function(){})
```
3. 匿名函数用于函数式编程或回调函数
```js
arr.map(function(){})
```

## js设计模式

1. 创建型模式：工厂方法模式，抽象工厂模式，单例模式，建造者模式，原型模式
2. 结构型模式：适配器模式、装饰器模式、代理模式、外观、桥接、组合、享元模式
3. 行为型模式，策略模式，模板方法模式、观察者模式/发布订阅模式......

## 观察者和发布订阅模式区别

1. 观察者模式里面，只有两个角色，观察者和别观察者；发布订阅模式有发布者、订阅者和中介者
2. 观察者和被观察者是松耦合关系，发布订阅模式不存在耦合
3. 观察者模式多应用于单个应用内部，发布订阅模式则更多的是一种跨应用的模式  

## 实现柯里化

```js
function curry(fn) {
  if (fn.length === 0) {
    return fn;
  }
  function curried(depth, args) {
    return function (newArgument) {
      if (depth - 1 === 0) {
        return fn(...args, newArgument);
      }
      return curried(depth - 1, [...args, newArgument]);
    };
  }
  return curried(fn.length, []);
}
function add(a, b) {
  return a + b;
}
const curriedAdd = curry(add);
const addFive = curriedAdd(5);
let result = [0, 1, 2, 3, 4, 5].map(addFive);
```




## 实现call
```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}
```

## 实现apply

```js
Function.prototype.myApply = function (context) {
    context = context || window;
    context.fn = this;
    let result;
    let args = Array(arguments)[0][1];
    // let args = [...arguments][1]
    context.fn(...args);
    delete context.fn;
    return result;
};
```

## 实现bind

需要进行instanceof判断，如果直接调用bind返回的新函数，那么它的 this 就是 context，如果通过 new 关键字调用这个函数（即作为构造函数调用），那么 this 应当指向新创建的对象（也就是实例的 this）
```js
Function.prototype.myBind = function (context) {
    context = context || window;
    let args = [...arguments].slice(1);
    let fn = this;
    return function Fn() {
        return fn.apply(
        this instanceof Fn ? this : context,
        args.concat([...arguments])
        );
    };
};
```

## 实现单例模式

```js
let createInstance = (function(){
  let instance = null;
  return function(name){
    if(instance){
      return instance;
    }
    this.name = name;
    return instance = this
  }
})()

createInstance.prototype.getName = function(){
  console.log(this.name);
}
let instance1 = new createInstance('zhangsan');
let instance2 = new createInstance('lisi');
console.log(instance1 === instance2); // true
instance1.getName() // zhangsan
instance2.getName() // zhangsan
```
```js
class CreateInstance {
  constructor(name) {
    this.name = name;
    if(CreateInstance.instance){
      return CreateInstance.instance;
    }
    CreateInstance.instance = this
  }
  getName() {
    console.log(this.name);
  }
}
let instance3 = new CreateInstance('wangwu');
let instance4 = new CreateInstance('zhaoliu');
console.log(instance3 === instance4); //true
instance3.getName() // wangwu
instance4.getName() // wangwu
```

## 实现观察者模式

```js
const ObserveQueue = new Set()
const observe = fn => ObserveQueue.add(fn)
const ObserveAble = obj => new Proxy(obj, {
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    // 通知所有监听器
    ObserveQueue.forEach(fn => fn())
    return result
  }
})
observe(function(){
  console.log('监听器1触发')
})
observe(function(){
  console.log('监听器2触发')
})
const obj = ObserveAble({
  name: 'zhangsan'
})

obj.name = 'lisi'
//监听器1触发
//监听器2触发
```
```js
function Subject(){
  this.state = null;
  this.observers = [];
  
  this.getState = function(){
    return this.state
  }

  this.notify = function(){
    this.observers.forEach(observer => {
      observer.update(this.state)
    });
  }

  this.setState = function(state){
    this.state = state;
    this.notify()
  }

  this.addOberver = function(observer){
    this.observers.push(observer)
  }
}

function Observer(name,subject){
  this.name = name
  this.subject = subject
  this.subject.addOberver(this)
  this.update = function(state){
    console.log(`${this.name}收到新状态`, state)
  }
}
let subject = new Subject()
let observer1 = new Observer('observer1',subject)
let observer2 = new Observer('observer2',subject)

subject.setState('new state')
// observer1收到新状态 new state
// observer2收到新状态 new state
```

## 实现发布订阅模式
```js
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
```


