# TS 再学习

以前学过，这回记记笔记，语雀虽然方便，但还是写在网站上好了

## 安装 TS

```js
    npm install -g typescript //全局安装
```

安装完成之后生成全局命令 tsc

```js
tsc - v; //查看版本
```

::: code-group

```js [test.ts]
const h = (name) =>{
    return `hello ${name}`
}
h("world")
可以使用tsc test.ts //编译项目，编译完成为一个js文件
```

:::

## 类型声明

### 基础类型

```ts
let a: number = 10;
let b: string = "hello";
let c: boolean = true;
let d: undefined = undefined;
let e: null = null;
let f: any = "hello"; //any类型，可以赋值任意类型,不进行类型检查
let g: unknown = "hello"; //unknown类型，可以赋值任意类型，会进行类型检查
```

### 数组类型

```ts
let a: number[] = [1, 2, 3]; //定义一个数字数组
let b: string[] = ["hello", "world"]; //定义一个字符串数组
```

```ts
let c: [string, number] = ["hello", 10]; //定义一个元组类型，包含两个类型
c.push("world"); //可以往元组中添加元素,但只能是对应元组类型的元素
```

### 对象类型

使用 Interface 定义对象类型

```ts
interface Person {
    readonly id: number;//只读属性
    name: string;
    age: number;
    hobbies?: string[];//？表示可选属性
}
let zhangsan: Person = {
    id:1,
    name: "张三",
    age: 20
}
zhangsan.id = 2; // 报错，id是只读属性
与const的区别：const定义的是变量，readonly定义的是属性
```

### 函数类型

```ts
function add(x: number, y: number, z?: number): number {
  return x + y + (z || 0);
}
let result = add(1, 2);
let add2: (x: number, y: number, z?: number) => number = add; //函数类型
Interface IsSum {
    (x: number, y: number, z?: number): number;//Interface定义函数类型
}
let add3: IsSum = add;
```

```ts
const add: (x: number, y: number, z?: number) => number = (x, y, z) => x + y + (z || 0); //箭头函数
ts可以自动推导参数类型，add被推导为(x: number, y: number, z?: number) => number类型
```

### 联合类型

```ts
let unionType: string | number = "hello"; //联合类型
function getLength(input: string | number): number {
  const s = input as string; //类型断言
  if (s.length) {
    return s.length;
  } else {
    return (input as number).toString().length;
  }
}
//使用typeof guards进行类型保护
function getLength(input: string | number): number {
  if (typeof input === "string") {
    return input.length;
  } else {
    return input.toString().length;
  }
}
```

### 枚举类型

::: code-group

```ts [test.ts]
enum Direction {
    "Up",//0
    "Down",//1
    "Left",//2
    "Right"//3
}
console.log(Direction.Up); // 0
console.log(Direction[0]); // "Up"
//const enum 定义常量枚举类型，不是所有的枚举都能作为常量枚举类型，比如包含计算属性的枚举
```

```ts [test.js]
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
//Direction[Direction["Up"] = 0] === Direction[0] = "Up";
//利用了赋值之后的返回值是该值的特性，来实现枚举特性
```

:::

### 泛型

#### 泛型基础
```ts
function echo<T>(input: T) {
  return input;
}
const result = echo("hello"); //泛型

function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];//交换
}
const result2 = swap([1, "hello"]); //泛型
result2[0].length; //类型推断
result2[1].toString(); //类型推断
```

#### 泛型约束
```ts{1-4,6-11,13-23}
function ehcoWithLength<T>(input: T): T {
  console.log(input.length);//报错类型“T”上不存在属性“length”
  return input
}

function ehcoWithLength<T>(input: T[]): T[] {
  console.log(input.length);
  return input;
}
const result = ehcoWithLength([1, 2, 3]);
const result2 = ehcoWithLength("123"); //类型“string”的参数不能赋给类型“unknown[]”的参数

interface ehcoWithLength {
  length: number;
}

function ehcoWithLength<T extends ehcoWithLength>(input: T): T {
  console.log(input.length);
  return input
}
const res = ehcoWithLength({ length: 3 })
const res2 = ehcoWithLength("123")
const res3  = ehcoWithLength([1,2,3])
```

#### 泛型类与接口
```ts
class Queue<T> {
  private data: T[] = [];

  push(item: T) {
    return this.data.push(item);
  }

  pop() {
    return this.data.shift();
  }
}

const queue = new Queue<number>();
queue.push(1);
const r = queue.pop();
if (r) {
  r.toFixed();
}
```
```ts
interface Animal<T, U> {
  name: T;
  age: U;
  run(): void;
}

let animal1: Animal<string, number> = {
  name: "dog",
  age: 2,
  run() {
    console.log("animal1 run");
  },
};

let animal2: Animal<number,string> = {
  name: 1,
  age: "2",
  run() {
    console.log("animal2 run");
  }
}
```

### 交叉类型&类型别名&字面量
```ts
//类型别名
let sum = (x: number, y: number): number => x + y;
type Sum = (x: number, y: number) => number;
let sum2: Sum = (x, y) => x + y;
const res = sum2(1, 2);

//字面量
const str: "hello" = "hello";
const num: 1 = 1;
const bool: true = true;
type Direction = "Up" | "Down" | "Left" | "Right";
const direction: Direction = "Left";

//交叉类型
interface Person {
  name: string;
}
type Student = Person & { age: number };
let zhangsan: Student = {
  name: "张三",
  age: 20,
};

```

### TS声明文件
#### 声明文件一
::: code-group
```ts [axios.d.ts]
interface AxiosRequestConfig {
    get:(url:string) => string;
    post:(url:string, data:any) => string;
}

declare const axios: AxiosRequestConfig;
```
```ts [test.ts]
axios.get('')
axios.post('',{})
axios.put('',{})//类型“AxiosRequestConfig”上不存在属性“put”。
```
:::

#### 声明文件二
::: code-group
```ts [calculator.d.ts]
type option = "minus" | "plus";

// type ICalculator = (options: option,numbers: number[]) => number
interface ICalculator {
  (options: option, numbers: number[]): number;//定义函数类型
  plus(numbers: number[]): number;
  minus: (numbers: number[]) => number;
}

declare const calculator: ICalculator;

export default calculator;

```
```ts [test.ts]
import calculator from './calculator';
calculator("minus", [1, 2]);
calculator.plus([1, 2]);
calculator.minus([1, 2]);

//可以在node_modules/@types/calculator/index.d.ts中直接定义
import calculator from 'calculator';//直接导入第三方库模式
```
:::

### TS内置实用工具类
TypeScript 提供了一些内置的实用工具类型（Utility Types），可以方便地对类型进行变换和操作。

#### Partial
```ts
// Partial<T> 将所有属性设为可选
interface Todo {
    title: string;
    description: string;
}

const todo: Partial<Todo> = {
    title: 'Learn TypeScript'
}
```

#### Required
```ts
// Required<T> 将所有属性设为必需
interface Todo {
    title?: string;
    description?: string;
}
const todo: Required<Todo> = {
    title: 'Learn TypeScript',
    description: 'Understanding Utility Types'
};
```

#### Readonly
```ts
// Readonly<T> 将所有属性设为只读
interface Todo {
    title: string;
    description: string;
}
const todo: Readonly<Todo> = {
    title: 'Learn TypeScript',
    description: 'Understanding Readonly'
};
```

#### Record
```ts
// Record<K, T> 构造一个对象类型，其属性 K 的值是 T 类型
const todoMap: Record<string, Todo> = {
    '1': { title: 'Learn TypeScript', description: 'Basics' }
};
```

#### Pick
```ts
// Pick<T, K> 从 T 中选取属性 K
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

const todo: Pick<Todo, 'title' | 'description'> = {
    title: 'Learn TypeScript',
    description: 'Understanding Pick'
};
```

#### Omit
```ts
// Omit<T, K> 从 T 中排除属性 K
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

const todo: Omit<Todo, 'completed'> = {
    title: 'Learn TypeScript',
    description: 'Understanding Omit'
};
```

#### Exclude
```ts
// Exclude<T, U> 从 T 中排除类型 U
type T = "a" | "b" | "c" | "d";
type U = "a" | "c";
type ExcludeType = Exclude<T, U>; // "b" | "d"
```

#### Extract
```ts
// Extract<T, U> 从 T 中提取类型 U
type T = "a" | "b" | "c" | "d";
type U = "a" | "c";
type ExtractType = Extract<T, U>; // "a" | "c"
```

#### NonNullable
```ts
// NonNullable<T> 从 T 中排除 null 和 undefined
type T = string | number | null | undefined;
type NonNullableType = NonNullable<T>; // string | number
```

#### Parameters
```ts
// Parameters<T> 获取函数类型 T 的参数类型
type Fn = (a: string, b: number) => void;
type ParametersType = Parameters<Fn>; // [string, number]
```

#### ReturnType
```ts
// ReturnType<T> 获取函数类型 T 的返回值类型
type Fn = (a: string, b: number) => string;
type ReturnTypeType = ReturnType<Fn>; // string
```

#### InstanceType
```ts
// InstanceType<T> 获取构造函数类型 T 的实例类型
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
type InstanceTypeType = InstanceType<typeof Animal>; // Animal
```


