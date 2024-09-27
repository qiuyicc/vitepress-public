# Npm Error

## certificate has expired
```ts
//证书过期了
1、取消ssl验证：
 
npm config set strict-ssl false
 
2、更换npm镜像源：
 
npm config set registry http://registry.cnpmjs.org
npm config set registry http://registry.npm.taobao.org

```

## Connect Timeout Error

::: danger
HttpClientConnectTimeoutError: Connect Timeout Error
:::
```ts
//解决方法：
npm config set proxy=null 
```
