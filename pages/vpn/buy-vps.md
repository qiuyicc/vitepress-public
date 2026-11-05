# 购买与初始化 VPS

## 1. 选购建议（本次实操）

| 项 | 选择 |
|----|------|
| 商家 | Vultr |
| 产品 | Cloud Compute（常规云主机，不是免费试用那种受限实例） |
| 地区 | Singapore（新加坡） |
| 系统 | Ubuntu 24.04 LTS x64 |
| 规格 | 最低档约 $5/月即可练手 |
| 用途 | 自建 WireGuard + 3x-ui，个人实验 |

支付与账号按官网流程即可。创建后记下：

- 公网 **IPv4**（例：`A.B.C.D`）
- 之后在 Settings 里再 **Enable IPv6**（后面家宽 IPv4 不通时很关键）
- root 初始密码（邮件或控制台）

## 2. 登录方式：先认清家宽限制

### 现象（本次踩坑）

从家里用 SSH 连 `A.B.C.D:22` / `:443` / `:8080` 经常 **超时**。  
同一台机器用 **Vultr 网页 Console** 可以正常登录。

### 结论

不是密码错，而是 **运营商/路径对这台 VPS 的部分 TCP 不通**。  
因此：

1. 初期所有操作优先用 **View Console**
2. 面板、节点尽量准备 **IPv6 访问路径**
3. 不要假设「家里能 SSH = 服务没问题」

## 3. Console 首次登录

1. Vultr → 实例 → **View Console**
2. 用户：`root`，密码：控制台邮件里的密码（注意 `0`/`O`）
3. 建议立刻改密码：

```bash
passwd
```

## 4. 基础安全与端口规划

本环境最终大致端口：

| 端口 | 协议 | 用途 |
|------|------|------|
| 22 或 443 | TCP | SSH（若改到 443，注意别和业务抢端口） |
| 80 | TCP | Let's Encrypt HTTP 校验 |
| 11027（示例） | TCP | 3x-ui 面板 |
| 56783（示例） | UDP | WireGuard |
| 自定义（如 31934） | TCP | VLESS 入站 |

UFW 示例（按你实际端口改）：

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 11027/tcp
ufw allow 56783/udp
ufw allow 31934/tcp
ufw enable
ufw status
```

Vultr 若挂了 Firewall Group，也要在控制台放行同样端口。

## 5. 开启 VPS 公网 IPv6

家宽 IPv4 直连不稳时，IPv6 是救命绳。

1. Vultr 实例 → **Settings / Networking → IPv6 → Enable**
2. Console：

```bash
ip -6 addr show enp1s0
# 应出现 scope global 的地址，例如 2401:xxxx:...
curl -6 -I https://ipv6.google.com
```

只有 `fe80::` 没有全局地址 = 还没分配成功，需等启用完成或重启网络。

## 6. 配置信息本地备份（建议）

在电脑建一个私密目录（不要公开推送），记录：

```text
VPS_IPv4=
VPS_IPv6=
SSH_PORT=
WG_PORT=
PANEL_PORT=
PANEL_PATH=
PANEL_USER=
PANEL_PASS=
VLESS_PORT=
```

下一篇：[WireGuard 安装与客户端](./wireguard.md)
