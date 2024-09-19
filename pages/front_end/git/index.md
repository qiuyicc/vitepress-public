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