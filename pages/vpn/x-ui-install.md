# 安装 3x-ui 面板

## 1. 安装命令

在 VPS（建议 Console / root）执行：

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

说明：

- 需要能访问 GitHub
- 脚本会安装 x-ui、可能附带 fail2ban / IP limit 等
- **会改系统**，只在自己机器上使用

## 2. SSL 证书步骤（安装向导）

安装过程会出现 **SSL Certificate Setup**：

| 选项 | 含义 | 本次建议 |
|------|------|----------|
| 1 Let's Encrypt Domain | 有域名 | 有域名再选 |
| 2 Let's Encrypt for IP | 按公网 IP 签证书，约 6 天自动续 | **只有 IP 时选 2（默认）** |
| 3 Custom | 自备证书 | 一般不用 |
| 4 Skip SSL | 明文 HTTP | 仅内网/反代时 |

注意：

- 1/2 需要 **80 端口** 对公网可达
- 询问 IPv4 是否正确时确认 `y`
- 「是否有 IPv6」：当时可先留空跳过；VPS 启用 IPv6 后再补证书也可以

## 3. 查看面板信息

```bash
x-ui settings
# 或
x-ui
```

典型输出字段：

```text
port: 11027
webBasePath: /随机字符串/
Access URL: https://A.B.C.D:11027/随机字符串/
Panel is secure with SSL
hasDefaultCredential: false   # false = 安装时自定义过账号
```

本地备份示例（勿公开）：

```text
AccessURL_IPv4: https://A.B.C.D:11027/xxxx/
AccessURL_IPv6: https://[VPS_IPv6]:11027/xxxx/
```

## 4. 用户名密码看不到怎么办

`x-ui settings` **不显示密码**。

在菜单里：

```bash
x-ui
# 选 7 Reset Username & Password
```

按提示设新用户名、密码。  
若问是否关闭 2FA：自用、没配验证器时选 **`y`**。

## 5. 防火墙务必放行面板端口

本次踩坑：服务已监听 `11027`，但 UFW 只有 22/80/443/WG，**没放行 11027**。

```bash
x-ui status
ss -lntp | grep 11027
ufw allow 11027/tcp
ufw reload
ufw status
```

## 6. 家宽打不开面板时

按优先级：

1. **手机流量**试 AccessURL（判断是不是家宽拦 TCP）
2. **WireGuard 分隧道**后打开 `https://10.66.66.1:端口/path/`
3. 家里开好 IPv6 后用：

```text
https://[VPS公网IPv6]:端口/path/
```

证书可能报名称不匹配，继续访问即可。

## 7. 常用维护命令

```bash
x-ui              # 交互菜单
x-ui status
x-ui start|stop|restart
x-ui log
x-ui settings
```

菜单里还有：改端口、重置路径、SSL、防火墙、BBR 等。

下一篇：[入站配置与导出节点](./x-ui-inbound.md)
