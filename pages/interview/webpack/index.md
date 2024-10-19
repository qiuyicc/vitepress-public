# Webpack

## Webpack工作流程

1. 初始化参数，从配置文件读取合并参数，得到最终参数
2. 开始编译，用上一步得到的参数初始化Complier对象，加载所有配置的插件，开始执行编译
3. 确定入口，根据entry找到入口文件
4. 编译模板，从入口文件出发，调用所有配置的loadder对模块进行翻译，再找到该模块依赖的模块，递归本步骤
5. 完成模块编译，经过第三步完成模块编译并获得他们之间的依赖关系
6. 输出资源，根据入口和模块之间额依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是修改输出内容的最后机会
7. 输出完成，确定后输出内容后，根据配置文件确定输出的路径和文件名，把文件内容写入到文件系统

## Webpack的配置项

1. entry：入口文件，Webpack从这里开始构建依赖关系图
2. output：输出文件，Webpack在这里定义输出的目录和文件名
3. module：模块配置，Webpack通过module来定义loader对不同文件类型的处理规则
4. resolve：解析配置，Webpack通过resolve来配置模块如何被解析
5. plugins：插件配置，Webpack通过plugins来引入第三方插件来实现更丰富的功能
6. devServer：开发服务器配置，Webpack通过devServer来配置开发环境的服务器
7. optimization：优化配置，Webpack通过optimization来配置Webpack的性能优化策略
8. externals：用于配置排除打包的模块
9. devtool：用于配置source-map的类型
10. context：用于配置webpack的工作目录,必须是绝对路径
11. target,指定的运行环境，可以是web，node，electron等
12. performance：用于配置webpack的性能提示
13. noParse：用于配置不需要解析的模块
14. stats：用于配置webpack的输出信息

## 什么是Loader，Plugin

loader：让webpack拥有加载和解析其他非JS文件的能力，webpack只能支持JS文件解析，loader在module.rules中配置，作为模板的解析规则，类型为数组，每一项都是一个Object，内部包含了test、loader、options等属性
plugin：plugin可以扩展webpack的功能，在webpack运行的生命周期中会广播许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变结果，plugins中单独配置，类型为数组，每一项都是一个Plugin的实例

## 常见的Loader

1. raw-loader，加载文件的原始内容(utf-8)
2. file-loader，处理文件，将文件复制到输出目录，并返回它们的URL
3. url-loader，与file-loader类似，区别是可以设置一个阈值，大于阈值会交给file-loader，小于阈值返回base64
4. source-map-loader，加载额外的sourceMap文件，方便调式
5. svg-inline-loader，将压缩后的svg内容注入代码
6. image-loader，加载并压缩图片
7. json-loader，加载JSON文件
8. handlebars-loader，将Handlebars模板编译成函数并返回
9. babel-loader，把ES6转换成ES5
10. ts-loader，ts转为js
11. awesome-typescript-loader，ts转为js，性能比ts-loader好
12. sass-loader，将sass转为css
13. css-loader，加载css，支持模块化、压缩、导入
14. style-loader，把css代码注入到js中
15. postcss-loader，扩展css语法，做兼容
16. eslint-loader，eslint检查js
17. tslint-loader，tslint检查TS

## 常见Plugin

1. define-plugin，定义环境变量
2. ignore-plugin，忽略部分文件
3. html-webpack-plugin，简化HTML文件创建(依赖于html-loader)
4. web-webpack-plugin，可方便地为单页应用输出HTML
5. uglifyjs-webpack-plugin，压缩文件
6. terser-webpack-plugin，压缩文件
7. webpack-paralled-uglify-plugin，多进程执行代码压缩，提高构建速度
8. mini-css-extract-plugin，分类样式文件，提取css为单独的文件，支持按需加载
9. serviceworker-webpack-plugin：为网页应用增加离线缓存功能
10. clean-wenpack-plugin，目录清理
11. ModuleConcatenationplugin，开启Scope Hoisting
12. speed-measure-webpack-plugin，可以看到每个loader和plugin的执行耗时、打包耗时
13. webpack-bundle-analyzer，可视化webpack输出文件的体积

## Webpack热更新HMR

HMR全称Hot Module Replacement，是Webpack提供的一种在不刷新浏览器的情况下更新模块的功能。
HMR的核心是客户端从服务器拉取更新后的文件，准确的说是chunk diff，实际上WDS(Webpack Dev Server)与浏览器之间维护了一个WebSocket，当文件资源发生变化时，WDS会向浏览器推送更新，并带上构建时的hash，让客户端与上一次的资源进行比对。客户端对比出差异后会向WDS发起AJAX请求来获取更新内容

## 代码分割的意义

代码分割的本质是在源代码直接上线和打包成唯一脚本的main.bundle.js两种极端方案之间的中间状态，使用可接受的服务器压力来换取更好的用户体验。
1. 源代码直接上线，过程可控，http请求多，性能开销大
2. 打包成唯一脚本，服务器压力小，但是页面空白期长，用户体验不好

## Webpack打包速度优化

1. 优化loader，对loader来说，影响打包效率的主要是Babel，Babel会把代码转换为字符换生成AST，然后对AST继续转换最后生成新代码，项目越大，转换代码越慢
2. HappyPack，受限于Node的单线程，Webpack也是单线程，而HappyPack可以将Loader的同步执行转为并行，提高打包速度
3. DllPugin，可以将特定的类库提前打包然后引入，可以极大地减少打包类库的次数，只有当类库更新版本时才重新打包，也实现了将公共代码抽离成单独文件的优化
4. 代码压缩，在Webpack3中，一般使用UglifyJs压缩代码，但是这个是单线程运行的，使用webpack-parallel-uglify-plugin可以多进程运行UglifyJs，在webpack4中，只需要设置mode为production即可自动压缩代码

## Webpack减少打包体积 

1. 按需加载，将每个路由页面单独打包为一个文件，只有当前页面需要时才加载，可以有效减少初始加载时间，也可以对loadash这中类库使用
2. Scope Hoisting，可以分析出模块间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去
3. Tree-Shaking，Tree-Shaking是Webpack4中新增的特性，可以分析出模块间的依赖关系，只保留用到的模块，可以有效减少打包体积

## Webpack优化前端性能

1. 压缩代码，压缩JS、CSS文件等
2. CDN加速，在构建过程中，将引用的静态资源路径修改为CDN上对应的路径，可以利用webpack对于output参数和各loader的publicPath参数来修改资源路径
3. Tree-Shaking
4. Code-Splitting，将代码拆分成多个文件，按需加载，可以有效减少初始加载时间，提高用户体验
5. SplitChunksPlugin，可以将公共代码抽离成单独文件，减少请求数，提高加载速度

## Webpack构建速度优化

1. 多入口的情况下，使用CommonsChunkPlugin来提取公共代码
2. 通过exterals参数，将一些公共库提前打包，减少请求数
3. 利用DllPlugin和DllReferencePlugin预编译资源模块，通过DllPlugin来对那些引用但不会修改的npm包进行预编译，再通过DllReferencePlugin来引用预编译好的资源，可以极大地减少打包时间
4. HappyPack，可以将Loader的同步执行转为并行，提高打包速度
5. webpack-parallel-uglify-plugin，多进程运行UglifyJs，提高压缩速度
6. Tree-Shaking和Scope Hoisting，可以剔除多余代码

## Webpack长缓存

用访问浏览器页面时，为了加快加载速度，会对用户访问的静态资源进行存储，但每一次代码升级或更新，都需要浏览器下载新的代码，最方便的方式时引入新的文件名称，只下载新的代码块，不会加载旧的代码块  
在Webpack中，可以通过output给输出文件定义指定chunkhash，并且分离经常更新的代码，通过NameModulesPlugin或者HashedModuleIdsPlugin使再次打包的文件名不变

## Weback实现按需加载

import("module")

## 神奇注释

在import里面可以添加一些注释，如定义该chunk的名称、要过滤的文件，引入指定的文件等，这类带有特殊功能的注释被称为神奇注释

## npm run dev的时候webpack做了什么

1. 检查node和npm版本，引入相关插件和配置
2. webpack对源码进行编译打包并返回complier对象
3. 创建express服务器
4. 配置开发中间件(webpack-dev-middleware)和热重载中间件(webpack-hot-middleware)
5. 挂载代理服务和中间件
6. 配置静态资源
7. 启动服务器监听特定端口
8. 打开浏览器

## Webpack Tree Shaking

利用了ES6模块静态解构特性来去除生产环境不必要的代码优化过程
1. 当Webpack分析代码时，它会标记出所有的import语句和export语句
2. 然后，当Webpack确定某个模块没有被导入时，它会在生成的bundle中排除这个模块
3. 同时，还会递归进行标记清理，以确保所有未使用的依赖项最终都不会出现在bundle
```js
module.exports = {
    optimization: {
        usedExports: true, // 标记出所有被使用的导出
        concatenateModules: true, // 合并模块
        minimize: true // 压缩代码
    }
}
```

## Webapck 与 Vite

1. Vite 是一个新的前端构建工具，它使用原生ES模块，并使用Rollup打包代码，它可以实现更快的开发速度，更小的打包体积，以及更好的HMR体验。
2. Webpack是先打包再启动开发服务器，Vite是直接启动，然后在需要时再按需编译
3. 现代浏览器支持ES Module，会主动请求去获取所需文件。Vite利用这一点，将开发环境下的模块文件直接作为浏览器要执行的文件，而不是先打包，这种方式减少了中间环节，提高了效率。当使用ES Module时，开发者实际上是在构建一个依赖关系图，主流浏览器可以通过在script标签中设置type="module"来加载模块，而无需额外的配置。默认情况下，模块会延迟加载，执行实际在文档解析之后，触发DOMContentLoaded事件之前。
4. Webpack底层是Node.js构建的，而Vite则是基于esbuild进行预构建依赖。esbuild采用Go语言编写，是纳秒级别，Node.js是毫秒级别的，因此Vite的启动速度更快。

## 


