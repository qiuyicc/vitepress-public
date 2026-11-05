# 自建 VPS / VPN 实践笔记

> 基于本机实操整理：Vultr 新加坡 VPS → WireGuard → 3x-ui（VLESS + Reality）→ v2rayN 客户端。  
> **仅作个人学习与自用网络实验记录。请遵守当地法律法规，勿对外提供服务或用于违法用途。**  
> 文中 IP、密钥、密码均为占位符，请替换成你自己的值，切勿把真实私钥提交到公开仓库。

## 最终可用方案（摘要）

| 组件 | 作用 | 本环境结论 |
|------|------|------------|
| Vultr Cloud Compute（新加坡） | 海外出口机器 | Ubuntu 24.04，约 $5/月 |
| WireGuard | 点对点隧道 / 管理内网 | **分隧道**可握手；全隧道在本家宽上不稳定 |
| 3x-ui + Xray | VLESS / Reality 代理面板 | 家宽 **IPv4 直连 VPS 常超时**，用 **IPv6** 访问面板与节点更稳 |
| v2rayN | Windows 客户端 | 传输选 **RAW + Reality**；Tun + 全局；YouTube 需登录后才正常播放 |

## 文档目录

1. [购买与初始化 VPS](./buy-vps.md)
2. [WireGuard 安装与客户端](./wireguard.md)
3. [安装 3x-ui 面板](./x-ui-install.md)
4. [入站配置与导出节点](./x-ui-inbound.md)
5. [v2rayN 客户端与排障](./client-v2rayn.md)
6. [踩坑清单与速查](./troubleshooting.md)

## 架构示意

```text
[家里 Windows]
    │
    ├─ IPv6 ──────────────► [Vultr SG VPS]
    │                         ├─ WireGuard UDP :56783  (内网 10.66.66.0/24)
    │                         ├─ 3x-ui 面板 TCP :11027 (+ SSL)
    │                         └─ VLESS Reality TCP :自定义端口
    │
    └─ IPv4 直连 VPS ────► 本环境经常超时 / 被拦（SSH、面板皆然）
```

## 推荐阅读顺序

按上面 1 → 5 做；出问题时看第 6 篇。若只想快速复现「能看外网」的链路，可跳过 WireGuard，直接做 VPS + 3x-ui + v2rayN（仍建议保留 Console 登录能力）。
