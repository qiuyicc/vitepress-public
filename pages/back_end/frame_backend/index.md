# 后端框架

仅限与Node后端框架相关

## Express

### 介绍

优点：简单、灵活、快速、易上手

缺点：

1. 路由响应中，很可能有从外部请求数据的服务，有验证路由的请求参数，返回特定的格式；
2. 所有的逻辑都写在一起，容易产生冗长的不宜维护的代码；
3. 一些大型项目必备的模块，如第三方服务初始化、安全、日志等没有明确的标准


### Express中间件

如同一个管道，先进先出，通过next放行  
中间件可以完成的任务：
1. 执行任何代码
2. 对请求和响应对象进行更改；
3. 结束请求和响应循环
4. 调用堆栈的下一个中间件
```ts
const express = require('express');
const app = express();

function myMiddleware(req, res, next) {
    console.log('This is my middleware');   
    next();
}
// app.use(myMiddleware); //可以用use方法注册中间件，可以是在路由之前注册
app.get('/',myMiddleware, (req, res) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
```
```ts
//express中间件，对错误捕获不友好，每个回调都拥有一个新的调用栈，需要手动捕获错误，向外传递
f1(req,res){
    f2(req,res){
        f3(req,res){
            res.send('Hello World!');   
        }
    }
}
```

## Koa

### 介绍

Koa是基于Node.js的web框架，由 Express 原班人马打造，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。

1. 使用Promise(async await)代替Callback
2. 使用ctx(上下文对象)，封装req和res，以及一些常用功能
3. 使用完全不同的中间件机制
4. 更轻量级的框架体积，没有捆绑任何中间件
5. 响应机制不同，express直接操作res对象，res.send()之后立即响应，koa数据通过ctx.body返回，中间件可以修改ctx.body，不会立即响应，等到所有中间件修改完毕然后再响应
6. 缺点是太轻量级，没有许多模块实现

```ts
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');

const router = new Router();

router.get('/test', async (ctx, next) => {
    ctx.body = 'Hello, World!';
})

app.use(router.routes());

// app.use(async (ctx, next) => {
//     ctx.throw(404, 'Page not found');
//     // ctx.body = 'Hello, World!';
// })

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
```

### Koa中间件

Koa中间件利用了**洋葱模型**,在await next后面会进入下一个中间件的执行，最后执行到最后又反向流出 

```ts
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello, World!';
})

async function test1(ctx, next) {
    console.log('test1 start');
    await next();
    console.log('test1 end');
}
async function test2(ctx, next) {
    console.log('test2 start');
    await next();
    console.log('test2 end');
}

async function test3(ctx, next) {
    console.log('test3 start');
    await next();
    console.log('test3 end');
    
}
app.use(test1);
app.use(test2);
app.use(test3);
app.use(router.routes());
// test1 start
// test2 start
// test3 start
// test3 end
// test2 end
// test1 end

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
```

## 总结

1. Express和Koa简单，扩展性强，适合个人的比较小型项目
2. 没有约定，对统一维护和开发不利
3. 后端框架需要统一的架构或约定进行开发；
4. 需要有丰富的扩展机制和定制性
5. TS支持


## Egg.js

1. 大厂出品，质量保证；
2. 国内开发者开发，中文文档
3. 统一约定，统一开发，统一维护；
4. 高度可拓展性的插件机制
5. 支持TS

### 安装
```ts
npm init egg --type=ts
```
```ts
npm install
```
```ts
npm run dev
```

### 目录结构

```ts
|-- .vscode
|-- app
|     |-- module(模块文件)
|         |-- bar 
|            |-- controller
|                   |-- home.ts
|                   |-- user.ts
|            |-- package.json
|         |-- foo
|            |-- service
|               |-- HomeService.ts
|            |-- package.json
|            |-- index.ts
|-- config(变量配置文件)
|     |-- config.default.ts
|     |-- plugin.ts
|     |-- config.local.ts
|     |-- config.prod.ts
|--test (测试目录)
|--typings (声明文件)
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- .eslintrc
|-- README.md
|-- .gitignore
```

### 文件结构

使用MVC架构，将业务和逻辑分离
1. Router路由，用来描述URL和Controller的对应关系；
2. Controller控制器，解析用户的输入，处理返回的结果
3. Service服务层，处理业务逻辑，如数据库操作、缓存操作、文件操作等；

使用Service的好处：  
1. 保持Controller中的逻辑独立性；
2. 保持业务逻辑的独立性，抽象出来的Service可以被多个Controller重复使用
3. 将逻辑和业务分离，降低耦合；


### 初试

删除app下的module文件夹，新建controller文件夹，创建test.ts文件,在app根目录下创建router.ts文件

```ts
|--app
|   |-- controller
|   |   |-- test.ts
|   |-- router.ts
```

::: code-group
```ts [test.ts]
import { Controller } from 'egg';
export default class TestController extends Controller {
  async index() {
    const { ctx } = this;
    // this.ctx.,当前请求上下文的对象
    // this.app.,代表整个应用程序的实例
    // this.service.,可以调用定义在服务层的各种方法
    // this.config.,对应用配置的访问。开发者可以通过它获取到在配置文件中定义的各种参数
    ctx.response.body = 'Hello, world!';
    ctx.response.status = 200;
  }
}

```
```ts [router.ts]
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  console.log('aaa', controller);
  router.get('/test', controller.test.index);
};

```
:::


### 请求参数

框架对于Body的请求规则：
1. 当请求的Content-Type为application/json，application/json-patch+json.application/csp-report, application/vnd.api+json时，会按照json格式对请求body进行解析，并限制body最大长度为100kb
2. 当请求的Content-Type为application/x-www-form-urlencoded会按照form表单格式对请求body进行解析，并限制body最大长度为100kb

::: code-group
```ts [test.ts]
import { Controller } from 'egg';
export default class TestController extends Controller {
  async index() {
    const { ctx } = this;
    // this.ctx.,当前请求上下文的对象
    // this.app.,代表整个应用程序的实例
    // this.service.,可以调用定义在服务层的各种方法
    // this.config.,对应用配置的访问。开发者可以通过它获取到在配置文件中定义的各种参数
    const { query, body } = ctx.request;
    const { id } = ctx.params;
    const res = {
      query,
      id,
      body,
    };
    ctx.response.body = res;
    ctx.response.status = 200;
  }
}

```

```ts [router.ts]
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/test/:id', controller.test.index);
  router.post('/test/:id', controller.test.index);
};

```
:::
测试POST请求：
1. 写个html文件来请求；
2. 使用工具Postman、ApiPost等工具；
3. 使用命令行工具curl
```ts
curl -X POST http://localhost:7001/test/10 --data '{"name":"test"}' --header 'Content-Type:application/json;charset=utf-8'
```

### 编写一个service

::: code-group
```ts [dog.ts]
//service文件夹下新建
import { Service } from 'egg';

interface Dog {
  message: string;
  status: string;
}

export default class DogService extends Service {
  async getDogData() {
    const { ctx } = this;
    const res = await ctx.curl<Dog>('https://dog.ceo/api/breeds/image/random', {
      dataType: 'json',
    });
    return res.data;
  }
}

```
```ts [test.ts]
//Controller文件夹下新建
import { Controller } from 'egg';

export default class TestController extends Controller {
  async getDog() {
    const { ctx, service } = this;
    const res = await service.dog.getDogData();
    ctx.body = res.message;
    ctx.status = 200;
  }
}
```
```ts [router.ts]
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/dog', controller.test.getDog);
};

```
:::


### 使用模板引擎插件

1. 安装插件
```ts
npm i egg-view-nunjucks --save
```
2. 配置插件
```ts
// config/plugin.ts
import { EggPlugin } from 'egg';
const plugin: EggPlugin = {
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};
```
3. 编写模板文件
```ts
// app/view/test.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Egg View Nunjucks</title>
</head>
<body>
  <img src="{{ url }}" alt="dog">
</body>
</html>
```
4. 编写Controller
```ts
// app/controller/test.ts
  async getDog() {
    const { ctx, service } = this;
    const res = await service.dog.getDogData();
    await ctx.render('test.nj', {
      url: res.message,
    });
    // ctx.response.body = res.message;
    // ctx.response.status = 200;
  }
```

### 使用中间件

//编写一个记录请求日志中间件
1. 在app/middleware目录下新建记录日志的中间件文件
```ts
// app/middleware/logger.ts
import { Context } from 'egg';
import { appendFileSync } from 'node:fs';
export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = new Date().getTime();
    const requestTime = new Date();
    await next();
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} --${time}`;
    appendFileSync('./log.txt', logTime + '\n');
  };
};
```

2. 在config/config.default.ts中配置中间件
```ts
// config/config.default.ts
  config.middleware = [ 'logger' ];
```

### 中间件添加更多配置

1. 给中间件添加options参数
```ts
import { Context, Application } from 'egg';
import { appendFileSync } from 'node:fs';
export default (options: any, app: Application) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = new Date().getTime();
    const requestTime = new Date();
    await next();
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    if (options.allowedMethod.includes(ctx.method)) {
      const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} --${time}`;
      appendFileSync('./log.txt', logTime + '\n');
    }
  };
};
```
2. 给中间件添加过滤方法
```ts
全局过滤方法
// config/config.default.ts
config.middleware = ['myLogger'];
const bizConfig = {
    myLogger: {
      allowedMethod: [ 'POST' ],
    },
  };
```
3. 给单个路由添加中间件
```ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const logger = app.middleware.myLogger(
    {
      allowedMethod: ['POST'],
    },
    app
  );
  router.get('/test/:id', controller.test.index);
  router.post('/test/:id',logger, controller.test.index);
  router.get('/dog', controller.test.getDog);
};

```

### Config文件夹

1. config.default.ts 应用的默认配置，一般来说，开发者不需要修改这个文件，除非需要修改框架的默认配置；
2. config.local.ts 本地环境的配置，一般来说，开发者在本地开发环境下使用，修改这个文件，使用了深拷贝合并，npm run dev以local文件为准；
3. config.prod.ts 生产环境的配置，一般来说，部署到生产环境时使用，修改这个文件，使用了深拷贝合并，需要首先进行npm run tsc编译，然后再npm start才能启动，start启动的是编译后的文件；
4. plugin.ts 插件配置文件
5. config向外暴露出一个函数，参数为appInfo:EggAppInfo,是应用有关信息，pkg是package.json，name是应用名，baseDir是应用根目录，home是用户目录，root是应用根目录，只有在local和unittest环境下才为baseDir，其他都为HOME
6. config文件分为两大部分，一部分是应用本身的配置，另一部分是业务逻辑的配置

### Config文件TS支持

1. 在contoller和service当中能够获取正确的类型，支持多级提示；
2. 在其他配置文件中能够获得default的正确类型；
3. 在中间件可以获取对应的提示，并且自动提示

虽然egg安装了ts，但是其config的返回值是合并config:PowerPartial< EggAppConfig > 和bizConfig，ts不能推断出返回值的类型，所以返回值为any类型，对我们开发不能使用ts类型推断,需要手动断言返回值为{}解决
```ts
  const config = {} as PowerPartial<EggAppConfig>;
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST' ],
    },
    baseUrl:'default.url'
  };
  ..............
  return {
    ...config as {},//手动断言返回为{}
    ...bizConfig,
  };
```
```ts
//typing/config/index.d.ts 声明文件
import 'egg';
import { EggAppConfig } from 'egg';
import ExportConfigDefault from '../../config/config.default';
type ConfigDefault = ReturnType<typeof ExportConfigDefault>; //returnType是ts的内置类型，用来获取函数返回值类型
type NewEggAppConfig = ConfigDefault;//起别名
declare module 'egg' {
  interface EggAppConfig extends NewEggAppConfig { } //EggAppConfig继承NewEggAppConfig
}
```
```ts
//contoller/test.ts
ctx.app.config.myLogger //可以获取提示
//config/config.local.ts
config.myLogger //可以获取提示
```
```ts
//再次修改myLogger
import { Context, Application,EggAppConfig } from 'egg';
import { appendFileSync } from 'node:fs';
//使用EggAppConfig['myLogger']来指定options的类型
export default (options: EggAppConfig['myLogger'], app: Application) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = new Date().getTime();
    const requestTime = new Date();
    await next();
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    console.log(app);
    if (options.allowedMethod.includes(ctx.method)) {
      const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} --${time}`;
      appendFileSync('./log.txt', logTime + '\n');
    }
  };
};

```

### Extend扩展

1. Application -全局应用对象，只有一个实例
2. Context -请求上下文对象，每次请求都会创建一个新的实例
3. Request -请求对象，封装了请求信息
4. Response -响应对象，封装了响应信息
5. Helper -辅助对象，提供一些工具方法

#### Helper扩展

```ts
// app/extend/helper.ts
import { Context } from 'egg';
interface ResType {
  ctx: Context;
  res?: any;
  msg?: string;
}

export default {
  //定义一个响应成功的返回格式
  success({ ctx, res, msg }: ResType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      msg: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
};

```
```ts
//app/controller/test.ts
  async index() {
    const { ctx } = this;
    const { query, body } = ctx.request;
    const { id } = ctx.params;
    const res = {
      query,
      id,
      body,
    };
    ctx.helper.success({ctx,res,})
  }
  asy
```

#### Application扩展

1. Application -全局应用对象，只有一个实例
   - ctx.app
   - contoller和service上可以通过this.app访问
   - middlerware可以通过传入的参数拿到，app: Application
2. Context -请求上下文对象，每次请求都会创建一个新的实例
   - controller和service上可以通过this.ctx访问
   - middlerware可以通过传入的参数拿到，ctx: Context
3. Request -请求对象，封装了请求信息
   - ctx.request
4. Response -响应对象，封装了响应信息
   - ctx.response
5. Helper -辅助对象，提供一些工具方法
   - ctx.helper
```ts
//在extend/application.ts中编写扩展方法
import { Application } from 'egg';
import axios,{AxiosInstance } from 'axios';
const AXIOS = Symbol('Application#axios');
export default {
  //扩展方法
  ehco(msg: string) {
    const that = this as unknown as Application;
    console.log(`hello ${msg}${that.config.env}`);
  },
  //扩展属性,设置getter方法
  get axiosInstance():AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 5000,
      });
    }
    return this[AXIOS];
  },
  //扩展属性,设置setter方法
  //set someProperty(value: Type) {
    // 自定义逻辑
  //}
  //get someProperty(value: Type) {
    // 自定义逻辑
  // } 
    //普通方法
    // someMethod() {
    //     // 操作代码
    // } 
    //static someStaticMethod() {
    // 静态方法代码
// }
};

```
```ts {15-17}
//controller/test.ts
  async index() {
    const { ctx } = this;
    // this.ctx.,当前请求上下文的对象
    // this.app.,代表整个应用程序的实例
    // this.service.,可以调用定义在服务层的各种方法
    // this.config.,对应用配置的访问。开发者可以通过它获取到在配置文件中定义的各种参数
    const { query, body } = ctx.request;
    const { id } = ctx.params;
    const res = {
      query,
      id,
      body,
    };
    this.app.ehco('test')
    const res2 = await this.app.axiosInstance.get('api/breeds/image/random')
    console.log(res2.data);
    ctx.helper.success({ctx,res})
  }
```

### 启动自定义

1. 配置文件即将加载，最后动态修改配置的时机，configWillLoad，同步
2. 配置插件加载完成，configDidLoad，同步
3. 文件加载完成，didLoad，异步
4. 插件启动完毕，willReady，异步
5. 应用已经启动完毕，didReady，异步
6. http/https server 已经启动，开始接受外部请求，serverDidReady

```ts
// 根目录下新建app.ts
import { IBoot,Application } from 'egg'

export default  class AppBoot implements IBoot {
    private readonly app:Application
    constructor(app:Application) {
        this.app = app
    }
    configWillLoad() {
        // 此时config文件已被读取合并，但是还并未生效
        //这是应用层修改配置的最后时机
        console.log(this.app.config.baseUrl);
        console.log(this.app.config.coreMiddleware);
        this.app.config.coreMiddleware.push('myLogger'); //可以在此添加中间件
    }
    configDidLoad(): void {
        //配置插件加载完成
    }
    async didLoad() {
        //异步
        //所有的插件都已加载完毕
    }
    async willReady(): Promise<void> {
        //异步
        //应用准备就绪
    }
    async didReady(): Promise<void> {
        //异步
        //应用启动完成
        const ctx = this.app.createAnonymousContext()//创建上下文
        // this.app.middleware 应用启动后真正的运行的中间件
    }

}
```

### Egg中TS支持原理

通过多次的类型重载，最终生成为丰富的类型提示
比如Controller：
::: code-group
```ts [index.d.ts]
//typing/contoller/index.d.ts
import 'egg';
import ExportTest from '../../../app/controller/test';

//类型重载
declare module 'egg' {
  interface IController {
    test: ExportTest;//添加test
  }
}
```
```ts
//而IController的又进行继承
export interface IController extends PlainObject { }
```
:::
比如config：
::: code-group
```ts [index.d.ts]
//config/index.d.ts
import 'egg';
import { EggAppConfig } from 'egg';
import ExportConfigDefault from '../../config/config.default';
type ConfigDefault = ReturnType<typeof ExportConfigDefault>;
type NewEggAppConfig = ConfigDefault;
declare module 'egg' {
  interface EggAppConfig extends NewEggAppConfig { }
}
```
```ts [egg-view的index.d.ts]
  interface EggAppConfig {
    view: {
      root: string;
      cache: boolean;
      defaultExtension: string;
      defaultViewEngine: string;
      mapping: PlainObject<string>;
    };
  }
```
:::
经过这样的不断扩充，最终形成了丰富的类型提示，让开发者在编写代码时，能够获得更好的提示，提高开发效率。

### Egg调试技巧

1. 使用console.log打印日志，可以看到打印的日志会被打印到控制台，并且可以看到打印的日志会被egg框架记录，可以在日志文件中查看到；
2. 使用egg-logger插件，可以记录日志到文件，并且可以看到打印的日志会被egg框架记录，可以在日志文件中查看到；
```ts
ctx.logger.debug('debug', query);
ctx.logger.info('info', id);
ctx.logger.warn('warn', body);
ctx.logger.error('error');
```
3. 使用VScode调试，可以设置断点，查看变量的值，可以看到变量的值；

### 日志

日志级别：NONE,DEBUG ，INFO，WARN，ERROR，默认只会输出INFO及以上级别的日志，需要在config下修改
```ts
  config.logger = {
    consoleLevel: 'DEBUG',//输出到控制台级别
    level: 'DEBUG'，//输出到日志文件级别
  }
```
baseDir:应用代码的位置
HOME：用户目录，如admin账户为/home/admin
root：应用根目录，只有在local和unittest环境下才为baseDir，其他都为HOME

1. 日志的默认位置
```ts
${appInfo.root}/logs/${appInfo.name}
```
1. 日志的分类
:::tip
1. appLogger ${appInfo.name}-web.log，例如 example-app-web.log，应用相关日志，供应用开发者使用的日志。我们在绝大多数情况下都在使用它
2. errorLogger common-error.log：实际上一般不会直接使用它，任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常。
3. coreLogger egg-web.log：框架内核、插件日志。
4. agentLogger egg-agent.log：agent 进程日志，框架和使用到 agent 进程执行任务的插件会打印一些日志到这里。
:::

### Egg连接MongDB

1. 安装mongoose包
```ts
npm install mongoose --save
```
2. MongDB配置
```ts
//config/config.default.ts
  const bizConfig = {
    mongoose:{
      url:'mongodb://localhost:27017/test'
    }
  };

```
3. 连接MongDB
```ts
//app.ts
import { IBoot, Application } from 'egg';
import { createConnection } from 'mongoose'
import assert from 'assert'

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    const { url } = this.app.config.mongoose;
    assert(url, 'config.mongoose.url is required');
    const db = createConnection(url);
    db.on('connected',()=>{
        app.logger.info('Mongoose connection open to ' + url);
    })
    //@ts-ignore
    app.mongoose = db; //这部分报错未解决,不影响后续使用 // [!code ++]  
  }
}

```
4. 声明mongoose的类型
```ts
import 'egg';
import { Connection } from 'mongoose';

type NewConnection = Connection
declare module 'egg' {
  interface Application {
    mongoose: NewConnection;
  }
}
```

### Egg配合mongodb初步使用

::: code-group
```ts{15-16} [service/dog.ts]
private getUsers() {
  const app = this.app;
  //映射到先前未创立Schema的User模型
  const UserSchema = new Schema({
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
    hobby: {
      type: Array,
    },
  },{collection: 'user'});
  //注意使用createConnection创建的db，需要使用db.model来映射模型
  //使用connect创建的，需要从mongoose引入model模块创建模型
  return app.mongoose.model('User',UserSchema)
}
async showUser(){
  const UserModel = this.getUsers();
  const result = await UserModel.find({age: {$gt: 25}}).exec();
  return result;
}
```
```ts [controller/test.ts]
async getUsers(){
  const users = await this.service.dog.showUser();
  const res = {
    users,
    mongooseId:this.app.mongoose.id
  }
  this.ctx.helper.success({ ctx: this.ctx, res })
}
```
```ts [rouer.ts]
router.get('/user', controller.test.getUsers);
```
:::

### Egg的Loader

1.  在app.ts中使用LoaderToApp载入model模块

```ts
//app.ts
async willReady(): Promise<void> {
  //异步
  //应用准备就绪
  const dir = join(this.app.config.baseDir, 'app/model');
  this.app.loader.loadToApp(dir,'model', {
  caseStyle: 'upper',
  })
}
```
2. 在app文件夹下新建model文件夹，在model文件夹下新建user.ts文件
```ts
//app/model/user.ts
import { Application } from "egg";
import { Schema } from "mongoose";
function initUserModel(app:Application) {
    //映射到先前未创立Schema的User模型
    const UserSchema = new Schema({
      name: {
        type: String,
      },
      age: {
        type: Number,
      },
      hobby: {
        type: Array,
      },
    },{collection: 'user'});
    return app.mongoose.model('User',UserSchema)
}
export default initUserModel;
```
3. 在typings/index.d.ts中声明model属性
```ts
//typings/index.d.ts
import 'egg';
import { Connection,Model } from 'mongoose';

type NewConnection = Connection
type MongooseModel = {
  [key: string]: Model<any>
}
declare module 'egg' {
  interface Application {
    mongoose: NewConnection;
    model: MongooseModel;
  }
}

```
4. 更改dog.ts文件
```ts
//app/service/dog.ts
async showUser(){
  //此时app上面就有model属性，上面有User模块可以使用
  const result = await this.app.model.User.find({age: {$gt: 25}}).exec();// [!code ++]
  return result;
}
```

### 将逻辑抽象为Egg插件

目标：将上一步的逻辑抽象为egg插件，可以直接在项目中使用，不需要在app.ts中编写代码。
1. 新建egg插件文件
```ts
npm init egg --type=plugin
//选择plugin模板
```
1. 在根目录下新建app.js，改写程序
```ts
//注意是JS
const path = require('path');
const assert = require('assert');
const mongoose = require('mongoose');

class AppBoot {
  constructor(app) {
    this.app = app;
    const { url } = this.app.config.mongoose;
    assert(url, 'config.mongoose.url is required');
    const db = mongoose.createConnection(url);
    db.on('connected', () => {
      app.logger.info('Mongoose connection open to ' + url);
    });
    app.mongoose = db;
  }
  async willReady() {
    const dir = path.join(this.app.config.baseDir, 'app/model');
    this.app.loader.loadToApp(dir, 'model', {
      caseStyle: 'upper',
    });
  }
}
module.exports = AppBoot;
```
3. 在根目录下新建index.d.ts,作为声明文件
```ts
import 'egg';
import { Connection, Model } from 'mongoose';

declare module 'egg' {
  type MongooseModel = {
    [key: string]: Model<any>;
  };
  interface Application {
    mongoose: Connection;
    models: MongooseModel;
  }
  interface EggAppConfig {
    mongoose: {
      url?: string;
    };
  }
}
```
4. 查看package.json文件，注意package的name不要重名，eggPlugin字段中的name字段为插件名，files是要提交的文件
```ts
"name": "egg-test-qiuyi-plugin",
"eggPlugin": {
    "name": "testPlugin"
  },
"files": [
  "app.js",
  "agent.js",
  "config",
  "app",
  "index.d.ts"
],
```
5. 发布插件，未登录先进行npm adduser登录
```ts
npm publish
```
6. 在项目中使用插件
```ts
npm install egg-test-qiuyi-plugin --save-dev
```
```ts
//config/plugin.ts
testPlugin:{
  enable: true,
  package: 'egg-test-qiuyi-plugin',
}
```
7. 注释先前的代码逻辑，使用插件
```ts
//config/config.default.ts
config.mongoose = {
  url:'mongodb://localhost:27017/test',
}
//config上有mongoose字段
//app上有mongoose和model字段，成功使用插件，运行项目无措
```

### 创建用户流程

1. 编写User模型
```ts
//app/model/user.ts
import { Application } from "egg";
import { Schema } from "mongoose";

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createAt: Date,
  updateAt: Date,
}

function initUserModel(app: Application) {
  const schema = new Schema<UserProps>({
    username: { type: String, required: true,unique: true },
    password: { type: String, required: true },
    email: { type: String },
    nickName: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  },{timestamps: true});//timestamps: true 自动添加createdAt和updatedAt字段
  return app.mongoose.model<UserProps>("User", schema);
}

export default initUserModel;
```
2. 编写UserService
```ts
//app/service/user.ts
import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {
  public async createUserServiceByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const userCreateData: Partial<UserProps> = {
      username,
      password,
      email: username,
    };
    const user = await ctx.model.User.create(userCreateData);
    return user;
  }

  async findByUserId(id: string) {
    return await this.ctx.model.User.findById(id);
  }
}
```
3. 编写UserController
```ts
//app/controller/user.ts
import { Controller } from 'egg';

export default class UserController extends Controller {
    async createUserControllerByEmail(){
        const { ctx, service } = this;
        const userData = await service.user.createUserServiceByEmail(ctx.request.body)
        ctx.helper.success({ctx, res: userData})
    }

    async showUser(){
        const { ctx, service } = this;
        const user = await service.user.findByUserId(ctx.params.id)
        ctx.helper.success({ctx, res: user})
    }
}
```
4. 编写路由
```ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.post('/api/users/create', controller.user.createUserControllerByEmail);
  router.get('/api/users/:id', controller.user.showUser)
};
```

### 改进Mdoel类型

1. 可以在Service中定义直接 断言User的类型为UserProps，缺点是每次手写
```ts
//app/service/user.ts
async findByUserId(id: string) {
  const userModel = this.ctx.model.User as Model<UserProps> 
  const result  = await userModel.findById(id);
  if(result){
      return result.xxxx //获得类型提示
  }
}
```
2. 在typing下的index.d.ts给egg-mongoose插件的MongooseModels类型进行扩展，缺点是需要在index.d.ts中手动声明
```ts
///typings/index.d.ts
import 'egg';
import { Connection, Model } from 'mongoose';
import { UserProps } from '../app/model/user';

declare module 'egg' {
  interface MongooseModels {
    User: Model<UserProps>;
  }
}
```
```ts
//这样在service中就可以直接使用UserProps类型
async findByUserId(id: string) {
  const result  = await this.ctx.model.User.findById(id);
  if(result){
    return result.xxxx //获得类型提示
  }
```
3. 注意到egg的内置插件egg-ts-helper可以自动生成模块类型文件，在typing/app/model/index.d.ts中可以看到User的类型定义,发现被IModel接口继承，于是可以在app/index.d.ts中继承IModel接口
```ts
//app/model/index.ts
import 'egg';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    User: ReturnType<typeof ExportUser>; //通过typeof拿到函数的类型，通过ReturnType拿到函数的返回值类型
  }
}
```
```ts
//app/index.d.ts
import 'egg';
import { Connection, Model } from 'mongoose';

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>;//允许扩展其他的属性而不会报错
  }
}
```

### 添加数据验证egg-validate

1. 安装egg-validate并使用
2. 创建rules使用
```ts
const userCreateRules  = {
    username:"email",
    password:{
        type:'password',
        min:6
    }
}
 //ctx.validate(userCreateRules) //直接抛出错误
const errors = app.validator.validate(userCreateRules, ctx.request.body)
if(errors){
    return ctx.helper.error({ctx,errno:1001,msg:'创建用户失败'})
}
```

### 规范化错误代码

```ts
//app/controller/user.ts
//暂时不抽离类型定义
export const userErrorMessages = {
    createUserValidateFail:{
        errno:'101001',
        message:'创建用户失败',
    },
    createUserAlreadyExist:{
        errno:'101002',
        message:'用户已存在',
    }
}
```
```ts
//app/extend/helper.ts
interface ErrType {
  ctx: Context;
  errType: keyof typeof userErrorMessages; // [!code ++]
  error?: any;
}
export default {
  success({ ctx, res, msg }: ResType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      msg: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
  error({ ctx, errType, error }: ErrType) {    
    const { errno, message } = userErrorMessages[errType];
    ctx.body = {
      errno,
      message,
      ...(error && { error }), // [!code ++]
    };
    ctx.status = 200;
  },
};
```
```ts
//app/controller/user.ts
 async createUserControllerByEmail(){
    const { ctx, service,app } = this;
    //ctx.validate(userCreateRules)
    const errors = app.validator.validate(userCreateRules, ctx.request.body)
    if(errors){
        return ctx.helper.error({ctx,errType:'createUserValidateFail',error:errors})
    }
    //检查用户名是否已存在
    const result = await service.user.findByUserName(ctx.request.body.username)
    if(result){
        return ctx.helper.error({ctx,errType:'createUserAlreadyExist'})
    }
    const userData = await service.user.createUserServiceByEmail(ctx.request.body)
    ctx.helper.success({ctx, res: userData})
}
```

### 密码加密egg-bcrypt

1. plaintext,明文，不用
2. md5,不可逆单向加密，缺点是碰撞，彩虹表，暴力破解，仍有泄露风险
3. md5 + salt,不可逆单向加密，salt是随机数，在hash前向明文固定位置插入salt，增加复杂度，增加安全性
4. bcrypt，一种加盐的单向Hash，不可逆加密算法，同一明文每次加密后的密文都不一样，安全性高
1. 安装egg-bcrypt并使用
```ts
npm i egg-bcrypt --save
```
2. 在config/config.default.ts中配置bcrypt
```ts
import 'egg';
declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>;
  }

  interface Context  {
    genHash(plainText: string):Promise<string>,
    compare(plainText: string, hash: string):Promise<boolean>,
  }
  interface EggAppConfig {
    bcrypt:{
        saltRounds: number
    }
  }
}
```
2. 在service和controller中使用genHash和compare方法
```ts
const hashPassword = await ctx.genHash(password); //生成hash密码
```
3. 编写login接口测试加密密码
```ts
async login() {
  const { ctx, service } = this;
  const errorRes = this.validateUserInput();
  //检查用户输入
  if (errorRes) {
    return ctx.helper.error({
      ctx,
      errType: 'userValidateFail',
      error: errorRes,
    });
  }
  const { username, password } = ctx.request.body;
  //检查用户是否存在
  const user  = await service.user.findByUserName(username);
  if(!user){
      return ctx.helper.error({ ctx, errType: 'loginCheckFail' });
  }
  // 验证密码
  const verifyResult = await ctx.compare(password,user!.password) // [!code ++]
  if(!verifyResult){
      return ctx.helper.error({ ctx, errType: 'loginCheckFail' });
  }else {
      return ctx.helper.success({ ctx, res: user, msg: '登录成功' });
  }
}
```

### 删除返回的password字段信息

1. 直接删除user中的password字段，行不通
```ts
delete user.password //user是一个Document & UserProps类型，不能直接对user进行delete
```
2. 使用toJSON,无法复用

```ts
const newUser = user.toJSON()
//@ts-ignore
delete newUser.password
```

3. 在定义model时传递options参数，使得UserModel每次调用toJSON时，会自动执行删除操作
```ts
function initUserModel(app: Application) {
  const schema = new Schema<UserProps>({
    username: { type: String, required: true,unique: true },
    password: { type: String, required: true },
    email: { type: String },
    nickName: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  },{timestamps: true,toJSON:{
    //每次调用toJSON方法，执行以下操作
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v
    }
  }});//timestamps: true 自动添加createdAt和updatedAt字段
  return app.mongoose.model<UserProps>("User", schema);
}
```

### mongoose-sequence实现ID自增

mongDB原来的_id字段通过ObjectId实现，生成的id很长，不方便使用，mongoose-sequence插件可以实现ID自增，生成的id是自增的整数，方便使用。
1. 安装mongoose-sequence，注意该插件是commonjs模块
```ts
npm i mongoose-sequence --save
```
2. 在model中引入工厂函数并使用
```ts
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(app.mongoose);
```
3. 使用schema实例的plugin方法，将AutoIncrement插件添加到schema中
```ts
 userSchema.plugin(AutoIncrement, { inc_field: 'id',id: 'user_id_counter' });//id用于跟踪 id 字段的下一个可用值
```

### cookie与session

egg内置了cookie和session插件，可以直接使用，不需要额外安装。

```ts
ctx.cookies.set('username',user.username,{encrypt:true}) //设置cookie并启动加密
ctx.cookies.get('username',{encrypt:true})//获取cookie并解密
ctx.session.username = user.username; //设置session
const { username } = ctx.session;//获取session
```
session流程：
1. 用户登录提交username，password
2. 后端查询数据库正确，创建session或者cookie
3. 返回set-cookie
4. 浏览器设置cookie，下次请求带上cookie
5. 查询是否有对应的session，有则返回数据，无则重新登录

### session使用外部存储方式

egg的session支持外部存储方式：
1. 使用外部存储可以扩展session的存储空间，
2. 但是当服务器重启时，session会丢失，依赖性高，
3. 且当session过多时，也会占用大量内存。
4. 多进程或多服务器时，同步是一个问题
5. 采用第三方服务，如redis等，也需要成本
默认时采用cookie-session,
1. 客户端序列化，服务器不需要保持任何数据，
2. 适合小型应用，低成本解决持久化和横向扩展的问题。
3. 浏览器对于Cookie大小有限制，不能存入太多的信息
4. Cookie每次请求都要携带，Session过大时，每次请求需要额外开支
5. 静态资源采用CDN，除了多服务器提高响应速度以外，另外一个优点也是可以避免带着Cookie

```ts
//typing/index.d.ts
import 'egg';
declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>;
  }

  interface Context  {
    genHash(plainText: string):Promise<string>,
    compare(plainText: string, hash: string):Promise<boolean>,
  }
  interface EggAppConfig {
    bcrypt:{
        saltRounds: number
    }
  }
  //添加sessionStore，sessionMap属性
  interface Application {
    sessionMap:{
      [key: string]: any
    },
    sessionStore:any
  }
}
```
```ts
//app.ts
constructor(app: Application) {
    this.app = app;
    (app as any).sessionMap = {};
    (app as any).sessionStore = {
      async get(key: string) {
        app.logger.info(`get session ${key}`);
        return (app as any).sessionMap[key];
      },
      async set(key: string, value: any) {
        app.logger.info(`set session ${(key)}--${value}`);
        (app as any).sessionMap[key] = value;
      },
      async destroy(key: string) {
        app.logger.info(`destroy session ${key}`);
        delete (app as any).sessionMap[key];
      }
    };
}
```






### JWT token

1. Header,描述JWT的元数据，加密算法，以及类型；
2. Payload，存放传递的数据
3. Signature，签名，防止数据被篡改，使用私钥加密

优点：
4. token是无状态的，服务器不需要记录任何信息，不占用内存
5. 多进程、多服务器没有影响；
6. 如果不记录在cookie里，跨域无影响，记录在Header里面
7. 和服务器解耦，任何设备可以生成token
缺点：
1. 无法废弃，token存在客户端
2. 空间更大，所有数据通过base64编码，增加传输时间


### Egg实现JWT登录

### jsonwebtoken使用
1. 安装jsonwebtoken及其类型声明文件
2. 使用sign方法生成token，verify方法验证token
```ts
//在登录的时候
import { sign,verify } from 'jsonwebtoken';
const token = sign({username:user.username},app.config.secret,{expiresIn: '10h'})
```
```ts
//在验证token的时候
getTokenValue(){
  const { ctx} = this;
  const { authorization } = ctx.headers;
  //Authorization: Bearer <token>
  if(!ctx.header || !authorization ){
    return false
  }
  if(typeof authorization ==='string'){
    const parts = authorization.split(' ');
    if(parts.length === 2){
      const scheme = parts[0];
      const token = parts[1];
      if(/^Bearer$/i.test(scheme)){
        return token
      }else {
        return false
      }
    }
  }else {
    return false
  }
}
const token = this.getTokenValue();
  if(!token){
    return ctx.helper.error({ ctx, errType: 'loginValidateFail' });
  }
  try {
    const decoded = verify(token,app.config.secret)
    return ctx.helper.success({ ctx, res: decoded });
    //"data": {
      // "username": "qiuyicc@qq.com",
      // "iat": 1727705764,
      // "exp": 1727741764
  // },
  } catch (error) {
    return ctx.helper.error({ ctx, errType: 'loginValidateFail' });
  }
```
3. jwt转化为中间件
```ts
//app/router.ts
const jwt = app.middleware.jwt({
  secret: app.config.jwt.secret,
});
```
```ts
//app/middleware/jwt.ts
import { Context,EggAppConfig } from "egg";
import { verify } from 'jsonwebtoken'
function getTokenValue(ctx: Context){
    const { authorization } = ctx.headers;
    //Authorization: Bearer <token>
    if(!ctx.header || !authorization ){
      return false
    }
    if(typeof authorization ==='string'){
      const parts = authorization.split(' ');
      if(parts.length === 2){
        const scheme = parts[0];
        const token = parts[1];
        if(/^Bearer$/i.test(scheme)){
          return token
        }else {
          return false
        }
      }
    }else {
      return false
    }
  }

  export default (options:EggAppConfig['jwt']) => {
    return async (ctx:Context,next:() => Promise<any>) =>{
        const token = getTokenValue(ctx)
        if(!token){
            return ctx.helper.error({ctx,errType:'loginValidateFail'})
        }
        const { secret } = options
        if(!secret){
            throw new Error('secret is required for jwt middleware')
        }
        try {
            const decoded = verify(token, secret)
            ctx.state.user = decoded
            await next()
        } catch (error) {
            return ctx.helper.error({ctx,errType:'loginValidateFail'})
        }
    }
  }
```

### egg-jwt插件使用

1. 安装egg-jwt插件
```ts
npm i egg-jwt --save
```
2. 在config/config.default.ts中配置jwt
```ts
config.jwt = {
  secret: 'your-secret',
  expiresIn: '10h',
};
```
3. 在controller中使用jwt中间件
```ts
//app/controller/user.ts
const token = app.jwt.sign({username:user.username},app.config.jwt.secret,{expiresIn: '10h'})
```
```ts
//app/router.ts
router.get('/api/users/:id',app.jwt as any, controller.user.showUser)
```
4. 对于错误的自定义捕获，利用中间件的性质捕获插件抛出的错误，返回我们自定义的错误
```ts
//app/middleware/customError.ts
import { Context } from "egg";

export default () =>{
    return async (ctx: Context, next: () => Promise<any>) =>{
        try {
            await next();
        } catch (error) {
            const err = error as any;
            if(err && err.status === 401){
                return ctx.helper.error({ctx,errType:'loginValidateFail'})
            }
            throw err
        }
    }
}
```

### egg-redis插件实现短信验证码

内部逻辑实现，未使用云服务
```ts
//config/config.default.ts
config.redis = {
  client: {
    port: 6379,
    host: '127.0.0.1',
    password: '123456',
    db: 0,
  },
};
```
```ts
//发送验证码
async sendVerifyCode() {
  const { ctx, app } = this;
  const { phoneNumber } = ctx.request.body;
  const errorRes = this.validateUserInput(userPhoneRules);
  if (errorRes) {
    return ctx.helper.error({
      ctx,
      errType: 'userValidateFail',
      error: errorRes,
    });
  }
  //检查redis中是否有发送记录
  const preVertifyCode = await app.redis.get(
    `phoneVertifyCode-${phoneNumber}`
  );
  //如果有记录，则返回错误
  if (preVertifyCode) {
    return ctx.helper.error({ ctx, errType: 'sendVerifyCodeFail' });
  }
  //生成短信验证码
  const vertifyCode = (Math.floor(Math.random() * 9000 + 1000)).toString();
  await app.redis.set(`phoneVertifyCode-${phoneNumber}`,vertifyCode,'ex',60)
  ctx.helper.success({ ctx, res: { vertifyCode } });
}
```


### 手机号注册登录逻辑
1. 手机号发送验证码，上步
2. 前端提交手机号和验证码，后端验证验证码
```ts
async loginByPhone() {
  const { ctx, app } = this;
  const { phoneNumber, vertifyCode } = ctx.request.body;
  //检查格式
  const errorRes = this.validateUserInput(userSendPhoneCodeRules);
  if (errorRes) {
    return ctx.helper.error({
      ctx,
      errType: 'PhoneOrVertifyCodeFial',
      error: errorRes,
    });
  }
  //检查验证码
  const preVertifyCode = await app.redis.get(
    `phoneVertifyCode-${phoneNumber}`
  );
  if (!preVertifyCode || preVertifyCode !== vertifyCode) {
    return ctx.helper.error({ ctx, errType: 'loginVertifyCodeFail' });
  }
  //登录
  const token = await ctx.service.user.loginByPhoneNumber(phoneNumber);
  return ctx.helper.success({ ctx, res: { token } });
}
```
3. 后端验证手机号是否注册，如果注册，则直接返回token，如果未注册，则创建用户并返回token
```ts
async loginByPhoneNumber(phoneNumber:string){
  const { ctx,app } = this;
  const user = await this.findByUserName(phoneNumber); //查数据库
  //如果用户存在，则直接返回token
  if (user) {
    const token = await app.jwt.sign({username:user.username},app.config.jwt.secret)
    return token
  }
  //如果用户不存在，则创建用户
  const userCreateData: Partial<UserProps> = {
    username: phoneNumber,
    phoneNumber,
    nickName:`lego_${phoneNumber.slice(-4)}`,
    type:'phone'
  };
  const newUser = await ctx.model.User.create(userCreateData);
  const token = await app.jwt.sign({username:newUser.username},app.config.jwt.secret)
  return token
}
```

### 阿里云实现短信服务

1. 注册阿里云账号，购买短信服务
2. 登录控制台，创建AccessKey，获取AccessKeyID和AccessKeySecret
3. 安装阿里云短信SDK,并配置config
```ts
//config/config.default.ts
const aliCloudConfig = {
  accessKeyId:'省略',
  accessKeySecret:'省略',
  endpoint:"dysmsapi.aliyuncs.com"
}
```
4. 在app里添加短信服务
```ts
//app/extend/application.ts
import Dysmsapi from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client';
const ALICLIENT = Symbol('Application#aliclient');
get AliClient():Dysmsapi {
  const that = this as Application
  const { accessKeyId, accessKeySecret,endpoint } = that.config.aliCloudConfig;
  if(!this[ALICLIENT]){
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret
    })
    config.endpoint = endpoint
    this[ALICLIENT] = new Dysmsapi(config)
  }
  return this[ALICLIENT]
}
```
5. 创建发送短信service
```ts
async sendSMS(phoneNumber:string,vertifyCode:string){
    const { app } = this
    const sendSmsRequest = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: '阿里云短信测试',
      templateCode: 'SMS_154950909',
      templateParam: `{"code":"${vertifyCode}"}`
    })
    const result = await app.AliClient.sendSms(sendSmsRequest)
    return result
  }
```
6. 在controller中调用发送短信service
```ts
const result  = await this.service.user.sendSMS(phoneNumber,vertifyCode)
if(result.body?.code!== 'OK'){
  return ctx.helper.error({ ctx, errType:'sendVertifyCodeError' });
}
```

### .env文件保存敏感信息

1. 下载dotenv包，安装
```ts
npm i dotenv --save
```
2. 在项目根目录下创建.env文件，将敏感信息保存到该文件中

```ts
ACCESS_KEY_ID= xxxx,//省略
ACCESS_KEY_SECRET= xxx,//注意不要带上引号,使用的时候会自动添加
```
3. 使用
```ts
import * as dotenv from 'dotenv';
dotenv.config();
现在就可以使用process.env.xxxx获取到环境变量的值了
```
4. 添加.env到gitignore中，避免将敏感信息提交到git仓库

### OAuth2授权用户登录介绍

OAuth2是一种授权协议，它允许第三方应用访问用户的资源，而不需要获取用户的用户名和密码。
传统方式的缺陷：
1. 为了后续服务，需要保存用户的密码，增加了安全风险
2. 没法限制用户获得授权的范围和有效期
3. 用户只有修改密码，才能收回赋予第三方应用的权力
4. 只要有一个第三方应用被破解，就会导致用户密码泄露

OAuth2的优点：
1. 在客户端和服务商之间，提供了一个授权层
2. 客户不能直接登录服务商，只能登录授权层
3. 客户端登录授权层所用的令牌，与用户密码不同，用户可以在登录的时候，指定授权层令牌的权限范围和有效期

Token的优点：
1. 令牌是短期的，到期会自动失效，用户自己无法修改
2. 令牌可以被数据所有者撤销，会立即失效
3. 令牌有权限范围(scope)

OAuth2的授权方式：
1. 授权码
2. 隐藏式
3. 密码式
4. 客户端凭证

### OAuth2授权码模式

1. 点击某个第三方应用，比如gitee，跳转到gitee的授权登录页面，携带参数?client_id="xx"&redirect_uri=callback&scope=read,client_id为gitee的第三方应用id，redirect_uri为回调地址，scope为授权范围
2. 用户点击同意，跳转回callback地址，携带code参数
3. 应用向gitee发送post请求，携带https://gitee.com/oauth/token?grant_type=authorization_code&code={code}&client_id={client_id}&redirect_uri={redirect_uri}&client_secret={client_secret}
4. gitee确认信息无误，返回accesstoken、refreshtoken、token_type、scope、expires_in等参数
5. 应用拿到accesstoken，请求Gitee的API数据，拿到用户信息

::: code-group
```ts [router.ts]
router.get('/api/users/passport/gitee',controller.user.oauth) //跳转到gitee授权页面
router.get('/api/users/passport/gitee/callback',controller.user.oauthByGitee) //gitee回调地址
```
```ts [config/config.default.ts]
const giteeOauthConfig = {
  cid:process.env.CLIENT_ID,
  secret:process.env.CLIENT_SECRET,
  redirectURL:'http://localhost:7001/api/users/passport/gitee/callback', //回调地址
  authURL:'https://gitee.com/oauth/token?grant_type=authorization_code', //授权地址
  giteeUserAPI:'https://gitee.com/api/v5/user' //获取用户信息地址
}
```
```ts [controller/user.ts]
//跳转到oauth页面
async oauth(){
  const { ctx, app, service } = this;
  const { cid,redirectURL } = app.config.giteeOauthConfig
  ctx.redirect(`https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`)
}
//跳转回来后获取token
async oauthByGitee(){
  const { ctx} = this;
  const { code } = ctx.request.query
  try {
    const token = await ctx.service.user.loginByGitee(code)
    if(token){
      ctx.helper.success({ ctx, res: { token } })
    }
  } catch (error) {
    ctx.helper.error({ ctx, errType: 'giteeOauthFail' })
  }
}
```
```ts [service/user.ts]
interface GiteeUserDataType {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}
//get access token from gitee
async getAccessToken(code: string) {
  const { ctx, app } = this;
  const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig;
  const { data } = await ctx.curl(authURL, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    data: {
      code,
      client_id: cid,
      redirect_uri: redirectURL,
      client_secret: secret,
    },
  });
  return data.access_token;
}
async getGiteeUserInfo(accessToken: string) {
  const { ctx, app } = this;
  const { giteeUserAPI } = app.config.giteeOauthConfig;
  const { data } =await ctx.curl<GiteeUserDataType>(`${giteeUserAPI}?access_token=${accessToken}`, {
    method: 'GET',
    dataType: 'json',
  })
  return data;
}
async loginByGitee(code: string) {
  const { ctx, app } = this;
  const accessToken = await this.getAccessToken(code);
  const giteeUserInfo = await this.getGiteeUserInfo(accessToken);
  //检查用户是否存在
  const { id, name, avatar_url, email } = giteeUserInfo;
  const stringId = id.toString();
  const user = await this.findByUserName(`Gitee_${stringId}`)//创建Gitee_id的用户名,防止与其他平台的用户名冲突
  if (user) {
    const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret);
    return token;
  }
  const userCreateData: Partial<UserProps> = {
    oauthID:stringId,
    provider: 'gitee',
    username: `Gitee_${stringId}`,
    picture: avatar_url,
    nickName:name,
    email,
    type: 'oauth',
  }
  const newUser = await ctx.model.User.create(userCreateData);
  const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret);
  return token;
}
```
:::

### OAuth2前后端分离实现登录

1. 前端点击OAuth2按钮,window.open打开授权地址
2. OAuth2同意授权,跳转到OAuth2回调地址,携带code参数
3. 经过后续一些列处理创建用户信息和拿到access_token
4. 不直接返回access_token，而是直接渲染页面,window.opener.postMessage(access_token.'http://localhost:xx')
5. 前端使用window.addEventListener('message',(event)=>{const token = event.data;})接收access_token

::: code-group
```ts [App.vue]
<script  lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { defineComponent,onMounted } from 'vue';
import axios from 'axios';
export default defineComponent({
  components: {},
  setup() {
    onMounted(() => {
      window.addEventListener('message', (event) => {
        const {type,token} = event.data;
        if(type === 'oauth'){
          axios.get('http://localhost:7001/api/users/getUserInfo',{
            headers:{
              Authorization: `Bearer ${token}`
            }
          }).then(res => {
            console.log(res);
          })
        }
      })
    })
    const open = () => {
      window.open('http://localhost:7001/api/users/passport/gitee', '_blank', 'width=500,height=500');
    }
    const login = () => {
      axios.post('http://localhost:7001/api/users/login',{
        username:'qiuyicc@qq.com',
        password:"123456"
      }).then(res => {
        console.log(res);
      })
    }
    return {
      open,
      login
    }
  }
})
</script>

<template>
  <button @click="open">使用Gitee账号登录</button>
  <button @click="login">登录测试</button>
</template>
```
```ts [view/success.nj]
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>授权成功</title>
</head>
<body>
    <h1>授权成功</h1>
    <h1>2秒钟后关闭</h1>
</body>
<script>
window.onload = () =>{
    setTimeout(() => {
        const message = {
            type:'oauth',
            token:'{{ token }}'
        }
        window.opener.postMessage(message,'http://localhost:5173')
        window.close();
    },2000)
}

</script>
</html>
```
```ts [controller/user.ts]
  //跳转回来后获取token
  async oauthByGitee() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    try {
      const token = await ctx.service.user.loginByGitee(code);
      if (token) {
        //渲染模板，模板中使用postmessage向前端传递消息
        await ctx.render('success.nj', { token });
        // ctx.helper.success({ ctx, res: { token } })
      }
    } catch (error) {
      ctx.helper.error({ ctx, errType: 'giteeOauthFail' });
    }
  }
}
```
:::

### Egg实现CORS跨域
原理就是使用中间件在每个请求后添加响应头，允许跨域请求。
1. 安装 egg-cors 插件
```ts
npm i egg-cors --save
```
2. 在config/plugin.ts中配置插件
3. 在config/config.default.ts中配置白名单
```ts
config.cors = {
  origin:'http://localhost:5173',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
}
```

### Egg实现通用查询配置

1. 定义通用查询类型
```ts
export interface IndexCondition {
    pageIndex?: number;
    pageSize?: number;
    select?: string | string[]; //查询字段
    populate?: { path?: string; select?: string; } | string; //关联查询
    customSort?: Record<string, any>; //自定义排序
    find?: Record<string, any>; //查询条件
  }
```
2. 使用
```ts
//controller/work.ts
async myList() {
  const { ctx } = this
  const userId = ctx.state.user._id
  const { pageIndex, pageSize, isTemplate, title } = ctx.query
  const findConditon = {
    user: userId,
    ...(title && { title: { $regex: title, $options: 'i' } }),//$regex表示模糊查询,$options表示大小写敏感
    ...(isTemplate && { isTemplate: !!parseInt(isTemplate) })
  }
  const listCondition: IndexCondition = {
    select: 'id author copiedCount coverImg desc title user isHot createdAt',
    populate: { path: 'user', select: 'username nickName picture' },
    find: findConditon,
    ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
    ...(pageSize && { pageSize: parseInt(pageSize) })
  }
  const res = await ctx.service.work.getList(listCondition)
  ctx.helper.success({ ctx, res })
}
```
```ts
//service/work.ts
const defaultIndexCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: '',
  customSort: { createdAt: -1 },
  find: {},
};
async getList(condition: IndexCondition) {
  const fcondition = { ...defaultIndexCondition, ...condition };
  const { pageIndex, pageSize, select, populate, customSort, find } =
    fcondition;
  const skip = pageIndex * pageSize;
  const res = await this.ctx.model.Work.find(find)
    .select(select)
    .populate(populate as  PopulateOptions)
    .skip(skip)
    .limit(pageSize)
    .sort(customSort)
    .lean();
  const count = await this.ctx.model.Work.countDocuments(find);
  return { count, list: res, pageSize, pageIndex };
}
```

### Egg装饰器使用

```ts
//app/decorator/checkPermission.ts
import { GlobalErrorTypes } from '../error/index';
import { Controller } from 'egg';

export default function checkPermission(
  modelName: string,
  errorType: GlobalErrorTypes,
  userKey = 'user'
) {
  return function (prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller;
      //@ts-ignore
      const { ctx } = that;
      const { id } = ctx.params;
      const userId = ctx.state.user._id;
      const certianRecord = await ctx.model[modelName].findOne({id})            
      if (!certianRecord || certianRecord[userKey].toString() !== userId) {
        return ctx.helper.error({ ctx, errType:errorType });
      }
      await originalMethod.apply(this, args);
    };
  };
}
```
```ts
//app/controller/work.ts
@checkPermission('Work','workNoPermission')
async update(){
  const { ctx, service } = this;
  const { id } = ctx.params
  const payload = ctx.request.body
  const workData = await ctx.model.Work.findOneAndUpdate({id},payload,{new:true}).lean()
  ctx.helper.success({ ctx, res: workData })
}
```

### Egg文件上传之File

```ts
import { Controller } from 'egg';

export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx, app } = this;
    const file = ctx.request.files[0];
    let url = file.filepath.replace(app.config.baseDir, app.config.baseUrl);
    url = url.replace(/\\/g, '/'); //注意url中可能包含反斜杠，需要替换为正斜杠
    ctx.helper.success({ ctx, res: {url} });
  }
}
```
```ts
//config/config.default.ts
config.multipart = {
  mode: 'file',
  tmpdir:join(appInfo.baseDir, 'uploads') // 设置上传文件临时目录
}
config.static = {
  dir:[
    { prefix: '/public',dir:join(appInfo.baseDir, 'app/public') },
    { prefix: '/uploads',dir:join(appInfo.baseDir, 'uploads') } // 设置静态文件目录
  ]
}
```

使用sharp处理图片
```ts
async fileLocalUpload() {
  const { ctx, app } = this;
  const { filepath } = ctx.request.files[0];

  // 生成sharp实例
  const imageSource = sharp(filepath);
  const metaData = await imageSource.metadata(); //获取图片元数据
  let thumbFileUrl = ''
  if(metaData.width && metaData.width > 300){
      const { name,ext,dir } = parse(filepath);
      console.log('baseDir',app.config.baseDir);
      const thumbFilePath = join(dir,`${name}-thumbnail${ext}`)
      await imageSource.resize({width: 300}).toFile(thumbFilePath); //生成缩略图
      thumbFileUrl = thumbFilePath.replace(app.config.baseDir, app.config.baseUrl)
      thumbFileUrl = thumbFileUrl.replace(/\\/g, '/') //注意url中可能包含反斜杠，需要替换为正斜杠
      console.log('thumbFileUrl',thumbFileUrl);
      
  }
  let url = filepath.replace(app.config.baseDir, app.config.baseUrl);
  url = url.replace(/\\/g, '/'); //注意url中可能包含反斜杠，需要替换为正斜杠
  
  ctx.helper.success({ ctx, res: {url,thumbFileUrl:thumbFileUrl?thumbFileUrl:url} });
}
```

### Egg文件上传之Stream

```ts
pathToUrl(filepath:string) {
  const { app } = this;
  let url = filepath.replace(app.config.baseDir, app.config.baseUrl);
  url = url.replace(/\\/g, '/');
  return url
}

async fileUploadByStream() {
  const { ctx, app } = this;
  const stream = await ctx.getFileStream(); //获取上传文件流，注意只能上传单个文件
  const uuid = nanoid(6);
  const saveFilePath = join(app.config.baseDir,'uploads',uuid+extname(stream.filename)) //设置保存路径及其扩展名
  const saveThumbnailPath = join(app.config.baseDir,'uploads',uuid+'_thumbnail'+extname(stream.filename))//设置缩略图保存路径及其扩展名
  const target = createWriteStream(saveFilePath);//创建写入流
  const target2 = createWriteStream(saveThumbnailPath);
  const savePromise = new Promise((resolve, reject) => {
    stream.pipe(target)//写入文件流
    .on('finish',resolve)
    .on('error',reject)
  })
  const transformer = sharp().resize({width: 300})//创建缩略图转换器，转换流 // [!code ++]
  const saveThumbnailPromise = new Promise((resolve, reject) => {
    stream.pipe(transformer).pipe(target2)//写入缩略图流 // [!code ++]
    .on('finish',resolve)
    .on('error',reject)
  })
  await Promise.all([savePromise,saveThumbnailPromise])
  ctx.helper.success({ctx,res:{
    url:this.pathToUrl(saveFilePath),//转换文件url
    thumbFileUrl:this.pathToUrl(saveThumbnailPath)
  }})
}
```
pipe改：对于每个pipe的错误bug，需要在**每个**pipe的on('error',reject)中处理，否则会导致后续pipe无法执行，这样做很不方便，容易出错，使用pipeline方法可以解决这个问题：
```ts
import { pipeline } from 'stream/promises'; //引入pipeline方法的prmoise版本
async fileUploadByStream() {
  ............
  const savePromise = pipeline(stream,target);
  const transformer = sharp().resize({width: 300})
  const saveThumbnailPromise = pipeline(stream,transformer,target2)
  try {
    await Promise.all([savePromise,saveThumbnailPromise])
  } catch (error) {
    return ctx.helper.error({ctx,errType:'uploadFail'})
  }
  ctx.helper.success({ctx,res:{
    url:this.pathToUrl(saveFilePath),
    thumbFileUrl:this.pathToUrl(saveThumbnailPath)
  }})
}
```

### Egg文件上传之OSS

1. 安装egg-oss
```ts
npm i egg-oss --save //已经支持TS
```
2. 启用插件并配置
```ts
config.oss = {
  client:{
    accessKeyId:process.env.ACCESS_KEY_ID || '',
    accessKeySecret:process.env.ACCESS_KEY_SECRET || '',
    bucket:'my-lego-backend',
    endpoint:'oss-cn-chengdu.aliyuncs.com',
    timeout: '60s'
  }
}
```
3. 使用
```ts
async uploadToOSS() {
  const { ctx, app } = this;
  const stream = await ctx.getFileStream(); //注意getFileStream()只能上传单文件
  const saveOssPath = join('imooc-test',nanoid(6)+extname(stream.filename))//设置保存路径及其扩展名
  try {
    const res = await ctx.oss.put(saveOssPath,stream)//上传文件到OSS
    const { name,url } = res
    ctx.helper.success({ctx,res:{name,url}})
  } catch (error) {
    await sendToWormhole(stream) //使用stream-wormhole销毁上传文件流
    ctx.helper.error({ctx,errType:'uploadOSSFail'})
  }
}
```

### Egg文件上传之busboy

如果使用File模式上传多文件，直接循环数组处理即可  
使用busboy上传多文件,多个文件上传底层库，基于事件
1. 安装busboy
```ts
npm i busboy --save
npm i @types/busboy --save-dev
```
2. 编写上传文件处理函数
```ts
import  busboy from 'busboy';
..............
uploadFileUseBusboy() {
  const { ctx,app } = this;
  const resultArr:string[] = [] 
  return new Promise<string[]>((resolve, reject) => {
    const bb = busboy({ headers: ctx.req.headers });
    bb.on('file',(name,file,info)=>{
      //文件流
      const uuid = nanoid(6);
      const saveFilePath = join(app.config.baseDir,'uploads',uuid+extname(info.filename))
      const target = createWriteStream(saveFilePath);
      file.pipe(target);
      file.on('end',()=>{
        resultArr.push(saveFilePath)
      })
    })
    bb.on('field',(name,val,info)=>{
      //对于文本类型
      console.log(name,val,info);
    })
    bb.on('finish',()=>{
      resolve(resultArr)
    })
    ctx.req.pipe(bb)
  })
}
async testBusBoy(){
  const { ctx } = this;
  const res = await this.uploadFileUseBusboy()
  ctx.helper.success({ctx,res})
}
```

### Egg文件上传之co-busboy

egg内置了multipart模块，可以直接使用multipart上传文件，其底层依赖于co-busboy

![上传文件](/uploadCut.png)
```ts
async uploadMultipleByBusboy() {
  const { ctx, app } = this;
  const parts = ctx.multipart() // [!code ++]
  const part1 = await parts();
  console.log(part1); //[ 'text', 'heelo', false, false ]
  const part2 = await parts();
  console.log(part2); // FileStream 
  await sendToWormhole(part2) // 处理文件流，需要销毁，否则会卡死
  const part3 = await parts();
  console.log(part3); //underfined
}
```
使用egg内置multipart模块上传多文件
```ts
async uploadMultipleByBusboy() {
  const { ctx, app } = this;
  const parts = ctx.multipart()
  const resultArr:string[] = []
  let part: FileStream | string[]; //一种文本一种文件
  while((part = await parts())){ // [!code ++]
    if(!Array.isArray(part)){
      try {
        const uuid = nanoid(6);
        const saveFilePath = join('imooc-test',uuid+extname(part.filename))
        const result = await app.oss.put(saveFilePath,part) //上传文件到OSS
        const { url } = result //获取上传文件的url
        resultArr.push(url)
      } catch (error) {
        await sendToWormhole(part)
        return ctx.helper.error({ctx,errType:'uploadOSSFail'})
      }
    }
  }
  ctx.helper.success({ctx,res:{resultArr}})
}
```

### Egg文件上传之限制文件大小和格式

1. 在config/config.default.ts中配置
```ts
config.multipart = {
  // mode: 'file',
  // tmpdir: join(appInfo.baseDir, 'uploads'), // 设置上传文件临时目录
  whitelist:['.png','.jpg','.gif','.webp','.jpeg'],
  fileSize: '20kb' // 限制上传文件大小，光在此配置不生效
};
```
2. 修改上传文件处理函数
```ts
async uploadMultipleByBusboy() {
  const { ctx, app } = this;
  const { fileSize } = app.config.multipart // 获取文件大小限制
  const parts = ctx.multipart({
    limits:{
      fileSize:fileSize as number //传递参数给multipart模块,再传递给co-busboy底层限制文件大小
    }
  })
  const resultArr:string[] = []
  let part: FileStream | string[];
  while((part = await parts())){
    if(!Array.isArray(part)){
      try {
        const uuid = nanoid(6);
        const saveFilePath = join('imooc-test',uuid+extname(part.filename))
        const result = await app.oss.put(saveFilePath,part)
        const { url } = result
        resultArr.push(url)
        if(part.truncated){ //如果文件超出大小，会被添加truncated属性
          await ctx.oss.delete(saveFilePath) //删除上传文件，已经传递了20kb的文件到服务器，需要清除
          return ctx.helper.error({ctx,errType:'uploadFileSizeFail'})
        }
      } catch (error) {
        await sendToWormhole(part)
        return ctx.helper.error({ctx,errType:'uploadOSSFail'})
      }
    }
  }
  ctx.helper.success({ctx,res:{resultArr}})
}
```
3. 限制上传文件格式
```ts
import { Context } from "egg";
export default () =>{
    return async (ctx: Context, next: () => Promise<any>) =>{
        try {
            await next();
        } catch (error) {
            const err = error as any;
            if(err && err.status === 401){
                return ctx.helper.error({ctx,errType:'loginValidateFail'})
            } else if(ctx.path === '/api/utils/uploadMultiple'){ //上传文件接口
                if(err && err.status === 400){ //上传文件格式错误
                    //修改向外抛出的错误信息
                    return ctx.helper.error({ctx,errType:'uploadFileFormatFail',error:err.message})
                }
            }
            throw err
        }
    }
}
```

### Egg重构Router

1. 重构jwt验证
```ts
config.jwt = {
  enable: true,
  secret: process.env.JWT_SECRET || '',
  match:[ // 匹配要验证的接口
    '/api/users/getUserInfo',
    '/api/works',
    '/api/utils'
  ]
};
```
2. 重构路由
```ts
router.prefix('/api') //使用prefix方法设置路由前缀
router.post('/api/users/create', controller.user.createUserControllerByEmail);//改变前
 ====>
router.post('/users/create', controller.user.createUserControllerByEmail);//改变后
```

### Egg SSR简单使用

1. 安装Vue
```ts
npm i vue@next --save
```
2. 使用,高版本的Vue已经内置了SSR渲染器，不需要额外安装
```ts
import { createSSRApp } from 'vue'
import { renderToString,renderToNodeStream } from '@vue/server-renderer'
async renderH5Page(){
  const { ctx, app } = this;
  const ssrApp = createSSRApp({
    data:() =>({msg:'hello ssr'}),
    template:'<h1>{{msg}}</h1>'
  })
  //renderToString写法
  // const appContent = await renderToString(ssrApp)
  // ctx.response.type = 'text/html'
  // ctx.body = appContent
  // renderToNodeStream写法

  const stream = await renderToNodeStream(ssrApp)
  ctx.status = 200
  await pipeline(stream,ctx.res)
}
```

### Egg SSR渲染H5页面

```ts
//app/controller/utils.ts
async renderH5Page(){
  const { ctx, app } = this;    
  const { id:idAndUuid } = ctx.params;
  const query = this.splitIdAndUuid(idAndUuid)
  try {      
    const {html,title,desc，bodyStyle} = await this.service.utils.renderToPageData(query)      
    await ctx.render('page.nj',{html,title,desc,bodyStyle})
  } catch (error) {
    ctx.helper.error({ctx,errType:'h5WorkFail'})
  }
}
```
```ts
//app/service/utils.ts
import { Service } from "egg";
import { createSSRApp } from 'vue'
import LegoCompoents from 'lego-components'
import { renderToString } from '@vue/server-renderer'
//实现响应式，把px转为vw
pxToVw(components=[]){
    const reg = /^(\d+(\.\d+)?)px$/ //匹配px单位
    components.forEach(component => {
        const props = (component as { props: Record<string, any> }).props || {};            
        Object.keys(props).forEach(key => {  
            const val = props[key]
            if(typeof val !== 'string'){
                return 
            }
            if(reg.test(val) === false){
                return
            }
            const arr = val.match(reg) || []
            const numStr = arr[1]
            const num = parseFloat(numStr)
            const vwNum =  (num / 375) * 100             
            props[key] = `${vwNum.toFixed(2)}vw`
        })
    })
}
//对于背景style
propsToStyle(props={}){
  const keys = Object.keys(props)
  const styleArr = keys.map(key =>{
      const formatkey = key.replace(/([A-Z])/g, c =>`-${c.toLocaleLowerCase()}`)
      const value = props[key]
      return `${formatkey}:${value}`
  })
  return styleArr.join(';')
}
//渲染页面
async renderToPageData(query:{id:string,uuid:string}){
    const work = await this.ctx.model.Work.findOne(query).lean() //找到作品
    if(!work){
        throw new Error('work not found')
    }
    const {title="默认",desc="默认",content} = work
    const parseContent  = JSON.parse(content &&content as any)       
    this.pxToVw(parseContent.components)//处理响应式
    const ssrApp = createSSRApp({
        data:()=>{
            return {
                compoents:(parseContent.components) || []
            }
        },
        template:`<final-page :components="compoents"/>`, //渲染组件
    })
    ssrApp.use(LegoCompoents)//使用组件库
     const html = await renderToString(ssrApp)
    const bodyStyle = this.propsToStyle(parseContent.props)
    return {
        html,
        title,
        desc
    }
}
```
```ts 
//app/view/page.nj
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{desc}}">
    <link href="https://cdn.bootcdn.net/ajax/libs/reseter.css/2.0.0/minireseter.css" rel="stylesheet">
    <title>{{title}}</title>
</head>
<body style="{{bodyStyle}}">
    {{html | safe}}
</body>
</html>
```

### Egg SSR渲染组件库样式问题

1. 直接拷贝样式文件到public目录，然后在模板中引用  
缺点：
  1. 样组件库升级，样式有更新的时候，需要重新拷贝，非常繁琐
  2. 当有更多JS功能时候，会出现很多限制；
  3. 使用第三方库的时候不方便，也需要拷贝第三方库的umd的CSS模块到public目录，然后在模板中引用，不方便管理。

2. 使用webpack单独打包样式文件和JS文件，然后在模板中引用
```ts
npm i webpack webpack-cli //webpack安装
npm i css-loader //css加载器
npm i mini-css-extract-plugin //css提取插件
npm i html-webpack-plugin //html模板插件
npm i filemanager-webpack-plugin --save-dev //文件管理插件
npm i clean-webpack-plugin --save-dev //清理插件
```
::: code-group
```ts [webpack/index.js]
import 'lego-components/dist/lego-components.css'
```
```ts [webpack/template.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{desc}}">
    <link href="https://cdn.bootcdn.net/ajax/libs/reseter.css/2.0.0/minireseter.css" rel="stylesheet">
    <title>{{title}}</title>
</head>
<body style="{{ bodyStyle }}">
    {{html | safe}}
</body>
</html>
```
```ts [webpack/webpack.config.js]
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const buildFileDest = path.resolve(__dirname,'../app/public')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const copyTemplateFileDest = path.resolve(__dirname,'../app/view')

module.exports = {
    mode:'production',
    context: path.resolve(__dirname,'../webpack'),
    entry:'./index.js',
    output:{
        path:buildFileDest,
        filename:'bundle.[fullhash:8].js',
        publicPath:'/public/'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name].[fullhash:8].css'
        }),
        new HtmlWebpackPlugin({
            filename:'page.nj',
            template:path.resolve(__dirname,'./template.html'),
        }),
        new FileManagerPlugin({
            events:{
                onEnd:{
                    copy:[
                        {
                            source:path.join(buildFileDest,'page.nj'),
                            destination:path.join(copyTemplateFileDest,'page.nj')
                        }
                    ]
                }
            }
        })   
    ]
}
```
```ts [package.json]
"build:template":"npx webpack --config webpack/webpack.config.js"
```
:::

### Egg Webpack结合上传OSS

将webpack打包后的文件上传到OSS，实现静态资源托管
```ts
//webpack/uploadToOSS.js
const OSS = require('ali-oss');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({
    path: path.resolve(__dirname, '../.env') //注意修改路径，默认目录是根目录，而uploadToOSS.js在webpack目录下
});
const publicPath = path.resolve(__dirname, '../app/public');
const client = new OSS({
        accessKeyId:process.env.ACCESS_KEY_ID || '',
        accessKeySecret:process.env.ACCESS_KEY_SECRET || '',
        bucket:'my-lego-backend',
        endpoint:'oss-cn-chengdu.aliyuncs.com',
        timeout: '60s'  
})
async function uploadToOSS() {
    const publicFiles = fs.readdirSync(publicPath)
    const files = publicFiles.filter(fileName => fileName !== 'page.nj')
    const res = await Promise.all(files.map(async fileName => {
        const saveOssPath = path.join('h5-assets',fileName)
        const filePath = path.join(publicPath, fileName)
        const result = await client.put(saveOssPath, filePath)
        const { url } = result
        return url
    }))
    console.log('上传成功',res)
}
uploadToOSS()
```
实现webpack环境变量区分，生产环境再上传
```ts
//webpack可以接受环境变量，要把原来的对象暴露改为函数暴露
module.exports = (env) =>{
  return {
    ..............
    output: {
    path: buildFileDest,
    filename: 'bundle.[fullhash:8].js',
    publicPath: env.production?'http://my-lego-backend.oss-cn-chengdu.aliyuncs.com/h5-assets/':'/public/',
    },
  }
}
```
```ts
//package.json
"build:template:dev": "npx webpack --config webpack/webpack.config.js",
"build:template:pro": "npx webpack --config webpack/webpack.config.js --env production && npm run upload",
"upload": "node webpack/uploadToOSS.js"
```

### Egg RBAC权限控制简单使用

```ts
npm i casl/ability 
```
```ts
import { AbilityBuilder,Ability } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { pick } from 'lodash';
class Work{
  constructor(attrs){
    Object.assign(this,attrs)
  }
}
interface User{
  id:number
  role:'admin' | 'vip' | 'normal'
}
const adminUser:User = {
  id:1,
  role:'admin'
}
const vipUser:User = {
  id:2,
  role:'vip'
}
const normalUser:User = {
  id:3,
  role:'normal'
}
const vipWork = new Work({
  id:1,
  author:2,
  content:"hello world",
  title:"hello",
  uuid:123456
  isTemplate:true
})
const normalWork = new Work({
  id:2,
  author:3,
  content:'test',
  title:'test',
  uuid:654321,
  isTemplate:false
})

const WORK_FIELDS = ['id','title','content','uuid','isTemplate'] //所有可修改的字段
const options = { fieldsFrom:rule => rule.fields || WORK_FIELDS }

function defineRules(user:User){
  const { can,cannot,build } = new AbilityBuilder(Ability);
  if(user.role === 'admin'){
    can('manage','all')
  }else if(user.role === 'vip'){
    can('download','Work')
    can('delete','Work',{author:user.id})
    can('update','Work',[title,content,uuid],{author:user.id})
  }else if(user.role === 'normal'){
    can('read','Work')
    can('delete','Work',{author:user.id})
    can('update','Work',[title,content],{author:user.id})
  }
  return build()
}
const rules = defineRules(adminUser)
console.log(rules.can('read','Work'));
console.log(rules.can('delete','Work'));
console.log(rules.can('update','Work'));

const rules2 = defineRules(vipUser)
console.log(rules2.can('read','Work'));
console.log(rules2.can('delete',vipWork)); //true
console.log(rules2.can('update',normalWork)); //false
console.log(rules2.can('update',normalWork,"title")); //true
console.log(rules2.can('update',normalWork,"uuid")); //true

//获取用户可修改的对应字段
const fileds = permittedFieldsOf(rules2,'update',vipWork,options) //['title', 'content', 'uuid']
const fields2 = permittedFieldsOf(rules2,'update',normalWork,options) //['title', 'content']

//normal user request body
const reqBody = {
  title:'new title',
  content:'new content', 
  uuid:123456 //只有vip用户可以修改uuid
}
const rawWork = pick(reqBody,fileds) //只保留可修改的字段
```


### Egg 结合CASL实现RBAC权限控制

app/decorator/checkPermission.ts
```ts
import { GlobalErrorTypes } from '../error/index';
import { Controller } from 'egg';
import defineRules from '..//roles/roles'
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { difference,assign } from 'lodash/fp'

//普通casl方法映射
const caslMethodMapping:Record<string, string> = {
  GET:"read",
  POST:"create",
  PATCH:"update",
  DELETE:"delete"
}

interface IOptions {
  action?:string //自定义action
  key?:string //查找数据时使用的key，默认为id
  value?:{type:'params' | 'body',valueKey:string} //查询数据时value的来源，默认为params
  // { "channels.id":ctx.request.body.workId }
}

interface ModelMapping {
  mongoose:string;
  casl:string
} 

/**
 * @param modelName 模型名称 
 * @param errorType 错误类型
 * @param options 选项
 * @returns function 装饰器
 */
const fieldsOptions = { fieldsFrom: rule => rule.fields || [] }
const defaultOptions = { key: 'id', value: { type: 'params', valueKey: 'id' } }
export default function checkPermission(
  modelName: string | ModelMapping,
  errorType: GlobalErrorTypes,
  options?: IOptions
) {
  return function (prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller;
      //@ts-ignore
      const { ctx } = that;
      const { method } = ctx.request;
      const searchOptions = assign(defaultOptions,options || {})
      const { key, value } = searchOptions
      const {type,valueKey } = value
      const source = type === 'params'? ctx.params : ctx.request.body
      const query = {
        [key]: source[valueKey]
      }//获取查询query格式参数
      const mongooseModelName = typeof modelName === 'string'? modelName : modelName.mongoose
      const caslModelName = typeof modelName === 'string'? modelName : modelName.casl
      let permission = false;
      let keyPermission = true;
      const action = (options && options.action)?options.action:caslMethodMapping[method];//自定义action
      if(!ctx.state && !ctx.state.user){
        return ctx.helper.error({ ctx, errType:errorType });
      }
      const ability = defineRules(ctx.state.user)
      const rule = ability.relevantRuleFor(action,caslModelName)//返回一个定义在roles中与给定操作和模型名称相关的权限规则      
      if(rule && rule.conditions){
        //如果rule中有受限查寻条件
        const certianRecord = await ctx.model[mongooseModelName].findOne(query).lean()
        permission = ability.can(action,subject(caslModelName,certianRecord))
      }else {
        permission = ability.can(action,caslModelName)
      }      
      //判断rule中是否有受限字段
      if(rule && rule.fields){
        const fields = permittedFieldsOf(ability,action,caslModelName,fieldsOptions)
        if(fields.length > 0){
          //1. 使用pick过滤没有权限的字段
          //2. 将请求字段和允许字段做比较
          const payLoadKeys = Object.keys(ctx.request.body)
          const diffKeys = difference(payLoadKeys,fields)  
          keyPermission = diffKeys.length === 0
        }
      }
      if (!permission || !keyPermission) {
        return ctx.helper.error({ ctx, errType:errorType });
      }
      await originalMethod.apply(this, args);
    };
  };
}
```
```ts
//roles/roles.ts
import { createMongoAbility,AbilityBuilder } from '@casl/ability'
import { Document } from 'mongoose'
import { UserProps } from '../model/user'

export default function defineRules(user: UserProps & Document<any,any,UserProps>) {
    const { can,build } = new AbilityBuilder(createMongoAbility)
    if(user){
        if(user.role === 'admin'){
            can('manage', 'all')
        }else {
            can('read','User',{_id:user._id})
            can('update','User',['nickName','picture'],{_id:user._id})

            can('create','Work',['title','desc','content','coverImg'])
            can('read','Work',{user:user._id})
            can('update','Work',['title','desc','content','coverImg'],{user:user._id})
            can('delete','Work',{user:user._id})
            can('publish','Work',{user:user._id})

            can('create','Channels',['name','workId'],{user:user._id})
            can('read','Channels',{user:user._id})
            can('update','Channels',['name'],{user:user._id})
            can('delete','Channels',{user:user._id})
        }
    }
    return build()  
}
```
```ts
//使用
@checkPermission({casl:'Channels',mongoose:'Work'},'workNoPermission',{value:{type:"body",valueKey:'workId'}})
```

### Egg 开发和部署模式

本地开发：
1. 使用了egg-bin启动项目，提供开发、调试、测试，监控文件修改等功能
2. 采用配置config.default.ts，启动命令为egg-bin dev

生产环境运行：
1. PM2-process manager，提供进程管理、负载均衡、日志管理等功能
2. cluster模式运行
3. 自动重启auto-reload
4. 热替换hot-reload
5. 性能监控，Monitoring

Egg生产环境：
1. 内置了egg-scripts,egg-cluster
2. 配置文件为config.prod.ts + config.default.ts
3. 需要先进行编译，然后启动进程

```ts
npm run tsc
npm run start
npm run stop
```
```ts
"scripts": {
  "start": "egg-scripts start --daemon --title=egg-server-egg_backend", // [!code ++]
  "stop": "egg-scripts stop --title=egg-server-egg_backend", // [!code ++]
  "dev": "egg-bin dev", // [!code ++]
  "test:local": "egg-bin test -p",
  "test": "npm run lint -- --fix && npm run test:local",
  "cov": "egg-bin cov -p",
  "ci": "npm run lint && npm run cov && npm run tsc && npm run clean",
  "lint": "eslint . --ext .ts --cache",
  "tsc": "tsc", // [!code ++]
  "clean": "tsc -b --clean",
  "build:template:dev": "npx webpack --config webpack/webpack.config.js",
  "build:template:pro": "npx webpack --config webpack/webpack.config.js --env production && npm run upload",
  "upload": "node webpack/uploadToOSS.js"
},
```

### Egg 三种不同进程

1. Master进程：1个，负责启动应用，监控应用进程，管理应用进程，进程间消息转发等，稳定性非常高
2. Agent进程：1个，有一些特殊性质的工作，不能多个worker一起合作完成，容易造成混乱，egg.js提供了一个新的agent_worker进程，专门处理一些特殊的任务，稳定性高
3. Worker进程：cpu核数，负责处理HTTP请求，执行业务代码，稳定性一般；
   
4. 使用egg-scripts启动master process
5. 使用egg-cluster启动和CPU核数相等的app worker process
6. 使用egg-cluster启动一个独特的agent_worker process

进程守护：
1. 当代码抛出错误但是并没有被捕获，worker使用process.on('uncaughtException',Handler)捕获对应的错误,这时候进程会与Master进程disconnect，Master进程会重新启动fork一个worker进程。
2. 系统异常，当一个进程出现异常导致crash或者被系统杀死时，Master会立即fork一个新的worker进程







## Egg错误记录

### 解决ts报错 not used

声明某些变量却未使用,解决办法：
1. 使用 @ts-ignore 注释：在未使用的行上方添加 // @ts-ignore 注释，这样 TypeScript 将忽略该行的错误检查
```ts
// @ts-ignore
import { unusedVariable } from 'some-module';
```
2. 配置 tsconfig.json：可以在 tsconfig.json 文件中配置 noUnusedLocals 和 noUnusedParameters 选项。设置为 false 将会关闭这些规则。
```ts
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

### 解决ESlint和prettier格式化冲突

解决办法：
1. 安装 eslint-config-prettier 包，它可以禁用所有与 Prettier 冲突的 ESLint 规则
```ts
npm install --save-dev eslint-config-prettier
```
2. 在ESLint 配置文件中（如 .eslintrc.js 或 .eslintrc），将 prettier 添加到 extends 数组的最后：
```ts
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // 其他您使用的规则
    "prettier"
  ],
  // 其他配置...
};
```

### 解决egg模块定义不提示错误

在app下编写了controller、extend等模块下的某些方法，但是在使用时，egg无法提示的编写的方法，  
解决办法：
```ts
npm i egg-ts-helper --save-dev
github地址：https://github.com/eggjs/egg-ts-helper/blob/master/README.zh-CN.md
```

### Egg连接MongDB时无法提示

在egg连接mongdb时，向app上挂载数据库db对象，虽然在typings下的index.d.ts中重载了Application的类型，但是在app.ts中还是无法提示，其他controller、service等模块可以正常提示,后续使用正常，未解决此错误，使用@ts-ignore注释，留作记录：
:::code-group
```ts [typing/index.d.ts]
import 'egg';
import { Connection } from 'mongoose';

type NewConnection = Connection
declare module 'egg' {
  interface Application {
    mongoose: NewConnection;
  }
}
```
```ts [app.ts]
constructor(app: Application) {
  this.app = app;
  const { url } = this.app.config.mongoose;
  assert(url, 'config.mongoose.url is required');
  const db = createConnection(url);
  db.on('connected',()=>{
      app.logger.info('Mongoose connection open to ' + url);
  })
  //@ts-ignore
  app.mongoose = db; // [!code ++]
}
```
::: 

### mongodb连接disconnected

::: danger
2024-09-29 12:36:30,006 ERROR 15136 [egg-mongoose] mongodb://localhost:27017/lego disconnected
2024-09-29 12:36:30,029 ERROR 15136 nodejs.MongoServerSelectionError: [egg-mongoose]connect ECONNREFUSED ::1:27017
原因：使用了本机的IPv6地址，而mongodb默认只监听IPv4地址，导致连接失败。
IPv4:127.0.0.1
IPv6:[::1]
:::
解决办法：
```ts
const uri = 'mongodb://127.0.0.1:27017/lego';
```

## Egg 错误未解决

### npm run start启动报错：
Egg 在tsc编译后，使用npm run start 启动时报错：
::: danger
node:events:497
      throw er; // Unhandled 'error' event
      ^

Error: spawn node ENOENT
    at ChildProcess._handle.onexit (node:internal/child_process:286:19)
    at onErrorNT (node:internal/child_process:484:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)

Emitted 'error' event on ChildProcess instance at:  
    at ChildProcess._handle.onexit (node:internal/child_process:292:12)  
    at onErrorNT (node:internal/child_process:484:16)  
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {  
  errno: -4058, 
  code: 'ENOENT',  
  syscall: 'spawn node',  
  path: 'node',  
  spawnargs: [  
    '--no-deprecation',  
    '--trace-warnings',  
    '--require',  
    'F:\\test_backend\\node_modules\\source-map-support\\register.js',  
    'F:\\test_backend\\node_modules\\egg-scripts\\lib\\start-cluster',  
    '{"title":"egg-server-egg_backend","baseDir":"F:\\\\test_backend",   "framework":"F:\\\\test_backend\\\\node_modules\\\\egg"}',  
    '--title=egg-server-egg_backend'  
  ]  
}  
:::
找不到node，但是node已经配置了环境变量,node及node -v正常使用，留待


### npm run start 启动报错：

上步没解决，改了下启动命令
```ts
G:\mysoft\Node.js\node.exe egg-scripts start --daemon --title=egg-server-egg_backend --ignore-stderr
```
::: danger
Error: Cannot find module 'F:\test_backend\egg-scripts'  
    at Module._resolveFilename (node:internal/modules/cjs/loader:1225:15)  
    at Module._load (node:internal/modules/cjs/loader:1051:27)  
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:174:12)  
    at node:internal/main/run_main_module:28:49 {  
  code: 'MODULE_NOT_FOUND',  
  requireStack: []  
:::
又改了下，启动不报错了，但是启动后，没有效果,访问不了,留待
```ts
G:\mysoft\Node.js\node.exe F:\test_backend\node_modules\egg-scripts start --daemon --title=egg-server-egg_backend --ignore-stderr
```



