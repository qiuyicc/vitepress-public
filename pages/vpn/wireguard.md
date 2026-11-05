# WireGuard 安装与客户端

WireGuard 适合当「管理隧道 / 内网」：SSH、面板走 `10.66.66.1` 可绕过家宽对公网 TCP 的拦截。  
本次结论：**分隧道可稳定握手**；`AllowedIPs = 0.0.0.0/0` 全隧道在本机网络下容易黑洞。

## 1. 服务器安装

Ubuntu 示例：

```bash
apt update
apt install -y wireguard wireguard-tools
```

开启转发：

```bash
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p
```

## 2. 生成密钥

```bash
umask 077
cd /etc/wireguard
wg genkey | tee server_private.key | wg pubkey > server_public.key
wg genkey | tee client1_private.key | wg pubkey > client1_public.key
# 可选 PSK
wg genpsk > client1_psk.key
```

## 3. 服务端配置示例

文件：`/etc/wireguard/laptop.conf`（接口名可自定，对应 `wg-quick` 名）

```ini
[Interface]
Address = 10.66.66.1/24
ListenPort = 56783
PrivateKey = <SERVER_PRIVATE_KEY>
# 若网卡名不是 ens3/enp1s0，先用 ip route 看默认出口
PostUp = iptables -A FORWARD -i laptop -j ACCEPT; iptables -t nat -A POSTROUTING -o enp1s0 -j MASQUERADE
PostDown = iptables -D FORWARD -i laptop -j ACCEPT; iptables -t nat -D POSTROUTING -o enp1s0 -j MASQUERADE

[Peer]
# PC1
PublicKey = <CLIENT1_PUBLIC_KEY>
PresharedKey = <CLIENT1_PSK>
AllowedIPs = 10.66.66.2/32

[Peer]
# Laptop
PublicKey = <CLIENT2_PUBLIC_KEY>
PresharedKey = <CLIENT2_PSK>
AllowedIPs = 10.66.66.3/32
```

启动：

```bash
systemctl enable wg-quick@laptop
systemctl start wg-quick@laptop
wg show
ufw allow 56783/udp
```

## 4. 客户端配置（Windows）

安装 [WireGuard for Windows](https://www.wireguard.com/install/)，新建隧道，例如：

### 推荐：分隧道（本次能通）

```ini
[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = 10.66.66.4/32
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
PresharedKey = <CLIENT_PSK>
Endpoint = A.B.C.D:56783
AllowedIPs = 10.66.66.0/24
PersistentKeepalive = 25
```

含义：只有访问 `10.66.66.0/24` 才走隧道，其它流量仍走家里网络。

### 可选：IPv6 Endpoint

家宽 IPv4 到 VPS 不稳、IPv6 通时：

```ini
Endpoint = [2401:xxxx:xxxx:xxxx::xxxx]:56783
```

### 不推荐先用：全隧道

```ini
AllowedIPs = 0.0.0.0/0, ::/0
```

本次在该电脑上容易出现：握手异常或「已连接但上不了网」（默认路由/网关被改乱，和向日葵、VMware 虚拟网卡也可能冲突）。

## 5. 配置怎么传到本地

家宽 SSH/SCP 超时，可用：

1. Console 里 `cat` 配置，用 [termbin](https://termbin.com) 等临时粘贴（注意时效与隐私）
2. 或 Console 手打关键字段到本地文件

本地保存示例路径：`F:\learnAgent\laptop-client-*.conf`（**勿提交 git**）

## 6. 连通性检查

客户端激活后：

```text
ping 10.66.66.1
```

服务器：

```bash
wg show
ping 10.66.66.4
```

### 用 WG 访问 3x-ui 面板（绕过公网 TCP 封锁）

```text
https://10.66.66.1:面板端口/WebBasePath/
```

证书若签的是公网 IP，浏览器会提示证书不匹配，选继续即可。

## 7. 多设备注意

每个 Peer 的 `Address` / `AllowedIPs` 必须唯一（`.2` / `.3` / `.4`…）。  
同一私钥不要在多台设备同时在线。

下一篇：[安装 3x-ui 面板](./x-ui-install.md)
