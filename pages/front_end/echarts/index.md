# 可视化

<!-- Echarts 学习，[Echarts 官网](https://echarts.apache.org/zh/feature.html) -->

## Canvas

### 学习

lineCap:
1. butt,平直
2. round,圆角
3. square,方形

lineJoin:
1. bevel,斜角
2. round,圆角
3. miter,尖角

1. beginPath()：开始绘制路径
2. moveTo(x,y)：移动到指定坐标
3. lineTo(x,y)：从当前点到指定坐标画一条直线
4. fill()：填充路径
5. stroke()：绘制路径的轮廓
6. closePath()：关闭当前路径

strokeStyle/fillStyle:
1. color,普通颜色
2. gradient,渐变色
3. pattern,图案

```ts
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.moveTo(100, 100);
ctx.lineTo(300,200);
ctx.lineTo(100,300);
// ctx.strokeStyle = 'blue';
// 线性渐变
const grd = ctx.createLinearGradient(100,100,300,300);
// 径向渐变
const grd2 = ctx.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
grd.addColorStop(0, '#fff');
grd.addColorStop(0.5, '#f00');
grd.addColorStop(1, '#0f0');
ctx.lineWidth=10;
ctx.fillStyle = grd
ctx.fill()
```

绘制文字：
```ts
ctx.fillText(str, x, y, maxWidth)
ctx.strokeText(str, x, y, maxWidth)
```
font属性：
```ts
ctx.fong = 'bold 20px Arial'
```
位置：
```ts
默认左下角对齐
ctx.textAlign = 'center'
ctx.textBaseline = 'top' // 原点，默认为bottom
```
多行文字：
```ts
const fontSzie = 20;
// 设置行高
const lineHeight = fontSzie * 2;
ctx.font = `${fontSzie}px Arial`;
// 设置居中对齐
ctx.textAlign = 'center';
// 设置顶部对齐
ctx.textBaseline = 'top';
const lines = [];
let line = '';
// 颜色
ctx.fillStyle = 'red';
const str =
'scheduler.yield() 是一种在多线程或异步编程中常见的操作，它的作用是让当前线程或任务主动放弃对 CPU 的控制权，从而允许其他线程或任务得以执行。这通常用于提升系统的响应能力和资源的合理利用';
for (let i = 0; i < str.length; i++) {
    // 超出宽度则换行
if (ctx.measureText(line + str[i]).width > canvas.width) {
    lines.push(line);
    line = '';
}
line += str[i];
}
lines.push(line);
lines.forEach((line, index) => {
ctx.fillText(
    line,
    canvas.width / 2,
    // 行高 * 行数 + 行高 - 字体大小 / 2
    index * lineHeight + (lineHeight - fontSzie) / 2
);
});
```