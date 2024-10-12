# CSS 

 ## 选择器及其优先级

| 选择器         |     格式      | 优先级权重 |
| -------------- | :-----------: | ---------: |
| id选择器       |      #id      |        100 |
| 类选择器       |  #classname   |         10 |
| 属性选择器     | a[ref="xxx"]  |         10 |
| 伪类选择器     | li:last-child |         10 |
| 标签选择器     |      div      |          1 |
| 伪元素选择器   |   li:after    |          1 |
| 相邻兄弟选择器 |     div+p     |          0 |
| 子代选择器     |     ul>li     |          0 |
| 后代选择器     |     li a      |          0 |
| 通配符选择器   |       *       |          0 |

!important声明的样式优先级最高，内联次之；  
优先级相同，最后出现的样式生效  
继承得到的样式优先级最低  
通用选择器  
样式表的来源：内联样式 -> 内部样式 -> 外部样式 -> 浏览器用户自定义样式 -> 浏览器默认样式

## CSS可继承与不可继承的属性有哪些

**不可继承**
1. display 规定元素应该生成的框的类型
2. vertical-align：垂直文本对齐
3. text-decoration:规定添加到文本的装饰
4. text-shadow：文本的阴影效果
5. white-space：空白符的处理
6. unicode-bidi：设置文本的方向
7. width、height、margin、border、padding
8. background、background-color、background-image、background-repeat、background-position、background-repeat、background-position、background-attachment
9. floa、clear、position、top、right、bottom、left、min-width、minheight、max-width、max-height、overflow、clip、z-index

**可继承**
1. font-family、font-weight、font-size、font-style
2. text-indent、text-align、line-height、letter-spacing、word-spacing、color
3. visibility、list-style、cursor

## display属性有哪些值
- block：块级元素，独占一行，宽度默认是父元素宽度，高度默认是内容高度
- inline：行内元素，不独占一行，宽度默认是内容宽度，高度默认是内容高度
- inline-block：行内块元素，既可以设置宽度和高度，又可以设置margin和padding，不独占一行
- none：隐藏元素，不占据任何空间
- table-cell：单元格元素，可以设置宽度和高度，不独占一行
- table-row：行元素，不独占一行
- table-caption：标题元素，不独占一行
- list-item：列表项元素，不独占一行

## 行内元素和块级元素有什么区别

1. 块级元素：独占一行，宽度默认是父元素宽度，高度默认是内容高度，可以设置margin和padding，换行自动
2. 行内元素：不独占一行，宽度默认是内容宽度，高度默认是内容高度，可以设置水平方向的margin和padding，不能设置垂直方向的margin和padding，不自动换行
3. 行内块元素：既可以设置宽度和高度，又可以设置margin和padding，不独占一行

## 隐藏元素的方法

1. display:none：将元素的display属性设置为none，元素将不可见，不占据空间，不响应绑定的监听事件
2. visibility:hidden：将元素的visibility属性设置为hidden，元素仍然占据空间，只是不可见，不响应绑定的监听事件
3. opacity:0：将元素的opacity属性设置为0，元素仍然占据空间，只是透明度为0，响应绑定的监听事件
4. postion:absolute;将元素的position属性设置为absolute,再移除可视区域内，元素仍然占据空间，只是不可见
5. z-index:-999：将元素的z-index属性设置为负值，使其他元素遮盖该元素
6. clip/clip-path：使用元素裁剪的⽅法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
7. transform:scale(0);将元素的transform属性设置为缩放0，元素仍然占据空间，只是缩放为0，不会响应绑定的监听事件。

## link和@import的区别

- link是HTML标签，除了加载CSS外，还可以定义RSS，@import是CSS的语法，两者都可以用来导入样式表。
- link引用CSS时，在页面载入的同时加载，@import需要页面网页完全载入以后加载
- link是HTML标签，无兼容问题，@import是CSS语法，不兼容IE5以下
- link支持使用JS控制DOM改变样式，@import不支持

## transition和animation的区别

- transition是过渡属性，可以实现元素的过渡效果，比如颜色的变化、宽度的变化等。它的实现需要触发一个事件，比如鼠标移入移出、鼠标悬停等才执行，可以设置一个开始帧，一个结束帧
- animation是动画属性，可以实现更复杂的动画效果，比如淡入淡出、旋转、缩放等。它的实现不需要触发事件，可以设置多个关键帧，可以设置动画的时长、次数、方向、播放方式等。

## 伪元素和伪类的区别和作用
- 伪元素：是CSS3新增的一种选择器，用来创建一些不在文档树中的元素，比如：::before、::after。
- 伪类：是CSS3新增的一种选择器，用来向某些选择器添加特殊的效果，比如：:hover、:active、:focus等。
  
## 盒模型

- 标准盒模型：宽度=内容宽度，高度=内容高度
- 怪异盒模型：宽度=内容宽度+左右内边距+左右边框，高度=内容高度+上下内边距+上下边框
- 通过box-sizing属性设置盒模型，默认值为content-box，即标准盒模型，border-box为怪异盒模型(IE盒子)

## 为什么有时候用translate来改变位置而不用定位

改变transform或opacity不会触发浏览器重排或重绘，会触发复合，而改变定位会触发浏览器重排或重绘，会造成较大的性能消耗。

## li之间的看不见的空白间隔原因及解决

li通常是放在一行，导致li换行后产生换行符，变为一个空格，占据位置
解决方法：
1. li设置float:left，缺点是有些容器不能设置浮动，影响布局
2. 所有li写在一行，缺点是不美观
3. 将ul内的字符尺寸设置为0，font-size:0，缺点是影响ul内的其他字符尺寸
4. 消除ul的字符间隔letter-spacing:-8px，缺点是也设置了li内的字符间隔，需要将li内的字符间隔设为默认letter-spacing:normal

## 常见的图片格式

1. BMP，是无损的，既支持索引色又支持直接色的点阵图，几乎对数据没有进行压缩，文件通常较大；
2. GIF，无损的，仅支持8bit索引色点阵图，文件小，又支持动画以及透明，通常用作动画
3. JPG，有损的直接色点阵图，有更丰富的色彩，适合存储照片；
4. PNG-8，无损的索引色点阵图，尽可能的情况下使用PNG-8，而不是GIF
5. PNG-24，无损的直接色点阵图，文件略小于BMP
6. SVG，无损的矢量图，放大不失真，适合logo，icon等
7. WebP，支持无损和有损，使用直接色

## 对CSSSprites的理解

CSSSprites是将多个小图片拼接成一张图片，通过CSS的background-image、background-repeat、background-position属性来实现背景定位。  
优点：
1. 减少网页HTTP请求，提交页面性能
2. 减少图片大小，提高网站加载速度
缺点：
1. 图片合并麻烦，需要制作图片
2. 图片定位麻烦，需要计算位置
3. 图片维护麻烦，牵一发动全身

## line-height

line-height属性用来设置文本高度，实际上是下一行基线到上一行基线的距离；  
如果一个标签没有height，那么最终高度由line-height决定；  
把line-height设置为height一样大小的值可以实现单行文字垂直居中  
line-height和height都可以撑开高度

line-height赋值：
1. px：固定值，如16px，em参考父元素font-size
2. 百分比，将计算后的值传递给后代
3. 纯数字，按比例传递，父级行高1.5，子元素字体18px，则子元素行高为1.5*18=27px

## CSS优化

**css加载：**
1. css压缩，将css进行打包压缩，减少文件体积；
2. 减少使用@import，使用link标签加载css文件；

**选择器：**
1. 关键选择器，选择器最后面的部分为关键选择器，css选择符从右到左进行匹配，如果使用ID选择器作为关键选择器，则不要为规则增加标签，过滤无关规则；
2. 避免使用通配符
3. 尽量少使用标签选择，而是用class
4. 尽量少使用后代选择器，后代选择器开销较高，尽量将选择器的深度降低至三层
5. 了解继承属性，避免重复设置相同的样式

**渲染性能：**
1. 慎重使用高性能属性：浮动、定位、动画、渐变、缩放、变换、过渡等；
2. 减少页面重排重绘
3. 去除空规则
4. 不使用@import
5. 选择器层级优化
6. css精灵图
7. 慎用Web字体

**维护性：**
1. 抽离相同的CSS
2. 样式内容分离，将CSS代码分离到外部文件

## PostCSS

后处理器，如postcss，通常是在完成的样式表中根据规范处理css，让其更有效。最常做的是给css属性添加浏览器前缀，比如-webkit-、-moz-、-ms-、-o-等，实现浏览器兼容性问题

## ::before和:after的区别

1. 单冒号用于伪类，双冒号用于伪元素
2. 伪元素定义在主体内容中的一个元素，但是不会真的渲染到DOM中

## display:inline-block什么时候显示间隙

1. 有空格的时候显示，可以删除空格
2. margin正值时，可以设置为负值
3. 使用font-size时，可以设置font-szie，letter-spacing、word-spacing，可以消除间隙

## 单行文本溢出

```ts
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

## 多行文本溢出

```ts
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
```

## CSS预处理器

1. Sass/Less：是一种CSS扩展语言，可以扩展CSS语言，增加了变量、嵌套、混合、函数等功能，可以更方便地编写CSS。
2. 结构清晰，便于扩展，方便屏蔽浏览器私有css差异
3. 轻松实现多重继承，兼容老代码  

Sass和Scss的区别：Sass是缩进语法，对于写惯css前端的开发者来说不直观，因此sass进行了语法改良，sass3变成了scss，简化了语法，用{}取代了原来的缩进，和原来的语法兼容

## 媒体查询

媒体查询组成：一个可选的媒体类型，零个或多个媒体功能表达式，这两部分最终会被解析为true或false，整个媒体查询为true，则对应的样式规则生效，否则不生效。可以用来实现响应式，针对不同的媒体类型定义不同的样式

```css
@media screen and (max-width: 600px) {
    /* 针对屏幕宽度小于600px的样式 */
    width:100%;
}
@media screen and (min-width: 600px) and (max-width: 1024px) {
    /* 针对屏幕宽度大于600px小于1024px的样式 */
    width:980px
}
```

## CSS工程化

CSS代码实现更好地组织和拆分，提高代码可维护性，降低代码重复率，提高代码复用率。常用的CSS工程化工具有：
1. 预处理器，Less、Scss
2. 后处理器，PostCSS
3. 打包，Webpack-Loader

## 判断元素达到可视区域

img.offsetTop < window.innerHeight + document.body.scrollTop

## z-index属性在什么情况下失效

1. 父元素position为relative，子元素的z-index无效
2. 元素在设置z-index的同时还设置了float

## CSS布局单位

1. px，像素，绝对单位，不受屏幕分辨率影响，px是CSS的基本单位，用于控制元素的大小
2. %，当浏览器的高度或宽度发生变化，元素的大小会自动调整，相对于父元素的宽度或高度
3. em和rem，em相对于父元素字体大小，rem相对于根元素字体大小
4. vw/vh，视口宽度/高度的百分比，视口指浏览器窗口的大小，vw/vh是相对于视口的宽度/高度，1vw等于视口宽度的1%，1vh等于视口高度的1%

## 常用布局方法

1. 浮动，兼容性好，注意浮动会脱离文档流，要清除浮动;
2. 绝对定位，快捷，子元素也脱离文档流
3. flex布局
4. grid布局
5. 栅格布局，可以用于多端适配

## 实现两栏布局

左边一栏宽度固定，右边一栏宽度自适应  
```html
<style>
使用float // [!code ++] 
.outer {
    height: 100px;
    margin: 0;
    padding:0
}
.left {
    width: 200px;
    height: 100%;
    float: left;
    background-color: red;
}
.right {
    margin-left: 200px;
    height: 100%;
    width: auto;
    background-color: cadetblue;
}

</style>
<body>
    <div class="outer">
        <div class="left"></div>
        <div class="right"></div>
    </div>
</body>
</html>
```
```html
<style>
使用flex // [!code ++] 
.outer {
    display: flex;
    height: 100px;
}
.left {
    width: 200px;
    height: 100%;
    background-color: pink;
}
.right {
    flex: 1;
    height: 100%;
    background-color: lightgreen;
}
</style>
```

## 实现三栏布局

左右两栏固定，中间宽度自适应
```html
使用float // [!code ++] 
<style>
    .outer {
        height: 200px;
    }

    .left {
        float: left;
        width: 200px;
        height: 100%;
        background-color: blue;
    }
    .right {
        float: right;
        width: 200px;
        height: 100%;
        background-color: red;
    }
    .middle {
        height: 100%;
        margin-left: 200px;
        margin-right: 200px;
        background-color: green;
    }
</style>
<body>
    <div class="outer">
        <div class="left"></div>
        <div class="right"></div>
        <div class="middle"></div>
    </div>
</body>
```
```html
使用flex // [!code ++] 
<style>
    .outer {
        height: 200px;
        display: flex;
    }
    .left {
        width: 200px;
        height: 100%;
        background-color: red;
    }
    .right {
        width: 200px;
        height: 100%;
        background-color: blue;
    }
    .middle {
        flex: 1;
        height: 100%;
        background-color: green;
    }
</style>
<body>
    <div class="outer">
        <div class="left"></div>
        <div class="middle"></div>
        <div class="right"></div>
    </div>
</body>
```
```html
使用定位 // [!code ++] 
<style>
    .outer {
        height: 200px;
        position: relative;
    }
    .left {
        width: 200px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: red;
    }
    .right {
        width: 200px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background-color: blue;
    }
    .middle {
        height: 100%;
        margin-left: 200px;
        margin-right: 200px;
        background-color: green;
    }
</style>
<body>
    <div class="outer">
        <div class="left"></div>
        <div class="middle"></div>
        <div class="right"></div>
    </div>
</body>
```

## 实现双飞翼(圣杯)布局

## 实现垂直居中

```html
使用定位+transform // [!code ++] 
  <style>
    .outer {
      width: 200px;
      height: 200px;
      background-color: blue;
      position: relative;
    }

    .inner {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: red;
    }
  </style>
  <body>
    <div class="outer">
        <div class="inner"></div>
    </div>
  </body>
```
```ts
使用flex // [!code ++] 
  <style>
    .outer {
      width: 200px;
      height: 200px;
      background-color: blue;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .inner {
        width: 50px;
        height: 50px;
        background-color: red;
    }
  </style>
  <body>
    <div class="outer">
        <div class="inner"></div>
    </div>
  </body>
```
```html
使用绝对定位 // [!code ++] 
  <style>
    .outer {
      width: 200px;
      height: 200px;
      background-color: blue;
      position: relative;
    }

    .inner {
        position: absolute;
        width: 50px;
        height: 50px;
        margin: auto; 
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: red;
    }
  </style>
  <body>
    <div class="outer">
        <div class="inner"></div>
    </div>
  </body>
```

## Flex布局

flex布局设置以后，子元素的float、clear、vertical-align属性将失效。采用flex布局的元素，称为flex容器，子元素称为flex项目。容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。

