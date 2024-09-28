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


