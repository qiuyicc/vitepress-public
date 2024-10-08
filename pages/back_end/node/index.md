# Node 再学习

学习 Node.js

## 初识 Node

node.js 是 js 的运行时环境，而不是一门编程语言；
node.js 适合 IO 密集型应用，而不适合 CPU 密集型应用。CPU 因为 node.js 单线程原因，容易造成 CPU 占用率过高。
如果要处理 CPU 密集型应用(大量的数据结构+算法)，可以使用 C++编写插件或者使用 node.js 提供的 cluster 。

```js
NPM常用指令：
npm -init
npm install 包名
npm uninstall	包名
npm config list 查看node及npm的版本
npm get registry 获取镜像地址
npm config set registry 地址 设置镜像地址
npm login //登录npm
npm publish //发布包
version版本号三段式：1.2.3：主版本号(重大更新) + 次版本号(功能更新) + 修订号(bug更新)
devDependencies：安装开发依赖    npm i 包名 -D
dependencies：生产依赖 npm i  包名 -S
peerDependencies：给编写插件人员或者编写npm包的开发人员去使用的
```

### npm i 的时候发生了什么

npm i 的时候发生了什么：
所有的依赖都会存放在根目录的 mode_modules 下，默认采用扁平化的方式安装，并且排序规则安装.bin 为第一个，@xx 为第二个，再按照首字母排序，使用广度优先算法，首先处理根目录下的所有依赖，之后逐层处理每个依赖包的依赖。
扁平化？：
理想状态下，在安装某层某个级别的模块时，如果发现同一层的某个依赖也使用了相同的依赖，则会提高这个依赖至同层，方便复用；如果依赖版本号不一致，则不会提高，还是会分别安装
![思路图](/package.png)

### package.json 基本配置

```js
//例如
"node_modules/@babel/parser": {
      "version": "7.24.5",//版本号
      "resolved": "https://registry.npmmirror.com/@babel/parser/-/parser-7.24.5.tgz",//下载地址
      "integrity": "sha512-EOv5IK8arwh3LI47dz1b0tKUb/1uhHAnHJOrjgtQMIpu1uXd9mlFrJg9IUgGUgZ41Ch0K8REPTYpO7B76b4vJg==",//检查包完整性的hash
      "bin": { //存在一个可执行文件
        "parser": "bin/babel-parser.js"
      },
      "dev":true,//是否是开发依赖
      "engines": { //使用node模块的最低版本
        "node": ">=6.0.0"
      }
    },
//缓存的基本原理：
  通过integrity + version + name(例如:node_modules/@babel/parser),生成唯一的一个key；
  使用npm config list || npm config ls -l  查看cache位置
  //cache = "C:\\Users\\Qiuyi\\AppData\\Local\\npm-cache"
  //_cacache文件即为缓存的文件夹，index-v5里面即为key值(索引值)，如果能对上，就去content-v2
  //里面找到对应的缓存文件解压到node_modules
```

### npm run dev 发生了什么

在当前的项目查找有没有 node_modules/.bin //所有可执行命令存放在地方

在全局的 node_modules 查找 //使用 npm config list 查找 prefix 字段

环境变量中查找

报错

package.json 中某些字段执行的生命周期

preXX : "xxx" //带有 pre 前缀，在 XX 命令之前做点什么

XX："xxx" //XX 命令

postXX:"xxx" //带有 post 前缀，在 XX 命令之后做点什么

### npx

npx 是一个命令行工具，它允许用户在不安装全局包的情况下，运行已安装在本地项目中的包或者远程仓库中包。

npx 的作用是在命令行中运行 node 包中的可执行文件，而不需要全局安装这些包。

npx 优势： 1.避免全局安装 2.总是使用最新版本，如果你本地没有相应的 package，npx 会从 npm 上下载；
3.npx 不仅可以执行 scripts 里面的命令，还可以执行任何的 nppm package；
npx 和 npm 的区别：

npx 侧重于执行命令，虽然会安装模块，但是重在执行某个命令；

npm 侧重于安装或者卸载某个模块，重在安装，并不具备执行某个模块的功能；

### 发布一个 npm 包

npm adduser

npm login

npm get registry //注意需要 npm 官网的源

npm publish

### npm 私服

1.离线使用，将私服部署到内网集群，实现离线使用； 2.提高包的安全性,私有的 npm 仓库可以更好的管理包； 3.提高包的下载速度

//使用库 npm i verdaccio -g

//verdaccio --help 查看命令

//verdaccio 运行

//在项目中使用还需设置 npmrc 文件

//registry=xxx

//npm i 首先会从我们指定的源安装，如果没有，则公网安装

### 全局变量

全局变量
定义一个全局变量,需要注意代码的执行顺序，global.xxx = xxxx

跨平台：根据环境自动判断,如果在浏览器则是 window，在 node 为 gobal

globalThis.xxx = xxx

node 没有 DOM 和 BOM，ECMAScript 可用，**dirname 具体到文件夹，**filename 具体到文件夹下面的文件

process process.argv 获取执行命令时传递的参数

process.cwd() //获取当前进程目录

process.exit //杀死进程

process.on("xx",()=>{}) //监听事件

### CSR、SSR、SEO

CSR、SSR、SEO
如果需要在 node 中操作 DOM，可以使用三方库 npm i jsdom

SSR 与 CSR 的区别：

1.页面加载方式
CSR 由服务器返回一个初始的 html 文件，然后浏览器下载并执行 JS 文件，JS 负责动态生成并更新内容。初始页面加载时，内容较少，页面结构和样式存在一定延迟，首屏加载慢；SSR，在服务器返回给浏览器之前，已经在服务器端生成完整的 HTML 页面，包含了初始的页面内容，浏览器接收的是已经渲染好的 HTML 页面，首屏加载速度快。

2.内容生成和渲染
CSR 中，页面的内容生成和渲染是由客户端 JS 负责的，当数据变化时，JS 会重新生成并更新 DOM，从而实现内容动态变化。这种方式使得前端开发更加灵活，可以创建复杂的交互和动画效果。SSR 中，服务器生成最终的 HTML 页面，这意味着对一些静态或少变的内容，可以提供更好的首屏加载速度。

3.用户交互和体验
对 SSR 来说，返回的是渲染好的 HTML 页面，可以提供更好的首屏加载速度和更好的 SEO

SEO：搜索引擎优化，是指通过对网站的 URL、标题、描述、关键字等进行优化，让搜索引擎更容易找到网站，从而提高网站的排名。SEO 对于大型网站来说尤为重要，因为搜索引擎的爬虫是通过抓取网站的 URL 来索引的，如果网站的 URL 不好，搜索引擎很难抓取到网站，从而影响网站的排名。
TDK 原则：
T：title
D：description
K：keywords
语义化标签
一个页面一个 H1，a 标签 href，1 个 main 标签
CSR 应用：ToB 后台管理系统，大屏可视化，不需要很高的 SEO 支持；
SSR 应用：ToC 密集型应用，新闻网站，博客网站，电子商务等，需要更高的 SEO

## Node.js 模块系统

### path 模块

path 模块在不同的操作系统上是有差异的,posix：表示可移植操作系统接口，相当于一套标准，比如把 Linux 系统的代码移植到 Windows 上，就需要用到 posix。Windows 并没有完全遵循 posix 标准，比如 windows 在设计采用了不同的 posix 的路径表示方法，windows 中使用反斜杠 \ 作为路径分隔符，posix 系统使用的正斜杠 /

```js
basename //返回给定路径的最后一部分
path.basename("/foo/bar/baz/index.html")  //index.html
path.posix.basename("xx")//模拟posix
dirname //返回路径目录名
path.dirname("\\foo\\bar\\baz\\index.html") // \foo\bar\baz
extname //返回路径扩展名(后缀),返回值是带点后面的值，如果没有点，返回空值；如果有多个点，返回最后一个点最后的内容；
path.extname("index.js") //.js
join //拼接路径
path.join("/a","/b","/c") // \a\b\c
path.join("/a","/b","/c","../") // \a\b\ 支持操作符
resolve //解析路径，返回绝对路径
path.resolve("/a","/b","/c") //如果都是绝对路径，返回最后一个 \c
path.resolve("./index.js") //如果只有一个相对路径，返回当前工作目录的绝对路径 F:\project\demo\index.js
path.resolve(__dirname,"./index.js") //同上
parse //解析路径，返回一个对象
path.parse("/home/user/dir/dile.txt")
//{ root: "/',dir:"/home/user/dir",base:"file.txt",ext:".txt",name:"file" }
format //对上面的parse对象进行逆向操作
path.format({....})
path.sep //windows返回的是\，posix返回的是/
```

### os 模块

os 模块提供了一些系统操作相关的 API，可以获取系统信息、环境变量、用户信息等。

```js
platform //获取操作系统的平台
os.platform() //win32
release //获取操作系统版本号
os.release() //10.0.0
type
os.type() //windows_NT
version
os.version() //Windows 10 Home China
可以用来实现open：true,底层就是通过获取操作系统从而实现打开浏览器
```

```js
//实现构建工具的open方法
const os = require("node:os");
const { exec } = require("child_process");
const platform = os.platform();
const open = (url) => {
  if (platform == "darwin") {
    exec(`open ${url}`);
  } else if (platform === "win32") {
    exec(`start ${url}`);
  } else if (platform === "linux") {
    exec(`xgd-open ${url}`);
  }
};
```

homedir //获取用户目录 //底层使用了 echo %userprofile%，
os.homedir() => C:\Users\Qiuyi

arch //获取 CPU 架构，安卓中使用较多，os.arch() //x64

cpus //获取 cpu 的一些信息，os.cpus().length => 返回电脑线程数
os.cpus() => 返回 cpu 对象信息

networkInterfaces => 返回网络信息数组

### process 模块

process 模块提供了当前 Node.js 进程的相关信息，可以获取当前进程的执行环境、执行路径、命令行参数、退出状态等。

arch => 返回 CPU 架构,process.arch() //x64

platform => 返回操作系统平台，process.platform //win32

argv => 返回进程信息，为数组，process.argv

```js
//执行node index.js --version
=> process.argv
[
  'G:\\mysoft\\Node.js\\node.exe',//运行脚本的编译器
  'F:\\vite-project\\index.js',//运行文件
  '--version' //运行参数
]
```

cwd =>返回工作目录，为绝对路径，process.cwd() //F:\vite-project，
注意在 esm 下\_\_dirname 不可用，可以使用 process.cwd()代替

memoryUsage //返回内存信息对象

exit => 退出进程 process.exit()，
process.on("exit",()=>{})//监听 exit

kill => 杀死进程,需要传递进程 ID，
process.kill(process.kid)

env => 返回环境变量，获取操作系统所有的环境变量，可以修改，但只在当前进程生效,不会影响系统的环境变量

process.env 可用于区别生产环境或开发环境，使用 cross-env 设置环境变量

```js
"dev":"cross-env NODE_ENV=dev node index.js"
"build":"cross-env NODE_ENV=prod node index.js"
//读取
//process.env.NODE_env
//跨平台原理
//区分不同的平台，再调用相应的命令设置环境变量
//windows  set设置
//posix   export设置
```

### child_process 模块

child_process 模块提供了创建子进程的 API，可以用来执行 shell 命令、执行 Node.js 脚本、创建进程池等。

exec //异步方法，回调函数，返回 buffer，可以帮我们执行 shell 命令，或者跟软件进行交互，执行较小的 shell 命令，上限 200KB
execSync() //execSync 同步

```ts
exec("node -v", (err, stdout, stderr) => {
  if (err) {
    return err; //错误
  }
  console.log(stdout); //标准输出流
  console.log(stderr); //失败输出流
});
const a = execSync("node -v --参数传递");
console.log(a.toString() + "--execSync");
//v18.16.0 --execSync
//v18.16.0

//还可用于软件交互
// execSync("G:\\mysoft\\QQmusic\\QQMusic.exe")
// execSync("start chrome https://www.baidu.com")
```

```ts
const {stdout} = spawn('netstat',["-a"]//传递参数为数组,options//配置项)
stdout.on("data",(msg)=>{
    console.log(msg.toString())
})
stdout.on("close",(msg)=>{
    console.log("结束")
})
```

options 配置：{

cwd:string,子进程的当前工作目录;

env:object,环境变量键值对；

encoding:string，默认为"utf-8";

shell:string,用于执行命令的 shell；

timeout:number,超时时间；

maxBuffer:number，stdout 或 stderr 允许的最大字节数；

killSignal：string,默认为"SIGTERM"；

uid:number，设置该进程的用户标识;

gid：number,设置该进程的组标识

}

execFile //执行可执行文件

execFile(path.resolve(\_\_dirname,"./xxx"),null,(err,stdout,stderr)=>{
}))

//底层实现顺序
exec -> execFile -> spawn
fork //只能接收 JS 模块,可以将耗时的应用放入执行

fork 通过 InterProcessCommunication(IPC)实现通讯，IPC 基于 libuv 实现，

(windows named pipe //管道) (posix unix domain socket //套接字)
::: code-group

```ts [index.js]
const testProcess = fork("./test.js"); //返回一个子进程
testProcess.send("父传递的消息"); //给子进程传递消息
testProcess.on("message", (msg) => {
  console.log(msg); //接收子进程的消息
});
```

```ts [test.js]
process.on("message", (msg) => {
  console.log(msg); //子进程监听消息
});
process.send("子传递的消息"); //给主进程传递消息
```

:::

### ffmpeg 操作音视频

跨平台的视频处理的程序

ffmpeg [全局参数] [输入文件参数] -i [输入文件] [输出文件参数] [输出文件]

```ts
execSync("ffmpeg -i test.mp4 test.gif", { stdio: "inherit" }); //转为gif
execSync("ffmpeg -i test.mp4 test.avi", { stdio: "inherit" }); //转为avi
execSync("ffmpeg -i test.mp4 test.mp3", { stdio: "inherit" }); //保留音频
execSync("ffmpeg -ss 5 -to 10 -i test.mp4 test2.mp4", { stdio: "inherit" }); //截取5 -10s
//添加水印
execSync(
  'ffmpeg -ss 5 -to 10 -i test.mp4 -vf drawtext=text="QIUYI":fontsize=30:x=10:y=10:fontcolor=white test3.mp4',
  { stdio: "inherit" }
);
execSync("ffmpeg  -i test3.mp4 -vf delogo=w=150:h=30:x=10:y=10 test4.mp4", {
  stdio: "inherit",
}); //消除水印
```

### events 模块

events 模块提供了事件驱动模型，可以用来处理异步事件，可以用来实现发布订阅模式。

```ts
import { EventEmitter } from "node:events";
const bus = new EventEmitter();
bus.setMaxListeners(20); //设置最大监听数
bus.getMaxListeners(); //获取最大监听数
bus.once("test", (msg) => {
  console.log(msg); //once只会执行一次
});
const fn = (msg) => {
  console.log(msg);
};
bus.on("test", fn); //订阅,默认最多监听10个
bus.off("test", fn); //解绑
bus.emit("test", "qiyi"); //发布

//process可以使用on、once等方法
//因为process底层继承了EventEmitter原型，并且挂载到了全局Global上面，使得process可以全局调用
```

### utils 模块

utils 模块提供了一些实用函数，可以用来处理数组、对象、字符串等。

```ts
import util from "node:util";
//promisify 返回包装后的promise函数
const execPromise = util.promisify(exec);
exec("node -v", (err, stdout, stderr) => {});
execPromise("node -v")
  .then((res) => {
    console.log(res);
    //{ stdout: 'v18.16.0\r\n', stderr: '' }
  })
  .catch((err) => {});

//callbackify
const fn = (type) => {
  if (type == 1) {
    return Promise.resolve("success");
  } else {
    return Promise.reject("error");
  }
};
const callbackify = util.callbackify(fn);
callbackify(1, (err, value) => {
  console.log(err, value);
});
```

```ts
//实现promisify
const myPromisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...values) => {
        //注意返回为对象,把stdout合stderr包装为values
        if (err) {
          reject(err);
        }
        if (values && values.length > 1) {
          let obj = {};
          for (let key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
          //注意最终结果拿到不stdout合stderr
          //node使用kCustomPromisifyArgsSymbol 没有对外提供
        } else {
          resolve(values[0]);
        }
      });
    });
  };
};
```

```ts
//实现callbackify
const myCallbackify = (fn) => {
  return (...args) => {
    let callback = args.pop(); //当有多个参数传递进来时，获取最后一个回调函数
    fn(...args)
      .then((res) => {
        //fn为promise
        callback(null, res);
      })
      .catch((err) => {
        callback(err);
      });
  };
};
```

```ts
format //格式化，使用方法和C语言的printf一致
util.format("%s----%s","qiu","yi") //qiu---yi
%s:匹配字符串;
%d:匹配数字
%i:除BigInt和Symbol外的所有值;
%f：除Symbol外的所有值;
%o:Object,包括不可枚举属性
%j:json;
%O:Object,不包括不可枚举属性
%%:%字符
```

### pngquant 压缩 png

```ts
exec("pngquant 1.png --output test.png");
//quality数字越高质量越好，体积越大；数字越小，质量越低，体积更小
exec("pngquant 1.png --quality=80 --output test1.png");
//speed 1-10,数字越小越慢，质量高；越大越快，质量一般
exec("pngquant 1.png --quality=80 --output test1.png");
```

### fs 模块

fs 模块提供了文件系统操作相关的 API，可以用来读写文件、创建目录、删除文件等。
fs 的原理是通过底层透传给 libuv 完成的,
fs 的 IO 操作都是由 libuv 完成的，而其他的宏任务为 node 完成,在一些执行时机上，可能宏任务会优于 libuv 完成

#### readFile

```ts
import fs from "node:fs"; //普通的fs模块
import fs2 from "node:fs/promises"; //fs的promise
//异步readRile
fs.readFile(
  "./readme.txt",
  {
    encoding: "utf-8",
    flag: "r",
  },
  (err, data) => {
    if (err) throw err;
    console.log(data);
  }
);
//注意同步阻塞代码
const res = fs.readFileSync("./readme.txt"); //返回一个Buffer
console.log(res.toString());
console.log("test");

fs2
  .readFile("./readme.txt")
  .then((res) => {
    console.log(res.toString());
  })
  .catch((err) => {});

//处理大文件的时候使用，可读流,输出为一段一段的输出
const readStream = fs.createReadStream("./readme.txt");
readStream.on("data", (chunk) => {
  console.log(chunk.toString());
});
readStream.on("end", () => {
  console.log("读取完成");
});
```
```ts
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
const server = createServer()
server.on("request", (req, res) => {
  const data = createReadStream("./bigFile.txt");
  data.pipe(res)
})
server.listen(8000)
```

#### mkdir

```ts
//创建文件夹
fs.mkdirSync("./test/demo/demo1", {
  recursive: true, //递归创建文件夹是的选择配置
});
//删除文件夹
fs.rmSync("./test", {
  recursive: true,
});
```

#### rename&watch

```ts
fs.renameSync("./readme.txt", "./test.txt");
```

```ts
//可以监听到文件的变化
fs.watch("./test.txt", (event, filename) => {
  console.log(event, filename);
});
```

```ts
fs.writeFileSync("./test.txt", "Node"); //覆盖原来的
fs.writeFileSync("./test.txt", "Node222", {
  flag: "a", //追加
});
fs.appendFileSync("./test.txt", "Vue"); //专门的追加API
```

#### writeStream

```ts
let writeStream = fs.createWriteStream("./index.txt");
let arr = [
  "第一行第一行第一行",
  "第二行第一行第一行",
  "第三行第一行第一行",
  "第四行第一行第一行",
];
arr.forEach((item) => {
  writeStream.write(item + "\n");
});
writeStream.end(); //注意要结束，要不然会一直开启
writeStream.on("finish", () => {
  console.log("写入完成");
});
```

#### 软链接和硬链接

```ts
//pnpm底层原理
//硬链接，共享文件，备份文件，同一个内存地址，原始文件删除，备份文件还在
//源地址         //硬链接地址
fs.linkSync("./index.txt", "./index2.txt");

//软链接  注意需要管理员权限powershell,是指向另一个文件或目录的引用，一旦删除原始文件，则软链接文件打不开
fs.symlinkSync("./index2.txt", "./index3.txt");
```

#### unlink

```ts
fs.unlinkSync是Node.js中的文件系统模块中的一个方法，
用于同步删除指定路径的文件或符号链接。通过调用该方法，
可以直接删除指定路径的文件或符号链接，而不需要通过回调函数的方式进行处理。
const fs = require('fs');

const fileToDelete = 'example.txt';
//参数是一个字符串，表示要删除的文件或符号链接的路径。
fs.unlinkSync(fileToDelete);
```

#### appendFileSync

```ts
fs.appendFileSync是Node.js中文件系统模块中的一个方法，
用于同步地向指定文件追加内容。该方法会将指定的数据追加到文件的末尾，
并且会阻塞当前进程直到操作完成。
const fs = require('fs');

const file = 'example.txt';
file：要追加内容的文件的路径
const data = 'Hello, World!';
data：要追加的内容，可以是字符串、Buffer或Uint8Array
fs.appendFileSync(file, data, 'utf8');
options：可选参数，可以是一个字符串表示文件编码（默认为'utf8'）或一个包含编码和标志属性的对象。
```

### crypto 密码

//提供通用的加密和哈希算法,底层为 C/C++

#### 对称加密

```ts
//第一个参数 algorithm 接收一个算法 通常aes-256-cbc
//第二个参数 key 密钥 32位
//第三个参数 iv 初始化向量 支持16位 保证密钥串每次是不一样的 密钥串缺位还可以补码
let key = crypto.randomBytes(32);
let iv = Buffer.from(crypto.randomBytes(16));
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
cipher.update("秋忆", "utf-8", "hex");
const result = cipher.final("hex"); //输出密文，16进制
console.log(result); //57b22c18821fdc8983bb4fee29811b46

//解密 相同的算法 相同的key 相同的iv
const de = crypto.createDecipheriv("aes-256-cbc", key, iv);
de.update(result, "hex", "utf-8");
console.log(de.final("utf-8")); //秋忆
```

#### 非对称加密

```ts
//生产公钥和私钥，管理员拥有私钥
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048, //长度越长越安全，越慢
});
//加密
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from("秋忆"));
console.log(encrypted.toString("hex"));
//解密
const decrypted = crypto.privateDecrypt(privateKey, encrypted);
console.log(decrypted.toString());
```

#### 哈希

```ts
//不能被解密，因为是单向的
let hash = crypto.createHash("sha256");
let hash1 = crypto.createHash("md5");
hash.update("秋忆");
hash1.update("秋忆");
console.log(hash.digest("hex"));
console.log(hash1.digest("hex"));
//83acf11daa7056312997de2e872eebf77a49ab63f5cb82311d9613dce5a43b57
//9612de9ed00927d7750a7192197e93f7

//不一定安全，因为他们具有唯一性,每一个算法对密码生成的hash都是一样的，可以撞库去
//匹配密码

//校验文件的一致性
//前端读取文件,拿到md5传给后端，后端拿到文件内容生成md5
//跟前端的md5匹配，如果一致，则文件没问题
```

### 编写一个脚手架

需要用到库:commander 用于构建命令行工具的库, inquirer 命令行交互的库, ora 用于在命令行界面显示加载动画的库
,download-git-repo 用于下载 Git 仓库的库

1.初始化 package.json

2.下载用到的三方库

3.编写一个 index 脚本

```ts
#!/usr/bin/env node
//告诉操作系统使用node执行脚本
console.log("test");
```

4.执行 npm link 命令做软连接，将文件挂载到全局，在 package.json 中配置 bin 配置对象

```json
  "type": "module",
  "bin": {
    "test-cli":"src/index.js"
  },
```

5.完善脚本
::: code-group

```ts [index.js]
#!/usr/bin/env node
//告诉操作系统使用node执行脚本
import { program } from "commander";
import fs from "node:fs";
import inquirer from "inquirer";
import { checkPath, downloadTemp } from "./utils.js";
let json = fs.readFileSync("./package.json");
json = JSON.parse(json);
program.version(json.version);
//添加一个自定义命令
program
  .command("create <projectName>")
  .alias("bbb")
  .description("创建项目")
  .action((projectName) => {
    inquirer
      .prompt([
        {
          type: "input", //输入input 确认confirm list选择框 checkbox多选
          name: "projectName", //返回值的key
          message: "请输入项目名称",
          default: projectName, //默认
        },
        {
          type: "confirm",
          name: "isTs",
          message: "是否使用Ts",
        },
      ])
      .then((res) => {
        if (checkPath(res.projectName)) {
          console.log("文件夹已经存在");
          return;
        }
        if (res.isTs) {
          downloadTemp("ts", res.projectName);
        } else {
          downloadTemp("js", res.projectName);
        }
      });
  });
program.parse(process.argv);
```

```ts [utils.js]
import fs from "node:fs";
import downloadGitRepo from "download-git-repo"; //git模板下载
import ora from "ora"; //动画
const spinner = ora("下载中....");
export const checkPath = (path) => {
  if (fs.existsSync(path)) {
    return true;
  } else {
    return false;
  }
};

export const downloadTemp = (branch, name) => {
  return new Promise((resolve, reject) => {
    downloadGitRepo(
      `direct:https://gitee.com/chinafaker/vue-template.git#${branch}`,
      name,
      { clone: true },
      (err) => {
        spinner.start();
        if (err) {
          spinner.fail("下载失败");
          reject(err);
        }
        resolve();
        spinner.succeed("下载完成");
      }
    );
  });
};
```

:::

### markdown 转 html

需要用到的库：EJS(模板引擎) Marked(一款 Markdown 解析器和编译器) BrowserSync(实时预览和同步网页更改)

ESJ 语法：

<%= 变量或表达式 %> //进行转义

<%- xx %>//不进行转义

<%-include('文件路径') %> //引入其他模板

<% if () {%> //条件判断

<% }%>
::: code-group

```ts [template.ejs]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title></title>
</head>
<body>
    <%- content %>
</body>
</html>
```

```ts [index.js]
const ejs = require("ejs");
const marked = require("marked");
const fs = require("node:fs");
const browserSync = require("browser-sync");
let browser;
const serve = () => {
  browser = browserSync.create();
  browser.init({
    server: {
      baseDir: "./",
      index: "index.html",
    },
  });
};
const init = (callback) => {
  const md = fs.readFileSync("./readme.md", "utf-8");
  ejs.renderFile(
    "template.ejs",
    {
      content: marked.parse(md),
      title: "Markdown to HTML",
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      fs.writeFileSync("./index.html", data);
      callback && callback();
    }
  );
};
//实现热更新
fs.watchFile("readme.md", (cur, pre) => {
  if (cur.mtime !== pre.mtime) {
    init(() => {
      //防止多开一个监听,只需要重新加载就行
      browser.reload();
    });
  }
});
init(() => {
  serve();
});
```

:::

### zlib 压缩

对数据进行压缩和解压缩，减少数据的传输大小和提高性能，gzip 采用 LZ77 和哈夫曼编码，适用于文件压缩，deflate 更快，适用于网络传输、HTTP 编码
::: code-group

```ts [gizp]
const zlib = require("node:zlib");
const fs = require("node:fs");
//压缩
// const ReadStream = fs.createReadStream('./index.txt')
// const WriteStream = fs.createWriteStream('./index2.txt.gz')//后缀需要为.gz
// //用管道来处理
// ReadStream.pipe(zlib.createGzip()).pipe(WriteStream)

//解压
const ReadStream = fs.createReadStream("./index2.txt.gz");
const WriteStream = fs.createWriteStream("./index.txt");
ReadStream.pipe(zlib.createGunzip()).pipe(WriteStream);
```

```ts [deflate]
const zlib = require("node:zlib");
const fs = require("node:fs");
//压缩
// const ReadStream = fs.createReadStream('./index.txt')
// const WriteStream = fs.createWriteStream('./index2.txt.deflate')//deflate
// //用管道来处理
// ReadStream.pipe(zlib.createDeflate()).pipe(WriteStream)

//解压
const ReadStream = fs.createReadStream("./index2.txt.deflate");
const WriteStream = fs.createWriteStream("./index.txt");
ReadStream.pipe(zlib.createInflate()).pipe(WriteStream);
```

```ts [应用]
const serve = http.createServer((req, res) => {
  let txt = "秋忆".repeat(1000); //6.2KB
  res.setHeader("Content-Encoding", "deflate");
  res.setHeader("Content-type", "text/plan;charset=utf-8");
  // let result = zlib.gzipSync(txt) //239B
  let result = zlib.deflateSync(txt); //230B
  res.end(result);
});
serve.listen(3000, () => {
  console.log("服务器启动...");
});
```

:::

### HTTP 模块

HTTP 模块是 Node.js 提供的用于处理 HTTP 请求和响应的模块，可以用于开发 Web 服务器、客户端、爬虫等。
::: tip
反向代理： 1.负载均衡，反向代理可以根据预先定义的算法将请求分发到后端服务器，以实现负载均衡，避免某个服务器出现过载。

2.高可用性。通过反向代理，可以将请求转发到多个后端服务器，以提供冗余和故障转移。

3.缓存和性能优化，反向代理可以缓存静态资源或经常访问的内容，以减轻后端服务器的负载并提高响应速度，还可以通过压缩、合并等优化算法提高网络性能。

4.安全性，反向代理可以作为防火墙，保护后端服务器免受恶意请求和攻击。

5.域名和路径重写，反向代理可以根据特定的规则进行路径重写，以实现 URL 路由和重定向，可以提高系统架构的灵活性和可维护性。
:::
::: code-group

```ts [小案例]
const http = require("node:http");
const url = require("node:url");
http
  .createServer((req, res) => {
    //为true开启序列化为对象形式
    const urlObj = url.parse(req.url, true);
    console.log(urlObj.query);
    if (req.method === "POST") {
      if (urlObj.pathname === "/login") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(data);
        });
      } else {
        res.statusCode = 404;
        res.end("404");
      }
    } else if (req.method === "GET") {
      res.end("GET");
    }
  })
  .listen(3000, () => {
    console.log("3000端口监听中....");
  });
```

```ts [反向代理]
const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./proxy.config");
const html1 = fs.readFileSync("./index.html");
http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url); //解析路径
    const proxyList = Object.keys(config.serve.proxy); //拿到代理路径
    if (proxyList.includes(pathname)) {
      //代理
      const proxy = createProxyMiddleware(config.serve.proxy[pathname]);
      proxy(req, res, (err) => {});
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(html1);
  })
  .listen(80);
```

```ts [proxy.config.js]
module.exports = {
  serve: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api2": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
};
```

```ts [3000.js]
//3000.js,代理服务器
const http = require("node:http");
const url = require("node:url");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    if (pathname === "/api") {
      res.end(" proxy success");
    }
  })
  .listen(3000, () => {
    console.log("3000端口启动....");
  });
```

:::

### HTTP 动静分离及缓存

动静分离是一种 Web 服务架构常用的优化技术，将动态生成的内容与静态资源分开处理和分发。
::: tip
优点：

1.性能优化，将静态资源与动态内容分离可以提高网站的加载速度，由于静态资源往往是不变的，可以使用 CDN 或浏览器缓存存储，减少网络请求和数据传输的开销。

2.负载均衡，通过将动态请求分发到不同的服务器或服务上，可以平衡多个服务器的负载；

3.安全性，通常静态资源是公开的，二动态请求可能涉及敏感数据或需要特定的身份验证和授权。
:::
::: code-group

```ts [动静分离]
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import mime from 'mime'
const server  = http.createServer((req,res)=>{
    const {url,method} =  req
    //静态
    if(method === 'GET' && url.startsWith('/static')){
        const staticPath = path.join(process.cwd(),url)
        const type = mime.getType(staticPath)
        const result = fs.readFileSync(staticPath);
        // console.log('缓存了吗');
        res.writeHead(200,{
            'content-type':type,//通过mime库自动判断类型
            'cache-control':'public,max-age=100' //设置缓存
        })
        res.end(result)
    }
    //动态
    if(method === 'POST' && url.startsWith('/api')){
      .......
    }
})
server.listen(3000,()=>{
    console.log('3000端口监听中...');
})
```

:::

### 邮件服务

::: tip 1.任务分配与跟踪，邮件服务可以用于分配任务，指派工作和跟踪项目进展。

2.错误报告和故障排除，当程序出现错误时，可以通过邮件将错误报告发送给团队成员或相关方。

3.自动化构建和持续集成，在持续集成和自动化构建过程中，邮件服务可以用于通知团队成员构建状态，单元测试结果和代码
覆盖率等信息。
:::
//用到的库 js-yaml(存放密码和授权码，不能明文写在代码里) ndoemailer(发送邮件)

```ts
import nodemailer from 'nodemailer'
import yaml from 'js-yaml'
import fs from 'node:fs'
import http from 'node:http'
import url from 'node:url'
const yamlInfo = yaml.load(fs.readFileSync('./mail.yaml', 'utf-8'))
//初始化邮件
const transport = nodemailer.createTransport({
    service: 'qq',
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: yamlInfo.user,
        pass: yamlInfo.pass
    }
})
http.createServer((req, res) => {
    const { pathname } = url.parse(req.url)
    if (req.method === 'POST' && pathname === '/send/mail') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            const {to,subject,text} = JSON.parse(data)
            //发送邮件
            transport.sendMail({
                to,//给谁发
                from:yamlInfo.user,//谁发的
                subject,//标题
                text//内容
            })
        })
        res.end('ok')
    }
}).listen(3000, () => {
    console.log('3000端口监听中...');
})

//mail.yaml
user: 17968xxxx@qq.com
pass: gqgmwhxxxxxx
```

### Express

::: code-group

```ts [基本使用]
import express from "express";

const app = express();
app.use(express.json()); //支持post请求解析json
app.get("/get", (req, res) => {
  console.log(req.query); //获取参数
  res.send("GET");
});

app.post("/post", (req, res) => {
  console.log(req.body); //获取参数
  res.send("POST");
});

app.get("/get/:id", (req, res) => {
  console.log(req.params); //获取参数
  res.send("动态参数");
});
app.listen(3000, () => {
  console.log("服务启动...");
});
```

```ts [路由]
import User from "./user.js";
import middleware from "./middleware.js";
//注册中间件
app.use(middleware);
app.use("/user", User);
//user.js
import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({
    code: 200,
    msg: "注册成功",
  });
});

router.post("/register", (req, res) => {
  res.json({
    code: 200,
    msg: "登录成功",
  });
});

export default router;
```

```ts [日志插件]
import log4js from "log4js"; //日志插件
log4js.configure({
  appenders: {
    //指定日志输出目标，可以定义多个
    out: {
      type: "stdout",
      layout: {
        //指定输出格式化方式
        type: "colored",
      },
    },
    file: {
      filename: "logs/server.log", //路径
      type: "file", //类型
      maxLogSize: 1000, //最大大小
      backups: 3, //保留的备份数量
      compress: true, //是否启用压缩
    },
  },
  categories: {
    //指定日志级别和输出目标的对应关系，可以定义多个
    default: {
      //指定默认的输出目标和日志级别
      appenders: ["out", "file"], //指定输出目标，可以是单个或多个，对应appenders中的输出目标名称。
      level: "debug", //指定输出目标的日志级别，包括：trace、debug、info、warn、error、fatal等。
    },
    //levels  全局日志级别
    //pm2 pm2中的配置参数
  },
});
const logger = log4js.getLogger("default");
//next 为是否执行下一个中间件
//如果不写就会一直卡住
const middleware = (req, res, next) => {
  logger.debug(`[${req.method}] ${req.url}`);
  next();
};
export default middleware;
```

:::

### 防盗链

::: tip
防盗链是指在网页中或在其他网络资源中，通过直接链接到其他网站上的图片、视频或媒体文件，从而显示在自己的网页上，这种行为通常会给被链接的网站带来额外的带宽消耗和浪费，且可能侵犯原始网站的版权。
防止防盗链：

1. 使用 Referrer 字段，该字段表明了请求资源的来源网站；
2. 使用访问控制列表 ACL，网站管理员可以配置服务器的访问控制列表，只允许特定的域名或 IP 地址访问资源，其他来源的请求将被拒绝。
3. 防盗链插件或脚本，一些网站平台或开发工具可能配置了专门的插件或脚本来防止防盗链；
4. 使用水印技术，在图片或视频上添加水印来帮助用户识别盗链行为；
   :::
   ::: code-group

```ts [exampel.js]
import express from "express";
const app = express();
//创建白名单
const whiteList = ["localhost"];
const preventHotLingking = (req, res, next) => {
  const referer = req.get("referer");
  if (referer) {
    const urlParams = new URL(referer);
    if (!whiteList.includes(urlParams.hostname)) {
      res.setHeader("Cache-Control", "no-store");
      res.status(403).send("禁止访问");
      return;
    }
  }
  console.log(referer);
  next();
};
app.use(preventHotLingking);
//初始化静态资源
// app.use(express.static('static'))
app.use("/assets", express.static("static"));
app.listen(3000, () => {
  console.log("服务已经启动...");
});
```

:::

### 请求和跨域

::: code-group

```ts [后端]
import express from "express";

const app = express();
app.use("*", (req, res, next) => {
  //跨域，获取不到session以及安全问题
  //* || 具体网址
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  //支持预检请求
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE, OPTIONS, HEAD, OPTIONS,PATCH"
  );
  //让cors支持application/json
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
//a=1&b=2           //new FormData    //纯文本
//cors 默认只支持application/x-www-form-urlencoded multipart/form-data text/plain
//不支持 application/json
//预检请求OPTIONS请求
//Content-tyope：application/json;
//自定义请求投
//非普通请求
app.get("/info", (req, res) => {
  //自定义的响应头,需要暴露出去前端才能读到
  res.set("qiuyi", "123");
  res.setHeader("Access-Control-Expose-Headers", "qiuyi");
  res.json({
    code: 200,
    msg: "成功",
    data: {
      name: "张三",
      age: 18,
    },
  });
});
app.patch("/patch", (req, res) => {
  res.json({
    code: 200,
    msg: "成功",
    data: {
      name: "张三",
      age: 18,
    },
  });
});
//WebSocket 全双工
//SSE 单工(适合大屏)
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream"); //SSE
  setInterval(() => {
    res.write("event:test\n");
    res.write(`data: ${Date.now()}\n\n`);
  }, 1200);
});
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

```ts [前端]
<script>
        // fetch('http://localhost:3000/info',{
        //     method:'GET',
        //     headers:{
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res=>{
        //     console.log(res.headers.get('qiuyi'));
        //    return res.json()
        // }).then(res=>{
        //     console.log(res);
        // })
        let sse = new EventSource('http://localhost:3000/sse')
        //默认是message
        // sse.addEventListener('message', function(event){
        //     console.log(event.data);
        // })
        //自定义test
        sse.addEventListener('test',(event)=>{
            console.log(event.data);
        })
    </script>
```

:::

### knex

Knex 是一个基于 JS 的查询生成器，它允许你使用 JS 代码来生成和执行 SQL 查询语句，无需直接编写 SQL 语句。

```ts
import yaml from "js-yaml";
import fs from "node:fs";
import express from "express";
import knex from "knex";
const app = express();
app.use(express.json());
const dbyaml = fs.readFileSync("./db.config.yaml", "utf8");
const dbconfig = yaml.load(dbyaml);
//连接数据库
const db = knex({
  client: "mysql2",
  connection: dbconfig.db,
});
//创建表模型
db.schema
  .createTableIfNotExists("list", (table) => {
    table.increments("id");
    table.string("name");
    table.integer("age");
    table.string("address");
    table.timestamps(true, true);
  })
  .then(() => {
    console.log("created table");
  });
//事务，用于保持原子的一致性，要么都成功，要么都回滚
db.transaction(async (trx) => {
  try {
    //假设1转2 100元 如果出现错误
    await trx("list").update({ money: -100 }).where({ id: 1 });
    await trx("list").update({ money: +100 }).where({ id: 2 });
    await trx.commit(); //提交事务
  } catch (error) {
    trx.rollback(); //回滚
  }
})
  .then(() => {
    console.log("ok");
  })
  .catch((error) => {
    console.log(error);
  });
//查询全部
app.get("/", async (req, res) => {
  const data = await db("list").select();
  const total = await db("list").count("* as total");
  //可以自定义sql
  db.raw("select * from users").then((res) => {
    console.log(res);
  });
  //左、右连接
  const a = await db("users")
    .select()
    .rightJoin("userdata", "users.id", "userdata.user_id");
  console.log(a);
  //降序
  const b = await db("list").select().orderBy("id", "desc");
  console.log(b);
  res.json({
    data,
    total: total[0].total,
    //可以使用toSQL().sql输出sql语句，方便调试
    sql: db("list").count("* as total").toSQL().sql,
  });
});
//查询单个
app.get("/user/:id", async (req, res) => {
  const data = await db("list").select().where({ id: req.params.id });
  res.send(data);
});
//编辑
app.post("/update", async (req, res) => {
  const { address, age, name, id } = req.body;
  await db("list").update({ address, age, name }).where({ id });
  res.send({ code: 200, data: "ok" });
});
//新增
app.post("/create", async (req, res) => {
  const { address, age, name } = req.body;
  await db("list").insert({ address, age, name });
  res.send({ code: 200, data: "ok" });
});
//删除
app.delete("/delete/:id", async (req, res) => {
  await db("list").delete().where({ id: req.params.id });
  res.send({ code: 200, data: "ok" });
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

### prisma

::: tip

1. npm i prisma -g
2. prisma init -h
3. prisma init --datasource-provider mysql
4. 修改.env 配置文件
5. 在 schema.prisma 文件中创建表模型
   :::
   ::: code-group

```ts [schema.prisma]

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

//编写表结构
//文章表
model Post {
  id Int @id @default(autoincrement())
  title String
  content String
  author User @relation(fields: [authorId],references: [id])
  authorId Int
}

//用户表
model User {
  id Int @id @default(autoincrement())
  name String
  age Int
  email String @unique //唯一
  posts Post[] //一对多
}
```

```ts [案例]
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
//新增
app.post("/create", async (req, res) => {
  const { name, email, age } = req.body;
  await prisma.user.create({
    data: {
      name,
      email,
      age,
      posts: {
        create: [
          {
            title: "文章1",
            content: "文章1的内容",
          },
          {
            title: "文章2",
            content: "文章2的内容",
          },
        ],
      },
    },
  });
  res.send({ code: 200 });
});
//编辑
app.post("/update", async (req, res) => {
  const { id, name, email, age } = req.body;
  await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email,
      age,
    },
  });
  res.send({ code: 200 });
});
app.get("/get", async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  res.send(users);
});
//单个查询
app.get("/getOne/:id", async (req, res) => {
  const row = await prisma.user.findMany({
    where: {
      id: Number(req.params.id),
    },
    include: {
      posts: true,
    },
  });
  res.send(row);
});
//删除
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  //级联删除
  //post表引用了user表的外键
  await prisma.post.deleteMany({
    where: {
      authorId: Number(id),
    },
  });
  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.send({ code: 200 });
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

:::

### JWT

JWT F:\prisma-dev
JSON Web Token,基于 JSON 的安全令牌。
JWT 由三部分组成，通过(.)进行分隔：
Header，包含了令牌的类型和使用的加密算法等信息，通常采用 Base64 编码；
Payload：包含了身份验证和授权等信息，如用户 Id，角色，权限等，也可以自定义其他相关信息，采用 Base64 编码；
Signature：使用指定的密钥对头部和负载进行签名，以确保令牌的真实性和完整性。
JWT 工作流程：
::: tip

1. 用户通过提供有效的凭证(如用户名和密码)进行身份验证；
2. 服务器验证凭证，并生成一个 JWT 作为响应，JWT 包含了用户的身份和其他必要的数据。
3. 将 JWT 发送给客户端；
4. 客户端在后续的请求中，将 JWT 放入请求的头部或其他适当的位置；
5. 服务器在接收到请求时，验证 JWT 的签名以确保其完整性和真实性，如果验证通过，服务器使用 JWT 中的信息进行授权和身份验证。
   :::
   依赖:
6. passport ,一个流行的用于身份验证和授权的 Node.js 库
7. passport-jwt, passport 库的一个插件，用于支持使用 JSON Web Token 进行身份验证和授权；
8. jsonwebtoken, 生成 token 库

### 定时任务

::: tip

1. 执行后台任务，如数据备份，日志清理，缓存刷新等，通过设置合适的时间间隔，可以确保这些任务按计划进行；
2. 执行定期操作：定时任务可以用于执行定期操作，如发送电子邮件、生成报告、更新数据等
3. 调度任务和工作流，协调复杂的任务和工作流程；
   通过三方库 node-schedule，一般定时任务都使用 cron 表达式去表示时间
   :::
   ::: code-group

```ts [introduce]
import schedule from 'node-schedule'

// corn表达式
//”* * * * * *“ 秒(0-59) 分(0-59) 时(0-23) 天(1-31) 月(1-12) 星期(0-6)
schedule.scheduleJob('*/5 * * * * *',function(){
    console.log('schedule job');//每5秒执行一次
})
每个字段可接受特殊字段：
数值：表示具体的时间单位；
范围：使用-连接起始和结束的数值，如1-5
通配符：*表示匹配该字段的所有可能值，如*每分钟、每小时等
逗号分隔：使用,分隔多个数值或范围，表示匹配其中任意一个值，如1,3表示1或3
步长：使用/表示步长，用于指定的间隔的数值，如*/5,表示每隔5个单位执行一次
特殊字符：cron表达式还支持一些特殊字符来表示特定含义，如?用于代替日和星期中的任意
值，L表示最后一天，W表示最近的工作日
```

```ts [案例]
//每5秒掘金签到一次
import schedule from "node-schedule";
import request from "request";
import config from "./myconfig.js";
schedule.scheduleJob("*/5 * * * * *", function () {
  request(
    config.check_url,
    {
      method: "POST",
      headers: {
        Referer: config.baseurl,
        cookie: config.cookie,
      },
    },
    function (err, response, body) {
      console.log(body);
    }
  );
});

//myconfig.js
export default {
  baseurl: "https://juejin.cn/",
  // aid:'2608',
  // uuid:'7227030707385992739',
  cookie: "sessionid=118be6cd351c28ed9ca4d7ddf47014b4",
  check_url:
    "https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=72270307073859927",
};
```

:::

### Serverless
Serverless 是一种构建和运行应用的方式，它将应用部署到云端，由云提供计算资源和服务，而无需用户管理服务器。
函数即服务 FaaS：在云函数里面操作数据库并提供 API 给前端，前端也可以操作数据库了；
后端即服务 BaaS:提供了一组预构建的后端服务，如身份验证，数据库存储，文件存储等，以简化应用程序的开发，开发人员直接使用 BaaS 平台的 API 和 SDK，无需自己构建和维护后端基础设施。
::: info
// npm i @serverless-devs/s -g

1. 生成密钥https://ram.console.aliyun.com/manage/ak
2. 配置密钥 s config add
3. 检查密钥 s config get -a [别名]
4. 创建项目 s
5. 在创建目录下执行 s deploy 部署
   报错：GET /tempBucketToken failed with 403. requestid: 1-665b147c-13f1cbf7-e8b221f62f55, message: FC service is not enabled for current user..
   解决：开通 FC 函数计算控制台，https://fc.console.aliyun.com/
6. 设置函数及返回值,记得部署代码，点击触发器拿到公网地址
   https://link.juejin.cn/target=https%3A%2F%2Ffcnext.console.aliyun.com%2Fcn-beijing%2Ffunctions
7. 调用
   :::
   ::: code-group

```ts [serverless.html]
    <script>
        fetch('https://server-ess-test-xvtpqinmel.cn-beijing.fcapp.run',{
            method:'POST',
        })
        .then(res=>res.json()).then(data=>{
            console.log(data);
        })
    </script>
```
:::

### Net

提供了用于创建基于网络的应用程序的 API，主要用于创建 TCP 服务器和 TCP 客户端，以及处理网络通信，也可以实现上层的协议，如 HTTP，websocket 等
::: code-group

```ts [server.js]
import net from "node:net";

const server = net.createServer((socket) => {
  setInterval(() => {
    //发送
    socket.write("hello world");
  }, 2000);
  //监听消息
  socket.on("data", (e) => {
    console.log(e.toString());
  });
});

server.listen(3000, () => {
  console.log("server is listening on port 3000");
});
```

```ts [client.js]
import net from "node:net";

const client = net.createConnection({
  port: 3000,
  host: "127.0.0.1",
});

client.on("data", (e) => {
  console.log(e.toString());
});

client.write("send message");
```

```ts [实现一个HTTP]
import net from 'node:net'


const html = `<h1>HTTP</h1>`

const reponseHeader = [
    'HTTP/1.1 200 OK',
    'Content-Type: text/html',
    'Content-Length:'+ html.length,
    '',
    html,
]
const server = net.createServer(socket=>{
    socket.on('data',(e)=>{
        socket.write(reponseHeader.join('\r\n'));
        console.log(reponseHeader.join('\r\n'));
        socket.end();
    })
})

server.listen(3000, ()=>{
    console.log('server listen on 3000');
})
```
:::

### socket.io
Socket.io 是一个基于 Node.js 的实时通信框架，它实现了 WebSocket 协议，可以实时地与浏览器进行双向通信。

聊天室案例：
::: code-group
```ts [index.js]
import http from "node:http";
import { Server } from "socket.io";
const server = http.createServer();

const io = new Server(server, {
  cors: {
    //跨域
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const groupMap = {};
io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    if (name && room) {
      socket.join(room);
      if (groupMap[room]) {
        groupMap[room].push({ name, room, id: socket.id });
      } else {
        groupMap[room] = [{ name, room, id: socket.id }];
      }
      socket.emit("groupMap", groupMap); //本窗口
      socket.broadcast.emit("groupMap", groupMap); //向全体窗口公布
      socket.broadcast.to(room).emit("message", {
        //加入群聊广播,自己收不到
        name: "管理员",
        message: `${name}加入了群聊`,
      });
    }
  });
  socket.on("message", ({ name, message, room }) => {
    //发送消息
    socket.broadcast.to(room).emit("message", {
      name,
      message,
    });
  });
  socket.on("disconnect", () => {
    //断开连接
    Object.keys(groupMap).forEach((item) => {
      let leave = groupMap[item].find((item) => item.id === socket.id);
      if (leave) {
        socket.broadcast.to(leave.room).emit("message", {
          name: "管理员",
          message: `${leave.name}离开了群聊`,
        });
        groupMap[item] = groupMap[item].filter((item) => item.id !== socket.id);
      }
    });
    socket.broadcast.emit("groupMap", groupMap);
  });
});

server.listen(3000, () => {
  console.log("server is listening on port 3000");
});
```

```ts [index.html]
    <script type="module">
        const sendMessage = (message) => {
            const div = document.createElement('div');
            div.className ='main-chat';
            div.innerText = `${message.name}:${message.message}`;
            main.appendChild(div)
        }
        let name = prompt('请输入您的名字')
        let room = prompt('请输入您的房间')
        const group = document.querySelector('.groupList')
        const main = document.querySelector('.main')
        const ipt = document.querySelector('.ipt')
        import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
        const socket = io('ws://localhost:3000'); //ws的地址
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Enter'){
                e.preventDefault();
                socket.emit('message',{
                    name,
                    message:ipt.innerText,
                    room,
                })
                sendMessage({
                    message:ipt.innerText,
                    name:name
                })
                ipt.innerText = ''
            }
        })
        socket.on('connect',()=>{
            socket.emit('join',{name,room})
            socket.on('groupMap',(data)=>{
                console.log(data);
                group.innerText = ``
                Object.keys(data).forEach(key=>{
                    const item = document.createElement('div');
                    item.className = 'groupList-items';
                    item.innerText = `房间名称:${key} 房间人数:${data[key].length}`
                    group.appendChild(item)
                })
            })
            socket.on('message',(data)=>{
                sendMessage(data)
            })
        })
    </script>
```

:::

### 图片预览的方法
1.URL.createObjectURL()，静态方法，创建一个DOMString，返回一个本地内存容器的URL地址，URL和document绑定，表示制定的file对象，可以直接打开预览 ，直接返回，同步执行，清楚方式只有unload()或revokeObjectURL()手动清除
2. FileReader.readAsDataURL()，异步方法，通过回调执行，将文件内容读取为base64编码，然后显示在img标签的src属性上，按照JS垃圾回收机制自动从内存中清理
3. Jest模拟ceateObjectURL()
```ts
window.URL.createObjectURL = jest.fn(() =>{
  return 'test.url'
})
```

### 