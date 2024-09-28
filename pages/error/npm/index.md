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


## npm publish 403 Forbidden

::: danger
403 Forbidden
原因：重名了
:::
解决方法：更换package.json中的name