# 

## 部署本地大模型

[模型](https://huggingface.co/models)

[openWebui](https://openwebui.com/)

### 准备工作

1. 下载Ollama，大模型的部署和管理工具，[Ollama](https://ollama.com/download),下载完成后打开浏览器输入localhost:11434,查看ollama是否正常运行
![ollma运行](/ollama_running.png)
```js
cmd输入
ollama //查看ollma命令
ollama list //查看已有模型
ollama run llama3.2 //下载模型，即可在命令行对话
```

### 图形化界面

2. MaxKB，一个基于大语言模型和RAG的知识库问答系统，RAG：检索、增强、生成，用来解决大语言模型的生成问题，大语言模型是基于预训练集训练出来的，如果你的问题超出了它的数据集，那么会出现“答非所问”，RAG通过通过从外部数据源添加一些上下文和基本信息，生成更准确的答案。[MaxKB](https://maxkb.cn/docs/installation/offline_installtion/)

MaxKB官方支持Ubuntu和CentOS，如果要使用Windows和Mac，可以在Docker上运行，注意配置代理或许加速
```js
docker run -d --name=maxkb -p 5005:8080 -v ~/.maxkb:/var/lib/postgresql/data 1panel/maxkb
```
搞定之后打开浏览器localhost:5005,查看MaxKB是否正常运行
![MaxKB运行](/maxkb_running.png)

输入默认用户密码登录,进入MaxKB图形化界面
```js
username:admin
password:MaxKB@123..
```
3. 创建模型，系统管理 -> 模型设置 -> 选择模型创建
![创建模型](/maxkb_createollama.png)

4. 创建应用，应用 -> 创建应用 -> 设置完成后点击发布 -> 概览获取公开访问链接 -> 粘贴到浏览器
![创建应用](/maxkb_public.png)

5. 嵌入网页，点击嵌入第三方

![嵌入第三方](/maxkb_insert.png)

### 内网穿透

现在我们的应用只能在本地localhost上访问，如果要让其他人访问，就需要进行内网穿透，这里推荐一个免费的内网穿透工具，[NGROK官网](https://ngrok.com/)
1. 安装NGROK,[NGROK安装](https://download.ngrok.com/windows?tab=install)
2. 注册NGROK账号，注意不能使用QQ账号，可以使用网易邮箱账号
3. 获取自己的Auth Token
![Auth Token](/ngork_authToken.png)
```js
CMD输入
ngrok config add-authtoken $YOUR_AUTHTOKEN
```
4. 启动NGROK
```js
ngrok http 5005 //启动ngrok，将5005端口映射到本地
```
![NGROK启动](/ngork_start.png)
5. 将映射的公网地址和我们的应用公网地址进行拼接，即可访问到MaxKB的图形化界面
![访问MaxKB](/ngork_bindurl.png)


### 错误

[MaxKB对接Ollama出现问题](https://bbs.fit2cloud.com/t/topic/4165/4)



