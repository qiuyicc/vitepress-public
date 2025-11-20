# Vue Lego Project

## 处理图片需求

现在要裁剪图片，对图片进行处理：

### 简单使用CropperJS

[CropperJS](https://github.com/fengyuanchen/cropperjs)

```js
npm install cropperjs
```
```js
//App.vue，全局导入Cropper.css
import 'cropperjs/dist/cropper.css';
```
```css
注意使用copperjs需要设置图片的css样式
/* Make sure the size of the image fits perfectly into the container */
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
```
```js
//点击按钮弹出模态框，并给图片打上ref
<a-modal title="裁剪图片" v-model:open="showModal" @ok="handleOk" @cancel="showModal = false" okText="确认"
    cancelText="取消">
    <div class="image-cropper">
        <img :src="value" id="processed-image" ref="cropperImg" />
    </div>
</a-modal>

import Cropper from 'cropperjs';
//使用watch监听showModal，当showModal为true时，实例化Cropper，并给图片绑定事件
const cropperImg = ref<HTMLImageElement | null>(null)
let cropper: Cropper;
watch(showModal,async (newValue)=>{
    if(newValue){
        await nextTick() //注意等待DOM渲染完成
        if(cropperImg.value){
            cropper =  new Cropper(cropperImg.value, {
                crop(event){
                    //更多API跳转Github查看CopperJS
                    console.log(event);
                }
            })               
        }
    }else {
        if(cropper){
            cropper.destroy()
        }
    }
})
```

### 使用OSS处理图片
[OSS处理图片](https://help.aliyun.com/zh/oss/user-guide/custom-crop?spm=a2c4g.11186623.0.0.328f4063bPagEL)
```js
//注意返回的URL需要经过处理才能使用，再第二次点击图片裁剪时，需要重置图片URL
const baseImageUrl = computed(() => props.value.split('?')[0])
cropper =  new Cropper(cropperImg.value, {
    crop(event){
        //获取裁剪框的坐标和宽高
        const { x,y,width,height } = event.detail
        cropData = {
            x:Math.floor(x),
            y:Math.floor(y),
            width:Math.floor(width),
            height:Math.floor(height)
        }
    }
})             
```
```js
//当裁剪完毕即可使用API发送到OSS
const handleOk = () => {
if(cropData){
    const {x,y,width,height} = cropData
    const croppperURL = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},width_${width},height_${height}`
    ctx.emit('change', croppperURL)
    showModal.value = false
    }
}
```

### 使用CopperJS处理图片

底层使用了基于Canvas的图片处理
1. toDataURL()：将图片转换为base64编码的字符串
```js
const handleOk = () => {
    if(cropData){
        const {x,y,width,height} = cropData
        const croppperURL = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},width_${width},height_${height}`
        ctx.emit('change', croppperURL)
        //使用copper实例上的getCroppedCanvas()方法，返回一个Canvas对象，再使用toDataURL()方法，将Canvas对象转换为base64编码的字符串，即可得到裁剪后的图片
        dataURL.value = cropper.getCroppedCanvas().toDataURL() // [!code ++]
        showModal.value = false
    }
}
```
2. Blob对象：将base64编码的字符串转换为Blob对象
```js
//使用Blob对象
cropper.getCroppedCanvas().toBlob(blob=>{
    if(blob){
        const formData = new FormData()
        formData.append('cropperImage', blob,'test.png')
        axios.post('/xxx',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(res=>{
            ctx.emit('change',res.data.url)
            showModal.value = false
        })
    }
})
```

## 图层面板分析

![效果图](/lego_tucengmark.png)

1. 图层的锁定和显示隐藏以及点击选中需求
   1. 可以在定义的store中的components添加更多的标识符,点击就切换为不同的值，使用这个值在页面做判断
   2. 点击选中，已经有了之前的currentElement，复用即可
   ```js
   {
    ....,
    isLocked:boolean,//锁定图层
    isHidden:boolean,//隐藏图层
   }
   ```
2. 图层名称编辑需求
   1. 添加更多属性，layerName
   2. 点击图层的时候，在input和普通标签之前切换
   3. 添加按钮响应，对于esc和enter键，关闭input框，修改图层名称，抽象为一个通用hooks，useKeyPress
   4. 点击input框外面响应，抽象为一个通用的hooks，useClickOutside
3. 拖动图层改变图层的顺序
   1. 比较复杂的交互逻辑，最终的目的就是改变store中的components的顺序，重新渲染页面

### 实现隐藏和显示、锁定，选中图层功能

::: code-group
```ts [LayerList.vue]
    //右层图层区域
    // 将ComponentsData传入
 <li class="ant-list-item" v-for="item in list" :key="item.id" @click="hanldeClick(item.id)" 
 // 动态选中active样式
 :class="{ active: item.id === selectedId }"> 
    //  判断isHidden
    <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
    <a-button
        shape="circle"
        @click.stop="handleChange(item.id, 'isHidden', !item.isHidden)"
    >
        <template v-slot:icon v-if="item.isHidden"><EyeOutlined /> </template>
        <template v-slot:icon v-else><EyeInvisibleOutlined /> </template>
    </a-button>
    </a-tooltip>
    //  判断isLocked
    <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
    <a-button
        shape="circle"
        @click.stop="handleChange(item.id, 'isLocked', !item.isLocked)"
    >
        <template v-slot:icon v-if="item.isLocked"
        ><UnlockOutlined />
        </template>
        <template v-slot:icon v-else><LockOutlined /> </template>
    </a-button>
    </a-tooltip>
    <span>{{ item.layerName }}</span>
</li>
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
    selectedId:{
        type:String,
        required:true
    }
  },
  emits: ['change', 'select'],
  setup(props, ctx) {
    // 点击图层emit select事件
    const hanldeClick = (id: string) => {
        ctx.emit('select', id)
    }
    // 点击隐藏或锁定按钮emit change事件
    const handleChange = (id: string, key: string, value: boolean) => {
        const data = {
            id,
            key,
            value,
            isRoot:true
        }
        ctx.emit('change', data)
    }
    return {
        handleChange,
        hanldeClick 
    };
  },
});
```

```ts [Editor.vue]
<edit-wrapper 
v-for="component in components"
:key="component.id"
:id="component.id"
//  判断是否隐藏
:hidden="component.isHidden"
//  判断是否选中
:active="component.id === (currentElement && currentElement.id)"
@set-active="setActive"
>
<component
    :is="component.name"
    v-bind="component.props"
/>
</edit-wrapper>
................
<a-tab-pane key="layer" tab="图层设置">
<layer-list
    :list="components"
    :selectedId="currentElement?currentElement.id:''"
    // 监听change和select事件
    @change="handleChange"
    @select="setActive"
>
</layer-list>
</a-tab-pane>
// store commit
const setActive = (id: string) => {
    store.commit("setActive", id);
}
const handleChange = (data: any) => {
    store.commit("updateComponent", data);
}
```
::::

### 实现图层重命名功能

1. 显示默认文本，点击以后显示input，并自动聚焦
2. input中的值显示为文本中的值
3. 更新值以后，键盘事件，封装useKeyPress
   1. esc，恢复文本区域，显示旧值
   2. enter，恢复文本区域，显示新值
4. 更新值以后，点击外侧区域，封装useClickOutSide
   1. 点击input外层区域，恢复文本区域，显示新值
5. 简单验证，input为空，不恢复，并显示错误

::: code-group
```ts [InlineEdit.vue]
<div @click.stop="handClick" class="inline-edit" ref="wrapper">
<input
    v-if="isEditing"
    ref="inputRef"
    placeholder="文本不能为空"
    v-model="innerVlaue"
    :class="{ 'input-error':!validate }"
/>
<slot v-else
    ><span>{{ innerVlaue }}</span></slot
>
</div>
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, ctx) {
    const innerVlaue = ref(props.value);
    const inputRef = ref<null | HTMLInputElement>(null);
    // wrapper容器判断点击位置
    const wrapper = (ref < null) | (HTMLElement > null);
    const isOutSide = useClickOutSide(wrapper);
    // 非空验证
    const validate = computed(()=>innerVlaue.value.trim()!=='') 
    let cacheValue = '';
    const isEditing = ref(false);
    // 编辑的时候保存先前的旧值
    watch(isEditing, (isEditing) => {
      if (isEditing) {
        cacheValue = innerVlaue.value;
        await nextTick();
        if (inputRef.value) {
          inputRef.value.focus();//点击自动聚焦
        }
      }
    });
    // 点击外层更新值
    watch(isOutSide, (newValue) => {
     if(!validate.value){
        return
      }
      if (newValue && isEditing.value) {
        isEditing.value = false;
        ctx.emit('change', innerVlaue.value);
      }
      // 每次给isOutSide复原，不然因为stop阻止冒泡会有bug
      isOutSide.value = false;
    });
    useKeyPress('Enter', () => {
      if (!validate.value) {
          return
      }
      if (isEditing.value) {
        isEditing.value = false;
        ctx.emit('change', innerVlaue.value);
      }
    });
    // 当esc按下的时候，返回先前旧值
    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerVlaue.value = cacheValue;
      }
    });
    const handClick = () => {
      isEditing.value = true;
    };
    return {
      isEditing,
      handClick,
      innerVlaue,
      wrapper,
    };
  },
});
</script>
```
```ts [useKeyPresss.ts]
import { onMounted, onUnmounted } from 'vue';
const useKeyPress = (key: string, cb: () => any) => {
  const trigger = (event: KeyboardEvent) => {
    if (key === event.key) {
      cb();
    }
  };
  onMounted(() => {
    document.addEventListener('keydown', trigger);
  });
  onUnmounted(() => {
    document.removeEventListener('keydown', trigger);
  });
};

export default useKeyPress;
```
```ts [useClickOutSide.ts]
import { ref, onMounted, onUnmounted, Ref } from 'vue';
const useClickOutSide = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutSide = ref(false);
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
        //注意EventTarget和Node的关系
      if (elementRef.value.contains(e.target as Node)) {
        isClickOutSide.value = false;
      } else {
        isClickOutSide.value = true;
      }
    }
  };
  onMounted(() => {
    document.addEventListener('click',handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click',handler)
  })
  return isClickOutSide
};

export default useClickOutSide;
```
:::

### 实现图层拖动功能

列表排序的三个阶段：
1. 拖动开始，dragstart
   1. 被拖动的图层的状态变化
   2. 其后出现一个浮动层，显示拖动的图层的位置
2. 拖动进行中，dragmove
   1. 浮层随着鼠标移动而移动
   2. 条目发生换位，当浮层下沿超过被拖动条目的二分之一的时候，触发换位
3. 松开鼠标阶段
   1. 浮层消失
   2. 被拖动图层复原
   3. 数据被更新

成熟的库：
1. Vue draggable
2. React Sortable HOC

#### 拖动开始Dragstart

常规做法：
1. 添加mouseDown事件，检查当前的target元素，然后添加特定的状态
2. 添加mouseMove事件，创建一个和被拖动元素一模一样的浮层，将它的定位设置为绝对定位，并且随着鼠标的坐标更新

使用HTML：
[HTML Drag](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations)
1. 使用HTML的drag特性，默认支持图形、链接、和选择的文本
2. 其他元素默认不可拖拽，想要拖拽可以设置draggable="true"
3. 使用dragstart事件监控拖动开始

```ts
<li
  class="ant-list-item"
  draggable="true"
  @dragstart="onDragStart($event, item.id)"
  :class="{
    ghost: dragData.currentDraging === item.id, //设置拖动样式
  }"
>
const onDragStart = (e: DragEvent, id: string) => {
  dragData.currentDraging = id;
};
```

#### 拖动结束Drop

使用HTML Drag事件中的drop事件即可，需要注意：
1. 如果在有效的放置目标元素（即取消了 dragenter 或 dragover 的元素）上放开鼠标，放置会成功实现，drop 事件在目标元素上被触发。否则，拖拽会被取消，不会触发 drop 事件。
2. 如果你想要允许放置，你必须取消 dragenter 和 dragover 事件来阻止默认的处理。你可以在属性定义的事件监听程序返回 false，或者调用事件的 preventDefault() 方法来实现这一点。
```ts
<li
  class="ant-list-item"
  draggable="true"
  @dragstart="onDragStart($event, item.id)"
  @drop="onDrop"
  @dragover="onDragOver"
  :class="{
    ghost: dragData.currentDraging === item.id,
  }"
>
const onDragStart = (e: DragEvent, id: string) => {
  dragData.currentDraging = id;
};
const onDrop = (e: DragEvent) => {
  dragData.currentDraging = '';
};
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};
```
3. 在拖动结束时，更新数据，切换位置
  1. 使用data-xxx拿到拖动后的index位置
  2. 使用arrary-move库进行位置交换
```ts
<li
  class="ant-list-item"
  draggable="true"
  @dragstart="onDragStart($event, item.id, index)"
  @drop="onDrop"
  @dragover="onDragOver"
  :data-index="index"
  v-for="(item, index) in list"
  :key="item.id"
  @click="hanldeClick(item.id)"
  :class="{
    active: item.id === selectedId,
    ghost: dragData.currentDraging === item.id,
  }"
>
const dragData = reactive({
  currentDraging: '',
  currentIndex: -1,
});
const onDragStart = (e: DragEvent, id: string, index: number) => {
  dragData.currentDraging = id;
  dragData.currentIndex = index;
};
const onDrop = (e: DragEvent) => {
  // 注意当拖动到其他DOM时，拿不到data-index，e.target是鼠标指向的元素，所以需要递归查找data-index
  const currentElement = getParentElement(e.target as HTMLElement,'ant-list-item')
  if(currentElement && currentElement.dataset.index){
    const moveIndex = parseInt(currentElement.dataset.index);
  // 注意这里直接使用了组件的props.list，因为是响应式数据，所以没有问题，但是并没有遵循单向数据流，如果需要使用可以在store中提交mutations更新数据
    arrayMove(props.list,dragData.currentIndex,moveIndex) //使用array-move库进行位置交换
  }
  dragData.currentDraging = '';
};
```
```ts
//查找父级特定className元素节点
export const getParentElement = (element: HTMLElement, className: string) => {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    } else {
      element = element.parentElement as HTMLElement;
    }
  }
  return null;
};
```

#### 拖动中DropEnter

```ts
<li
  class="ant-list-item"
  draggable="true"
  @dragstart="onDragStart($event, item.id, index)"
  @drop="onDrop"
  @dragover="onDragOver"
  @dragenter="onDragEnter($event, index)"
  :data-index="index"
  v-for="(item, index) in list"
  :key="item.id"
  @click="hanldeClick(item.id)"
  :class="{
    active: item.id === selectedId,
    ghost: dragData.currentDraging === item.id,
  }"
>
const dragData = reactive({
  currentDraging: '',
  currentIndex: -1,
});
let startIndex = -1;
let endIndex = -1;
const onDragStart = (e: DragEvent, id: string, index: number) => {
  dragData.currentDraging = id;
  dragData.currentIndex = index;
  startIndex = index;
};
const onDrop = (e: DragEvent) => {
  ctx.emit('drop',{
    startIndex,
    endIndex
  })
  dragData.currentDraging = '';
};
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};
//使用dragenter事件监控拖动位置，并替代drop事件
const onDragEnter = (e: DragEvent, index: number) => {
  if (index !== dragData.currentIndex) {
  // 注意这里直接使用了组件的props.list，因为是响应式数据，所以没有问题，但是并没有遵循单向数据流，如果需要使用可以在store中提交mutations更新数据
    arrayMove(props.list, dragData.currentIndex, index);
    dragData.currentIndex = index;
    endIndex = index;
  }
};
```

#### 使用Vue draggable完成拖拽

[Github vue-draggable](https://github.com/SortableJS/vue.draggable.next)
```ts
npm i -S vuedraggable@next
```
```ts
<draggable
  // 绑定拖动数据
  :list="list"
  class="ant-list-items ant-list-bordered"
  ghost-class="ghost"
  //使用handle属性指定拖动元素
  handle=".handle">
  //注意使用element替换使用中的item
  <template #item="{element}">
    <li
        class="ant-list-item"
        @click="hanldeClick(element.id)"
        :class="{
          active: element.id === selectedId,
        }"
      >
      ..................
      ..................
      <a-tooltip title="拖动排序">
        // class="handle"绑定拖动目标元素
        <a-button shape="circle" class="handle">
          <template v-slot:icon><DragOutlined /> </template>
        </a-button>
      </a-tooltip>
   </template>
</draggable>
```

## 属性面板分析

![效果图](/lego_shuxingmark.png)

现在的属性面板是通过公共面板属性CommonComponentProps生成的，会直接在右侧属性面板上渲染出来，这样以后如果属性多了起来，一来查找某个属性很不方便，二来用户体验也很差。现在要考虑将属性进行分类展示，比如基础属性、样式属性、交互属性等，并实现点击折叠下放的功能。

1. 创建一个新的组件，EditGroup，该组件的目的是为了将当前节点的Element.props中的属性转换为数组的多项，每项就对应了一个属性面板
```ts
[
  {
    text: '基础属性',
    items:[....]
  },
  {
    text: '尺寸',
    items:[...]
  }，
  {
    text: '阴影',
    items:[...]
  }
  .......
]
```
2. 完成数据的混入，将原来的属性数据添加完整，propsMap中也要将属性添加完整，不然不能一一映射
3. 通用属性是写死的，直接手动添加即可
4. 独特属性需要经过计算，=> 所有属性的数组(全集)与通用属性的数组(子集)的差集
5. 最终循环数组得到对应的界面

### 完成属性分类

1. 完成属性数据的混入与补全
2. 完成属性到组件的映射关系补全
3. 完成基本属性的计算
::: code-group
```ts [EditGroup.vue]
import { difference } from 'lodash-es';
export interface GroupProps {
  text: string;
  items: string[];
}
// 编写默认的分类属性
const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: [
      'height',
      'width',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom',
    ],
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow'],
  },
  {
    text: '位置',
    items: ['left', 'top'],
  },
  {
    text: '事件功能',
    items: ['actionType', 'url'],
  },
];

export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<AllComponentProps>>,
      required: true,
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: defaultEditGroups,
    },
  },
  setup(props, ctx) {
    const newGroups = computed(() => {
      // 得到所有Nromal属性 // [!code ++]
      const allNormalProps = props.groups.reduce((acc, cur) => {
        return [...acc, ...cur.items];
      }, [] as string[]);
      // 对传递进来的props进行过滤，得到自身基本属性 // [!code ++]
      const specailProps = difference(Object.keys(props.props), allNormalProps);
      return [
        {
            text:'基本属性',
            items:specailProps
        },
        ...props.groups
      ]
    });
    return {
        newGroups
    };
  },
});
</script>
```
```ts [editor.ts]
//混入属性数据
export const commonDefaultProps: CommonComponentProps = {
  // actions
  actionType: "",
  url: "",
  // size
  height: "",
  width: "373px",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
  // border type
  borderStyle: "none",
  borderColor: "#000",
  borderWidth: "0",
  borderRadius: "0",
  // shadow and opacity
  boxShadow: "0 0 0 #000000",
  opacity: "1",
  // position and x,y
  position: "absolute",
  left: "0",
  top: "0",
  right: "0",
};

export const textDefaultProps: TextComponentProps = {
  // basic props - font styles
  text: "正文内容",
  fontSize: "14px",
  fontFamily: "",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: "1",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "",
  ...commonDefaultProps,
};

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "l-text",
    layerName:"图层一",
    props: { ...textDefaultProps,text: "测试文本1", fontSize: "16px" },
  }
]
```
```ts [propsMap.ts]
// 完成propsMap映射表 // [!code ++]
export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: {
      rows: 3,
    },
    afterTransform: (e: any) => e.target.value,
  },
  textAlign: {
    text: "对齐方式",
    component: "a-radio-group",
    subComponent: "a-radio-button",
    options: [
      {
        text: "左对齐",
        value: "left",
      },
      {
        text: "居中",
        value: "center",
      },
      {
        text: "右对齐",
        value: "right",
      },
    ],
    afterTransform:(e: any) => e.target.value,
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  .................
  .................
}
```
:::

### 完成属性展示及折叠

1. 处理newGroups，转换为最终的props对象
2. 封装propstable组件，展示属性
3. 使用collpose组件实现折叠
::: code-group
```ts [edit-group.vue]
<template>
  <div class="edit-groups">
  //使用collpase组件实现折叠
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel
        v-for="(group, index) in editGroups"
        :key="index"
        :header="group.text"
      >
        <props-table :props="group.props" @change="handleChange">{{
          group.props
        }}</props-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

// 默认展开第一个面板
const activeKey = ref(`0`);
//处理最终属性对象
 const editGroups = computed(() => {
return newGroups.value.map((group) => {
  const propsMapObj = {} as AllComponentProps;
  group.items.forEach((item) => {
    const key = item as keyof AllComponentProps;
    propsMapObj[key] = props.props[key] ?? '';
  });
  return {
    ...group,
    props: propsMapObj,
  };
});
});
```
```ts [props-table.vue]
<div v-for="(item, key) in finalProps" :key="key" class="prop-item">
<span class="label" v-if="item.text">{{ item.text }}</span>
// 动态渲染组件
<component v-if="item" :is="item.component" :[item.valueProp!]="item.value" v-bind="item.extraProps" v-on="item.events">
//子组件渲染
  <template v-if="item.options">
    <component :is="item.subComponent" v-for="(option, k) in item.options" :key="k" :value="option.value">
      <render-vnode :vNode="option.text"></render-vnode>
    </component>
  </template>
</component>
</div>

export default defineComponent({
  name: "props-table",
  props: {
    props: {
      type: Object as PropType<Partial<AllComponentProps>>,
      required: true,
    },
  },
  emits:['change'],
  components: {
    RenderVnode,
    ColorPicker,
    ImageProcesser
  },
  setup(props,context) {
      //处理props
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof AllComponentProps
        // 进行mapPropsToForms映射
        const item = mapPropsToForms[newKey]
        if (item) {
          const { valueProp = 'value', eventName = 'change', initalTransform, afterTransform } = item
        const newItem: FormProps = {
          ...item,
          value:initalTransform ? initalTransform(value) : value,
          valueProp,
          eventName,
          events:{
            [eventName]:(data: any) => {     
              context.emit('change', { key, value: afterTransform? afterTransform(data) : data })
            }
          }
        }        
          result[newKey] = newItem
        }
        return result
      }, {} as { [key: string]: FormProps });
    });  
    return {
      finalProps,
    };
  },
```
```ts [render-vnode.ts]
//针对span渲染一个vnode节点
import { defineComponent } from 'vue'
const RenderVnode = defineComponent({
  props: {  
    vNode: {
      type: [Object, String],
      required: true
    }
  },
  render() {
    return this.vNode
  }
})

export default RenderVnode
```
:::

## 页面面板分析

需要增加一个页面面板，用于给整个页面背景设置相应的属性，如背景颜色、背景图片等
![效果图](/lego_yemianmark.png)

1. 重新定义新的ComponentData的数据结构，及store中的数据
```ts
export interface EditorProps {
  //中间编辑器渲染的数组
  components: ComponentData[];
  //当前编辑的元素uuid
  currentElement: string;
  // 添加页面面板属性
  page: PageData;
}
export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
export interface PageData {
  props: PageProps;
  title: string;
}
const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: "url('https://os.alipayobjects.com/xxxxx/xxxxxxxx.png')",,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px',
};
............
state: {
  components: testComponents,
  currentElement: '',
  page: {
    props: pageDefaultProps,
    title: 'test'
  },
},
```
2. 对于背景图片的处理
     1. background-image值为空，渲染StyleUploader上传图片， change => url(newImage.scr)
     2. 值不为空，渲染ImageProcesser组件，如果要处理图片，change => url(newImage.scr)
     3. 删除图片， change  => ""

::: code-group
```ts
mapPropsToForms: PropsToForms = {
  .......
    backgroundImage: {
    ...defaultHandler,
    component: 'background-processer',
//因为传递过来的是background-image的url("http://xxx.jpg")的格式，所以要进行url处理
    initalTransform: (v: string) => {
      if (v) {
        const reg = /\(["'](.+)["']\)/g
        const matches = reg.exec(v)
        if (matches && matches.length > 1) {
          return matches[1]
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    afterTransform: (e: string) => e ? `url('${e}')` : ''
    },
  };
}
```
```ts [background-processer.vue]
<template>
  <div class="background-processer">
    //如果没有value，展示上传组件，否则展示image组件
    <styled-uploader v-if="!value" />
    <image-processer v-else :value="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageProcesser from './ImageProcesser.vue'
import StyledUploader from './StyledUploader.vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    ImageProcesser,
    StyledUploader
  }
})
</script>
```
:::

3. 完成上传、更新、删除背景图片的功能

```ts
<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @success="onImageUploaded" />
    <image-processer v-else :value="value" @change="handleUploadUrl" :showDelete="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import ImageProcesser from './ImageProcesser.vue';
import StyledUploader from './StyledUploader.vue';
import { UploadResp } from '../extraType';
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: {
    ImageProcesser,
    StyledUploader,
  },
  emits: ['change'],
  setup(props, context) {
    const onImageUploaded = (data: { resp: UploadResp; file: File }) => {
      const { resp } = data;
      message.success('上传成功');
      context.emit('change', resp.data.url);
    };
    const handleUploadUrl = (url: string) => {
      context.emit('change', url);
    };
    return {
      onImageUploaded,
      handleUploadUrl,
    };
  },
});
</script>
```


## 拖动元素分析

### 拖动元素改变位置

通用的解决方案:
1. 把元素设置成绝对定位，MouseDown后开始操作
2. 添加MouseDown监控更新top、left值
3. 拖动开始时计算鼠标在拖动盒子里面的偏移量，因为在拖动过程中鼠标相对于拖动盒子的位置是不发生改变的
4. 当拖动结束时，计算鼠标相对于页面的偏移量，使用鼠标的x，y与前面的盒子偏移量的差值
 
- 添加点击事件，获取当前相对于盒子的偏移量
```ts
<div
  class="edit-wrapper"
  ref="editWrapper"
  :style="styles"
  @mousedown="startMove"
  @click="onItemClick(id)"
  :class="{ active: active, hidden: hidden }"
>
  <slot></slot>
</div>


const editWrapper = ref<null | HTMLElement>(null);
const onItemClick = (id: string) => {
  context.emit('set-active', id);
};
const gap = {
  x: 0,
  y: 0,
};
//把属性绑定到外层的wrapper上
const styles = computed(() =>
  pick(props.props, ['position', 'top', 'left', 'width', 'height'])
);
// mouseDown时计算偏移量
const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value as HTMLElement;
  const { left, top } = currentElement.getBoundingClientRect();
  gap.x = e.clientX - left;
  gap.y = e.clientY - top;
};
```

- 计算鼠标在页面的偏移量，监控mousemove和mouseup事件
```ts
const caculateMovePosition = (e: MouseEvent) => {
  //这里需要获取整个画布区域的id，因为移动的时候需要限制在画布区域内
  const container = document.getElementById('canvas-area') as HTMLElement;
  // 这里使用getBoundingClientRect()获取元素的位置也可以
  //注意offsetTop是相对于最近的position:非static的祖先元素的距离，而不是整个文档的距离
  const left = e.clientX - gap.x - container.offsetLeft;
  const top = e.clientY - gap.y - container.offsetTop + container.scrollTop; //注意滚动条
  return {
    left,
    top,
  };
};
const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value as HTMLElement;
  const { left, top } = currentElement.getBoundingClientRect();
  gap.x = e.clientX - left;
  gap.y = e.clientY - top;
  const handleMove = (e: MouseEvent) => {
    const { left, top } = caculateMovePosition(e);
    if (currentElement) {
      currentElement.style.left = left + 'px';
      currentElement.style.top = top + 'px';
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove);
  }
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

- 完成拖动store更改，因为数据来源于store，我们改变当前组件样式的没有对store中数据进行更改，当放下鼠标的时候，需要把样式更新到store中

```ts
let isMoving = false; //添加一个标记进行优化，当不发生移动的时候，不进行store更新
 const handleMouseUp = (e: MouseEvent) => {
  document.removeEventListener('mousemove', handleMove);
  if (isMoving) {
    const { left, top } = caculateMovePosition(e);
    context.emit('update-position', { left, top, id: props.id });
    isMoving = false;
  }
  nextTick(() => {
    document.removeEventListener('mouseup', handleMouseUp);
  })
};

//上层组件提交commit更新数据
const updatePosition = (data: {
  left: number;
  top: number;
  id: string;
}) => {
  const { left, top, id } = data;
  store.commit('updateComponent', { key: 'left', value: left+'px', id });
  store.commit('updateComponent', { key: 'top', value: top+'px', id });
};
```

### 拖动元素改变大小

1. 需要在元素的四个角创建对应的样式
2. 计算在不同角度的偏移量，根据偏移量设置元素的宽高

- 定义resizers盒子及其四个角的样式
```ts
  <div class="resizers">
    //注意冒泡
    <div class="resizer top-left" ></div>
    <div class="resizer top-right" ></div>
    <div class="resizer bottom-left" ></div>
    <div class="resizer bottom-right" @mousedown.stop="startResize('bottom-right')"></div>
  </div>
</div>

const startResize = (direction: string) => {
const currentElement = editWrapper.value as HTMLElement;
const handleMove = (e: MouseEvent) => {
  if(currentElement){
    const { left, top } = currentElement.getBoundingClientRect();
    currentElement.style.width = e.clientX - left + 'px';
    currentElement.style.height = e.clientY - top + 'px';
  }
}

.edit-wrapper > * {
  //取消slot中的样式，代理到wrapper上
  position: static !important;
  //改变元素大小填充元素的宽高
  width: 100% !important;
  height: 100% !important;
}
.edit-wrapper.active .resizers {
  display: block;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  //设置鼠标样式
  cursor: nwse-resize;
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  //设置鼠标样式
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
    //设置鼠标样式
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
    //设置鼠标样式  
  cursor: nwse-resize;
}
```

- 计算右下角的逻辑：width：clientY - left, height：clientX - top
- 计算右上角的逻辑：width：clientX - left, height：bottom - clientY，top：clientY - container.top+container.scrollTop
- 计算左下角的逻辑：width：right - clientX, height：clientY - top，left：clientX - container.left
- 计算右上角的逻辑：width：right - clientX, height：bottom - clientY，top：clientY - container.top+scrollTop，left：clientX - container.left

```ts
type ResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
interface OriginalPositions {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
const caculateSize = (
  direction: ResizeDirection,
  e: MouseEvent,
  positions: OriginalPositions
) => {
  const { clientX, clientY } = e;
  const { left, right, top, bottom } = positions;
  const container = document.getElementById('canvas-area') as HTMLElement;
  const rightWidth = clientX - left;
  const topHeight = clientY - top;
  const bottomToHeight = bottom - clientY;
  const leftWidth = right - clientX;
  const leftOffset = clientX - container.offsetLeft;
  //注意滚动条的影响
  const topOffset = clientY - container.offsetTop+scrollTop;
  switch (direction) {
    case 'top-left':
      return {
        top: topOffset,
        left: leftOffset,
        width: leftWidth,
        height: bottomToHeight,
      };
    case 'top-right':
      return {
        top: topOffset,
        width: rightWidth,
        height: bottomToHeight,
      };
    case 'bottom-left':
      return {
        height: topHeight,
        left: leftOffset,
        width: leftWidth,
      };
    case 'bottom-right':
      return {
        height: topHeight,
        width: rightWidth,
      };
    default:
      break;
  }
};
//重构startResize
const startResize = (direction: ResizeDirection) => {
const currentElement = editWrapper.value as HTMLElement;
const { left, right, top, bottom } =
  currentElement.getBoundingClientRect();
const handleMove = (e: MouseEvent) => {
  const size = caculateSize(direction, e, {
    left,
    right,
    top,
    bottom,
  });
  const { style } = currentElement;
  if (size) {
    style.width = size.width + 'px';
    style.height = size.height + 'px';
    if (size.left) {
      style.left = size.left + 'px';
    }
    if (size.top) {
      style.top = size.top + 'px';
    }
  }
};

//store更新数据
const updatePosition = (data: {
  left: number;
  top: number;
  id: string;
}) => {
  const {  id } = data;
  const updateData = pickBy(data, (v, k) => k !== 'id')
  forEach(updateData, (v, k) => {
    store.commit('updateComponent', { key: k, value: v + 'px', id })
  })
};
```

## 快捷键分析

1. 元素选择，前提是元素被选择的情况下
   1. 拷贝图层，Ctrl+C，复制当前选中元素的数据结构
   2. 粘贴图层，Ctrl+V，将复制的数据结构粘贴到components数组中
   3. 删除图层，Backspace/Delete，在components数组中删除当前选中元素
   4. 取消选中，ESC，currentElement置空
2. 元素移动
   1. 上下左右每次移动1像素，⬆️/⬇️/⬅️/➡️，更新top/left
   2. 上下左右每次移动10像素，shift+⬆️/⬇️/⬅️/➡️，更新top/left
3. 撤销/重做
   1. 撤销，Ctrl+Z
   2. 重做，Ctrl+Shift+Z
```ts
使用HotKeys库
npm i hotkeys-js --save
```

### 初步构建快捷键

::: code-group
```ts [hooks/useHotKeys.ts]
import hotkeys, { KeyHandler } from 'hotkeys-js';
import { onMounted, onUnmounted } from 'vue';

const useHotKeys = (key: string, callback: KeyHandler) => {
    onMounted(() => {
        hotkeys(key, callback);
    })
    onUnmounted(() => {
        hotkeys.unbind(key);
    })
};

export default useHotKeys;
```
```ts [plugins/hotKeys.ts]
import useHotKeys from '../hooks/useHotKeys'
export default function initHotKeys() {
  useHotKeys('ctrl+c,command+c',()=>{
    alert('copy') 
  })
  useHotKeys('ctrl+v,command+v',()=>{
    alert('paste') 
  })
}
```
:::

### store联动

```ts
import { computed } from 'vue';
import { useStore } from 'vuex';
import useHotKeys from '../hooks/useHotKeys';
import { GlobalProps } from '@/store/index';
//创建一个高阶函数阻止default事件
const wrap = (callback: KeyHandler) => {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  };
};
export default function initHotKeys() {
  const store = useStore<GlobalProps>();
  const currentId = computed(() => store.state.editor.currentElement);
  useHotKeys('ctrl+c,command+c', () => {
    store.commit('copyComponent', currentId.value);
  });
  useHotKeys('up', wrap(() => {
    store.commit('moveComponent', {
      direction: 'up',
      amount: 1,
      id: currentId.value,
    });
  }));
}
........store
copyComponent(state, id) {
  const currentComponent = state.components.find(
    (component) => component.id === id
  );
  if (currentComponent) {
    state.copiedComponent = currentComponent;
    message.success('复制成功');
  }
},
moveComponent(
    state,
    data: { direction: moveDirection; amount: number; id: string }
  ) {
    const currentComponent = state.components.find(
      (component) => component.id === data.id
    );
    if (currentComponent) {
      const oldTop = parseInt(currentComponent.props.top || '0');
      const oldLeft = parseInt(currentComponent.props.left || '0');
      const { direction, amount } = data;
      switch (direction) {
        case 'up': {
          const newValue = oldTop - amount + 'px';
          store.commit('updateComponent', {
            key: 'top',
            value: newValue,
            id: data.id,
          });
          break;
        }
        .........
```

### 撤销重做

- 需要一个history数组来保存历史记录，包括类型，componentId，数据等，以及一个指针保存现在的位置
- 两个mutations：redo和undo
- 针对不同的类型，需要不同的redo和undo逻辑 
```ts
添加图层
state.histories.push({
  id: uuidv4(),
  componentId: component.id,
  type: 'add',
  data: cloneDeep(component),
});
删除图层
state.histories.push({
  id: uuidv4(),
  componentId: currentComponent.id,
  type: 'delete',
  data: currentComponent,
  index: currentIndex,
});
修改属性
state.histories.push({
  id: uuidv4(),
  componentId: component.id || state.currentElement,
  type: 'modify',
  data: {
    key,
    oldValue,
    newValue: value,
  },
});
```

```ts
//undo,redo与之相反
undo(state) {
  if (state.historyIndex === -1) {
    state.historyIndex = state.histories.length - 1;
  } else {
    state.historyIndex--;
  }
  const history = state.histories[state.historyIndex];
  switch (history.type) {
    case 'add': {
      state.components = state.components.filter(
        (component) => component.id !== history.componentId
      );
      break;
    }
    case 'delete': {
      state.components = insertAt(
        state.components,
        history.index!,
        history.data
      );
      break;
    }
    case 'modify': {
      const { componentId, data } = history;
      const { key, oldValue } = data;
      const updatedComponent = state.components.find(
        (component) => component.id === componentId
      );
      if (updatedComponent) {
        updatedComponent.props[key as keyof AllComponentProps] = oldValue;
      }
      break;
    }
    default:
      break;
  }
},
```

#### 优化

- 一次修改多个key，value的时候(拖动，改变大小)，会添加多条记录
- 快速的修改一个key值(比如修改文本)，会保存多个记录
- 在当前位置继续编辑，历史记录会添加到最后
- 页面图层设置没有回滚
- 历史记录没有设置最大长度

```ts
//将数据统一传递，在store里面统一修改，而不是遍历数组调用commit
const updatePosition = (data: {
  left: number;
  top: number;
  id: string;
}) => {
  const {  id } = data;
  const updateData = pickBy(data, (v, k) => k !== 'id')
  const keysArr = Object.keys(updateData)
  const valuesArr = Object.values(updateData).map(v => v + 'px')
  store.commit('updateComponent', { key: keysArr, value: valuesArr, id })
};

//优化push里面的history结构['top','left'],['50px','50px']
updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
  const component = state.components.find(
    (component) => component.id === (id || state.currentElement)
  );
  if (component) {
    if (isRoot) {
      (component as any)[key as string] = value;
    } else {
      const oldValue = Array.isArray(key)
        ? key.map((key) => component.props[key])
        : component.props[key];
      state.histories.push({
        id: uuidv4(),
        componentId: component.id || state.currentElement,
        type: 'modify',
        data: {
          key,
          oldValue,
          newValue: value,
        },
      });
      if (Array.isArray(key) && Array.isArray(value)) {
        key.forEach((keyName, index) => {
          component.props[keyName] = value[index];
        });
      } else if (typeof key === 'string' && typeof value === 'string') {
        component.props[key] = value;
      }
    }
  }
},
//undo和redo统一调用modifyHistory
const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history;
  const { key, oldValue, newValue } = data;
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>;
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  );
  if (updatedComponent) {
    if(Array.isArray(newKey)){
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] = type === 'undo'? oldValue[index] : newValue[index];
      })
    }else {
      updatedComponent.props[newKey] = type === 'undo'? oldValue : newValue;
    }
  }
};
```
```ts
//逻辑拆分，添加记录长度限制以及中途继续编辑
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  //中途继续编辑的时候把historyIndex之后的值清空
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex);
    state.historyIndex = -1;
  }
  //超出最大长度限制时，删除最早的记录
  if (state.histories.length < state.maxHistoryLength) {
    state.histories.push(historyRecord);
  } else {
    state.histories.shift();
    state.histories.push(historyRecord);
  }
};
//修改属性时，先缓存最初始的oldValue到cacheOldValue
const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData,
  oldValue: any
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElement,
    type: 'modify',
    data: {
      key,
      oldValue: state.cacheOldValue,
      newValue: value,
    },
  });
  state.cacheOldValue = null;
};
//防抖函数
const debouncedUpdateHistory = (
  callback: (...agrs: any) => void,
  tiemout = 1000
) => {
  let timer = 0;
  return (...agrs: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...agrs);
    }, tiemout);
  };
};
//对modifyHistory进行优化，使用debounce防抖
const pushHistoryDebounced = debouncedUpdateHistory(pushModifyHistory);
```

## 右键菜单分析

在编辑器区域元素上右键弹出一个自定义菜单，点击对应选项完成相应的操作。
1. 在中间编辑区域拦截默认的菜单右键事件，右键事件是contextmenu
2. 判断是否点击在元素上，判断鼠标的e.target是否在EditWrapper组件的范围内
3. 显示一个自定义菜单，其中包括操作项，显示在鼠标位置(e.clientX, e.clientY)
4. 点击完成操作，重用已经支持的mutation和hotkeys，并且关闭自定义菜单

```ts
const menuRef = ref<HTMLElement | null>(null);
const triggerContextMenu = (e: MouseEvent) => {
  const domElement = menuRef.value as HTMLElement;
  const wrapperElement = getParentElement(
    e.target as HTMLElement,
    'edit-wrapper'
  );
  if (wrapperElement) {
    //阻止页面默认右键菜单弹出
    e.preventDefault();
    domElement.style.display = 'block';
    domElement.style.top = e.pageY + 'px';
    domElement.style.left = e.pageX + 'px';
  }
};
const handleClick = () => {
  const domElement = menuRef.value as HTMLElement;
  domElement.style.display = 'none';
};
onMounted(() => {
  document.addEventListener('contextmenu', triggerContextMenu);
  document.addEventListener('click', handleClick);
});

onUnmounted(() => {
  document.removeEventListener('contextmenu', triggerContextMenu);
  document.removeEventListener('click', handleClick);
});
return {
  menuRef
};
```

### 使用函数式创建组件
- 使用render函数创建组件
```ts
// createContextMenu.ts
import { createVNode, render } from 'vue';
import ContextMenu from './ContextMenu.vue'
export interface ActionItem {
  action: () => void;
  text: string;
  shortcut: string;
}

const createContextMenu = (actions: ActionItem[]) => {
    const container = document.createElement('div');
    const options = {
        actions
    }
    const vm  = createVNode(ContextMenu, options)
    render(vm, container)
    document.body.appendChild(container)
}
export default createContextMenu

//editor.ts
onMounted(() => {
  createContextMenu(testActions)
})
```

### 插件化右键菜单

- 使用插件函数方式注册右键菜单
- 支持区域选择，可以自定义区域右键菜单
- 联动store，修改数据
::: code-group
```ts [plugins/ContextMenu.ts]
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import createContextMenu, { ActionItem } from '@/components/createContextMenu';
const initContextMenu = () => {
  // 联动store
  const store = useStore();
  let destory;
  let destory2;
  const testActions: ActionItem[] = [
    {
      shortcut: 'Delete',
      text: '删除图层',
      action: (id: string) => {
        store.commit('deleteComponent', id);
      },
    }
  ];
  //创建其他区域右键菜单
  const testActions2: ActionItem[] = [
    {
      shortcut: 'ctrl+c',
      text: '复制',
      action: () => {
        console.log('撤销');
      },
    },
  ];
  onMounted(() => {
   destory =  createContextMenu(testActions);
   destory2 =  createContextMenu(testActions2, 'settings-panel'); //创建settings-panel区域右键菜单
  });
    onUnmounted(() => {
    destory();
    destory2();
  });
};

export default initContextMenu;
```
```ts [ContextMenu.vue]
triggerClass: {
  type: String,
  default: 'edit-wrapper',
},
const triggerContextMenu = (e: MouseEvent) => {
  const domElement = menuRef.value as HTMLElement;
  const wrapperElement = getParentElement(
    e.target as HTMLElement,
    // 区域选择
    props.triggerClass 
  );
  if (wrapperElement) {
    e.preventDefault();
    domElement.style.display = 'block';
    domElement.style.top = e.pageY + 'px';
    domElement.style.left = e.pageX + 'px';
    // 拿到当前点击的组件id，在edit-wrapper上绑定自定义属性data-component-id="id"
    const cid = wrapperElement.dataset.componentId;
    if (cid) {
      componentId.value = cid;
    }
  }
};
```
```ts [createContextMenu.ts]
//函数式组件
import { createVNode, render } from 'vue';
import ContextMenu from './ContextMenu.vue';

export interface ActionItem {
  action: (id: string) => void;
  text: string;
  shortcut: string;
}

const createContextMenu = (
  actions: ActionItem[],
  triggerClass = 'edit-wrapper'
) => {
  const container = document.createElement('div');
  const options = {
    actions,
    triggerClass,
  };
  const vm = createVNode(ContextMenu, options);
  render(vm, container);
  document.body.appendChild(container);
  return () => {
    //使用闭包进行销毁
    render(null, container)
    document.body.removeChild(container)
  }
};
export default createContextMenu;
```
:::

## Mock Server

[json-server](https://github.com/typicode/json-server)

## 表单校验

[async-validator](https://github.com/yiminghe/async-validator)
```ts
 const cellnumberValidator = (rule: Rule, value: string) => {
  return new Promise((resolve, reject) => {
    const passed =  /^1[3-9]\d{9}$/.test(value.trim())
    setTimeout(() => {
      if (passed) {
        resolve('')
      } else {
        reject('手机号码格式不正确')
      }
    }, 500)
  })
}
const rules = reactive({
  cellphone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    // { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
    { asyncValidator: cellnumberValidator, trigger: 'blur' }
  ]
})
```
[useForm](https://www.antdv.com/components/form-cn/#components-form-demo-validation)
```ts
使用useForm
const { validate, resetFields, validateInfos } = useForm(form, rules);
<a-form-item
  v-bind="validateInfos.cellphone"
  name="cellphone"
>
  <a-input v-model:value="form.cellphone">
```

## 登录

- 进行表单校验
- 发送手机验证码，进行disabled倒计时
- 点击“登录”按钮进行登录，返回token
- 路由跳转到首页

::: code-group
```ts [login.vue]
 const login = () => {
  validate().then(() => {
    const payload = {
      phoneNumber: form.cellphone,
      vertifyCode: form.verifyCode
    }
    store.dispatch('loginAndFetch', payload).then(() => {
      message.success('登录成功 2秒后跳转首页')
      resetFields()
      setTimeout(() => {
        router.push('/')
      }, 2000)
    })
  })
}
const getCode = () => {
  axios.post('/users/generateCode', { phoneNumber: form.cellphone}).then(() => {
    message.success('验证码已发送，请注意查收', 5)
    startCounter()
  })
}
```
```ts [user.ts]
login({ commit }, payload) {
  return axios.post('/users/loginByPhoneCode', payload).then((rawData) => {
    commit('login', rawData.data);
  });
},
fetchCurrentUser({ commit }) {
  return axios.get('/users/getUserInfo').then((rawData) => {
    commit('fetchCurrentUser', rawData.data)
  })
},
loginAndFetch({dispatch, commit},loginData){
  return dispatch('login',loginData).then(() => {
    return dispatch('fetchCurrentUser')
  })
}
```
:::

### 使用高阶函数封装重复逻辑

```ts
// 1. 返回一个函数，和原来的函数处理一模一样
// 2. 确定接受的参数
// 3. 写内部的逻辑
const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: 'GET' }
) => {
  return async (context: ActionContext<any, any>, payload?: any) => {
    const newConfig = { ...config, data: payload };
    const { data } = await axios(url, newConfig);
    context.commit(commitName, data);
    return data;
  };
};
actions: {
  login:actionWrapper('/users/loginByPhoneCode', 'login', { method: 'POST' }),
  fetchCurrentUser: actionWrapper('/users/getUserInfo', 'fetchCurrentUser'),
  loginAndFetch({ dispatch, commit }, loginData) {
    return dispatch('login', loginData).then(() => {
      return dispatch('fetchCurrentUser');
    });
  },
},
```

### 全局与细粒度loading读取状态

```ts
import { Module } from 'vuex'
import { GlobalProps } from './index'
export interface GlobalStatus {
  // 请求Name对象
  opNames: { [key: string]: boolean };
  //请求数量
  requestNumber: number;
  //错误信息
  error: {
    status: boolean;
    message: string;
  }
}

const global: Module<GlobalStatus, GlobalProps> = {
  state: {
    requestNumber: 0,
    opNames: {},
    error: {
      status: false,
      message: '',
    }
  },
  mutations: {
    startLoading (state, { opName }) {
      state.requestNumber++
      if (opName) {
        state.opNames[opName] = true
      }
    },
    finishLoading (state, { opName }) {
      setTimeout(() => {
        state.requestNumber--
        delete state.opNames[opName]
      }, 1000)
    },
    // 错误处理
    setError (state, { status, message }) {
      state.error = {
        status,
        message,
      };
  },
  getters: {
    // 全局loading
    isLoading: (state) => {
      return state.requestNumber > 0
    },
    // 细粒度loading
    isOpLoading: state => (opName: string) => {
      return state.opNames[opName]
    }
  }
}

export default global
//使用
const isLoginLoading = computed(() => store.getters.isOpLoading('login'));
```

### 错误处理

```ts
export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
};
axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig;
  store.commit('setError', {
    status: false,
    message: '',
  });
  store.commit('startLoading', { opName: newConfig.opName });
  return config;
});
axios.interceptors.response.use((res: AxiosResponse<RespData>) => {
  const { config, data } = res;
  const newConfig = config as ICustomAxiosConfig;
  store.commit('finishLoading', { opName: newConfig.opName });
  const { errno, message } = data;
  if(errno !== 200){
    store.commit('setError', {status: true, message})
    return Promise.reject(data)
  }
  return res;
} ,(rej: AxiosError)=>{
    const newConfig = rej.config as ICustomAxiosConfig;
    store.commit('setError', {status: true, message: '服务器错误'}),
    store.commit('finishLoading', { opName: newConfig.opName })
    return Promise.reject(rej)
});

使用
const error = computed(() => store.state.global.error);
watch(
  () => error.value.status,
  (errValue) => {
    if (errValue) {
      message.error(error.value.message || '未知错误', 2);
    }
  }
);
```

```ts
//全局使用，在App.vue中调用
<template>
  <div class="app-container">
    <a-spin v-if="showLoading" tip="读取中" class="global-spinner"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { GlobalProps } from './store/index'
export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore<GlobalProps>()
    const route = useRoute()
    const isLoading = computed(() => store.getters.isLoading)
    const showLoading = computed(() => isLoading.value && !route.meta.disableLoading)
    const error = computed(() => store.state.global.error)
    watch(() => error.value.status, (errorValue) => {
      if (errorValue) {
        message.error(error.value.message || '未知错误', 2)
      }
    })
    return {
      showLoading
    }
  }
})
</script>
```

### 登录持久化

```ts
// store/user.ts
login(state, rawData: RespData<{ token; string }>) {
  const { token } = rawData.data;
  localStorage.setItem('token', token);
  state.token = token;
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
},

// router/index.ts
router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { token, isLogin } = user;
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta;
  if (title) {
    document.title = title as string;
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        await store.dispatch('fetchCurrentUser');
        if (redirectAlreadyLogin) {
          return '/';
        }
      } catch (error) {
        // message.error('登录失效，请重新登录');
        store.commit('logout');
        return '/login';
      }
    } else {
      if (requiredLogin) {
        return '/login';
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return '/';
    }
  }
});
```

## HTML2Canvas截图

html2canvas是一个开源的js库，可以将html页面转换成canvas图片，简单实现基本思路：
1. 创建一个canvas元素
2. 创建svg文件，使用Blob构造函数
3. 将svg中的值填充foreignObject，然后填充想要复制节点的Object
4. 创建img标签，将img.src = URL.createObjectURL(svg)
5. 在img完成读取后，调用canvas的drawImage方法，将img绘制到canvas上
6. 不支持box-shadow，不支持跨域
```ts
const drawImage = () =>{
  const canvas = document.createElement('canvas-image') as HTMLCanvasElement;
  canvas.width = 400;
  canvas.height = 400;
  const ele = document.getElementById('author') as HTMLElement;
  const data = {
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>"+
      "<foreignObject width='100%' height='100%'>"+
        "<div xmlns='http://www.w3.org/1999/xhtml'>"+
          ele.innerHTML+
        "</div>"+
      "</foreignObject>"+
    "</svg>"
  }
  const svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  const img = new Image();
  const url = URL.createObjectURL(svg);
  img.addEventListener('load', () => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  })
}
```

## QRCode生成

[node-qrcode](https://github.com/soldair/node-qrcode)
```ts
// index.js -> bundle.js
var QRCode = require('qrcode')
var canvas = document.getElementById('canvas')

QRCode.toCanvas(canvas, 'sample text', function (error) {
  if (error) console.error(error)
  console.log('success!');
})
```

## 复制到剪贴板

1. Clipboard API [Github 地址](https://github.com/zenorocha/clipboard.js)，[MDN](https://github.com/zenorocha/clipboard.js)

2. document.execCommand(),
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand#%E8%AF%AD%E6%B3%95)

```ts
export function copyToCilpboard(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand('copy');
  } catch (error) {
    console.log(error);
  }
}
```

## 前端文件下载

### 使用A链接

A链接，可以创建通向其他网页、文件、同一页面内的位置、电子邮件地址或其他任何形式的超链接。A链接的一个特殊属性:download，此属性指示浏览器下载而不是导航到它。

A链接的另一个特殊属性rel，该属性指定了目标对象到链接对象的关系，该属性有一个noopener属性，对于web安全来说比较关键。当使用_blank时打开一个新标签页，新页面的window对象上有一个属性opener，它指向的是前一个页面的window对象，因此，后一个页面就获取了前一个页面的控制权。

模拟下载过程：
1. 创建A链接
2. 设置href以及download属性
3. 触发A链接的点击事件
4. 注意，download属性仅适用于同源URL
```ts
export const downloadFile = (src: string, fileName = 'default.png') => {
  // 创建链接
  const link = document.createElement('a')
  link.download = fileName
  link.rel = 'noopener'
  // 处理跨域问题
  if (link.origin !== location.origin) {
    //https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
    axios.get(src, { responseType: 'blob'}).then(data => {
      link.href = URL.createObjectURL(data.data)
      setTimeout(() => { link.dispatchEvent(new MouseEvent('click')) })
      // https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL
      setTimeout(() => { URL.revokeObjectURL(link.href)}, 10000 )
    }).catch((e) => {
      console.error(e)
      link.target='_blank'
      link.href= src
      link.dispatchEvent(new MouseEvent('click'))
    })
  } else {
  // 设置链接属性
  link.href= src
  // 触发事件
  link.dispatchEvent(new MouseEvent('click'))
  }
}
```

### 使用FileSaver.js

底层也使用了A链接的方式，不过针对各大浏览器做了更多的ployfill和兼容
[FileSaver.js](https://github.com/eligrey/FileSaver.js)


### HTTP特殊响应头

借助HTTP特殊响应头触发浏览器自动下载[Content-Disposition](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition)
第一个参数或者是 inline（默认值，表示回复中的消息体会以页面的一部分或者整个页面的形式展示），或者是 attachment（意味着消息体应该被下载到本地；大多数浏览器会呈现一个“保存为”的对话框，将 filename 的值预填为下载后的文件名，假如它存在的话）。
```ts
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"
```

## Vue-Cli模式
当运行vue-cli-service时，它会根据不同的命令，设置对应的模式，模式对应的是一个环境变量，是一个Node_ENV
1. development模式用于vue-cli-service serve
2. test模式用于vue-cli-service test:unit
3. production模式用于vue-cli-service build

test模式，Vue Cli会创建一个优化过后的，并且旨在用于单元测试的webpack配置，它并不会处理图片以及一些对单元测试非必需的其他资源。

development模式会创建一个webpack配置，该配置启用热更新，不会对资源进行hash也不会打出vendor bundles，目的是为了在开发的时候能够快速重新构建。

### 修改环境变量

1. 使用[cross-nev](https://github.com/kentcdodds/cross-env)
```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```
2. 在项目根目录下创建相应文件来指定环境变量配置
   1. .env文件，在所有环境中都被载入
   2. .env.local，在所有环境中都被载入，但会被git忽略
   3. .env.[mode]，在指定环境中被载入
   4. .env.[mode].local，在指定环境中被载入，但会被git忽略 
```ts
// .env.staging
VUE_APP_ENV=staging
NODE_ENV=development

//使用
vue-cli-service serve --mode staging
consol.log(process.env.NODE_ENV) // development
```
环境变量优先级：cross-env > .env.[mode] > 运行时默认的mode
注意需要使用特定的变量名称：
```ts
VUE_APP_XXX
NODE_ENV
BASE_URL
```

## Vue.config.js


### 打包分析

```ts
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isStaging = !!process.env.VUE_APP_STAGINE
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyzeMode = !!process.env.ANALYZE_MODE
module.exports = {
  // 生产环境要使用 OSS 地址
  // 其他环境都使用绝对路径
  publicPath: (isProduction && !isStaging) ? '生产地址' : '/',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3E7FFF',
          },
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: config => {
    // 忽略 moment 的 locale 文件
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    )
    // 压缩代码
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm:'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
        })
      )
    }
    // 分析打包体积
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        })
      )
    }
    // 优化打包体积
    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: 'all',
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            // get the name. 
            // node_modules/packageName/sub/path
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}`
          }
        },
      }
    }
  },
  //链式操作webpack配置
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '我的标题'
      args[0].desc = '我的描述'
      return args
    })
  }
}
```

### 优化打包体积大小

1. 查看package.json中的dependencies和devDependencies，把没用的模块从其中删除
2. 检查是否有功能大体相同的模块，比如lodash和lodash-es
3. 检查是否有没用的模块打包进来，使用webpack ignorePlugin忽略
4. 按需加载第三方库，如Element-UI，Ant-Design-Vue等，按需引入
5. 使用tree-shaking，只打包用到的模块
6. 使用externals，将第三方库打包到CDN上，减少打包体积
7. 使用SplitChunksPlugin分割模块

### 按需加载UI组件

::: code-group
```ts [configAntD.ts]
// import all used components in whole projects
import { Avatar, Button } from 'ant-design-vue'
import { App } from 'vue'
const components = [
  Avatar,
  Button,
]
const install = (app: App) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}
export default {
  install
}
```
```ts [main.ts]
import Antd from './configAntD'
app.use(Antd)
```
:::

### 路由懒加载

```ts
//为路由添加懒加载，并设置魔法注释 webpackChunkName，以便于打包后根据名称找到
component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
```

## Nginx优化

### 使用缓存

```ts
使用nginx添加响应头
expires 24h; //缓存时间，绝对时间，单位：秒，有误差
Cache-Control max-age=86400; //缓存时间，相对时间，单位：秒，推荐使用
```
```ts
etag on; //启用etag，表示文件内容的hash值，可以用于缓存控制
add_header Last-Modified $date_gmt; //添加Last-Modified响应头，表示文件最后的修改时间，可以用于缓存控制
```

### 使用压缩

```ts
gzip on; //启用gzip压缩
gzip_min_length 1k; //压缩最小字节数
gzip_comp_level 6; //压缩级别，1-9，数字越大压缩率越高，压缩时间越长
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; //压缩类型
```
```ts
brotli on; //启用brotli压缩
brotli_comp_level 4; //压缩级别，1-11，数字越大压缩率越高，压缩时间越长
brotli_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; //压缩类型
```

### 开启HTTPS/2和KeepAlive

```ts
keepalive_timeout 65; //保持连接的时间，单位：秒
ssl on; //启用ssl
ssl_certificate /path/to/your/certificate.crt; //证书路径
ssl_certificate_key /path/to/your/certificate.key; //证书私钥路径
ssl_protocols TLSv1.2 TLSv1.3; //支持的协议
```
```ts
listen 443 ssl http2; //开启https和http2
```

