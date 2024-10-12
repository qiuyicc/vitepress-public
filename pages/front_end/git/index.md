# Git学习
Git是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。

## Git Flow
Git Flow是一个工作流，它定义了多个短期分支，以帮助开发团队在短期内完成工作，同时保持稳定性。一般都有双分支：
master和develop，被称为长期分支。

1. master分支：主分支，用于发布稳定版本的代码，不能直接工作在此分支。

2. develop分支：开发分支，用于开发新功能。

其他短期分支：
3. feature分支：新功能分支，用于开发新功能。

4. release分支：发布分支，用于准备发布新版本。

5. hotfix分支：紧急修复分支，用于修复已发布版本的紧急bug。

## Github Flow
Github Flow是Github官方推出的工作流，它与Git Flow非常相似，但有一些不同之处，大致有如下流程：

1. master分支：主分支，用于发布稳定版本的代码，不能直接工作在此分支。
2. 根据需求，从master拉出分支
3. 开发完成功能后，提交commit
4. 发起PR (Pull Request)
5. 代码审查
6. 合并PR
8. 部署测试
7. merge到master分支

branch命名规则：
1. feature/xxx：新功能分支
2. bugfix/xxx：bug修复分支
3. release/xxx：发布分支
4. hotfix/xxx：紧急修复分支

commit命名规则：
言之有物，行之有效。

## Git命令

1. git init 初始化一个仓库
2. git add 文件名 添加文件到暂存区  git add . 添加所有文件到暂存区
3. git commit -m "提交说明" 提交暂存区到仓库
4. git status 查看仓库状态
5. git branch 分支名 创建分支 git branch -M main 重命名当前分支为main git branch 查看当前分支
6. git remote add origin git@github.com:qiuyicc/lego.git 关联远程仓库
7. git push -u origin main 推送本地仓库到远程仓库,并跟踪
8. git pull  拉取远程仓库到本地仓库
9. git checkout 分支名 切换分支
10. git merge 分支名 合并分支
11. git log 查看提交历史
12. git diff 文件名 查看文件修改内容
13 .gitignore 添加忽略文件
14. git reset --hard HEAD^ 回退到上一个版本

::: tip git使用技巧
git config --global alias.co checkout //设置别名，co代替checkout
git co === git checkout

git remote -v //查看远程仓库地址

SSH连接：git@github.com:qiuyicc/lego.git
:::

::: warning git六步
1. git init //初始化一个仓库
2. git add . //添加所有文件到暂存区
3. git commit -m "提交说明" //提交暂存区到仓库
4. git branch -M main //重命名当前分支为main
5. git remote add origin git@github.com:qiuyicc/lego.git //关联远程仓库
6. git push -u origin main //推送本地仓库到远程仓库,并跟踪
:::


## Git错误解决记录
### 没有权限或者仓库不存在
::: danger 错误
Please make sure you have the correct access rights and the repository exists
:::
原因：没有权限或者仓库不存在

解决方法：
1. 尝试重新关联远程仓库，:arrow_right: push失败
```ts
git remote add origin git@github.com:qiuyicc/lego.git
```
2. ssh问题，重新生成ssh，:arrow_right: push失败
```ts
git config --list //查看git配置
//如果没有user.name和user.email，则需要设置
git config --global user.name "your name"
git config --global user.email "your email"
//虽然有但是重新生成后还是失败
```
3. 尝试删除本地.ssh文件夹，重新生成，:arrow_right: push失败
```ts
git config --global user.name "your name"
git config --global user.email "your email"
ssh-keygen -t rsa -C "your email"
//配置ssh
//C:\Users\你的用户名\.ssh\id_rsa.pub，复制id_rsa.pub文件里的全部内容。
=> github设置 => SSH and GPG keys => New SSH key => 粘贴生成的公钥
```
3. 检查仓库地址是否正确，:arrow_right: push成功:tada:
```ts
git remote -v //查看远程仓库地址
发现地址为git@@github.com:qiuyicc/lego.git，多了个@，也不知道哪里来的 // [!code ++]

git remote set-url origin git@github.com:qiuyicc/lego.git // [!code ++]
//修改远程仓库地址
```


# 云服务器

## 修改远程登录Root

改变root登录：
1. 有非常多的bot使用root+pwd的形式暴力破解机器；
2. root拥有最高权限，可以做任何事情，破解后会造成更大的损失，而某个特定用户只能影响它的文件系统；

3. 远程登录
```ts
ssh root@xxx.xxx.xxx.xxx
```
1. 新增用户
```ts
adduser username
```
1. 给予该用户sudo权限，使其登录后可以切换到root
```ts
chmod u+w /etc/sudoers
vim /etc/sudoers
在 `root ALL=(ALL) ALL` 后面添加 `username ALL=(ALL) ALL`
```
1. 禁止使用root登录ssh
```ts
vim /etc/ssh/sshd_config
找到 PermitRootLogin 并将其值改为 no
service sshd restart 重启ssh服务
```

## 去除远程登录密码，使用ssh key登录

不使用密码登录：
1. 用户经常使用错误的、简单的密码，容易被破解；
2. 用户在多个账户上可能使用重复的密码，从别的账户盗取的密码或可一试百灵

使用ssh key登录：
1. ssh key采用了经典的非堆成加密技术，使用工具创建一个公钥和私钥，将公钥可以放置在任何服务器上，在本地保留私钥。使用ssh登录的时候，就会验证公钥和私钥是否匹配，从而实现免密登录
2. 证书由1024Bits到4096Bits的随机字符串组成，要比自己的密码安全的多。

1. 本地生成ssh key
```ts
             //算法 //长度  //邮箱
ssh-keygen -t rsa -b 4096 -C "your email"
```
2. 本地证书位置

```ts
/C:/Users/你的用户名/.ssh/id_rsa.pub //公钥
/C:/Users/你的用户名/.ssh/id_rsa //私钥
```
3. 上传公钥到服务器

```ts
ssh root@xxx.xxx.xxx.xxx
mkdir .ssh
cd .ssh
touch authorized_keys //创建authorized_keys文件,固定名称
vim authorized_keys //编辑authorized_keys文件
//打开本地生成的公钥文件，粘贴公钥内容到authorized_keys文件
```

4. 禁止使用密码登录

```ts
vim /etc/ssh/sshd_config
更改PasswordAuthentication no //禁止使用密码登录
service sshd restart 重启ssh服务
```

## Linux

1. Debian(完全免费的Linux发行版) - Ubuntu (基于Debian，更加容易上手) - apt(包管理系统) - 软件格式为deb包
2. Red Hat(商用Linux发行版) - CentOS (Red Hat减去收费软件) - yum(包管理系统) - 软件格式为rpm包

使用service或者systemctl管理服务

service 服务名称 操作指令(status/start/stop/restart)
systemctl 操作指令(start/stop/restart/status/reload) 服务名称 

## Linux部署项目

1. 登录远程服务器,在自己需要的目录下clone代码
2. 安装对应的依赖,npm i 
3. 创建并设置.env文件,配置环境变量
4. 开启云服务器的对应端口
5. 启动项目

传统部署的问题：
1. 前置软件的安装，他们在不同的操作系统中安装的方式、版本可能不同，导致部署困难；
2. 项目需要运行一系列的命令才能启动；
3. 项目更新问题，需要手动更新代码，十分繁琐，切容易出错

## Docker

1. 传统的虚拟机，需要安装完整的操作系统，占用大量的磁盘空间，启动慢，占用内存；
2. Docker容器，只需要安装Docker，每个容器不需要安装完整的操作系统，里面的进程直接运行在Docker宿主机的内核中，启动快，占用内存小；
3. 微服务架构，每个容器可以单独运行，互相隔离，更加灵活，适合于微服务架构。

### Docker 镜像

docker镜像添加：
1. 打开Docker Desktop，点击右上角的设置图标，选择Docker Engine，添加：
```ts
"registry-mirrors": [
    	"https://dockerpull.com",
        "https://docker.anyhub.us.kg",
        "https://dockerhub.jobcher.com",
        "https://dockerhub.icu",
        "https://docker.awsl9527.cn"
    ]
```
2. 或者是找到C盘 -> 用户 -> 用户名 -> .docker -> daemon.json文件，添加上边的镜像：
3. 一些Docker 命令
```ts
docker --version //查看docker版本
docker pull node:20 //拉取node镜像
docker images //查看本地镜像
docker rmi docker_image_id //删除本地镜像
docker push <username>/<repository>:<tag> //推送镜像到dockerhub
```

### Docker容器

```ts
docker run -d -p 81:80 --name container_name image_name //启动容器
-d 后台运行
-p 81:80 81为主机端口，80为容器端口，映射端口
--name container_name 容器名称
image_name 镜像名称
```
比如安装nginx，运行,访问81端口
```ts
docker run -d -p 81:80 nginx
```
![Docker容器](/nginx.png)

```ts
docker ps //查看所有容器
docker stop container_ID //停止容器
docker ps -a //查看所有容器，包括停止的
docker rm container_ID //删除容器
docker container start container_ID //启动容器
```
进入Docker容器内部：
```ts
docker exec -it container_ID /bin/bash //进入容器内部
-i //即使没有附加也保持STDIN打开
-t //分配一个伪终端
```
![Nginx_Container](/nginx_container.png)

### Docker持久化容器数据

 ```ts
 docker run -d -p 81:80 -v host_path:container_path image_name //挂载数据卷
-v host_path:container_path 挂载数据卷，host_path为宿主机路径，container_path为容器路径
docker run -d -p 81:80 -v /data/nginx:/usr/share/nginx/html nginx //挂载nginx默认的html目录
```
```ts
//比如在当前目录下新建一个index.html,使用-v挂载到nginx的html目录
C:\Users\Qiuyi>docker run -d -p 81:80 -v C:\Users\Qiuyi:/usr/share/nginx/html nginx
```
![挂载数据卷](/nginx_v.png)

Docker使用MongoDB数据库共享：

1. 下载MongoDB镜像
2. 使用-v命令,注意这里不需要开启文件共享，文件共享选项卡仅在 Hyper-V 模式下可用，因为文件会在 WSL 2 模式和 Windows 容器模式下自动共享
```ts
                 //主机MongoDB数据路径  //容器路径
docker run -d -v G:\mysoft\MongoDB\data:/data/db mongo
```
3. 查看容器
```ts
docker ps
docker exec -it 07a9a2fe3b7b bash
```
4. 查看数据库
```ts
root@07a9a2fe3b7b:/# mongosh
test> show dbs
```
![成功运行](/mongo_v.png)

**Volumn：**
Volumn是Docker容器中的一个重要概念，它可以将宿主机的目录或文件映射到容器中，使得容器中的应用可以直接访问宿主机的数据。

```ts
docker volume create <volumen-name> //创建volumen
docker run -d -v <volumen-name>:/data/db mongo //挂载volumen
docker volume inspect <volumen-name> //查看volumen信息
docker volume rm <volumen-name> //删除volumen
```
```ts
docker volume create MongoTest
docker run -d -v MongoTest:/data/db mongo
.......
```

### Docker 构建自定义镜像Dockerfile

1. 编写一个test文件，作为测试使用；
```ts
//docker/server.js
const {createServer} = require('http');
const server = createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');
});
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

```
2. 编写Dockerfile文件，定义镜像的构建过程；
```ts
# 指定从node：20镜像构建
FROM node:20
# run执行，创建app目录
RUN mkdir -p /usr/src/app
# 指定工作目录
WORKDIR /usr/src/app 
# 拷贝server.js到app目录
COPY server.js /usr/src/app/
# 暴露端口3000
EXPOSE 3000
# 启动入口
CMD node server.js
```
![文件目录](/dockerProfile_cate.png)

3. build docker镜像
```ts
//注意结尾有个点 . ，代表Dockerfile文件所在上下文，build的时候会把上下文打包到镜像中，
//不要在磁盘根目录下建立Dockerfile文件，会把磁盘的所有文件当作上下文打包！！
docker build -t test-server . //-t 镜像名称
```
4. 使用images镜像
```ts
docker images //查看本地镜像
docker run -d -p 8000:3000 test-server //运行镜像
```
![成功运行](/dockerProfile_success.png)


### Docker 上传项目






## Docker安装问题

### Docker安装错误

安装完成Docker以后，打开Docker Desktop，先后出现了docker engin stopped和docker WSL error，网上找了很多解决办法，搞了大半天都没有解决我的问题，最后翻到一篇博客,得以解决：
https://blog.csdn.net/qq_39757730/article/details/117431647

::: danger
Docker Engine stopped
:::
::: danger
Docker Desktop - Unexpected WSL error  
................
:::
解决办法：
::: tip
控制面板 -> 程序 -> 启用或关闭Windows功能 -> 勾选Windows虚拟机平台监控程序 -> 重启电脑  
:::

前置需要,本人安装的是Windows下WSL2版本：
![前置条件](/docker.png)
1. 开启虚拟化功能，控制面板 -> 程序 -> 启用或关闭Windows功能 -> 勾选虚拟机平台 
2. 开启适用于Linux的Windows子系统, 控制面板 -> 程序 -> 启用或关闭Windows功能 -> 勾选适用于Linux的Windows子系统
3. 启用WSL2，管理员权限打开CMD窗口，设置wsl默认版本为2
```ts
wsl --set-default-version 2
```
```ts
wsl --update
```
然后进行wsl --update更新，然而这部分更新根本跑不动,建议直接挂上梯子,或者如果能登上github，上github安装wsl包，[github WSL下载地址](https://github.com/microsoft/WSL/releases)
![WSL](/github_wsl.png),下载完成后安装即可,再次执行wsl --update
![wsl --update](/wsl_update.png)

最后打开Docker Desktop，成功运行！
![成功运行](/docker_success.png)

```ts
wsl -l -v #查看wsl版本
wsl --list --online #查看可安装的linux发行版
wsl --install -d Ubuntu #安装ubuntu
```

### Docker build错误

在项目中使用了TS，并且也在devDependencies安装了TypeScript，仍然报错
::: danger
TypeScript 在 Docker 构建中未找到 TSC:: tsc not found
:::

解决：  
在Dockerfile构建的使用
```ts
RUN npm install -g typescript
```





## 云服务器部署问题

### 项目NodeJS版本太高,服务器NodeJS版本太低,导致项目无法运行

GLIBC是GNU C库，为多种编程语言提供了底层的接口，而Node.js在运行过程中需要依赖GLIBC库。在CentOS 7系统中，默认安装的GLIBC版本可能低于Node.js高版本所需的GLIBC_2.28
![Node版本太高](/centos.png)

解决办法：
1. 升级CentOS系统到最新版本，新版本的CentOS系统通常会包含更高版本的GLIBC库，从而满足Node.js高版本的需求
2. 手动安装Glibc_2.28版本，不展开
3. 使用Docker


