# v2rayN 客户端与排障

客户端以 **v2rayN（Windows）** 为例；Clash 老版本对 VLESS Reality / XHTTP 支持差，优先 v2rayN + 新 Xray 内核。

## 1. 导入节点

1. 复制 `vless://...` 链接
2. v2rayN → 从剪贴板导入
3. 确认显示大致为：`VLESS` / `raw` / `reality`
4. 测延迟：通了应是绿色数字（本次约 220ms）；**-1** = 握手失败

### 延迟 -1 时优先检查

- 入站是否 XHTTP/mKCP/复杂加密 → 改回 **RAW + Reality**
- 端口是否 UFW 放行
- 链接是否 IPv6，本机 IPv6 是否真通（`ping -6 2001:4860:4860::8888`）
- 内核是否过旧 → 更新 Xray

## 2. 推荐日常设置

### 底部栏

| 项 | 建议 |
|----|------|
| 启用 Tun | 开（**管理员运行** v2rayN） |
| 系统代理 | 测流媒体时可先「清除系统代理」，只留 Tun |
| 路由 | 先用 `V4-全局(Global)` 验证；稳定后再改「绕过大陆」 |

### Tun 模式设置

| 项 | 建议 | 原因 |
|----|------|------|
| 自动路由 | 开 | |
| 严格路由 | 开 | |
| **启用 IPv6** | **开** | 关了以后 YouTube 等 IPv6 流量可能不进 Tun |
| MTU | **1400** | 不要用 9000，容易导致大流量异常 |
| 旧版 TUN 保护 | 按需 | 关则用 xray TUN |

### DNS 基础设置

| 项 | 建议 |
|----|------|
| 直连 DNS | 如 `119.29.29.29` |
| 远程 DNS | `https://cloudflare-dns.com/dns-query` |
| **代理目标解析策略** | **`UseIPv4`** |
| Happy Eyeballs | 先关 |

### 路由规则集 `V4-全局`

| 项 | 建议 |
|----|------|
| 域名解析策略 | `IPIfNonMatch` |
| sing-box 域名解析策略 | **`ipv4_only`** |
| `阻断udp443` | 可先取消勾选；若 QUIC 异常再按需开启或改 proxy |

> 日志里若出现 `udp:142.251.x.x:443 [tun -> block]`，就是「阻断 udp443」规则在生效。  
> 页面能开、视频不能播时，优先怀疑这条或浏览器 QUIC。

## 3. 浏览器侧

```text
chrome://flags/#enable-quic  →  Disabled → 彻底退出 Chrome 再开
```

无痕窗口测试；也可换 Firefox 对比。

## 4. YouTube 专项（本次真实结论）

排查过 Tun / QUIC / 规则 / IPv4 策略后，最终发现：

> **登录 YouTube 账号之后就可以正常播放**；未登录时出现「视频无法播放」。  
> 页面能打开（甚至显示 YouTube SG）、TikTok 能播，并不等于播放器权限/登录状态正常。

建议验证顺序：

1. 先确认节点延迟正常、Tun+全局
2. 登录 Google/YouTube
3. 再试普通长视频（Shorts 更容易抽风）

## 5. 日志怎么读

| 日志 | 含义 |
|------|------|
| `[tun -> proxy]` | 流量进代理 |
| `[tun -> block]` | 被规则阻断 |
| `[tun -> dns]` | DNS 走模块 |
| `2404:6800:...` | Google IPv6 |
| `142.250.` / `142.251.` | Google IPv4 |
| 不见 `googlevideo` 字样 | 正常，常只显示 IP |

## 6. 连通性自测

```text
https://www.cloudflare.com/cdn-cgi/trace
```

看 `ip` / `loc` 是否变为新加坡附近。  
v2rayN 显示「已连接」但 IP 仍是国内，说明流量没走节点。

下一篇：[踩坑清单与速查](./troubleshooting.md)
