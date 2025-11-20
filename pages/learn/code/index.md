# 如何写出高质量前端代码

## 项目结构的划分

### 相互独立原则
1. 当对问题进行分解的时候，确保每个层级的问题与问题之间没有重复、交叉、相关性。  
2. 有的项目下可能存在一个components目录，想要用来存放公共组件，而同时目录下又存在一个common目录，用来存放公共代码。违反相互独立原则的，一个公共组件本身也是属于公共代码，common在含义上包含了components，所以应该将components目录挪到common目录下。  
3. 目录划分存在问题最多的场景就是目录之间职责不清晰，互相包含或者交叉，导致大家新建文件时不知道到底该放到哪个目录下，而在查找文件时也不确定文件会在哪个目录，造成混乱和效率低下

### 完全穷尽
1. 要求所有的子问题或分类加起来必须覆盖整个问题的所有集合。这意味着在拆解问题时，不能遗漏任何重要的元素或方面
2. 二分法,就是找一个角度将事物一分为二，非黑即白，就像A和!A
3. 要素法,就是根据事物的属性对其进行分类,按照前端文件的类型，将common目录划分为组件components、工具库utils、常量const、配置config、api服务service、样式style、指令directive、中间件middleware、 资源assets。
3. 流程分析法，通过流程分析法，我们可以将项目的目录划分为这几类：开发前准备工作（接口mock、打包配置build）、业务开发（一般源码放在src目录）、测试（test目录存放测试用例）、部署(deployer目录存放部署脚本或CI/CD配置)、上线(doc目录存放帮助文档)
4. 矩阵分析法，将问题划分为不同的象限或区域，每个区域代表一个独立的子问题。重要紧急、重要但不紧急、紧急但不重要、既不紧急也不重要。

### 分层思维

#### 前端组件分层

1. 通用组件，存放和业务无关的组件，比如button、input、select等，通常我们使用第三方组件库来作为通用组件；
2. 项目基础组件，项目中广泛使用但并不局限于某个具体业务的组件，比如基于通用组件封装自己的弹窗、表格等；
3. 业务组件，具体的业务模块组件；
4. 页面组件，页面组件和路由组件一一对应

组件的调用原则：高层组件可以调用底层组件，底层组件绝对不允许引用高层组件。也就是说页面组件可以引用业务组件和项目基础组件，但是项目基础组件中绝对不可以调用业务组件和页面组件，只要遵循这一个原则，就不会存在循环依赖的问题了

#### 领域驱动设计DDD
什么是DDD？Q&A：以一种领域专家、设计人员、开发人员都能理解的通用语言作为相互交流的工具，在交流的过程中发现领域概念，然后将这些概念设计成一个领域模型；由领域模型驱动软件设计，用代码来实现该领域模型。比如给非技术人员看代码，他们肯定看不懂的，但是你如果给他们看一个模型，告诉他们你要设计的商品模块包含哪些属性，有哪些功能，他们是可以理解并且帮你去完善的。

在前端项目中建立一个领域层，用来存放各个业务实体的核心设计，什么是业务实体呢？就是业务中的一个具体概念，通常都是一个名词，比如用户User、商品Product、订单Order等；存放哪些设计资源呢？可以存放这个业务相关的所有资源，以用户User模块为例，设计资源包括用户相关的一些常量配置（如api接口地址）、service（用户的增删改查接口调用方法）、静态资源（如默认用户头像）、配置（用户列表的columns配置）、组件（添加用户的表单）、utils（格式化用户手机号的方法）等。这个有点类似于state？不过还是有些区别


#### 一致性
一致原则指的是在整个项目中保持相似的结构和命名约定，以便开发人员能够快速理解项目结构。 通过保持一致性，可以降低学习成本、提高团队协作效率，并减少出错的可能性。
1. 目录/文件命名保持一致
2. 目录下的内容要和目录名称保持一致
3. 命名要和使用方保持一致

#### 示例
1. 根据二分，将项目代码分为开发阶段文件和非开发阶段文件，非开发阶段文件主要包括上线部署相关的文件和帮助文档
2. 开发文件可以根据是否部署到生产环境和开发环境，开发环境三要素：数据Mock、编辑打包Build、单元测试Test
3. 生产环境可以用分层思维分成基础层base、领域层domain、应用层src
4. 应用层下又可以分资源assets、布局文件layout、页面组件pages、路由router、状态store

├── dev         //工程代码
│    ├── mock      //mock文件
│    ├── build     //编译配置
│    └── test      //测试文件 
├── deployer    //部署文件
│    ├── Dockerfile      
│    └── nginx     
├── doc         //文档
│    └── help.md     
├── domain      //领域层
│    ├── user         
│    │  ├── const          
│    │  │   ├── api.js         
│    │  │   └── status.js      
│    │  ├── service.js     
│    │  ├── components     
│    │  │   ├── AddUser.vue       
│    │  │   └── UserAvatar.vue   
│    │  ├── config.js      
│    │  └── utils.js       
│    └── product       
│       ├── const    
│       ├── components 
│       ├── service.js   
│       ├── config.js     
│       └── utils.js
├── src          //应用层
│    ├── assets       //资源文件  
│    ├── layout       //布局文件  
│    ├── router       //路由配置  
│    ├── store        //共享数据  
│    └── pages        //页面组件
│       ├── user-list   
│       └── user-detail
└── base        //基础层
     ├── const         //常量配置
     ├── styles        //公共样式
     ├── utils         //公共库
     └── components    //项目基础组件


## 网络请求要封装到什么程度

### 接口地址的封装
所有的接口地址都不应该以硬编码的形式被使用，而是应该以常量的形式封装起来，如果后端修改了接口地址，我们只需要修改接口的配置文件即可，无需修改任何业务代码，实现了前后端的隔离，解除了前端网络请求对后端接口地址的依赖，这也体现了封装的好处：隔离变化。
```js
//RESTful风格接口
export const userApis1 = {
    userDetail: '/api/v1/user/{id}' // 3种method对应下面3个配置，配置变多了
}
//封装了method和url的形式
export const userApis2 = {
   getUserDetail: 'GET /api/v1/user/{id}',
   updateUser: 'PUT /api/v1/user/{id}',
   deleteUser: 'DELETE /api/v1/user/{id}'
}

// 后续封装一个网络请求方法request，支持解析路径中的method和url
// 如，request('GET /api/v1/users')
```

### 接口服务service的封装
1. 易上手，即使新人上手也可以很快理解接口开发；
2. 没有service时，耦合了大量与后代的接口，一改多改；
3. 没有service时，会增加很多重复性工作；

### 网络请求request的封装原则
1. 上层应用不应该依赖底层实现，本质上是避免依赖倒置，要把axios当做底层工具，而你站在上层去提要求，第三方库是服务于你的，而不是反过来被第三方库绑架

### 网络请求层次结构
1. 业务层代码只能调用service提供的方法，不能直接引用api或者request方法，更不能直接调用axios等第三方库。
2. service引用每个服务的api配置和封装的request方法完成网络请求，同样的在service中不能直接调用第三方http库。
3. request方法由第三方库来实现，可以通过axios或者fetch等任何http库来实现，更换第三方库不会影响其它层。

## 表单开发

### 错误示范
1. 这个表单props不应该叫做data，而是通用的value(还算认可)
2. 这个表单传递的formData变化感知不到，不知道组件内部要进行怎样的修改
```vue
<template>
    <el-form>
        <el-form-item>
            <MyFormItem :data="formData"/>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data(){
        return {
            formData:{
                name: '',
                age: 18
            }
        }
    }
}
</script>
```

### 表格开发的格式

#### 受控组件
组件的内部状态可以通过修改属性值的方式进行控制：
1. 存在一个名为value的属性，组件的初始值由value决定，value值变化后组件内部值跟随改变；
2. 组件对外抛出change事件，组件内部值变动之后调用change事件，通知上层修改value值。

#### 非受控组件
组件的内部状态由组件自身进行维护，而不是受到外部传递过来的props控制
1. 对外提供一个名为defaultValue的属性,组件的初始状态由defaultValue决定,后续组件的状态随着用户交互而进行变化，但不通知父组件
2. 对外提供一个可以获取组件内部状态的方法,一般通过ref方式访问组件的内部状态value，如$refs.***.value（不建议直接访问组件内部状态）,建议提供一个method方法获取内部状态，如getValue()

### 表单开发注意事项

#### 表单项逻辑分散
一个表单项的实现代码分散在多个地方：Dom、JS、Style，很难搞明白一个表单项的完整逻辑，不符合高内聚的编程原则

#### 表单项无法在多个表单中复用
由于没有抽取单独的表单项组件，从而无法在其他表单中复用，只能每次都重新开发一遍。

#### 表单文件行数过大
不进行表单项组件抽取，面向细节开发表单，很容易造成一个表单组件达到数千行

#### 掩盖了表单核心逻辑
细节过多，导致本末倒置，无法看清表单的核心逻辑。

#### 校验规则不统一
可以把相同业务的校验规则整理到一个常量中进行引用

#### 复杂业务表单开发
通常我们可以利用分治思想来解决。将一个大型任务分解成多个小任务，小任务是很容易解决的，解决后再通过聚合多个小任务的结果，最终完成大型任务的开发。

### 组件化的好处

1. 分离关注点
2. 提升复用性
3. UI更一致
4. 提升可测试性

#### 何时进行组件抽取
1. 复用性，如果一个功能在多个页面都有使用，或者可以预期在后续会被重复使用，那么就可以把它抽取为组件。
2. 复杂度，如果一个组件的复杂度较高，那么它可能需要被拆分成多个小的、可重用的组件，以便更好地管理和维护
3. 结构化编程，根据功能的结构来拆分
4. 一个组件应该有它的重点任务，在别人阅读你的组件实现时，不应该用一些非主线的代码把他的关注点吸引走。

#### 组件五步

1. 明确组件的定位，是通用组件还是业务组件，是纯UI组件还是带状态组件，是表单组件还是展示组件，不同类型的组件定位，决定着后续组件如何设计。
2. 确定组件接口，组件的接口一般包含四部分：属性props、事件events、方法methods和插槽slots。
3. 设计组件的内部数据，组件的内部数据可以分为元数据（data）和派生数据（computed），开发一个组件之前，应该先把所有组件用到的数据列举出来，然后看看哪些是元数据，哪些可以根据元数据推算出来，进而确定组件的数据结构。
4. 梳理组件的交互逻辑
5. 编码

#### 组件抽象

1. 学会抽象，遵守单一职责原则，有利于提升组件的复用性
2. 插槽可用于扩展DOM，钩子函数可用于扩展逻辑，支持自定义类可用于扩展样式，尽量不在基础组件中使用 !important
3. 组件最好能傻瓜式使用，减少配置，默认值就可以满足大部分场景，命名要符合用户习惯
4. 提升组件可读性需要结合多种手段：组件命名、顶部注释、结构化开发、显式修改数据、区分元数据和派生数据、不要滥用watch等，切记，子组件不可修改父组件传递的props
5. 为了提升组件正交性，要尽量减少父子组件的耦合、组件与外部数据的耦合以及组件和业务逻辑的耦合，组件之间进行通信只能通过对方提供的接口进行，不可擅自访问组件内部的状态和DOM，子组件不要指挥父组件做事


## 设计模式
前端学习设计模式应该关注其核心思想，其中最核心的就是隔离变化，将各种变化引起的代码变更隔离在有限的范围内，减少变化对系统或者流程的影响；针对功能扩展，应该遵循对扩展开发、对修改关闭的原则。

### 策略模式
策略模式（Strategy Pattern）允许在运行时根据不同的情况选择不同的算法或策略。该模式将算法或策略封装起来，使得它们可以相互替换
1. 不好的示例，缺乏可读性和可维护性
2. 第一个点是getUser函数中充斥着大量的分支语句(switch、if)，每个分支都会增加阅读的成本，分支越多，嵌套分支越深，理解起来就越困难；第二个点是排序部分所占的代码比重在getUser函数中过高，有点头轻脚重的感觉，代码不够结构化。
3. 在可维护性方面，后续如果要增加一些新的排序方式，你就必须要先理解getUser方法的实现原理，然后再修改getUser方法中关于排序的实现
```js
function getUser(sortKey, sortDirection){
    //忽略通过请求获取用户数据相关代码
    let users = [
        {name: '用户1', createTime: '2023-10-1', department: '前端部'},
        {name: '用户2', createTime: '2023-10-2', department: '后端部'},
    ];
    
    switch (sortKey){
        case 'name':
            if(sortDirection === 'asc'){
                //按照名称升序排序
            }else{
                //按照名称降序排序
            }
            break;
        case 'createTime':
            if(sortDirection === 'asc'){
                //按照创建时间升序排序
            }else{
                //按照创建时间降序排序
            }
            break;
        case 'department':
            if(sortDirection === 'asc'){
                //按照部门升序排序
            }else{
                //按照部门降序排序
            }
            break;
    }
    return users;
}

getUser('name', 'asc'); //按照名称升序获取用户
getUser('createTime', 'desc'); //按照创建时间降序获取用户
```
使用策略模式，把排序抽象出去
```js
const nameAscStrategy = function (users){  }; //按照名称升序排序
const nameDescStrategy = function (users){  }; //按照名称降序排序
const createTimeAscStrategy = function (users){  }; //按照创建时间升序排序
const createTimeDescStrategy = function (users){  }; //按照创建时间降序排序
const departmentAscStrategy = function (users){  }; //按照部门升序排序
const departmentDescStrategy = function (users){  }; //按照部门降序排序


function getUser(sortStrategy){
    //忽略通过请求获取用户数据相关代码
    let users = [
        {name: '用户1', createTime: '2023-10-1', department: '前端部'},
        {name: '用户2', createTime: '2023-10-2', department: '后端部'},
    ];
    
    return sortStrategy(users);
}

getUser(nameAscStrategy); //按照名称升序获取用户
getUser(createTimeDescStrategy); //按照创建时间降序获取用户
```
```js
// 缺乏可维护性
function getStatusLabel(status){
    if(status === 'success'){
        return '成功';
    }else if(status === 'fail'){
        return '失败';
    }else{
        return '进行中';
    }
}
// ===>
export const STATUS = {
    success: 'success',
    fail: 'fail',
    run: 'run'
}
export const STATUS_LABEL = {
    [STATUS.success]: '成功',
    [STATUS.fail]: '失败',
    [STATUS.run]: '进行中'
}

// ==>
import {STATUS_LABEL, STATUS_COLOR} from 'const.js'
function getStatusLabel(status){
    return STATUS_LABEL[status]
}
```

### 模板方法模式
在一个方法中定义一个算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重新定义该算法的某些特定步骤。
1. 没有使用设计模式
```js
<template>
    <my-dialog @confirm="confirmHandler">
        <my-tabs @change="tabChangeHandler">
            <el-tab-pane name="样式配置">
                <!--样式配置组件-->
            </el-tab-pane>
            <el-tab-pane name="存储配置">
                <!--存储配置组件-->
            </el-tab-pane>
            <el-tab-pane name="系统配置">
                <!--系统配置组件-->
            </el-tab-pane>
        </my-tabs>
        
    </my-dialog>
</template>
<script>
export default {
    methods: {
        //切换页签
        tabChangeHandler(tab) {
            switch (tab) {
                case '样式配置':
                    //样式配置的初始化
                    break;
                case '存储配置':
                    //存储配置的初始化
                    break;
                case '系统配置':
                    //系统配置的初始化
                    break;
            }
        },
        //提交表单
        confirmHandler() {
            //样式配置的校验
            //存储配置的校验
            //系统配置的校验
        }
    }
}
</script>
```
使用设计模式
```js
<template>
    <!-- 新增页签无需修改Dom -->
    <my-dialog @confirm="confirmHandler">
        <my-tabs @change="tabChangeHandler">
            <el-tab-pane v-for="(tab, key) in tabs" :name="tab.name">
                <component :is="tab.component"/>
            </el-tab-pane>
        </my-tabs>
    </my-dialog>
</template>
<script>
export default {
    data(){
        return {
            //新增tab，只需要修改此处
            tabs: {
                style: {
                    label: '样式配置',
                    component: StyleComponent,
                    initData: this.styleInit,
                    validate: this.styleValidate
                },
                storage: {
                    label: '存储配置',
                    component: StorageComponent,
                    initData: this.storageInit,
                    validate: this.storageValidate
                },
                system: {
                    label: '系统配置',
                    component: SystemComponent,
                    initData: this.systemInit,
                    validate: this.systemValidate
                }
            }
        }
    },
    methods: {
        //切换页签，新增页签无需变化
        tabChangeHandler(tab) {
            this.tabs[tab].initData();
        },
        //提交表单，新增页签无需变化
        confirmHandler() {
            //遍历tabs调用validate
        }
    }
}
</script>
```

### 适配器模式
通过增加一个适配中间层，将一个类的接口转换成客户端所期望的另一个接口。适配器模式允许不兼容的接口之间进行协同工作，使得客户端能够使用不同接口的对象。
```js
function timeAdaptor(data) {
    //将接口中的 创建时间和更新时间 格式化成我们想要的格式
    ['createTime', 'updateTieme'].forEach(key => {
        if (data[key]) {
            const date = new Date(createTime);
            const formattedTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            data[key] = formattedTime;
        }
    })
    return data;
}

function responseKeyAdaptor(response){
    //将对象key值由下划线格式转为小驼峰
}
```

### 装饰器模式
装饰器模式是指允许在不修改现有对象的情况下，动态地向对象添加额外的行为或功能。装饰器模式通过将对象包装在一个装饰器对象中，从而在运行时动态地添加新的行为或修改现有行为。

1. 扩展第三方库方法
2. 扩展类
```js
// 购物车
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
    console.log(`Item added: ${item}`);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}
// 折扣装饰器
class DiscountDecorator {
  constructor(cart, discount) {
    this.cart = cart;
    this.discount = discount; // 折扣
  }

  //实现购物车的方法
  addItem(item) {
    this.cart.addItem(item);
  }
  
  getTotalPrice() {
    const totalPrice = this.cart.getTotalPrice();
    const discountedPrice = totalPrice * this.discount;
    return discountedPrice;
  }
}
const cart = new ShoppingCart();
const discountCart = new DiscountDecorator(cart, 0.9);

discountCart.addItem({ name: 'Product 1', price: 10 });
discountCart.addItem({ name: 'Product 2', price: 20 });

console.log(discountCart.getTotalPrice()); //（ 10 + 20 ）*0.9 = 27
// 优惠卷装饰器
class CouponDecorator {
  constructor(cart, coupon) {
    this.cart = cart;
    this.coupon = coupon; // 优惠券金额
  }

  addItem(item) {
    this.cart.addItem(item);
  }

  getTotalPrice() {
    const totalPrice = this.cart.getTotalPrice();
    const totalPriceWithCoupon = totalPrice - this.coupon;
    return totalPriceWithCoupon;
  }
}
// 一起使用
const cart = new ShoppingCart();
const discountCart = new DiscountDecorator(cart, 0.9);
const couponCart = new CouponDecorator(discountCart, 5);

couponCart.addItem({ name: 'Product 1', price: 10 });
couponCart.addItem({ name: 'Product 2', price: 20 });

console.log(couponCart.getTotalPrice()); // （10 + 20）* 0.9 - 5 = 22
```
3. 扩展组件
```vue
<template>
  <div class="form-validator-decorator">
    <slot></slot>
    <button @click="handleSubmit">提交</button>
    <div v-if="showError" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showError: false,
      errorMessage: '',
    };
  },
  methods: {
    handleSubmit() {
      // 进行表单验证
      if (this.validateForm()) {
        // 验证通过，执行原始组件的提交逻辑
        this.$slots.default[0].submitForm();
      } else {
        // 验证失败，显示错误消息
        this.showError = true;
        this.errorMessage = 'Form validation failed';
      }
    },
    validateForm() {
      // 进行表单验证的逻辑，返回验证结果
      return this.$slots.default[0].validate();
    },
  },
};
</script>

<template>
  <form-validator-decorator>
    <Form></Form>
  </form-validator-decorator>
</template>

<script>
import Form from './Form.vue';
import FormValidatorDecorator from './FormValidatorDecorator.vue';

export default {
  components: {
    Form,
    FormValidatorDecorator,
  },
};
</script>
```

## 代码改不动

### 原则
1. 单文件代码过长，超过千行：需要结构化思考、模块划分
2. 模块之间耦合严重：需要解耦
3. 代码复制代替了代码复用：开发前先抽取公共代码
4. 强行复用、假装复用：不因UI相同而复用，同一个业务逻辑才可复用
5. 破坏了数据一致性：区分元数据和派生数据，利用计算属性计算派生数据
6. 职责不单一：每个底层小模块只做一件事
7. 解决方案不"正统"：重视方案评审和CodeReview

### 重构
1. 不改变软件的功能
2. 小步快跑
3. 边改边测
4. 随时可停

## 单元测试

1. 议对前端项目中的基础Utils和通用组件进行单元测试。
2. 编写单测用例时，我们应该遵循四个原则：相互独立、完全穷尽、单一职责和可重复。
3. 推荐在单测编写时采用TDD（测试驱动开发）的方式进行，先写测试用例，然后通过不断重构，逐渐完善代码实现，尤其是在基础Utils开发或者开源库开发时，TDD非常有效。
4. E2E测试是及时发现线上问题的重要手段，对回归测试有着非常大的帮助，建议对稳定的、非核心的功能优先进行E2E测试。
5. 常见的测试框架和库：Jest、Karma、Mocha、Chai、Sinon，E2E(Cypress、Selenium、Nightwatch、TestCafe、Playwright、Puppeteer)

## 前端设计

1. 设计的过程就是对齐需求认知的过程，加深对产品需求的理解；
2. 进行前端设计之后的排期才是靠谱的，而且能提前发现潜在的风险；
3. 写伪代码的过程就类似大脑编译代码的过程，有效提升编程能力
4. 设计的过程就是大脑模拟解决问题的过程，有效提升大型项目的组织、设计能力
5. 前端设计文档分为业务功能设计文档和前端公共功能设计文档。业务功能设计文档主要包括：相关文档、需求梳理、前端设计、依赖资源（API）、排期。公共功能设计文档主要包括：当前存在的问题、期望实现的功能、使用示例、API、实现方案。
6. 明确文档的目的和受众、结构化地表达、内容详尽、重点突出、图形化表达

## 编程原则

1. 最少知识原则LOD，只通过少量的业务知识储备，就可以去轻松地维护或者使用你写的代码。
2. DRY原则，不要重复自己，尽量使用函数、类或模块来封装可复用的代码片段。
3. KISS原则，要把用户当”傻子“，用户不只是产品的用户，你的同事也是你代码的用户，保持代码简单易懂，避免过度复杂化，尽量使用简洁的解决方案
4. YAGNI原则，不要过度设计，选用刚刚好能解决当下问题的方案，面向现在编程而不是面向未来编程。
5. SOLID原则：

    5.1：单一职责原则（SRP）：一个模块只有一个修改它的原因  
    5.2：开闭原则（OCP）：对扩展开发，对修改关闭  
    5.3：里氏替换原则（LSP）：任何基类（父类）可以被其子类替换  
    5.4：接口隔离原则（ISP）：实现一个方法、组件时，不要依赖不需要的内容（数据、组件等），依赖关系应该尽可能小  
    5.5：依赖倒置原则（DIP）：高层模块不应该依赖于低层模块的具体实现
6. 高内聚低耦合：模块内部应该紧密相关，模块之间的依赖应该尽量减少。

## 提高代码健壮性
1. 优化工作流程  
    重视设计文档评审  
    认真对待Code Review  
    提测前进行严格的自测  
    鼓励前端团队成员进行交叉测试  
    核心功能进行自动化测试  
2. 不要相信用户
    不要相信用户的输入，对表单、查询等用户输入一定要做校验  
    防止用户进入无权限的页面，可通过全量路由配置 + 拦截鉴权 或 动态路由方式来实现  
    如果用户进入了不存在的页面也要给予响应  
    控制按钮的点击，包括控制操作权限、根据状态禁用按钮、防止重复点击 
3. 不要相信后端：注意安全取值，可以封装方法简化实现 
4. 不要使用旧数据，编辑操作应该拉取最新数据
5. 不要传递无用数据，调用接口仅发送必要的最少数据
6. 错误捕获
    js 8种错误类型  
    多使用try catch  
    监听错误的发生进行合理的处理  
    捕获Vue组件中的错误  
    通过React组件ErrorBoundary进行异常处理  
7. 重视网络请求
    网络请求失败才是常态，注意失败后的初始化处理  
    关注慢速网络，提测前使用低速模式验证你的功能  
    尽量不要请求全量数据，通过合理的交互避免全量数据  
    别忘记取消会引起异常的网络请求  
8. 组件卸载前一定要卸载定时器
9. 给你的项目增加监控，有了数据才能评价健壮性，才能主动解决项目中的异常

## 性能优化

### 降低时间消耗

#### 减少网络请求数量
1. 合并文件：通过打包技术，将多个页面的js、css、组件等资源打包到一起，减少最终文件数量，比如原来项目中组件、js和样式文件加起来可能有上百个，最终打包出去的可能也就10个左右，大大减少了网络请求数量。
2. 雪碧图：特别适合将多个小图片合并成一张大图。
3. 字体图标：使用字体图标代替传统的图片图标，字体图标可以通过CSS直接渲染，无需额外的网络请求。
4. 懒加载：针对图片等资源使用懒加载技术，只在出现在视窗区域中时才加载资源。
5. 浏览器缓存：通过缓存技术，特别是强制缓存，减少请求资源数量，js、css、图片等资源尽量使用强制缓存。
#### 减少网络请求大小
1. 打包压缩：对生产环境的代码进行压缩，如使用UglifyJS、Terser、Webpack插件（TerserWebpackPlugin、MiniCssExtractPlugin）等
2. 代码拆分：如果把所有的文件打包成一个文件，那么必然导致这个文件过大，影响首次加载的速度，可以按照使用频次进行拆包，只把经常使用的包打到公共包中，如使用webpack的splitChunks功能来完成该功能。
3. 按需引入：一些第三方库或者组件库都支持按需引入，减少无用的代码
4. 异步路由：通过异步路由，将页面的代码从打包文件中分离出来，减少主文件的大小
5. gzip压缩：通过nginx等服务将返回的数据进行gzip压缩，gzip可以有效提升网络传输速度，但是要注意平衡压缩质量，压缩的太狠，虽然传输时间减少，但是服务器压缩时间就会加长
6. 图片压缩：不要直接使用UI设计师提供的图片，记得先压缩一下
7. 更换图片格式：不知道你注意到没有，不同格式的图片大小是不一样的，JPEG的通常要比PNG的小，而WebP的图片压缩体积大约只有JPEG的2/3
#### 加快网络请求速度
1. http2代替http：HTTP/1.1中，一个连接在同一时间只能处理一个请求，而HTTP/2通过多路复用技术解决了这个问题，允许单个TCP连接上并发多个请求，而且HTTP/2使用HPACK算法对头部信息进行压缩，大大减少了传输的数据量。
2. 提升服务器带宽：没啥说的，如果经费充足，提高服务器带宽能同时为更多用户提供良好的传输速度。
3. 使用CDN：服务器带宽一般有限，那么可以将静态资源放到CDN服务上，由专业的供应商提供更好的网络传输速度。
#### 并行加载
1. 同一个域名下最多只能同时发起6-8个请求，即使你一下子发出几十个文件请求，浏览器也只会按照最大并发6-8个来顺序执行
2. 可以通过Promise.all并行发起请求，而不必await上一个完成再发送下一个。
#### 预加载
1. DNS预解析：如果打开淘宝网站，就能在head中发现如下的代码，通过浏览器闲时DNS预解析，可以加快后续资源加载速度
2. 资源预加载：可以在页面或者某个功能呈现之前提前加载其所需的资源，比如在浏览器闲时加载后续可能用到的资

### 页面渲染优化

1. 通过服务端渲染技术（SSR）加快首屏的渲染速度
2. 内容懒加载
3. 异步加载js
4. 批量操作DOM：如果你需要对多个DOM元素进行修改，尽量将这些修改合并成一次操作
5. 避免使用innerHTML进行大量更新：虽然innerHTML可以一次性更新多个元素，但如果内容较大或更新频繁，可能会导致性能问题
6. 优化数据绑定,如果你使用的是现代前端框架（如React、Vue或Angular），确保你正确使用了数据绑定和组件更新机制
7. 使用虚拟列表技术：用户看不到的内容是不必渲染的，这和懒加载类似，对于一些长列表，可以通过虚拟列表技术，减少不必要的DOM渲染
8. 避免频繁的样式更改：频繁的样式更改可能导致浏览器的重排（reflow）和重绘（repaint），这是非常耗时的操作。尽量将样式更改合并到一起，或者使用CSS类名来切换样式，而不是直接操作样式属性。
9. 防抖或节流：使用防抖或节流来减少一些短时间内频繁用户操作带来的多次渲染问题。
10. 减少重排：一些CSS设置不当会导致页面重排，导致不必要的大面积重新渲染；也可以利用GPU加速提升一些动画的渲染流畅度

### 长任务

1. 将耗时较长的同步任务拆成多个异步任务：根据浏览器事件循环机制可以知道，长的同步任务会阻塞页面渲染，而拆成小任务并通过异步（如setTimeout）将任务依次执行，则不会阻塞页面渲染
2. 使用Worker执行长任务：Web Workers允许你在浏览器的后台线程中运行JavaScript，这样就不会阻塞主线程
3. 更合理的数据结构：有时长任务可能是因为数据结构不合理导致查询、变更耗时较长，可以考虑修改数据结构减低时间复杂度

### 减少资源占用
1. 能用sessionStorage的地方就不要用localStorage，因为sessionStorage会在页面关闭后自动清除缓存，而localStorage则需要代码执行清理逻辑。
2. 组件销毁时记得清除组件中使用的对象（eCharts等实例）、及时清理定时器、清空闭包中使用的变量等。
3. 有些场景下需要循环进行网络请求，比如需要每隔一段时间刷新页面中某个数据的状态,如果网络不好可能导致请求阻塞，最终越积越多，更好的做法是通过setTimeout，在每次请求成功后再间隔5秒发起请求，确保每次网络请求的间隔为5秒，就算请求时间很长也没有影响。如果对实时性要求较高，还可以更换为Web Socket或SSE。
4. 对于一些较高复杂度的交与后端处理

### 友好提示
如果实在遇到有性能问题暂时解决不掉的情况，别忘记添加一个友好的提示，例如一个有趣的loading或者进度条，能有效缓解用户的焦虑，至少能让用户知道，他的操作得到了你的响应，而不是被忽视了。




