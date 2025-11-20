# 其他

## 图片优化

1. 不用图片，有些时候修饰图可以使用CSS代替
2. CDN加速，使用第三方的图片CDN加速，可以大幅度减少网站的响应时间
3. 小图使用base64格式
4. 精灵图
5. 合适的图片格式，能够使用Webp的尽量使用Webp，WebP具有更好的图片压缩算法，带来更小的图片体积，缺点是兼容性不好
6. 小图使用PNG，大图使用PNG，图标使用SVG

## 响应式与大屏
1. 媒体查询  
```js
兼容性好，支持所有现代浏览器
实现简单，纯CSS
可精确控制不同断点的样式
支持多种媒体类型（screen、print等）

需要维护多套样式代码
断点设置不当会导致样式跳跃
代码量较大，维护成本高
无法实现平滑过渡
/* 移动端 */
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
    padding: 10px;
  }
}

/* 平板 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* PC端 */
@media screen and (min-width: 1025px) {
  .container {
    width: 1200px;
    margin: 0 auto;
  }
}
```
2. rem适配
```js
适配效果好，等比缩放
一套代码适配多端
计算相对简单
兼容性好（IE9+）


需要JS动态设置根字体大小
字体大小也会缩放，可能需要单独处理
嵌套层级深时计算复杂
需要配合设计稿基准值
// 动态设置根字体大小
function setRem() {
  const designWidth = 750; // 设计稿宽度
  const baseSize = 100; // 基准值
  const scale = document.documentElement.clientWidth / designWidth;
  document.documentElement.style.fontSize = baseSize * scale + 'px';
}

setRem();
window.addEventListener('resize', setRem);

// CSS中使用
.container {
  width: 7.5rem; /* 750px / 100 */
  height: 3rem;  /* 300px / 100 */
}
```
3. vw/vh
```js
纯CSS实现，无需JS
响应式效果好
性能好，浏览器原生支持
适配简单

兼容性稍差（IE9不支持，需要polyfill）
小屏幕可能出现字体过小
需要手动计算vw值
无法精确到1px
/* 设计稿 750px，1vw = 7.5px */
.container {
  width: 100vw;
  height: 50vh;
  font-size: 4vw; /* 30px / 7.5 */
  padding: 2.67vw; /* 20px / 7.5 */
}

/* 使用 calc 更精确 */
.container {
  width: calc(100vw - 40px);
}
```
4. 百分比适配
```css
实现简单
兼容性最好
无需额外配置

只能适配宽度，高度适配困难
嵌套计算复杂
无法精确控制
容易产生布局问题
.container {
  width: 100%;
  height: 50%;
}

.child {
  width: 50%;
  margin: 0 auto;
}
```
5. Flex适配
布局灵活，一维布局强大
自适应能力强
代码简洁
现代浏览器支持好

二维布局能力有限
兼容性（IE10+）
嵌套复杂时性能可能下降
```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.item {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}
```

6. Grid适配
```css
二维布局能力强
代码简洁
响应式实现优雅
布局精确

兼容性较差（IE不支持）
学习成本较高
复杂布局可能性能下降
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 响应式网格 */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

## 大屏适配方案
1. Scale 缩放方案
```js
实现简单，一套代码
保持设计稿比例
适配效果好
无需修改现有代码

可能出现模糊（缩放导致）
滚动条处理复杂
交互事件坐标需要转换
性能一般
// 大屏适配 - scale缩放
function scaleScreen() {
  const designWidth = 1920;
  const designHeight = 1080;
  const scaleX = window.innerWidth / designWidth;
  const scaleY = window.innerHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);
  
  document.body.style.transform = `scale(${scale})`;
  document.body.style.transformOrigin = 'top left';
  document.body.style.width = designWidth + 'px';
  document.body.style.height = designHeight + 'px';
}

scaleScreen();
window.addEventListener('resize', scaleScreen);
```
2. rem + vw 混合方案
```js
// 大屏使用vw，小屏使用rem

结合两种方案优势
适配范围广
灵活性高

实现复杂
维护成本高
需要处理边界情况
function setRem() {
  const width = window.innerWidth;
  if (width >= 1920) {
    // 大屏使用vw
    document.documentElement.style.fontSize = width / 100 + 'px';
  } else {
    // 小屏使用rem
    const scale = width / 750;
    document.documentElement.style.fontSize = 100 * scale + 'px';
  }
}
```
3. 固定尺寸+居中方案
```js
实现最简单
性能最好
无需计算

小屏幕显示不完整
用户体验差
不适用于响应式需求
.container {
  width: 1920px;
  height: 1080px;
  margin: 0 auto;
  position: relative;
}

/* 超出部分隐藏或滚动 */
body {
  overflow: hidden; /* 或 auto */
}
```
4. 百分比 + 最大/最小宽度
```css
实现简单
适配中等屏幕
保持最大宽度限制


小屏幕无法适配
固定最小宽度限制灵活性
.container {
  width: 100%;
  max-width: 1920px;
  min-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```


## 离屏渲染
离屏渲染（Off-Screen Rendering）指浏览器或渲染引擎在当前屏幕之外（内存中的缓冲区）先把内容绘制好，然后再一次性合成到可视页面。例如 transform、opacity、filter 等特效，或使用 canvas、WebGL、iframe、video，以及 CSS will-change、translateZ(0) 等都会触发离屏渲染（又称“合成层”或“独立层”）。
1. 创建独立的渲染层或缓冲区
2. 在后台先完成该层的绘制/渲染
3. 合成阶段将离屏结果与主页面叠加

缺点：
1. 内存占用增加：每个离屏层都需要额外的显存/内存，层数多会造成内存压力。
2. 创建成本：建立和维护合成层需要额外的 CPU/GPU 开销，如果频繁创建/销毁，会导致性能抖动。
3. 不当使用反而降速：滥用 will-change 或 transform: translateZ(0) 会强制创建过多图层，引发“层爆炸”，导致渲染卡顿。
4. 调试复杂：层级关系、合成顺序、z-index 等问题更难定位，容易出现叠层错误或锯齿、模糊等副作用。
5. 移动端耗电：GPU 参与渲染更频繁，可能导致发热、耗电加剧。