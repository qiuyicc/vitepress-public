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

## 响应式
一个网站可以兼容多个终端，而不是为每一个终端做一个特定的版本。
基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理，页面头部必须有meta声明的viewport标签
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" maximum-scale=1.0, user-scalable=no />
```

## Flex布局

flex布局设置以后，子元素的float、clear、vertical-align属性将失效。采用flex布局的元素，称为flex容器，子元素称为flex项目。容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。
justify-content属性定义了项目在主轴上的对齐方式:
1. flex-start,元素排列在容器的起始位置(默认)
2. flex-end，元素排列的容器末尾，
3. center，元素在容器水平居中
4. space-between，第一个元素与容器起点对齐，最后一个元素与容器终点对齐，其他元素之间均匀分布空间
5. space-around，每个元素两侧的间距相等，元素间距均匀分布
6. space-evenly，所有元素之间、以及与容器两端的空隙都相等
align-items属性定义了项目在交叉轴上的对齐方式：
1. stretch，子元素在交叉轴上填满整个容器高度（默认值，前提是子元素没有设置具体的高度）
2. flex-start，子元素在交叉轴的起始位置，
3. flex-end，子元素在交叉轴的终点位置，
4. center，子元素在交叉轴居中
5. baseline，子元素在交叉轴的基线上对齐

## 浮动

1. 浮动元素脱离文档流，不占据空间，或引起高度塌陷问题；
2. 浮动元素碰到包含它的边框或者其他浮动元素的边框停留
浮动问题：
1. 高度塌陷：父元素高度塌陷，子元素无法撑开高度，影响布局
2. 非浮动元素会紧跟在浮动元素后面，影响布局
清除浮动：
1. 给父级定义足够高的height
2. 最后一个浮动元素后加一个空div，并设置clear:both;
3. 包含浮动的父级标签添加overflow:hidden或overflow:auto;
4. 使用:after伪元素清除浮动

```css
floatEle:after{
    content: "";
    display: block;
    clear: both;
    height: 0;
}
```

## BFC

BFC是块级格式化上下文，是一个独立的环境，容器内的布局不受外部影响

创建BFC：
1. body
2. float不为none
3. position为absolute或fixed
4. display为inline-block、table-cell、table-caption、flex等
5. overflow不为visible

BFC的特点：
1. 垂直方向上，自上而下排列，与文档流一致
2. BFC中上下相岭的容器的margin会重叠
3. 计算BFC的高度时，浮动元素也参与计算
4. BFC是独立的容器，内部不影响外部
5. 每个元素的左margin值和容器的左border相接触
6. BFC不与浮动元素重叠

BFC的作用：  
1. 解决margin重叠问题；
2. 解决高度塌陷问题，子元素设置float后，父元素高度塌陷，可以把父元素变为一个BFC，如设置overflow:hidden;
3. 创建自适应两栏布局，左侧设置float：left，右侧设置overflow：hidden;这样右侧不会与左侧重叠，两栏自适应；

## margin重叠问题

两个块级元素的上外边距和下外边距在垂直方向可能会折叠,注意浮动元素和绝对定位元素的margin不会折叠  
兄弟间的折叠：
1. 底部元素display:inline-block;
2. 底部元素设置float
3. 底部元素position:absolute;

父子间折叠：
1. 父元素overflow:hidden;
2. 父元素设置border:1px solid transparent;
3. 子元素display:inline-block;
4. 子元素加入浮动或定位

## 元素层叠顺序

父辈有定位且配置了z-index,优先按照父辈的定位的z-index进行层级比较
1. 背景图和边框
2. 负的z-index
3. 块级盒，文档流内非定位非行内级后代元素
4. 浮动盒
5. 行内盒
6. z-index：0
7. z-index：正值


## Position的值

1. static，默认值，没有定位，元素出现在正常的流中（忽略top、bottom、left、right的设置）
2. absolute，相对于最近的已定位祖先元素进行定位，如果元素没有已定位的祖先元素，则相对于body进行定位
3. relative,相对于其正常位置进行定位，不会脱离文档流，设置top、bottom、left、right，元素会按照设置的位置进行移动
4. fixed，相对于浏览器窗口进行定位，不随页面滚动而滚动，脱离文档流，设置top、bottom、left、right，元素会按照设置的位置进行移动
5. sticky，设置top、bottom、left、right四个阈值之一，sticky才会生效，当父元素滚动时，子元素也会跟着一起滚动，为relative,超出阈值后，会变成fixed，固定定位

## absoulte与fixed的区别

共同点：
1. 改变行内元素的呈现方式，将display置为inline-block
2. 脱离文档流
3. 覆盖非定位元素
不同点：
1. absolute是相对于最近的已定位祖先元素进行定位，fixed是相对于浏览器窗口进行定位
2. absolute会跟着父元素进行移动，fixed固定在页面具体位置

## display、float、position的优先级关系

1. 首先判断display值是否为none，为none，float、position属性不起作用
2. 其次position是否为absolute或fixed，是则float失效,并且设置display值为block或table
3. 如果position不为absolute或fixed，则判断float是否none，不是则display按上面规则转换
4. 如果float为none，判断元素是否为根元素，如果是根元素则display值按照上面规则转换，如果不是，保持指定属性

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

## css解决浏览器兼容

1. webkit前缀，-webkit-，针对webkit内核
2. moz前缀，-moz-，针对火狐内核
3. ms前缀，-ms-，针对IE内核
4. o前缀，-o-，针对opera内核

## margin-top百分比

margin-top：50%,表示距离父元素的顶部距离为父元素高度的50%，也就是说，父元素的高度变化，子元素的距离也会变化。

## Less特性

1. 变量
```less
@color: #333;
.box {
    color: @color;
}
```
2. 嵌套
```less
.box {
    color: #333;
    &-active {
        color: @color;
    }
}
```
3. 运算
```less
@width: 100px;
@height: 100px;
.box {
    width: (@width + @height);
}
```
4. 条件语句
```less
@width: 100px;
@height: 100px;
.box {
    width: (@width > @height)? @width : @height;
}
```
5. 字符串插值
```less
@url:"/images/"
div {
    background-image: url("@{url}bg.png");
}
```
6. 媒体查询定义变量
```less
@mediaQuery: ~"(max-wdith: 768px)";
@media screen and @mediaQuery {
    div {
        width:200px
    }
}
```

## Input Type值

1. text，单行文本输入框
2. password，密码输入框，输入内容会被掩盖
3. email，邮箱输入框，输入内容必须符合邮箱格式
4. number，数字输入框，输入内容必须为数字
5. radio，单选框
6. checkbox，多选框
7. submit，提交按钮
8. reset，重置按钮
9. button，自定义按钮
10. file，文件上传按钮
11. hidden，隐藏输入字段
12. image，图像上传按钮
13. search，搜索框，输入内容会出现搜索按钮
14. tel，电话号码输入框，输入内容必须符合电话号码格式
15. url，网址输入框，输入内容必须符合网址格式
16. date，日期输入框，输入内容必须符合日期格式
17. time，时间输入框，输入内容必须符合时间格式
18. datetime，日期时间输入框，输入内容必须符合日期时间格式
19. month，月份输入框，输入内容必须符合月份格式
20. week，周输入框，输入内容必须符合周格式
21. range，范围输入框，输入内容必须在范围内
22. color，颜色输入框，输入内容必须符合颜色格式

## 实现一张图片在浏览器大小改变时保持不变

比如实现16:9的图片在浏览器大小改变时保持不变，可以用以下方法：
```ts
<div>
<class="image-container">
  <img src="你的图片链接.jpg" alt="描述" />
</div>
.image-container {
  width: 100%; /* 容器宽度为100% */
  position: relative;
  padding-top: 56.25%; /* 16:9 的比例 */
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例且覆盖整个容器 */
}
```

## rem如何根据HTML字号进行适配

通用：
1. 使用媒体查询，根据不同的设备按比例设置html文字大小
2. 元素rem = 元素px / (屏幕宽度/划分的份数),屏幕宽度/划分的份数就是html的font-size值，比如750尺寸/15份 = 50px，假如元素为100px，那么rem = 100px / 50px = 2
3. 有一定适用性，换算较为简单，不过有兼容性问题，对不同手机的适配不是非常精准，需要配置多个媒体查询，如果某款手机不在设置范围之内，会出现无法适配

网易：
1. 拿到设计稿/100，得到宽度rem值
2. 动态设置font-size
```js
document.documentElement.style.fontSize = document.documentElement.clientWidth / x(x为rem值) + 'px';
```
3. 可以动态配置font-size，基本无兼容性问题，不过无viewport缩放，且针对于iPhone的Retina屏幕无适配

手淘方案：
1. 拿到设计稿/10，得到font-size基准值
2. 引入flexible.js
3. 设计稿px/font-size基准值即可换算rem
4. 可以动态配置font-size和dpr做适配，不过单位计算较为复杂，需要注意

## Bootstrap栅格系统工作原理

1. 行(row)必须包含在container(固定宽度)中,以便为其赋予合适的排列(alignment)和(padding)
2. 通过row在水平方向创建一组列column
3. 内容放置在column内，并且只有列可以作为行row的直接子元素
4. 通过为列设置padding属性，创建列与列之间的间隔gutter，通过为row元素设置负值margin可以抵消padding
5. 列通过指定1-12来表示跨越范围，如果一行的列>12，多余的列所在元素将作为一个整体另起一列

## CSS支持小于12px的文字
```css
span {
    font-size: 12px;
    -webkit-transform: scale(0.75);
}
```

## 浏览器是如何解析CSS选择器的

css选择器解析是从右向左匹配的，假设有：
```css
.box h3 span {}
```
css会先匹配span，对于每一个span，向上遍历找到h3，再向上遍历找到box，最后找到html结束  
如果中途找不到h3或box，可以及时停止匹配，有效减少回溯次数提升性能

## less和scss的深度选择器

当style标签有scope属性时，样式只会限定作用于当前组件，当除去后，样式会应用到全局，造成全局样式污染，因此less和scss都提供了深度选择器，可以限定作用域，避免污染全局样式。

```less
 /deep/ .xxx {

}
>>> .xxx {

}
:deep(.xxx){

}
::v-deep .xxx {
    // 废弃
}

```


## css动画

```html
<style>
@keyframes move {
    0% {
    transform: translate(0, 0);
    }
    50% {
    transform: translateX(100px)
    }
    100% {
    transform: translate(0, 0);
    }
}
.outer {
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 50%;
    animation: move linear 2s  infinite;
    /* animation:动画名称 动画深度 动画时长 动画次数 动画方向 执行完毕状态; */
}
</style>
<body>
<div class="outer"></div>
</body>
```

## css变量

定义全局变量：
```css
:root {
    --color: #333;
}
/* 使用 */
color: var(--color);
```
定义局部变量：
```css
.box {
    --width: 100px;
}
```
less定义变量：
```less
@color: #333;
.box {
    color: var(@color);
}
```
scss定义变量：
```scss
$color: #333;
.box {
    color: var($color);
}
```

## 移动端常见问题

1. 点击事件300ms延迟，解决下载fastclick的包
2. 忽略Android平台中对邮箱地址的识别
```html
<meta name="format-detection" content="email=no" />
```
3. 当网站添加到主屏幕快速启动方式，隐藏地址栏，针对ios的safari
```html
<meta name="app-mobile-web-app-capable" content="yes" />
```

## 画一条0.5px的线

```css
transform: scale(0.5,0.5);
```

## tab栏三分之一变色

使用渐变，常见的有两种类型的渐变：线性渐变（linear-gradient）和径向渐变（radial-gradient）
线性渐变：
1. 线性渐变是在一个方向上平滑地过渡颜色。可以指定渐变的方向以及各个颜色的停留位置。
```ts
background: linear-gradient(direction, color-stop1, color-stop2, ...);
direction：可以使用角度（如 90deg）或关键字（如 to right、to left、to top、to bottom）来指定渐变方向。
color-stop：颜色值，可以是任何有效的颜色值（如 HEX、RGB、RGBA、HSL 等）
background: linear-gradient(to right, #154154 33.33%, lightgray); /* 三分之一青色，剩余渐变 */
```
2. 径向渐变是从中心点向外平滑过渡颜色
```ts
background: radial-gradient(shape size at position, color-stop1, color-stop2, ...);
shape：可以是 circle（圆形）或 ellipse（椭圆形）
size：可以设置形状的大小，例如 closest-side、farthest-side、closest-corner、farthest-corner
background: radial-gradient(circle, red, yellow);
```

## 实现一个三角形

```css
div {
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-bottom-color: brown;
}
```

## 实现一个扇形

```css
div {
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-radius: 100px;
    border-bottom-color: brown;
}
```

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

## 实现一个时钟效果

```html
<style>
body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #282c34;
    color: white;
    font-family: Arial, sans-serif;
}

.clock {
    font-size: 48px;
    border: 2px solid white;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
<body>
<div class="clock">
    <div id="time"></div>
</div>

<script>
    function updateTime() {
    const now = new Date();
    //padStart() 方法用指定字符在字符串头部填充指定长度*
    const hours = String(now.getHours()).padStart(2, '0');  
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = timeString;
    }

    // 每秒更新一次时间
    setInterval(updateTime, 1000);

    // 初始化时钟
    updateTime();
</script>
</body>
```

