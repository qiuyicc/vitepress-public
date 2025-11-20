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
13. gitignore 添加忽略文件
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

## Git积累
```js
git rm -r --cached . //删除暂存区
git push --force //强制推送到远程仓库
```

## Github Actions

Github Actions是一个基于事件驱动的工作流自动化平台，它允许你自动化你的软件开发流程，例如：构建、测试、发布、部署。其他：
1. github actions
2. travis ci
3. Circle CI
4. Jenkins

### YAML语法
YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化格式，常用于配置文件和数据交换。使用空格来进行缩进，可读性好。

在线检测YAML语法：[YAMLCHECKER](https://yamlchecker.com/) [我的工具箱](https://toolgg.com/yaml-validator.html)
```yml
# scalar 纯量，不能再分割的量
key：value
number: 123
boolean: true
test_string: "Hello, world!"
multiple_string: |
  line1
  line2
  line3
# 集合类型，使用缩进表示层级关系，最好是两个
person:
  name: "John"
  age: 30
  hobbies:
    - reading
    - writing
# 数组或列表类型，使用-表示元素
arr:
  - 1
  - 2
  - name: "John"
```

### Github Actions的基本使用
1. workflow是一个可配置的自动化流程，可以包含多个jobs，通过一个在repository中定义的.github/workflows/文件来定义，一个repository可以有多个workflow。
2. Events，是触发workflow的特殊事件，比如，pull、request、push等。[Github Events](https://docs.github.com/zh/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)
3. Jobs，是workflow的主要工作单元，每个Jobs是在同一runner(处于github的一台特殊虚拟机，可支持各种操作系统)中进行的，每个步骤或是一个shell命令，或是一个可执行的action，每个步骤按顺序执行，并且相互依赖
4. Actions，是可复用的工作流，使用actions可帮助我们减少在workflow中重复的工作，并可与其他人共享。[Github Actions](https://github.com/marketplace?type=actions)
![github actions](/githubActions.png)
```yml
# .github/workflows/test-githubActions.yml
name: Test GitHub Actions
on: [push]
jobs:
  Ckeck-Github-Actions:
    runs-on: ubuntu-latest 
    steps:
      - run: echo "triggered by a ${{ github.event_name }} event"
      - run: echo "running on ${{ runner.os }}"
      - name: check out repository code
        uses: actions/checkout@v2
      - run: echo "the ${{ github.respository }} repository has been cloned "
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
```
![github actions](/githubActions2.png)
```yml
# .github/workflows/more-githubActions.yml
name: More GitHub Actions
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        respository: 'lego'
    - name: List files in the repository
      run: |
        ls ${{ github.workspace }}
    - uses: actions/setup-node@v2
      with:
        node-version: '20'
    - run: node -v
    - run: npm install -g typescript
    - run: tsc -v
```

### Github Secrets

1. Secrets是Github提供的一种安全机制，可以将敏感信息如密码、密钥等，加密后存储在仓库中，只有拥有仓库的权限的人才能访问。
2. 点击某个仓库设置 -> 左侧菜单Secrets and variables -> Actions -> New repository secret -> 添加名称和值 -> 点击Add secret
3. 使用
```yml
# .github/workflows/ssh-githubActions.yml
name: SSH GitHub Actions
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    # 使用SSH Remote Command Action
    - uses: appleboy/ssh-action@master
    # 通过secrets可以获取到私密信息，如密码、密钥等
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        password: ${{ secrets.SSH_PWD }}
        script-stop: true
        # 脚本命令
        script: |
          pwd
          ls -l
          touch test.txt
          echo ${{ secrets.TEST_MYSECRET }} >> test.txt

```
![github secret](/githubSecret.png)

### Github Actions推送镜像到阿里云ACR

1. 设置Github Secrets
```ts
// 阿里云账号AccessKey
ACCESS_KEY_ID && ACCESS_KEY_SECRET
// 阿里云容器镜像仓库名称
ACR_PASSWORD && ACR_USERNAME
```
2. 编写相应的workflow文件
   1. checkout代码
   2. 创建.env文件，添加环境变量
   3. 使用阿里云Actions进行docker longin
   4. 使用阿里云Actions进行docker build
   5. 使用阿里云Actions进行docker push
```yml
# .github/workflows/push-image.yml
name: Push Docker Image
on: [push]
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    # Checkpout the repository
      - name: Checkout
        uses: actions/checkout@v2
    # 创建env文件
      - run: touch .env
      - run: echo ACCESS_KEY_ID=${{ secrets.ACCESS_KEY_ID }} >> .env
      - run: echo ACCESS_KEY_SECRET=${{ secrets.ACCESS_KEY_SECRET }} >> .env
    # 登录阿里云ACR
      - name: Login to Aliyun ACR
        uses: aliyun/acr-login@v1
        with:
          login-server: crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com
          region-id: cn-chengdu
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
    # 构建镜像
      - name: Build Docker Image
        run: docker build --tag crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/xxxx/lego:1.0.1 .
      - name: Push Docker Image
        run: docker push crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/xxxx/lego:1.0.1
```
![推送ACR成功](/pushACR.png)

### Github Actions部署到服务器

使用github actions在服务器上部署对应代码并运行
1. checkout代码
2. 创建.env文件，添加项目所需的环境变量
3. 创建文件夹，拷贝必要文件
4. 将新建的文件夹拷贝到服务器中
5. SSH远程登录服务器
   1. 进入拷贝的文件夹内
   2. 登录阿里云ACR
   3. 停止原先的服务docker-compose down
   4. 启动新服务docker-compose up -d
   5. 清理敏感文件
```yml
name: Push Docker Image
on: [push]
jobs:
  deploy-and-restart:
    runs-on: ubuntu-latest
    steps:
    # Checkpout the repository
      - name: Checkout
        uses: actions/checkout@v2
    # 创建env文件
      - name: create env file
        run: |
          touch .env
          echo ACCESS_KEY_ID=${{ secrets.ACCESS_KEY_ID }} >> .env
          echo ACCESS_KEY_SECRET=${{ secrets.ACCESS_KEY_SECRET }} >> .env
          echo CLIENT_ID=${{ secrets.CLIENT_ID }} >> .env
          echo CLIENT_SECRET=${{ secrets.CLIENT_SECRET }} >> .env
          echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
          echo MONGO_INSERT_ROOT_USERNAME=${{ secrets.MONGO_INSERT_ROOT_USERNAME }} >> .env
          echo MONGO_INSERT_ROOT_PASSWORD=${{ secrets.MONGO_INSERT_ROOT_PASSWORD }} >> .env
          echo MONGO_DB_USERNAME=${{ secrets.MONGO_DB_USERNAME }} >> .env
          echo MONGO_DB_PASSWORD=${{ secrets.MONGO_DB_PASSWORD }} >> .env
          echo REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }} >> .env
          echo PING_ENV=${{ secrets.PING_ENV }} >> .env
      # 拷贝必要文件
      - name: 'copy necessary files'
        run: |
          mkdir lego-backend
          cp .env docker-compose-online.yml lego-backend
          cp -r mongo-entrypoint lego-backend
          ls -a lego-backend
      # 通过scp拷贝文件到服务器
      - name: 'copy files to server'
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          source: 'lego-backend'
          target: '~'
      #  登录ssh服务器
      - name: 'login server'
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          script-stop: true
          # 登录阿里云ACR并执行docker命令
          script: |
            docker login --username=${{ secrets.ACR_USERNAME }} --password=${{ secrets.ACR_PASSWORD }} ${{ secrets.ACR_SERVER }}
            cd ~/lego-backend
            docker-compose -f docker-compose-online.yml down
            docker-compose -f docker-compose-online.yml up -d
            rm -rf .env
            docker logout ${{ secrets.ACR_SERVER }}
```

### Github Actions优化获取提交信息

解决问题：
1. 不是每次commit都要构建并部署上线，只有特定情况下才会上线，比如合并到master分支、发布新版本等。
2. 需要使用和该次相关的特殊信息，作为构建image的tag
3. 可以使用提交的tag作为镜像tag，或者使用commit ID作为镜像tag

```yml
name: Tag Test
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  test-tags:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: test github tag
      # 获取github ref
      # 获取commit ID -> sha
        run:
          echo ${{ github.ref }}
          echo ${{ github.sha }}
          echo ${{ github.ref_name }}
      - name: find and replace
        uses: jacobtomlinson/gha-find-replace@master
        # 找到docker-compose-online.yml文件中的tag，替换为github ref_name
        with:
          find: "{{tag}}"
          replace: "${{ github.ref_name }}"
          include: "docker-compose-online.yml"
      - run: cat docker-compose-online.yml
```
```js
git add .
git commit -m "test tag"
git tag -a v1.0.1 -m "release v1.0.1" //打标签
git push --tags //推送标签到远程仓库
```

### Github Actions整合自动化部署流程
```yml
# .github/workflows/publish-project.yml
name: Publish Project
# 1.只接受项目有tag推送 // [!code ++]
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  publish-release:
    runs-on: ubuntu-latest
    steps:
      - name: checkout code
        uses: actions/checkout@v2
    # 2. 创建env文件 // [!code ++]
      - name: create env file
        run: |
          touch .env
          echo ACCESS_KEY_ID=${{ secrets.ACCESS_KEY_ID }} >> .env
          echo ACCESS_KEY_SECRET=${{ secrets.ACCESS_KEY_SECRET }} >> .env
          echo CLIENT_ID=${{ secrets.CLIENT_ID }} >> .env
          echo CLIENT_SECRET=${{ secrets.CLIENT_SECRET }} >> .env
          echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
          echo MONGO_INSERT_ROOT_USERNAME=${{ secrets.MONGO_INSERT_ROOT_USERNAME }} >> .env
          echo MONGO_INSERT_ROOT_PASSWORD=${{ secrets.MONGO_INSERT_ROOT_PASSWORD }} >> .env
          echo MONGO_DB_USERNAME=${{ secrets.MONGO_DB_USERNAME }} >> .env
          echo MONGO_DB_PASSWORD=${{ secrets.MONGO_DB_PASSWORD }} >> .env
          echo REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }} >> .env
          echo PING_ENV=${{ secrets.PING_ENV }} >> .env
    # 3. 阿里云ACR登录 // [!code ++]
      - name: login ACR
        uses: aliyun/acr-login@v1
        with:
          login-server: ${{ secrets.ACR_SERVER }}
          region-id: cn-chengdu
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
    # 4. 构建镜像到ACR // [!code ++]
      - name: build docker Image
        run: docker build --tag crpi-u3rymwjz4yzwkbmm.cn-chengdu.personal.cr.aliyuncs.com/qiuyicc/lego:${{ github.ref_name }} .
      - name: push docker Image
        run: docker push crpi-u3rymwjz4yzwkbmm.cn-chengdu.personal.cr.aliyuncs.com/qiuyicc/lego:${{ github.ref_name }}
    # 5. 查找compose文件并替换为相应的tag // [!code ++]
      - name: find and replace tag in docker-compose file
        uses: jacobtomlinson/gha-find-replace@master
        with:
          find: "{{tag}}"
          replace: "${{ github.ref_name }}"
          include: "docker-compose-online.yml"
      - run: cat docker-compose-online.yml
      # 6. 拷贝必要文件到lego-backend目录 // [!code ++]
      - name: 'copy necessary files to lego-backend directory'
        run: |
          mkdir lego-backend
          cp .env docker-compose-online.yml lego-backend
          cp -r mongo-entrypoint lego-backend
          ls -a lego-backend
      # 7. 通过scp拷贝文件到服务器 // [!code ++]
      - name: 'use scp copy files to server'
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          source: 'lego-backend'
          target: '~'
      # 8. 通过SSH登录重启服务 // [!code ++]
      - name: 'login SSH server'
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          script-stop: true
      # 9. 登录阿里云ACR // [!code ++]
          script: |
            docker login --username=${{ secrets.ACR_USERNAME }} --password=${{ secrets.ACR_PASSWORD }} ${{ secrets.ACR_SERVER }}
            cd ~/lego-backend
            docker-compose -f docker-compose-online.yml down
            docker-compose -f docker-compose-online.yml up -d
            rm -rf .env
            docker logout ${{ secrets.ACR_SERVER }}
```
回滚版本：找到对应的github actions，点击右上角Re-run all jobs回滚版本
![回滚版本](/github_rollback.png)

### Github Actions使用release-it精简流程

现在虽然可以自动化发布项目，但是需要手动打tag，以及package.json中的版本号更新，这就需要人工操作，这时候可以使用release-it来简化流程。

```js
npm i --save-dev release-it
```
```js
// package.json
scripts: {
    "release": "release-it" //弹出用户输入模式
    "release": "release-it --ci" //ci模式
}
```
release有两种模式，一种是弹出用户输入模式，一种是ci模式，ci模式是自动化脚本,release流程：
1. Prerequisite checks，检查是否满足发布条件
2. other plugins or user commands/hooks update file，其他插件或用户命令/hooks更新文件
3. git add . --update
4. git commit -m "[git.commitMessage]"
5. git tag --annotate --message="[git.tagAnnotation]" [git.tagName]
6. git push [git.pushArgs] [git.pushRepo]
```js
npm run release //使用弹出用户输入模式
```
 ![release-it](/github_release.png)

## Github 热点

1. **crawl4ai** 是一个专为大型语言模型设计的数据抓取工具。它旨在帮助用户从网络上高效地获取结构化数据，这些数据可以用来训练或增强现有的自然语言处理模型。[Crawl4AI](https://github.com/unclecode/crawl4ai)
2. **Pake** 是一个强大的工具，允许开发者将任何网页转换成跨平台的桌面应用程序。通过简单的命令行操作，它可以生成轻量级的应用程序安装包，支持Windows、macOS和Linux等操作系统。[Pake](https://github.com/tw93/Pake)
3. **screenpipe**,是一款基于AI技术的屏幕录制与分析工具。它不仅可以捕获屏幕内容，还能实时对图像进行处理，如文字识别、物体检测等，适用于远程协作、教学演示以及自动化测试等多种场景。[ScreenPipe](https://github.com/mediar-ai/screenpipe)
4. **exo** 是一种分布式AI推理框架，旨在提高大规模机器学习模型在生产环境中的性能。它允许多个节点协同工作，共同完成复杂的计算任务，特别适合需要高吞吐量和低延迟的应用。[Exo](https://github.com/exo-explore/exo)
5. **OpenBB**, 是一个开源的金融分析软件套件，面向投资者和技术分析师。它集成了大量金融数据来源，提供了强大的数据分析工具，帮助用户做出更明智的投资决策。[OpenBB](https://github.com/OpenBB-finance/OpenBB)

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

### yml错误
:::danger
The workflow is not valid. .github/workflows/push-image.yml (Line: 4, Col: 3): The identifier 'build and push' is invalid. IDs may only contain alphanumeric characters, '_', and '-'. IDs must start with a letter or '_' and and must be less than 100 characters.
:::
原因：yml文件格式错误，不能使用空格分割字符
```yml
build and push:
```
解决：
```yml
build-and-push:
```

### step错误1

:::danger
a step cannot have both the `uses` and `run` keys
:::
原因：step中不能同时使用`uses`和`run`

### step错误2
:::danger
every step must define a `uses` or `run` key
:::
原因：step中必须定义`uses`或`run`

### relase-it错误1
:::danger
ERROR Working dir must be clean
:::
原因：release首先要commit提交代码,但是commit之后仍然报错，使用git status查看文件状态，发现有未提交的没有忽略的无用文件混入了,删除无用文件即可。[release-it Docs](https://github.com/release-it/release-it/blob/main/docs/git.md)
```js
git add .
git commit -m "test tag"
```
```js
//.gitignore添加
/docker-volumes/
```
```js
git rm -r --cached docker-volumes/ //移除 docker-volumes 下已有的文件的跟踪，重新add，commit即可。
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

## Linux命令
```ts
ls        # 列出当前目录的文件
ls -l     # 列出详细信息
ls -a     # 列出所有文件，包括隐藏文件
cd /path/to/directory  # 切换到指定目录
cd ..                   # 返回上一级目录
pwd # 显示当前目录的路径
mkdir new_directory # 创建新目录
rmdir empty_directory # 删除空目录
rm file.txt                   # 删除文件
rm -r directory_name           # 递归删除目录及其内容
cp source.txt destination.txt  # 复制文件
cp -r source_directory/ destination_directory/  # 递归复制目录
mv oldname.txt newname.txt     # 重命名文件
mv file.txt /path/to/directory/ # 移动文件
cat file.txt # 查看文件内容
less file.txt # 逐页查看文件内容
nano file.txt  # 以 nano 编辑器打开文件
vim file.txt   # 以 vim 编辑器打开文件
```
```ts
top # 显示系统资源使用情况
free -m # 显示内存使用情况
df -h # 显示磁盘使用情况
du -sh directory_name # 显示目录大小
uname -a  # 显示所有系统信息  
```
```ts
chmod 755 file.txt  # 设置文件为 rwxr-xr-x
chown user:group file.txt  # 设置文件所有者为 user，群组为 group
sudo command  # 例如，安装软件
sudo useradd newuser # 添加新用户
passwd username # 修改用户密码
```
```ts
ping www.example.com # 测试网络连通性
ifconfig # 查看网络接口信息
netstat -tuln # 查看端口占用情况
curl http://www.example.com  # 通过 URL 发送请求和获取数据
```
```ts
//Debian/Ubuntu
sudo apt update               # 更新软件包列表
sudo apt upgrade              # 升级已安装的软件包
sudo apt install package_name  # 安装软件包
// Red Hat/CentOS
sudo yum update               # 更新软件包
sudo yum install package_name  # 安装软件包

```

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

[Docker Hub](https://hub.docker.com/)

[Docker 镜像——轩辕博客](https://xuanyuan.me/blog/archives/1154?from=tencent#_registry_mirror)

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
docker stop $(docker ps -q) //停止所有容器
docker ps -a //查看所有容器，包括停止的
docker ps -q //查看所有容器的ID
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


### Docker 上传项目及容器间通信

1. 在项目根目录下新建.dockerignore文件，排除不需要上传的文件和Dockerfile文件
```ts
FROM node:20
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install 
RUN npm install -g typescript
RUN npm run tsc 
EXPOSE 7001
CMD npx egg-scripts start  --title=egg-server-example
```
2. 对于项目间Docker通信，比如要和mongodb通信,配置production里面mongoose配置
```ts
config.mongoose = {
  //url: 'mongodb://localhost:27017/lego',
  url: 'mongodb://mongo:27017/lego', //改为mongo
};
```
3. 创建network通信
```ts
docker network create lego //创建名为lego的网络
docker run -d --network lego --name mongo -p 27017:27017 mongo
--network lego 指明容器加入lego网络
--name mongo 给容器起名mongo,和项目里面的mongo名称对应上
```
4. build docker镜像
```ts
docker build -t lego-backend .
docker run -d -p 7001:7001 --network lego lego-backend
```
![成功运行](/docker_project.png)


### Docker-Compose

Docker-Compose是Docker官方提供的编排工具，可以定义多个Docker容器的应用环境，并定义它们之间的交互关系，比如启动顺序、依赖关系等。

1. 安装，如果是安装了客户端，Mac和Windows会自定安装Docker-Compose，如果是Linux需要手动安装
```ts
docker-compose --version
```
2. 配置文件，docker-compose.yml文件，定义容器的配置信息，比如容器的镜像、端口、环境变量、依赖关系等
```ts
# docker-compose.yml
version: '3'
services:
  lego-mongo:
    image: mongo
    ports:
      - 27017:27017
    container_name: lego-mongo
    volumes:
      - './docker-volumes/mongo/data:/data/db'
  lego-backend:
    depends_on:
      - lego-mongo
    ports:
      - 7001:7001
    container_name: lego-backend
    build:
      context: .
      dockerfile: Dockerfile
```
3. 启动，在项目根目录下执行命令
```ts
docker-compose up -d //启动容器
docker-compose down //停止容器
docker-compose ps //查看容器状态
docker-compose logs //查看容器日志
docker-compose up -d --build //重新构建镜像并启动容器
```

### Docker 初始化项目Mongo

mongodb可以使用一个mongo-entrypoint文件来初始化mongodb，在docker-compose.yml文件中添加如下配置：
```js
version: '3'
services:
  lego-mongo:
    image: mongo
    ports:
      - 27017:27017
    container_name: lego-mongo
    volumes:
      - './docker-volumes/mongo/data:/data/db'
      - './mongo-entrypoint/:/docker-entrypoint-initdb.d/' //挂载mongo-entrypoint文件，注意mongo-entrypoint文件必须是在第一次初始化数据时起作用，如果需要再次初始化需要删除docker-volumes文件
    env_file: //挂载.env文件
      - .env
  lego-backend:
    depends_on:
      - lego-mongo
    ports:
      - 7001:7001
    container_name: lego-backend
    build:
      context: .
      dockerfile: Dockerfile
    env_file: //注入用户密码
      - .env
```
```js
//.env
mongdb里面内置了初始化用户和密码，当挂载mongo-entrypoint文件后，会自动执行初始化脚本，创建用户和密码
MONGO_INSERT_ROOT_USERNAME=xxx
MONGO_INSERT_ROOT_PASSWORD=xxx
MONGO_DB_USERNAME=xxx
MONGO_DB_PASSWORD=xxx
```
```js
//mongo-entrypoint/setup.sh
//编写一个初始shell脚本
#!/bin/bash
#shell 脚本中发生错误，则停止执行并退出
set -e

mongosh <<EOF //EOF表示在某个命令后执行的子命令
use admin
//进行mongdb的auth认证，可以直接使用MONGO_INITDB_ROOT_PASSWORD、USERNAME等环境变量，因为在前面的yml文件中已经挂载了相应的mongo-entrypoint初始化文件并设置了相应的env环境变量注入
db.auth('$MONGO_INSERT_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use lego
db.createUser({user: '$MONGO_DB_USERNAME', pwd: '$MONGO_DB_PASSWORD', roles: [{role: 'readWrite', db: 'lego'}]})
db.createCollection('works')
db.works.insertMany([
  {
    id: 19,
    title: '1024 程序员日',
    desc: '1024 程序员日',
    author: '185****2625',
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    copiedCount: 737,
    isHot: true,
    isTemplate: true,
    isPublic: true,
    createdAt: '2020-11-26T09:27:19.000Z',
  }
])
EOF
```
```js
//更改config.prod.js文件，为mongdb配置添加用户名和密码
  config.mongoose = {
    url: 'mongodb://lego-mongo:27017/lego',
    options: {
      user:process.env.MONGO_DB_USERNAME,
      pass:process.env.MONGO_DB_PASSWORD,
    },
  };
```
```js
//重新build
docker-compose up -d --build
```
![成功运行](/mongdb_init2.png)
![成功运行](/mongdb_init.png)

### Docker 启用Redis
```js
docker pull redis:6 //拉取redis镜像
```
```js
//docker-compose.yml
version: '3'
services:
  lego-mongo:
    image: mongo
    ports:
      - 27017:27017
    container_name: lego-mongo
    volumes:
      - './docker-volumes/mongo/data:/data/db'
      - './mongo-entrypoint/:/docker-entrypoint-initdb.d/'
    env_file:
      - .env
  lego-redis: //增加redis容器
    image: redis:6
    ports:
      - 6379:6379
    command: > //使用自定义requirepass密码
      --requirepass ${REDIS_PASSWORD}
    container_name: lego-redis
    env_file:
      - .env
  lego-backend:
    depends_on:
      - lego-mongo
      - lego-redis
    ports:
      - 7001:7001
    container_name: lego-backend
    build:
      context: .
      dockerfile: Dockerfile
    env_file:
      - .env
```
```js
//env文件增加redis密码
REDIS_PASSWORD=xxx
```
```js
//config.prod.js文件配置redis
config.redis = {
  client: {
    port: 6379,
    host: 'lego-redis',
    password: process.env.REDIS_PASSWORD,
    db: 0,
  },
};
```
```js
//重新build
docker-compose up -d --build
```

### Docker alpine优化镜像大小
Alpine:
  small:默认软件包，alpine选择busybox，C运行库，一般使用glibc，alpine选择musl
  Simple：很多内置插件去掉，去掉国际化
  Secure安全

```js
docker pull node:20-alpine //拉取node:20-alpine镜像
```
```js
//Dockerfile
FROM node:20-alpine
```

### Docker 优化构建速度

docker层的cache机制，docker build命令会把每一层的镜像缓存下来，下次构建时，会优先使用缓存的层，加快构建速度。而如果上一层的的缓存失效，会导致下一层的缓存失效。对项目来说，如果package.json文件没有变化，则可以直接使用缓存的层，加快构建速度。

```js
FROM node:20-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json package-lock.json /usr/src/app/ ///先进行复制package.json和package-lock.json文件
RUN npm install //先进行安装依赖
COPY . /usr/src/app/ //复制项目文件，如果package.json文件没有变化，则可以直接使用缓存的层，直接复制项目文件，加快构建速度
RUN npm run tsc 
EXPOSE 7001
CMD npx egg-scripts start  --title=egg-server-example
```

### Docker 服务器运行项目

1. 服务器安装docker、docker安装相应的images镜像
2. 服务器上拉取项目代码，进入项目根目录，执行docker-compose up -d --build 启动项目
3. 服务器上开放相应的端口，对于端口已经占用的，可以停止占用端口的进程，或者修改映射端口号
4. 使用IP访问项目，查看是否成功
![服务器运行项目](/server_docker.png)
![服务器运行项目](/server_docker2.png)

### 阿里云容器镜像服务ACR
目前线上更新的流程：
1. 每次代码更新以后，登录到ssh服务器
2. 关闭服务，docker-compose down
3. 更新代码 git pull
4. 重新设置.env文件
5. 重新build镜像，docker-compose build  xxx
6. 重启服务，docker-compose up -d

每次都要手动部署和设置，非常繁琐，最理想的是自动一次性部署到服务器，并且自动更新代码。我们在docker-compose.yml文件生成的应用镜像是在本地的，如果我们把镜像上传到阿里云的容器镜像服务，就可以实现自动部署和更新，不需要build，而是直接使用服务器中的的镜像.[阿里云镜像服务](https://cr.console.aliyun.com/cn-chengdu/instances)
1. 登录阿里云容器镜像服务，创建个人版本实例，设置密码
2. 创建命令空间
3. 创建镜像仓库，代码源为本地仓库
4. 点击仓库，查看仓库基本信息和操作
5. 将生成的镜像推送到创建好的阿里云镜像仓库
```js
docker login --username=xxxxx crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com //登录阿里云镜像仓库
```
```js
//构建镜像方式一，直接build的时候打tag
docker build --tag "crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/仓库名:镜像版本号" . 
//构建镜像方式二，build之后再push到仓库
docker-compose build xxx //构建镜像
docker tag [ImageId] crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/xxxx/lego:[镜像版本号]
```
```js
docker push crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/xxxx/lego:[镜像版本号] //推送镜像到阿里云镜像仓库
```
```yml
# 增加一个新的docker-compose-online.yml文件，将镜像源改为阿里云镜像仓库
version: '3'
services:
  lego-mongo:
    image: mongo
    ports:
      - 27018:27017
    container_name: lego-mongo
    volumes:
      - './docker-volumes/mongo/data:/data/db'
      - './mongo-entrypoint/:/docker-entrypoint-initdb.d/'
    env_file:
      - .env
  lego-redis:
    image: redis:6
    ports:
      - 6378:6379
    command: > 
      --requirepass ${REDIS_PASSWORD}
    container_name: lego-redis
    env_file:
      - .env
  lego-backend:
    # 使用阿里云镜像仓库的镜像
    image: crpi-xxxxx.cn-chengdu.personal.cr.aliyuncs.com/xxxx/lego:1.0.0
    # 使用7002端口映射，避免与本地端口冲突
    ports:
      - 7002:7001
    container_name: lego-backend
    env_file:
      - .env
```
```js
docker-compose -f docker-compose-online.yml up -d //使用docker-compose-online.yml文件启动项目
```
这样即使本地没有项目的镜像，也会从阿里云镜像仓库拉取镜像。



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


