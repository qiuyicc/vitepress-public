# SQL

## MySQL

### sql基础

```ts
mysql -uroot -p //使用mysql
show databases;//展示数据库
use 数据库名;//使用数据库
show tables;//展示表
select * from 表名//查看表的全部内容
```

### sql表单语句

```ts{7}
show databases;//查看数据库
create database 库名;//创建数据库,不能重复创建
 create database if not exists test;//避免重复创建
 create database if not exists test3
    -> default character set = "utf8mb4";//创建utf8字符集

//安装Database Client JDBC扩展插件，并连接数据库
-- CREATE TABLE `user` (
--     id int NOT NULL//不为空 PRIMARY KEY//主键 AUTO_INCREMENT//自增,
--     name VARCHAR(255)//类型 COMMENT '名字',//注释
--     age INT NOT NULL COMMENT '年龄',
--     address VARCHAR(255) COMMENT '地址',
--     create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP//当前时间 COMMENT '创建时间'
-- ) COMMENT '用户表'
-- ALTER TABLE `user` RENAME `users`//重命名
-- ALTER Table `users` ADD COLUMN `hobby` VARCHAR(100) COMMENT "爱好"//新增列
-- ALTER TABLE `users` DROP `hobby`//删除列
-- ALTER Table `users` MODIFY `age` VARCHAR(100) COMMENT "年龄 "//修改
-- ALTER Table `users` DROP `age`,DROP `name`//可以连用，使用，分隔
```

### sql查询

```ts
-- SELECT id from `users` //查询某列
-- SELECT id,address from `users`//查询多列
-- SELECT * from `users` //查询所有
-- SELECT id as use_id from `users` //对查询结果别名
-- SELECT * from `users` ORDER BY id DESC //根据id降序
-- SELECT * from `users` ORDER BY id ASC //升序
-- SELECT * from `users` LIMIT 0,3 //从0开始查询3条数据
-- SELECT * from `users` WHERE address = 'test'//条件查询 为完全匹配
-- SELECT * from `users` WHERE address = 'test' AND id < 5 //联合查询
-- SELECT * from `users` WHERE address = 'test' ||  id > 5 //条件查询
-- SELECT * from `users` WHERE address = 'test' OR  id > 5 //第二种写法
-- SELECT * from `users` WHERE address LIKE '%t'//匹配以t结尾的address %匹配0或多个字符
-- SELECT * from `users` WHERE address LIKE '%t%' //匹配含t的address
-- SELECT * from `users` WHERE address LIKE '_t%' //匹配第二个字符为t的address _用于占位
```

### sql增删改

```ts
-- INSERT INTO users (`name`,`age`,`address`) VALUES ('六子',22,'青园街')//新增数据
-- INSERT INTO users (`name`,`age`,`address`) VALUES ('七子',22,'青园街'),('八弟',30,'老虎街')//新增多个
-- UPDATE `users` SET address =  '益阳街',age = 20,name = '混子' WHERE id = 1 //更新id=1
-- DELETE from `users` WHERE id = 2 //删除id=2
-- DELETE from `users` WHERE id  IN(9,10,11) //删除多个
```

### sql表达式

```ts
-- SELECT age + 100  as age_name from `users` WHERE age >= 20 //算术表达式,支持+-*/><
-- SELECT CONCAT(`name`,'拼接') from `users`//拼接字符串
-- SELECT LEFT(`name`,1) from `users` //截取name的第一个字符
-- SELECT RAND() from `users` //生成随机数
-- SELECT SUM(`age`) from `users` //age求和
-- SELECT AVG(`age`) from `users` //age平均数
-- SELECT MAX(`age`) from `users` //MAX函数，MIN函数
-- SELECT COUNT(*) from `users` //总数
-- SELECT Now() from `users` //返回当前时间
-- SELECT DATE_ADD(NOW(),INTERVAL 1 DAY) FROM `users` //时间加一天，DATE_SUB减一天
-- SELECT IF(age >= 30,"中年","青年") from `users`// 条件判断
```

### sql子查询+连表

```ts
-- SELECT * from `userdata` WHERE user_id = (SELECT id from `users` WHERE name = '七子')//子查询
-- SELECT * from `users`,`userdata` WHERE `userdata`.`user_id` = `users`.`id` //内连接
-- //外连接  左连接(以驱动表为主，如果连动表没有填充Null) 右连接(以连动表为主，如果没有不会填充NUll) 
-- SELECT * from `users` LEFT JOIN `userdata` ON `users`.`id` = `userdata`.`user_id` //左连接
-- SELECT * FROM `users` RIGHT JOIN `userdata` ON `users`.`id` = `userdata`.`user_id`//右连接
```

### sql+express

```ts
import mysql2 from 'mysql2/promise'
import yaml from 'js-yaml'
import fs from 'node:fs'
import express from 'express'
const app = express()
app.use(express.json())
const dbyaml = fs.readFileSync('./db.config.yaml', 'utf8')
const dbconfig = yaml.load(dbyaml)
const sql = await mysql2.createConnection({
    ...dbconfig.db
})
//查询全部
app.get('/',async (req,res) => {
    const [data]= await sql.query('select * from users')
    console.log(data);
    res.send(data)
})
//查询单个
app.get('/user/:id',async (req,res) => {
    // const [data]= await sql.query(`select * from users where id =${req.params.id}`)
    const [data]= await sql.query(`select * from users where id = ?`,[req.params.id])
    console.log(data);
    res.send(data)
})
//编辑
app.post('/update',async (req,res) => {
    const {address,age,name,id} = req.body
    await sql.query('update users set name=?,age=?,address=? where id=?',[name,age,address,req.body.id])
    res.send({code:200,data:'ok'})
})
//创建
app.post('/create',async (req,res) => {
    const {address,age,name} = req.body
    await sql.query('insert into users (name,age,address) values(?,?,?)',[name,age,address])
    res.send({code:200,data:'ok'})
})
//删除
app.delete('/delete',async (req,res) => {
    await sql.query('delete from users where id=?',[req.body.id])
    res.send({code:200,data:'ok'})
});
app.listen(3000,() => {
    console.log('listening on port 3000');
})
```

### Knex

Knex是一个基于JS的查询生成器，它允许你使用JS代码来生成和执行SQL查询语句，无需直接编写SQL语句。

```ts
import yaml from 'js-yaml'
import fs from 'node:fs'
import express from 'express'
import knex from 'knex'
const app = express()
app.use(express.json())
const dbyaml = fs.readFileSync('./db.config.yaml', 'utf8')
const dbconfig = yaml.load(dbyaml)
//连接数据库
const db = knex({
    client:'mysql2',
    connection:dbconfig.db
})
//创建表模型
db.schema.createTableIfNotExists('list',table => {
    table.increments('id')
    table.string('name')
    table.integer('age')
    table.string('address')
    table.timestamps(true, true)
}).then(()=>{
    console.log('created table');
})
//事务，用于保持原子的一致性，要么都成功，要么都回滚
db.transaction(async (trx) => {
    try {
        //假设1转2 100元 如果出现错误
        await trx('list').update({money:-100}).where({id:1})
        await trx('list').update({money:+100}).where({id:2})
        await trx.commit()//提交事务
    } catch (error) {
        trx.rollback()//回滚
    }
}).then(()=>{
    console.log('ok');
}).catch(error =>{
    console.log(error);
})
//查询全部
app.get('/',async (req,res) => {
    const data = await db('list').select()
    const total = await db('list').count("* as total")
    //可以自定义sql
    db.raw("select * from users").then(res=>{
        console.log(res);
    })
    //左、右连接
    const a = await db('users').select().rightJoin('userdata', 'users.id', 'userdata.user_id')
    console.log(a);
    //降序
   const b =  await db('list').select().orderBy('id','desc')
   console.log(b);
    res.json({
        data,
        total:total[0].total,
      //可以使用toSQL().sql输出sql语句，方便调试
        sql:db('list').count("* as total").toSQL().sql
    })
})
//查询单个
app.get('/user/:id',async (req,res) => {
    const data = await db('list').select().where({id:req.params.id})
    res.send(data)
})
//编辑
app.post('/update',async (req,res) => {
    const {address,age,name,id} = req.body
    await db('list').update({address,age,name}).where({id})
    res.send({code:200,data:'ok'})
})
//新增
app.post('/create',async (req,res) => {
    const {address,age,name} = req.body
    await db('list').insert({address,age,name})
    res.send({code:200,data:'ok'})
})
//删除
app.delete('/delete/:id',async (req,res) => {
    await db('list').delete().where({id:req.params.id})
    res.send({code:200,data:'ok'})
});
app.listen(3000,() => {
    console.log('listening on port 3000');
})
```

### Prisma
1. npm i prisma -g
2. prisma init -h
3. prisma init --datasource-provider mysql 
4. 修改.env配置文件
5. 在schema.prisma文件中创建表模型

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
```ts []
import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
//新增
app.post('/create', async (req, res) => {
    const { name, email, age } = req.body
    await prisma.user.create({
        data: {
            name,
            email,
            age,
            posts: {
                create: [
                    {
                        title: '文章1',
                        content: '文章1的内容'
                    },
                    {
                        title: '文章2',
                        content: '文章2的内容'
                    }
                ]
            }
        }
    })
    res.send({code:200})
});
//编辑
app.post('/update', async (req, res) => {
    const { id, name, email, age } = req.body
    await prisma.user.update({
        where:{
            id:Number(id)
        },
        data:{
            name,
            email,
            age
        }
    })
    res.send({code:200})
})
app.get('/get',async (req,res)=>{
    const users = await prisma.user.findMany({
        include:{
            posts:true
        }
    })
    res.send(users)
})
//单个查询
app.get('/getOne/:id',async (req, res)=>{
    const row = await prisma.user.findMany({
        where:{
            id: Number(req.params.id)
        },
        include:{
            posts:true
        }
    })
    res.send(row)
})
//删除
app.delete('/delete/:id',async (req, res)=>{
    const { id } = req.params
    //级联删除
    //post表引用了user表的外键
    await prisma.post.deleteMany({
        where:{
            authorId:Number(id)
        }
    })
    await prisma.user.delete({
        where:{
            id:Number(id)
        }
    })
    res.send({code:200})
})
app.listen(3000, () => {
    console.log('server is running on port 3000');
});
```
:::

## Redis

### 介绍

redis是一个开源的内存数据结构存储系统。
1. 内存存储，redis主要将数据存储在内存中，因此具有快速的读写性能；
2. 多种数据结构，redis不仅仅是一个简单的键值存储，它支持多种数据结构，如字符串、哈希、列表、集合和有序集合,用于灵活的操作数据。
3. 发布/订阅，redis支持发布/订阅模式，允许多个客户端订阅一个或多个频道，以接收实时发布的消息。
4. 事务，redis支持事务，可以将多个命令打包成一个原子操作执行，确保这些命令要么全部执行成功，要么失败。
5. 持久化，redis提供了两种持久化数据的方式，RDB(redis database)和AOF（Append Only File）.RDB是将数据以快照形式保存到磁盘，而AOF是将每个写操作追加到文件中，这些机制用于确保数据在意外宕机或重启后持久性。
6. 高可用性，redis支持主从复制和Sentinel哨兵机制。通过主从复制，可以创建多个redis示例的副本，以提高读取性能和容错能力。Sentinel是一个用于监控和自动故障转移的系统，它可以在主节点宕机时自动将从节点提升为主节点。
7. 缓存，由于redis具有快速的读写能力和灵活的数据结构，被广泛用作缓存层。
8. 实时统计，redis的计数器和有序集合等数据结构使其非常适合实时统计场景，它可以存储和更新计数器，并对有序集合进行排名和范围查询，用于统计和排行榜功能。

### Redis命令

```ts
//redis启动
redis-server //默认端口6379
redis-server redis.conf //指定配置文件,修改配置里面的daemonize为yes可以配置为后端启动，windows下无效
```

::: code-group
```ts [redis认证]
(error) NOAUTH Authentication required.
auth 123456
```
```ts [字符串操作]
SET key value [NX|XX] [EX seconds] [PX milliseconds] [GET]
key //要设置的键名
value //设置的值
NX //可选，表示只在键不存在时才设置
XX //可选，表示只在键已经存在时才设置值
EX seconds //可选，将键的过期时间设置为指定的秒数
PX milliseconds //可选，将键的过期时间设置为指定的毫秒数
GET //可选，返回键的旧值
get key //取值
del key //删除值
```
```ts [集合操作]
无序且不重复的数据结构，用于存储独立的数据。
1.添加
SADD 集合名称 值1 [值2]
2.获取
smembers 集合名
3.检查成员 
sismember 集合名 成员名
4.移除成员
srem 集合名 成员名
```
```ts [哈希表操作]
//不能重复
1.设置
hset 表名 键名 键值
2.获取
hget 表名 键名
3.删除
hdel 表名 键名
4.获取所有
hgetall 表名
```
```ts [列表操作]
1.添加
rpush key ele1 ele2 ele3//将元素从右侧插入,插入列表头部
lpush key ele1 ele2 ele3//将元素从左侧插入，插入列表尾部
2.获取
lindex key index //获取表中指定索引位置元素
lrange key start stop //获取指定范围内的元素
lrange list 0 -1 //获取全部
3.修改
lset key index newValue //修改列表中指定索引位置的元素
4.删除
lpop key //从列表的左侧删除并返回一个元素
rpop key //右侧删除第一个并返回
lrem key count value //从列表中删除指定数量的元素
5.获取列表长度
llen key
```
:::

### Redis发布订阅和事务

发布-订阅是一种消息传递模式，其中消息发布者将消息发送到频道，而订阅者可以订阅一个或多个频道以接收消息。这种模式允许消息的解耦，发布者和订阅者之间不需要直接交互。
1. 订阅
subscribe  监听名
2. 发布
publish 监听名  消息  

Reds事务不支持回滚
1. 开启一个事务  multi
2. 取消事务 discard
3. exec 用于执行事务中的所有命令
```ts
127.0.0.1:6379> set A 100
OK
127.0.0.1:6379> set B 100
OK
127.0.0.1:6379> multi //开启事务
OK
127.0.0.1:6379> set A 0
QUEUED //事务开启一个队列，此时并没有执行
127.0.0.1:6379> set B 200
QUEUED
127.0.0.1:6379> exec //执行队列
```

### Redis持久化

RDB持久化是将redis数据以快照形式保存到磁盘，适用于做备份，通过save可以设置快照频率或者手动输入save快照
![RDB](/rdb.png?url)

AOF持久化是将redis执行过的命令记录到文件中，并在重启时，从文件中读取命令，重新执行命令，以此来恢复数据。
AOF：修改appendonly配置项的no，改为yes，表示启用AOF，将每次的写操作存到一个文件里面
```ts
appendonly yes
```

### Redis高可用-主从复制

主从复制：一种数据复制和同步机制，其中一个Redis服务器(称主服务器)将其数据复制到一个或多个其他Redis服务器(称从服务器).主从复制提供了数据冗余备份，读写分离，和故障恢复等功能。

1. 在Redis目录下新建一个从服务器配置,比如redis-6378.conf
```ts
bind 127.0.0.1 //ip地址
port 6378 //从服务器端口
daemonize yes //开启守护进程，静默运行
replicaof 127.0.0.1 6379 //指定主服务器
masterauth 12346 //主机密码
```
2. 开启从服务器  
```ts
redis-server ./redis-6378.conf
```
3. 新建一个cmd窗口，redis-cli -p 6378，执行keys * 可以看见主服务器的东西

### IORedis
ioredis是nodejs中一个用于和redis进行交互的库
1. 高性能，一次往返发送多个redis命令，并且可以在丢失时自动重新连接；
2. promise和async/await支持
3. 集群和sentinel支持，用于分布式和高可用性
4. Lua脚本，可以使用eval和evalsha命令执行lua脚本
5. 发布/订阅和阻塞命令
```ts
import Redis from 'ioredis'
const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: '123456',
});
const redis2 = new Redis({
    host: 'localhost',
    port: 6379,
    password: '123456',
});
//字符串
redis.set('key','value')
redis.get('key').then(res=>{
    console.log(res);
})
redis.setex('key1',5,'value')//设置过期时间
//集合
redis.sadd('set',1,2,3,4)
redis.smembers('set').then(res=>{
    console.log(res);
})
redis.srem('set',1)//删除
redis.sismember('set',2).then(res=>{
    console.log(res);//检测在不在，不在为0
})
//哈希
redis.hset('obj','name','qiuyi')
redis.hget('obj','name').then(res=>{
    console.log(res);
})
redis.hdel('obj','name')
redis.hgetall('obj').then(res=>{
    console.log(res);
})

//列表
redis.lpush('list3',1,2,3)
redis.rpush('list3',4,5,6)
redis.llen('list3').then(res=>{
    console.log(res);
})
redis.lrange('list3',0,-1).then(res=>{
    console.log(res);
})
//发布订阅
redis.subscribe('test')
redis.subscribe('test2')
redis.on('message',(channel,message)=>{
    console.log(channel,message);
})
redis2.publish('test','hello world')
redis2.publish('test2','11')
```

### Lua脚本

一种轻量、高效的脚本语言，可以将Lua和Redis和Nginx结合使用，构建高性能的Web应用程序

::: code-group
```ts [定义变量]
a = 2 --全局变量
print(a)

do
local name = 'qiuyi' --局部变量
print(name)
end
print(name) --nil 表示null

--arr local type = {10,20,30}数组表示
--object local obj = {name = 'qiuyi',age = 18}对象表示
--其他类型于js类似，注意undefined和null为nil
//条件
local a  = 1
if a == 1 then
    print('a = 1')
elseif a == 2 then
else
    print(3)
end
//函数
function func(val)
    if val == 1 then
        print('val = 1')
    elseif val == 2 then
    else
        print(3)
    end
end
func(a)
//循环
for i=1, 10, 1 do
    print(i)
end

local obj = {name = 'qiuyi',age = 18}
local arr = {10,20,30}
--ipairs只能迭代数组部分
for k, v in ipairs(arr) do
    --注意数组索引从1开始
    print(k,v)
end
--pairs可以迭代所有键值对
for k, v in pairs(obj) do
    print(k,v)
end
```
```ts [模块化]
//utils.lua
local module = {}

function module.add(a,b)
    return a+b
end
module.PI = 3.14
return module

//index.lua
local M = require('./utils')
local a = M.add(1,2)
print(a)
print(M.PI)
```
```ts [操作文件]
local file = io.open('./index.txt','r')
local content = file:read('*a')
print(content)
```
:::

### 限流阀

::: code-group
```ts [index.js]
import express from 'express';
import Redis from 'ioredis';
import fs from 'node:fs'
const app = express();
const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: '123456',
});
const lua = fs.readFileSync('./index.lua','utf-8')
const KEY = 'lott'//redis存值
const TIME = 30 //限流时间
const LIMIT = 5 //限流次数
app.use('*',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
})
app.get('/lott',(req,res)=>{
            //lua文件，1个KEY值，TIME,LIMIT为参数,回调
    redis.eval(lua,1,KEY,TIME,LIMIT,(err,result)=>{
        if(err){
            console.log(err);
            return
        }
        if(result === 1){
            res.json({
                code: 200,
                msg: '成功'
            })
        }else {
            res.json({
                code: 400,
                msg: '失败'
            })
        }
    })
})
app.listen(3000,()=>{
    console.log('服务启动...');
});
```
```ts [index.lua]
local key = KEYS[1] --传递过来的key值
local interval = tonumber(ARGV[1]) --传递的参数
local count = tonumber(ARGV[2])
local limmit = tonumber(redis.call('get',key) or '0')

if limmit + 1 >= count then
    return 0
else
    redis.call('incr',key)//计数器加1
    redis.call('expire',key,interval)//设置过期时间
    return 1
end
```    
:::


## Redis报错

### Could not create server TCP listening

::: danger 
Could not create server TCP listening socket 127.0.0.1:6379: bind: 操作成功完成。  
原因：6379端口被占用，上次的redis服务未关闭  
:::
```ts
1.输入redis-cli,启动redis
redis-cli.exe
2.shutdown 关闭redis服务
shutdown 
3.如果需要认证，输入auth yourpassword
auth yourpassword
4.exit
```

### 在一个非套接字上尝试了一个操作

::: danger 
Could not create server TCP listening socket *:6379: bind: 在一个非套接字上尝试了一个操作。  
原因：未指定配置文件
:::
```ts
//指定配置文件
redis-server.exe redis.windows.conf
```




## MongoDB

### 连接mongodb

```ts
import { MongoClient } from 'mongodb'
const url =  "mongodb://localhost:27017"
const client = new MongoClient(url)
async function run() {
    try {
        await client.connect()
        const db = client.db("test")
        const res = await db.command({ ping: 1 })
        console.log('Connected successfully to server',res)



    } catch (error) {
        console.log('连接数据库失败了',error)
    } finally {
        await client.close()
    }
}
run()
```

### 简单插入和查询

```ts
import { MongoClient,WithId, Document } from 'mongodb'
const url =  "mongodb://localhost:27017"
const client = new MongoClient(url)
async function run() {
try {
    await client.connect()
    const db = client.db("test")
    const res = await db.command({ ping: 1 })
    console.log('Connected successfully to server',res)

    const userCollection = db.collection("user")
    //插入单条
    const result = await userCollection.insertOne({ name: "John", age: 30 })
    // 多条
    const results = await userCollection.insertMany([
        {name:"Peter",age:25},
        {name:"Mary",age:35}
    ])
    //查询多条
    const result = await userCollection.findOne({name:"John"})
    const cursor =  userCollection.find() //返回mongodb FindCursor对象 // [!code ++]

    // 使用 toArray 方法获取所有文档
    const documents: WithId<Document>[] = await cursor.toArray();
    documents.forEach(doc => {
        // 对每个文档进行处理
        console.log(doc);
    });

} catch (error) {
    console.log('连接数据库失败了',error)
} finally {
    await client.close()
}
}
run()
```

### mognodb操作符

```ts
( > ) 大于 - $gt
( < ) 小于 - $lt
( >= ) 大于等于 - $gte
( <= ) 小于等于 - $lte
( != ) 不等于 - $ne
( ! ) 不存在 - $nin
(  $or ) 或 - $or
(  $and ) 与 - $and
(  $not ) 非 - $not
(  $in ) 包含 - $in
(  $all ) 包含所有 - $all
(  $elemMatch ) 元素匹配 - $elemMatch
(  $exists ) 存在 - $exists
(  $type ) 类型 - $type
(  $regex ) 正则 - $regex
(  $options ) 正则选项 - $options
(  $text ) 全文搜索 - $text
(  $mod ) 模块 - $mod
(  $near ) 近 - $near
(  $slice ) 切片 - $slice
(  $sort ) 排序 - $sort
(  $group ) 分组 - $group
```
```ts
const result  = await userCollection.find({age:{$gt:25}}).toArray()
const result2  = await userCollection.find({age:{$gt:25},name:"Mary"}).toArray()
const result3  = await userCollection.find({age:{$gt:25},name:/M.*/}).toArray()
const result4  = await userCollection.find({$and:[{age:{$gt:25}},{name:/M.*/}]}).toArray()
const result5  = await userCollection.find({$or:[{age:{$gt:25}},{name:/M.*/}]}).toArray()
const result6  = await userCollection.find({age:{$exists:true}}).toArray()
const result8  = await userCollection.find({age:{$type:"number"}}).toArray()      
```

### options参数

```ts
const options: FindOptions = {
    limit: 2,
    skip: 1,
    sort: { age: -1 },
    projection: { name: 1,age:1, _id: 0 },//只返回name,age字段,不返回_id
};
const result = await userCollection
    .find({ age: { $gt: 25 } }, options)
    .toArray();
    //支持链式调用
    const result2  =  await userCollection.find({age:{$gt:25}}).sort({age:-1}).toArray()
```

### update和replace

```ts
const replaceDoc = await userCollection.replaceOne({name:"John"},{name:"John2",age:30})
//$set,重新设置
//$inc 自增
//$push 数组添加元素
//$pull 数组删除元素
//$unset 删除字段
//$rename 字段重命名 
const updateOptions: UpdateFilter<Document> = {
    $set: { name: "John3" },
    $inc: { age: 1 },
}
const updateResult = await userCollection.updateOne({ name: "John2" }, updateOptions)
console.log(updateResult);
```
```ts
const updateOptions: UpdateFilter<{ name: string; age: number; hobby: string[] }> = {
    // $push:{ hobby: '学习' }
    // $push:{
    //   $each: ['学习', '睡觉'],
    // }
    // $push:{
    //   $each: ['学习', '睡觉'],
    //   $position: 1, // 插入到数组的第2个位置
    // },
    // $pull:{
    //   hobby: '喝水'
    // }
    // $set:{
    //   "hobby.0": "学习"
    // }
}
const updateResult = await userCollection.updateOne({ _id: new ObjectId('66f7830c783a0d63fc9f61e6') }, {$push:{ hobby: '学习' }})
```

### 数组操作

```ts
const search = await userCollection.findOne({ hobby: ['吃饭',"喝水"] }) //完全匹配
const search2 = await userCollection.findOne({ hobby: { $all: ['吃饭'] } }) //部分匹配
const search3 = await userCollection.findOne({ hobby: '吃饭' }) //包含匹配
const search4 = await userCollection.findOne({ hobby: /喝.*/ }) //正则匹配
//使用占位符进行更新
const UpdateFilter: UpdateFilter<User> = {
    $set: {
    "hobby.$": "喝水-new" // [!code ++]
    }
}
const update = await userCollection.updateOne({ _id: new ObjectId('66f7830c783a0d63fc9f61e6'), hobby: "喝水" }, UpdateFilter)

```

### mongodb索引

索引为了提高效率，MongDB的文件类型是：BJON，索引是一个特殊的数据结构，存储在一个易于遍历读取的数据集合中  
索引会增加写操作的代价lay，但会提高查询效率，索引的建立和维护需要耗费时间，所以在创建索引时，需要慎重考虑。  

```ts
const result = await userCollection.find({name:"test50000"}).explain() //explain分析查询信息 ，20ms左右
const result = await userCollection.find({_id:ObjectId("66f7830c783a0d63fc9f61e6")}) //查询索引，0ms

const result = await userCollection.createIndex({name:1}) //创建name索引,1表示升序
const IndexResult = await userCollection.listIndexes().toArray() //获取索引信息
const result = await userCollection.dropIndex("name_1") //删除索引
const result = await userCollection.totalIndexSize() //获取索引大小
```

### 内嵌和引用

1. 引用，在一个文档中存储另一个文档的ID，通过ID来查询文档，两次查询，一次查询文档，一次查询ID，数据查询量会变小，但是需要两个查询，性能会变慢。

2. 内嵌，只需要一次查询就能获取所有的信息，避免多级和查询，但是单个文档太大，查询更耗时；针对单个文档，mongoDB有一个16M的限制。


### 聚合

将来自多个文档的值组合在一起，并且可以对分组数据执行各种操作以返回结果
1. $group: 聚合文档，将文档分组，并对分组数据执行操作
2. $match,过滤文档；
3. $project,修改文档；
4. $sort,排序；
5. $limit,限制返回结果数量；
6. $skip,跳过指定数量的文档；

```ts
const peipeLine = [
    {$match:{ age: { $gt: 25 } }}, //匹配
    {$group:{_id:"$team",total:{$sum:"$age"},$count:{$sum:1},$avg:{$avg:"$age"}} }//team分组，计算age总和，count总数
    {$sort:{ total:1 }}
]
const result = await userCollection.aggregate(peipeLine).toArray()
```
8. $lookup,联合查询，查询另一个集合的文档，将两个集合的文档合并成一个文档

```ts
const pipeLine = [
    {$match:{ age: { $gt: 25 } }},
    {
        $lookip:{
            from:"collection name",
            localField:"collcrction field name", //当前集合的字段
            foreignField:"foreign field name",//另一个集合的字段
            as:"new field name"
        }
    }
]
```

### mongoose

1. 建立在native mongoDB nodejs driver之上，提供了更高级的API，更方便的操作mongodb
2. 提出Model层，将mongodb的操作封装成Model层，用来约束集合中的数据结构
3. 扩展丰富
4. 是一个ODM（Object Document Mapping）框架，可以将mongodb的文档映射到js对象，方便操作

ORM：
1. Object-Relational Mapping，对象-关系映射，将关系数据库中的数据模型映射到面向对象编程语言中的对象模型。
2. 不需要写SQL语句，直接操作对象即可。
3. 使用面向对象的方式操作数据，代码量少，容易理解
4. Classes类 -> Tables，Objects实例 -> Records(表中的一行数据),Attributes字段 -> Columns(Records中的一列数据)
5. 内置很多功能

ODM：
1. 针对noSQL数据库，将mongodb中的数据模型映射到js对象，提供更高级的API，更方便的操作mongodb
   
### mongoose基本语法

```ts
import { connect, Schema, model, disconnect } from 'mongoose';

async function startServer() {
  try {
    await connect('mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');
    //创建Product模型
    const ProductSchema = new Schema({
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
    });
    const ProductModel = model('Product', ProductSchema);
    //使用create方法创建数据
    // const result = await ProductModel.create({
    //   name: 'Product1',
    //   price: 100,
    // });
    //使用save方法创建数据
    const result = new ProductModel({
        name:"Product2",
        price:200
    })
    await result.save();
  } catch (error) {
    console.log(error);
  } finally {
    await disconnect();
  }
}
startServer();
```

## mongodb创建Auth

```ts
use admin //admin是mongodb的用户数据库
db.createUser({user:'root',pwd:'123456',roles:[{role:'root',}]}) //创建root用户
db.auth('root','123456') //验证root用户
 ```
 ```ts
 mongod --config xxx/mongo.conf --auth //启动mongodb，指定配置文件，开启auth验证
 mongo -u "root" -p "123456" --authenticationDatabase "admin" //连接mongodb，指定用户名和密,--authenticationDatabase指定开始验证的数据库
 ```

## MongoDB 报错


### 无法使用mongosh命令
::: danger 
无法使用mongo命令
:::
解决：
1. 下载mongoshell，[MongoDBSell](https://www.mongodb.com/try/download/shell)
2. 将解压后的bin文件夹里面的内容添加到MongoDB的bin目录下
3. 将该文件配置到系统变量的path变量中,目录级别到bin目录即可，不用具体到.exe
4. 测试使用mongosh命令是否可用
![success](/mongosh.png)

### mongo 1067错误

```ts
net start MongoDB
报错:1067
```
::: tip
多方尝试均无效，重装MongoDB后解决。
:::

