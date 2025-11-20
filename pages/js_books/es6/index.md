# ES6 入门

## babel

Babel是一款广为使用的转码器，可以将ES6的代码转为ES5代码，使得浏览器可以识别和运行。Babel通过一个配置文件.babelrc来进行配置，指定需要转码的ES6语法。
```js
{
  "presets": ["latest"],//指定转码的规则
  "plugins": []
}
```
```ts
babel-cli 命令行转码
babel-node babel-cli自带的，提供一个支持ES6的REPL环境
babel-register 注册babel，使得require()可以自动转码
babel-core 核心模块，提供API接口用于转码
babel-polyfill 垫片，babel默认只转换新的JavaScript语法，而不转换新的API，需要使用垫片来实现这些API的转码，比如Promise、Generator等。
```

## let和const命令

es6声明变量的6种方法：
    - var
    - function
    - let
    - const
    - import
    - class