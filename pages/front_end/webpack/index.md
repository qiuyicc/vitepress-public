# Build Tools

## Webpack

### 介绍

Webpack 是一个模块打包器，可以将各种资源（js，css，图片，字体等）打包成一个文件。  
致力于大型 SPA 项目的模块化构建  
问题：

1. ESM 存在环境兼容问题
2. 模块文件过多，网络请求频繁
3. 前端资源需要模块化
4. 编译浏览器无法理解的东西，ES6、TS、.vue 等等
5. 编译优化：文件拆分及合并、图片压缩、资源处理
6. 提高开发效率，服务器，路径别名，HMR 等

优势：

1. 通过各种 loader 和 plugin 对各种资源进行转换和处理，如 JSX，ES6，LESS，SASS 等；
2. 通过各种 plugins 对文件进行处理；
3. 提供 webpack-dev-server 服务器，进行本地开发；
4. 支持 HMR(Hot Module Replacement)，可以实现模块热更新；

### Webpack 模块加载方式及配置项

1. 遵循 ESM 标准 import 声明
2. 遵循 commonjs 标准的 require
3. 遵循 ADM 标准的 define 函数和 require 函数

```ts
1. entry：必须，入口文件配置，值为对象或数组
2. output：必须，最终产出配置，值为对象
3. mode：4之后必须，开发模式，值为字符串
4. devServer，非必须，开发模式配置，值为对象
5. module，非必须，loader编写，值为对象
6. plugins，非必须，插件相关，值为数组
7. optimization，非必须，优化相关，值为对象
8. resolve，非必须，提供一些简化功能，值为对象
```

### webpack 基本配置

1. 使用 commonjs 向外暴露，module.exports = { }
2. mode 有三种模式，production 为生产模式，会简化代码，development 为开发模式，不会简化代码，none 不做任何改变

```ts
//需要使用commonjs规范
module.exports = {
  // entry:["./app.js","./xxx.js"] //单入口文件，把两个文件当作一个入口
  // entry:{//多入口
  //     app1:'',
  //     app2:''
  // }，
  entry: {
    app: "./app.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].[hash:4].bundle.js",
  },
  mode: "development", //production developemnt none,
  //loader
  module: {
    rules: [
      {
        test: /\.js/,
      },
    ],
  },
  plugins: [],
  resolve: {},
  devServer: {},
  optimization: {},
};
```

### babel 配置

用于转换 ES6 高级语法成浏览器兼容的语法,babel-loader 是接口，实现功能的是@babel/core,  
需要安装 babel-loader @babel/core @babel/preset-env  
可以在 rules 里面直接配置或者使用.babelrc 文件

```ts
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:[
                            [
                                '@babel/preset-env',
                                {
                                    targets:{
                                        browsers:[
                                            ">1%",
                                            "last 2 versions",
                                            "not ie<=8"
                                        ]
                                    }
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
```

```ts
//babel默认的编译版本配置文件
{
    "presets":[
        [
            "@babel/preset-env",
            {
                "targets":{
                    "browsers":[
                        ">1%",
                        "last 2 versions",
                        "not ie<=8"
                    ]
                }
            }
        ]
    ]
}
```

### ESlint 配置

```ts
module.exports = {
  env: {
    //设置运行环境为浏览器环境
    browser: true,
    //版本
    es2021: true,
  },
  extends: [
    //继承已有的规范比如eslint-config-standard
    "standard",
    //继承vue插件里面的strongly-recommended规范
    "plugin:vue/strongly-recommended",
  ],
  //使用某一个规范的插件
  //提供额外的rules + 提供一套现成的规范，比如eslint-plugin-vue
  plugins: ["vue"],
  //解析配置
  parserOptions: {
    ecmaVersion: 6, //指定es版本
    sourceType: "module", //script module指定模块化
    //语言特性
    ecmaFeature: {
      jsx: true,
    },
    //检查细节
    rules: {
      //官网查阅
    },
  },
};
```

### CSS 配置

less-loader、css-loader、style-loader，mini-css-extract-plugin(提取 css 为单独的文件)、css-minimizer-webpack-plugin(压缩 CSS)

```ts
            {
                test:/\.css$/,
                use: [miniCss.loader,'css-loader']
            }
    plugins:[
   // new eslintPlugin()
   new miniCss({
    filename:'test.bundle.css'
   }),
   new minimizer()
    ],
```

### 图片配置

file-loader，url-loader（file-loader的plus版本，多了一些操作hash、base64等），对于小文件可以使用url-loader转为base64，对于大文件还是要使用file-loader，不然打包出来的体积偏大；记得要安装file-loader，不然报错
```ts
{
    test:/\.(jpg|jpeg|png|gif|svg)$/,
    loader:'url-loader',
    options:{
        limit:5000,
        name:"[name].[hash].[ext]"
    }
}
```

### loader

本质是一个方法，该方法接收到要处理的资源内容，处理完成后给出内容，作为打包的结果，期间可以使用多个loader进行下一步的处理，类似于一个个管道，但是最终的输出结果必须是一个JS代码
```ts
//简易loader，//md文档转为html
const marked  = require("marked")
module.exports = (context) =>{
    const html = marked(context)
    return `export default ${JSON.stringify(html)}` //必须返回一个JS结果
  //或者直接返回一个字符串交给下一个loader
}
```

### html处理

```ts
html-webpack-plugin//html模板,在html模板中可以使用EJS语法定义一些htmlWebpackPlugin传递的变量
plguins:{
  new webpackPlugin({
    template:"./index.html",
    filename:"index.html"，
    chunks:["app"]，//指定入口文件
  minify:{
    collapseWhitespace:true,
      removeComments:true,
      removeAttributeQuotes:true
  },//一些配置项
  inject:"body" //body head false 指定script插入的位置
  })
}
```

### 代码分割

```ts
单入口文件：使用import()加载或者require.ensure([],()=>{}."name")加载
//webpack会自动分包
import("./src/index.js").then((module)=>{
   module.default.xxx//如果是默认导出
    ......
})
//分包的同时起名,添加魔法注释,注意名称一样会合并
import(/* webpackChunkName:"index" */"./src/index.js").then((module)=>{
   module.default.xxx//如果是默认导出
    ......
})
```

```ts
多入口文件：重复打包同一代码
optimization:{
    splitChunks:{
        //单独定义
        cacheGropus:{
            //第三方库代码重复
            vendor:{
                test:/[\\/]node_modules[\\/]/,
                filename:"vendor.js",
                chunks:"all",
                minChunks:1
            },
            //业务代码重复
            common:{
                filenmae:"common.js",
                chunks:"all",//all(全部拆分) ,async(只拆异步) , initial(只拆同步),
                minChunks:2,//chunk重复出现几次就进行拆分
                minSize:1000,//最小拆分chunk大小,太小没必要拆
            }
        }
    },
    //webpack运行时代码
    runtimeChunk:{
        name:"runtime.js"
    }
}
```


### resolve配置

```ts
resolve:{
        alias:{//设置别名
            "@css":"./css",
        },
        //设置省略后缀名
        extensions:[".js",".css",".json"]
    },
```

```ts
require.context
  app.js中
                               //子文件获取 //匹配的文件
   let arr =  require.context('./mode',false,/.js/)
   //require.context批量拿到某个文件下的所有东西
   arr.keys().forEach((item)=>{
    console.log(arr(item).default);
   })
```


### devServer
对于html、css等静态资源为热更新(不刷新页面，状态保留)，对于JS默认为强制更新(刷新页面丢失状态)
```ts
devServer:{
        port:8080,
        hot:true，
        proxy：{
          //开发阶段解决跨域问题
          "/api1":{
            target:"xxx",
              pathRewrite:{
              "^/api:''"
              },
            headers:{},
            changeOrigin:true
          },
          "/api2":{
            .....
          }
        }，
        static：{ //通过该配置对象向dist提供静态资源文件目录
          directory: path.join(__dirname, 'public'),
        //告诉服务器从哪里提供内容。只有在你希望提供静态文件时才需要这样做。
        }
    },
```

### devtool

使用什么source-map，定位错误,开发一般用eval-cheap-source-map/cheap-module-eval-source-map  
eval模式原理是给webpack打包后的文件放在eval函数中并在结尾加上//#sourceUrl = "xxx.js"来说明报错文件是哪个，不能定位错误行和列
生产使用none，防止暴露源码

### plguins

本质是在webpack声明周期钩子中挂载函数来实现，为一个函数或者一个包含apply方法的对象
1. clean-webpack-plugin //清除dist文件目录下的文件
2. html-webpack-plugin //让webpack根据模板自动生成html文件，而不是手动编写
3. copy-webpack-plugin，//拷贝静态资源文件到指定目录，开发阶段最好不使用，消耗性能；上线使用，开发阶段使用devServer；
4. mini-css-extract-plugin，提取css文件为一个单独的文件，如果使用该插件，就不需要style-loader，而是通过link的方式引入miniCssExtract生成的文件，使用miniCssExtract.loader
5. css-minimizer-webpack-plugin，压缩CSS


### HMR

可以保留页面的状态  
1. 设置devServer中的hot为true
2. 在plugin中引入webpack内置模块，webpack.HotModuleReplacementPlugin()
3. HMR不是开箱即用，对于样式文件css可以，在style-loader中已经处理了HMR，而对于JS模块不确定性很大，需要手动确定JS规则，框架的HMR除外(框架已经定义好了规则)
4. HMR的JS API：使用module.hot(HMR的核心对象).accept()//注册某个模块更新的处理函数

```ts
import b from "./b.js"
console.log(b);
//接收两个参数，一个是模块的路径，一个是处理函数
if(module.hot){
  module.hot.accept("./b.js",()=>{
  //处理函数
  console.log("b.js更新了，这里处理热替换的逻辑")
})
}

1.可以使用hot:"only"，强制热替换不进行自动刷新，在进行热替换失败时可用,如accept()里面有错误，如果hot为true的话webpack会让浏览器进行刷新，让我们找不到错误；
2.使用accept需要在plugin中开启HotModuleReplacementPlugin()，如果没有开启会报错；那么可以在事先判断一下是否开启module.hot;
```

### 优化
配置文件根据环境启用不同的配置，一个环境单独配一个文件；要根据不同的环境进行不同的打包，一般在process.env中设置，有时候需要在js代码中获取环境，可以借助插件
####  merge
```ts
通过使用webpack-merge合并
const base = require("./webpack.baseconfig.js")//基础配置
const merge =  require("webpack-merge").merge//获取webpackmerge方法
module.exports = merge(base,{
  //写需要的配置,如果冲突，以这个为准
})
```

#### cross-env

::: code-group
```ts [package.json]
//跨平台的方式来设置环境变量
"build":"cross-env NODE_ENV=production webpack -- config ....."
"dev":"cross-env NODE_ENV=development webpack-dev-server ...."
```
```ts [webpack.config.js]
通过暴露一个方法，可以接收到webpack默认的env
module.exports = function(env，argv){
  return merge(base(env),{
    //env是通过cli传递的环境参数；
    //argv是指运行cli时传递的所有参数
  })
}
```
:::

#### 全局变量

```ts
const webpack = require("webpack")
plugins:[
  new webpack.DefinePlugin({
    baseURL:'www.xxx.com'//以全局的方式注入
  })
]
```

#### 打包分析

```ts
1.官方方案：--json输出打包结果分析json
  "getjson":"webpack --config ./webpack.base.js --env pro --json">status.json
  //使用webpack网站webpack.github.io/analyse/上传打包后的json文件
2.webpack-bundle-analyzer
  下载安装后使用该plugin
  打包完成后即可弹出打包分析网站，可以查看bundle的结构关系以及大小
```

#### DLL

```ts
1.提前打包不变的包，如三方库
2.通知正式打包DLL处理过，不再处理
const webpack = require("webpack")
module.exports = {
  mode:"production",
  entry:{
    vendor:[
      "axios",
      "loadsh"
    ]
  },
  output:{
    path:__dirname + "/dist",
    filename:"[name].dll.js"
    library:"[name]_library"
  },
plugins:[
  new webpack.DllPlugin({
    path:__dirname + "/[name]-mainfest.json",
    name:"[name]_library"//与library同名
  })
]
}

正式打包文件中：
plugins：[
  new webpack.DllReferencePlugin({
    mainfest:require(__dirname + "/vendor-mainfest.json")//通知正式打包
  })
]

//提前打包的文件不会自动引入到模板html中
//需要手动引入script
```

#### tree-shaking

```ts
//tree-shaking会在生产模式下自动开启
//手动配置
optimization:{
    usedExports:true,//标记哪些未被使用
    minimize:true，//删除
    concatenateModules:true,//Scope Hosting，尽可能把模块合并在一个函数中
}
```

#### sideEffects

```ts
副作用：模块执行时，除了导出成员之外所作的事情；某些模块加载时可能会修改全局状态、调用API，或执行其他影响应用状态的操作。
sdieEffects一般用于NPM包标记是否有副作用
//在package.json中
"sideEffects":false //标识模块有无副作用，全局, 这样设置会使Webpack在树摇优化时删除未被使用的导出，从而减少打包后的文件体积。
//如果某些特定文件确实存在副作用（如CSS文件），比如设置原型方法，,可以
//设置sideEffects为数组，标识哪些文件时副作用文件
"sideEffects":[
  "*.css",
  "./src/index.js"
  //所有的CSS文件和src/index.js会被认为具有副作用，Webpack不会在树摇优化时删除这些文件。
]
//webpack.config.js中
optimization:{
  sideEffects:true,//开启sideEffects功能
  usedExports:true,//标记哪些未被使用
    minimize:true，//删除
    concatenateModules:true,//Scope Hosting，尽可能把模块合并在一个函数中
}
```

#### Hash

```ts
//全局hash，全局hash是基于整个项目的构建生成的哈希值。
//当项目中的任意文件发生变化时，整个项目的hash都会变化。
output:{
  filename:"[name].[hash].bundle.js"
}
//chunk hash，chunkhash是基于每个chunk生成的哈希值。
//允许更细粒度的缓存控制，如果项目中有些代码没有改变，则可以重用已经缓存的chunk，提升加载性能。
output:{
  filename:"[name].[chunkhash].bundle.js"
}
//content hash，主要用于CSS文件，当CSS文件的内容发生变化时，其contenthash才会改变。
//因为CSS和JS文件之间没有直接的关系，contenthash能够更精确地反映文件内容的变化。
output:{
  filename:"[name].[contenthash].bundle.js"
}
```

## Snowpack

Bundler 的问题：

1. 当资源越来越多的时候，打包速度越来越慢；
2. 大中型的项目，启动时间可能达到几分钟；

Snowpack 的优势：

1. 利用新版浏览器支持 es modules 的特性；
2. 不会被打包；
3. 每个文件编译一次，永久被缓存；
4. 当一个文件修改的时候，只需要重新 build 那个文件即可；

处理 Node_modules 中的模块：

1. 扫描 node_modules 中的模块，找到使用的模块；
2. 将每个模块转为单个 js 文件；
3. 这些单个文件都是 esm 模块，可以被新版浏览器直接使用  
   处理生产环境：
4. 默认情况下，和开发环境生产的代码几乎一致，但是也提供插件生成全浏览器兼容的代码；

## Rollup

### 初始

RollUp 与 Webpack 的区别：

1. RollUp 更适合于库的构建，而 Webpack 更适合于应用的构建；
2. RollUp 的构建速度更快，但 Webpack 更适合于模块化的应用；
3. RollUp 的配置文件相对简单，而 Webpack 的配置文件相对复杂；

```ts
//运行命令，缺点是参数太多，太长
npx rollup main.js --file dist/bundle.js --format iife
```

::: code-group

```ts [rollup.config.js]
//使用配置文件
import json from "@rollup/plugin-json";
export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json()],
};
```

:::

```ts
npx rollup --config rollup.config.js
```

### Rollup项目简单配置

```ts
import vue from "rollup-plugin-vue";
import json from "rollup-plugin-json";
import css from "rollup-plugin-css-only";
import pkg from "./package.json" assert { type: "json" };
const name = "lego-bricks";
const file = (type) => `${pkg.name}.${type}.js`;
export default {
  input: "src/App.vue",
  output: {
    name,
    file: `dist/${file("esm")}`,
    format: "es",
  },
  plugins: [vue(), json(), css({ output: "bundle.css" })],
};
```

```ts
import vue from "rollup-plugin-vue";
import json from "rollup-plugin-json";
import css from "rollup-plugin-css-only";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };
const name = "lego-bricks";
const file = (type) => `${pkg.name}.${type}.js`;
//覆盖tsconfig.json
const overrides = {
  compilerOptions: {
    declaration: true,
  },
  include: ["src/index.ts"],
};
export default {
  input: "src/App.vue",
  output: {
    name,
    file: `dist/${file("esm")}`,
    format: "es",
  },
  plugins: [
    typescript({
      tsconfigOverride: overrides,
    }),
    vue(),
    json(),
    css({ output: "bundle.css" }),
  ],
};
```

```ts
import vue from "rollup-plugin-vue";
import json from "rollup-plugin-json";
import css from "rollup-plugin-css-only";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };
export const name = "lego-bricks";
export const file = (type) => `${pkg.name}.${type}.js`;
//覆盖tsconfig.json
const overrides = {
  compilerOptions: {
    declaration: true,
  },
  include: ["src/index.ts"],
};
export default {
  input: "src/App.vue",
  output: {
    name,
    file: `dist/${file("esm")}`,
    format: "es",
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfigOverride: overrides,
    }),
    vue(),
    json(),
    css({ output: "bundle.css" }),
  ],
  external: ["vue", "lodash-es"],
};
```

### Rollup进行项目打包区分

```ts
npm i rimraf --save-dev //清空文件夹
```

::: code-group

```ts [rollup.config.esm.js]
import basicConfig, { file, name } from "./rollup.config.basic.js";
export default {
  ...basicConfig,
  output: {
    name,
    file: `dist/${file("esm")}`,
    format: "es",
  },
};
```

```ts [rollup.config.umd.js]
import basicConfig, { file } from "./rollup.config.basic.js";
export default {
  ...basicConfig,
  output: {
    name: "myComponents",
    file: `dist/${file("umd")}`,
    format: "umd",
    globals: {
      vue: "Vue",
      "lodash-es": "_",
    },
    exports: "named",
  },
};
```

```ts [rollup.config.basic.js]
import vue from "rollup-plugin-vue";
import json from "rollup-plugin-json";
import css from "rollup-plugin-css-only";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };
export const name = "lego-bricks";
export const file = (type) => `${pkg.name}.${type}.js`;
//覆盖tsconfig.json
const overrides = {
  compilerOptions: {
    declaration: true,
  },
  include: ["src/index.ts"],
};
export default {
  input: "src/App.vue",
  output: {
    name,
    file: `dist/${file("esm")}`,
    format: "es",
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfigOverride: overrides,
    }),
    vue(),
    json(),
    css({ output: "bundle.css" }),
  ],
  external: ["vue", "lodash-es"],
};
```

```ts [package.json]
  "scripts": {
    "build": "npm run clean && npm run build:esm && npm run build:umd",
    "build:esm": "rollup --config rollup.config.esm.js",
    "build:umd": "rollup --config rollup.config.umd.js",
    "clean": "rimraf ./dist"
  },
```

:::

### RollUp 插件原理

```ts
import json from "@rollup/plugin-json";
import { dataToEsm } from "@rollup//pluginutils";
//插件原理，在rollup的不同生命周期中，会执行不同的插件，插件的作用就是对代码进行处理
//重要声明周期：buildStart -> load -> transform -> buildEnd
function createPlugins() {
  return {
    name: "my-plugin",
    buildStart(options) {
      //options是rollup的全部配置
      console.log("buildStart", options);
    },
    load(id) {
      //id就是要加载的文件的路径
      console.log("load", id);
      return null; //什么都不做，返回null
    },
    transform(code, id) {
      //code是要转换的代码，id是要转换的文件的路径
      // console.log("transform",code,id);
      // return null;
      //实现json转esm的插件
      if (id.slice(-5) !== ".json") return null;
      try {
        const jsonData = JSON.parse(code);
        const esmData = dataToEsm(jsonData);
        return {
          code: esmData,
        };
      } catch (error) {
        throw new Error(`Invalid JSON in ${id}: ${error.message}`);
      }
    },
    buildEnd(err, options) {
      console.log("buildEnd", err, options);
    },
  };
}

export default {
  input: "main.js",
  output: {
    file: "dist/bundle.js",
    format: "es",
  },
  plugins: [createPlugins()],
};
```

### Rollup 报错记录

#### JSON 问题

::: danger
TypeError： xxxxx needs an import assertion of type “json“
:::

```ts
npm i  @rollup/plugin-json --save-dev //安装JSON插件
引入之后再plugins中使用，无效
```

```ts
import pkg from "./package.json" assert { type: "json" }; //类型断言
console.log(pkg.name); //正常使用
```

#### id 属性无法读取

::: danger
[!] (plugin vue) TypeError: Cannot read properties of undefined (reading 'id')
:::

```ts
网上没找到，猜测版本问题
npm i rollup-plugin-vue --save-dev //解决
```

#### Unresolved dependencies

::: warning
(!) Unresolved dependencies  
//直接去官网安装插件即可  
https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency
:::

#### Missing global variable name

::: warning
(!) Missing global variable name  
https://rollupjs.org/configuration-options/#output-globals  
Use "output.globals" to specify browser global variable names corresponding to external modules:
vue (guessing "vue")
:::

```ts
//配置globals选项
output: {
    .....
    globals: {
        "vue": "Vue"
    }
}
```

## Vite

### 介绍

1. vite利用浏览器的ESM，让代码不像传统的构建工具一样去分析引入，打包构建，而是直接保持模块化，这样省去了大量的编译 时间，让代码更改后的响应速度大量提升。
2. 构建方面使用rollup
3. 自带处理css以及各种预处理语言，支持TS等，不用像webpack那样需要配置
4. Vite其核心原理是利用浏览器现在已经支持ES6的import,碰见import就会发送一个HTTP请求去加载文件，Vite启动一个 koa 服务器拦截这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再以ESM格式返回返回给浏览器。Vite整个过程中没有对文件进行打包编译，做到了真正的按需加载，所以其运行速度比原始的webpack开发编译速度快出许多！

### vite初始

```ts
构建vite：：npm create vite;
```
1. 帮我们全局安装了一个vite脚手架，create-vite
2. 直接运行create-vite脚手架 bin目录下的一个执行配置

1. 不同的第三方包会有不同的导出格式；
2. 对路径上的处理可以直接使用，import xx from "a.js",vite会自动进行路径重写
3. 解决网络多包传输的性能问题(原生esm规范不支持node_modules)，vite的依赖预构建会尝试将依赖集成最后只生成一个或几个模块；
4. 依赖预构建：首先vite会找到对应的依赖，然后调用esbuild，将其他规范的代码转换为esm，然后放到当前目录的node_modules/.vite/deps,同时对esm规范的各个模块进行统一集成；

```ts
//Vite中的merge
import { defineConfig } from 'vite'
import viteBaseConfig from "./vite.base.config"
import viteProdConfig from "./vite.prod.config"
import viteDevConfig from "./vite.dev.config"
const envResolve = {
  "serve":() => {
    console.log('开发环境');
   return  Object.assign({},viteBaseConfig,viteDevConfig)
  },
  "build":() => {
    console.log('生产环境');
    return  Object.assign({},viteBaseConfig,viteProdConfig)
  }
}
export default defineConfig(({command})=>{
    return envResolve[command]()
})
// export default defineConfig(({ command }) => {
//   if (command === 'serve') {
//     return {
//       // dev 独有配置
//     }
//   } else {
//     // command === 'build'
//     return {
//       // build 独有配置
//     }
//   }
// })

```

### 环境变量

对于环境变量，希望在不同的执行命令下会有不同的环境变量注入：：在根目录下新建三个文件：  
.env(默认公用env文件),  
.env.development(dev环境变量文件)，  
.env.production(生产环境变量文件)  
注意里面的环境变量为key=value形式，其中key为VITE_定义开头，否则访问不到注入的环境变量，因为Vite对这个进行了一层拦截；如果要修改这个变量的开头定义，可以在配置文件中修改envPrefix配置选项；

::: code-group
```ts [如.env.development]
//自定义的开头ENV_
ENV_APP_KEY = "development1111"
//默认的开头VITE_
VITE_APP_KEY1 = 'test'
```
```ts [修改envPrefix]
export default defineConfig({
    plugins:[
        vue()
    ],
    envPrefix:"ENV_"
})
```
```ts [环境变量注入]
const envResolve = {
  "serve":() => {
    console.log('开发环境');
   return  Object.assign({},viteBaseConfig,viteDevConfig)
  },
  "build":() => {
    console.log('生产环境');
    return  Object.assign({},viteBaseConfig,viteProdConfig)
  }
}
export default defineConfig(({command,mode})=>{
  //根据mode指定环境变量文件，默认为.env文件，相当于公共env文件
    const env  = loadEnv(mode,process.cwd(),"")
    //process.cwd()为相对路径，因为此时env文件放置在根目录；可以是一个相对路径/绝对路径
  //第三个参数为prefixes，prefixes: string | string[] = 'VITE_',
    console.log('!!!!',mode);//mode取决于我们执行程序的命令 dev为development，build则是production
    return envResolve[command]()
})
```
:::


### plugins
跟其他打包工具差不多
1. 内置插件：
- vite-plugin-vue: 处理.vue文件
- vite-plugin-md: 处理.md文件
- vite-plugin-windicss: 处理.windi文件
- vite-plugin-icons: 处理.svg文件
- vite-plugin-compression: 压缩打包后的文件
- vite-plugin-html: 处理html文件
- vite-plugin-pwa: 处理PWA
- vite-plugin-mock: 处理mock数据
- vite-plugin-imagemin: 压缩图片
- vite-plugin-eslint: 处理eslint
- vite-plugin-stylelint: 处理stylelint
2. 第三方插件：
- vite-plugin-style-import: 按需引入样式
- vite-plugin-svg-icons: 处理.svg文件
- vite-plugin-svgr: 处理.svg文件
- vitejs-plugin-legacy: 兼容旧浏览器
- unplugin-vue-components: 自动引入组件
- unplugin-auto-import: 自动引入第三方库
- vite-plugin-react-refresh: 热更新
- vite-plugin-vuedoc: 处理.md文件
- vite-plugin-pages: 处理.vue文件
- vite-plugin-optimize-persist: 优化打包后的文件
- vite-plugin-inspect: 调试插件

### 优化
1. 优化打包后的文件：
- vite-plugin-optimize-persist: 优化打包后的文件，通过分析依赖关系，对某些模块的优化，减少冗余代码，从而达到降低最终打包体积的效果。
- vite-plugin-compression: 压缩打包后的文件，缩打包后的文件，通常以 Gzip 或 Brotli 格式进行压缩，从而显著减小文件的体积。
2. 优化开发环境：
- vite-plugin-react-refresh: 热更新
- vite-plugin-inspect: 调试插件
3. 优化构建速度：
- vite-plugin-svgr: 处理.svg-> React组件 
- vite-plugin-icons: 处理.svg文件
- vite-plugin-windicss: 处理.windi文件
- vite-plugin-md: 处理.md文件
- vite-plugin-mock: 处理mock数据
4. 优化打包体积：
- vite-plugin-style-import: 按需引入样式
- vite-plugin-pages: 处理.vue文件
- vite-plugin-vuedoc: 处理.md文件

.....................