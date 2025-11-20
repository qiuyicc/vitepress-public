# JavaScript 高级程序设计

JavaScript 高级程序设计(第四版)

## 什么是JavaScript

JavaScript是一门用来与网页交互的脚本语言，包含三个组成部分：
1. ECMAScript：JavaScript的核心，定义了JavaScript的语法和基本对象。
2. DOM：Document Object Model，提供操作网页内容的方法和接口。
3. BOM：Browser Object Model，提供与浏览器进行交互的方法和接口。
4. 这三个部分得到了五大浏览器(IE、Firefox、Chrome、Safari、Opera)不同程度的支持，所有浏览器基本上都对ES5提供了完善的支持，对ES6及以上的支持度也逐渐提升。

## HTML中的JavaScript

### script元素

1. async：可选，表示应该立即下载脚本，不用等脚本和执行完毕再加载页面，也不用等到异步脚本下载和执行后再加载其他脚本，只对外部脚本文件有效；
2. charset：可选，使用指定字符集编码脚本；很少使用；
3. crossorigin：可选，跨域资源共享（CORS）设置，允许跨域请求；corssorigin="anonymous"表示允许跨域请求，但是不发送cookie；crsorigin="use-credentials"表示允许跨域请求，并发送cookie；
4. defer:可选，表示脚本可以延迟到文档完全被解析和显示之后再执行，只对外部脚本文件有效
5. intergrity：可选，对比接受到的资源和指定的加密签名以验证子资源的完整性，这个属性可以确保CDN不会提供恶意脚本；
6. language：废弃，最初用于表示代码块的脚本语言版本
7. src：可选，表示包含要执行的代码的外部文件
8. type：可选，表示代码类型，默认是text/javascript，如果这个值是module，则代码会被当成ES6模块，才能使用import和export语句。
9. 在使用行内JavaScript时，要注意不能出现字符换`</script>`，行内脚本会把它当成结束的script标签，如果行内script代码块要使用`</script>`，可以用`\`转义。
10. 如果使用了src属性，则不应该再script标签中书写其他javascript代码，如果两者都提供的话，浏览器也只会下载并执行脚本，忽略行内代码。
11. src属性可以跨域，这个能力可以让我们通过不同的域分发JS，可以使用integrity属性防范安全问题
12. 按照惯例，外部引用的js文件扩展名是.js，但这不是必须的，因为浏览器不会检查js文件的扩展名，这为服务端脚本语言动态生成js或者在浏览器中将js扩展语言(如TS、JSX等)转译为JS提供了可能性，但是要注意服务器经常根据文件扩展来确定响应正确的MIME类型，所以最好还是使用正确的扩展名。
13. 动态加载脚本，通过向DOM中动态添加script元素可以加载指定的脚本,但是在把HTMLElemnt添加到DOM且执行到这段代码之前都不会发送请求，默认情况下，以这种形式创建的script元素是以异步方式加载的，相当于添加了async属性，但不是所有浏览器都支持async，如果想要统一脚本的加载行为，可以动态设置为同步加载，但是这种方式获取资源对浏览器的预加载器是不可见的，这将影响它们在资源获取队列中的优先级，如果想要预加载器知道脚本的加载顺序，可以显式的声明他们。
```ts
<link rel="preload" href="example.js"> // 预加载脚本

let script = document.createElement('script');
script.src = 'example.js';
scipt.async = false; // 同步加载
document.head.appendChild(script);
```

### 文档模式

IE5.5发明了文档模式，可以使用doctype来切换文档模式，最初的文档模式有混杂模式和标准模式，随着浏览器的发展，又出现了第三种模式：准标准模式，准标准模式和标准模式十分接近，很少需要区分。
```ts
<!DOCTYPE html> // 标准模式
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> //  Transitional模式
```

### noscript元素

针对早期浏览器不支持javascript的情况，可以用noscript元素来提示用户。noscript元素可以包含任何可以出现在body中的HTML元素，script除外。有两种情况下，浏览器将显示包含在noscript元素中的内容：
1. 浏览器不支持脚本；
2. 浏览器支持脚本，但脚本被禁用

## 语言基础

### 数据类型

#### Boolean类型

| 数据类型  | 转换为true的值      | 转换为false的值 |
|-----------|-------------------|----------------|
| Boolean   | true              | false          |
| String    | 非空字符串          | ""             |
| Number    | 非零数值(包括无穷)  | 0、NaN         |
| Object    | 非空对象           | null           |
| Undefined | N/A(不存在)       | undefined      |

#### Number类型

1. 基本number类型
```ts
let num1 = 10; // 默认十进制
let num2 = 070; // 八进制,第一个开头必须是0，然后相应的八进制数(0-7)
let num3 = 079; // 非法八进制，因为9不是八进制数,当成十进制79处理
let num4 = 08; // 非法八进制，因为8没有对应的数字,当成十进制8处理
let num5 = 0x1F; // 十六进制,前缀0x表示
使用八进制和十六进制格式创建的数值在数学操作中都被视为十进制数值。

let float1 = 1.1; // 浮点数
let float2 = 0.1 //有效但不推荐
let float3 = 1. //小数点后面没有数字，当作整数1处理
let float4 = 1.0 //小数点后面是0，当作整数1处理
默认情况下，ECMAScript会把小数点后至少包含6个0的浮点值转换为科学计数法
let float5 = 3.125e7 // 科学计数法表示3.125*10^7,31250000
let float6 = 3e-7; // 科学计数法表示3*10^-7,0.0000003
```
2. 值的范围
ECMAScript可以表示的最小数值保存在Number.MIN_VALUE属性中，这个值在多数浏览器中是5e-324，最大数值保存在Number.MAX_VALUE属性中,这个值在多数浏览器中是1.7976931348623157e+308。任何超过JS可表示范围大小的值都以无穷大表示,即Infinity(正无穷)和-Infinity(负无穷)。

3. NaN(Not a Number)
NaN，用于表示本来要返回数值的操作失败了(而不是抛出错误)
```ts
console.log(0/0) // NaN
console.log(-0/+0) // NaN
console.log(5/0) // Infinity
console.log(-5/0) // -Infinity
NaN不等于包括NaN在内的任何值
//isNaN()函数可以用来判断一个值是否是NaN
console.log(isNaN(NaN)) // true
console.log(isNaN(10)) // false，10是数值
console.log(isNaN("10")) // false，"10"虽然是字符串,但是可以转换为数值
console.log(isNaN("Hello")) // false，"Hello"不能转换为数值
console.log(true) // false，true可以转换为数值0
```

4. 数值转换
有三个函数可以将非数值转换为数值:
1. Number()函数，可以将任意类型的值转换为数值.
   1. 布尔值，true转换为1，false转换为0
   2. 数值，直接返回
   3. null转换为0
   4. underfined转换为NaN
   5. 字符串，可以转换为数值，规则如下：
      1. 如果字符串包括数值字符，包括数值字符前面带+或-，则转换为相应的数值,Number("-123") => -123
      2. 如果字符串包含有效的浮点值格式，则转换为相应的浮点数,Number("3.14") => 3.14
      3. 如果字符串包含有效的十六进制格式，则转换为相应的十进制数,Number("0x1F") => 31
      4. 如果是空字符串，则转换为0
      5. 如果字符串包含除上述格式之外的字符，则转换为NaN Number("Hello") => NaN,Number('1.1.2') => NaN
   6. 对象，调用valueOf()方法，如果返回的结果是数值，则返回该数值，否则调用toString()方法，如果返回的结果是数值，则返回该数值，否则返回NaN。
2. parseInt()函数，可以将字符串转换为整数
   1. 从第一个非空字符串开始转换，如果第一个字符不是数字字符或者负号，则返回NaN
   2. 空字符串返回NaN
   3. 如果是数值字符，依次检查每个字符，直到结尾或者遇到非数值字符。
```ts
parseInt("123") // 123
parseInt("123blue") // 123
parseInt("0x1F") // 31
parseInt("") // NaN
parseInt("22.5") // 22
parseInt("0xAF") // 175
parseInt("AF",16) // 175,如果传递第二个参数，则以该参数作为基数转换，可以省略0x前缀
parseInt("AF") // NaN
```
1. parseFloat()函数，可以将字符串转换为浮点数
   1. parseFloat只能解析十进制值，不能传递第二个参数
   2. 十六进制始终返回0
```ts
parseFloat("1234blue") // 1234
parseFlloat("0xA") // 0
parseFloat("3.14") // 3.14
parseFloat("0908.5") // 908.5
parseFloat("22.34.5")// 22.34
```





