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



