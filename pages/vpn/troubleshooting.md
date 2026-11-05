# 踩坑清单与速查

按现象检索。

## 网络 / 登录 VPS

| 现象 | 原因 | 处理 |
|------|------|------|
| 家宽 SSH 超时，Console 正常 | 运营商对 VPS TCP 拦截/路由差 | 用 Console；改走 IPv6；或 WG 内网管理 |
| `curl -6 ipv6.google.com` 解析失败 | DNS 污染或无 IPv6 | 查 `ipconfig`；路由器开 IPv6+PD |
| `nslookup` 得到 `2001::1` | 假 AAAA | 换 DNS；修光猫劫持 |
| `ping -6`「传输失败」 | IPv6 未真正通 | 路由器选无状态/DHCPv6+PD；保存后重连 WiFi |
| 路由里选 DHCPv6 又跳回无状态 | 固件按上行能力纠正 | 可保留无状态+PD，以 ping -6 为准 |

## WireGuard

| 现象 | 原因 | 处理 |
|------|------|------|
| 全隧道连上但无网 | 路由黑洞 / 网关冲突 | 改分隧道 `AllowedIPs=10.66.66.0/24` |
| 公钥不匹配 | 复制密钥时 0/O 错误 | 重新生成并核对 |
| 家里拷不了 conf | SCP 超时 | termbin / Console 手抄 |

## 3x-ui 面板

| 现象 | 原因 | 处理 |
|------|------|------|
| AccessURL 浏览器连不上 | UFW 未放行面板端口 | `ufw allow 端口/tcp` |
| 服务在听、外网不通 | 家宽拦公网 TCP | IPv6 URL 或 `https://10.66.66.1:...` |
| 不知道账号密码 | settings 不显示密码 | `x-ui` → 7 重置；2FA 选 y |
| 导出链接空白 / 无二维码 | 未添加客户端 | 先「添加客户端」再导出 |
| 下载的「新加坡」文件打不开 | 0 字节空文件 | 用剪贴板粘贴到记事本 |

## 节点 / 客户端

| 现象 | 原因 | 处理 |
|------|------|------|
| 延迟 -1 | XHTTP/协议不兼容或端口不通 | 改 RAW+Reality；放行端口；更新内核 |
| Clash 超时 | 内核/协议支持不足 | 改用 v2rayN |
| `curl` 端口 Empty reply | 非 HTTP 服务 | 属正常，只说明 TCP 通 |
| TikTok 能播 YouTube 不能 | QUIC 被 block / 未登录等 | 查 `阻断udp443`；关浏览器 QUIC；**登录 YouTube** |
| 日志 `[tun -> block]` udp443 | 全局规则里阻断 QUIC | 取消该规则或改 proxy |
| 日志只有 `2404:6800` | 仍走 IPv6 出网 | DNS `UseIPv4` + 规则集 `ipv4_only` |
| Tun IPv6 关着 | 视频 IPv6 旁路 | Tun 设置里启用 IPv6 |
| MTU 9000 | 大包异常 | 改为 1400 |

## 家宽 IPv6 路由器参考

启用 IPv6 后：

- 全局地址：无状态自动配置（若 DHCPv6 保存后又跳回，可接受）
- DNS：DHCPv6 或手动 `2001:4860:4860::8888` / `2400:3200::1`
- 前缀代理：**PD**
- 保存 → 重连 WiFi → `ping -6 2001:4860:4860::8888`

## 本次成功路径（复盘）

```text
Vultr SG Ubuntu
  → 开 IPv6
  → 装 3x-ui + IP 证书 + UFW 放行面板/入站端口
  → 入站：VLESS + RAW + Reality(www.microsoft.com:443)
  → 添加客户端，导出 vless://（IPv6 地址）
  → v2rayN：Tun(开IPv6, MTU1400) + 全局 + UseIPv4/ipv4_only
  → 取消有问题的 udp443 block（按需）
  → 登录 YouTube 后视频可播放
```

WireGuard 作为旁路：分隧道管理 VPS / 访问面板内网 IP。

## 安全提醒

- 私钥、面板密码、vless 链接不要进公开 Git
- `pages/` 若被 gitignore，本地笔记仍可能随其它备份泄露，注意目录权限
- 仅自用；合法合规由使用者自行负责

返回：[VPN 总览](./index.md)
