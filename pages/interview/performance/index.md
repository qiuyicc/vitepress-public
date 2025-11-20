# Performance

## import很多如何优化

使用Re-export重导出

模块重导的几种形式：
1. 直接重导出，直接从另一个模块重导出特定成员
```ts
export { foo, bar } from './other-module';
```
2. 重命名并导出，从另一个模块导入成员并重命名他们然后再导出
```ts
export { foo as renamedFoo, bar as renamedBar } from './other-module';
```
3. 重导出整个模块(不含默认导出)，将另一个模块的所有导出成员作为单个对象重导出
```ts
export * from './other-module';
```
4. 收拢集合再重导出
```ts
import { foo, bar } from './other-module';
export { foo, bar };
```