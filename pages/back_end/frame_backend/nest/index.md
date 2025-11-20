# NestJS

## 初始NestJS

### 初始NestJS项目

1. 安装NestJS CLI
```ts
npm install -g @nestjs/cli
//安装完成后
nest -v //查看NestJS版本
```
2. 创建项目
```ts
nest new project-name
```
3. 运行项目
```ts
npm run start
```

### NestJS核心概念

::: code-group
```ts [main.ts]
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
```ts [app.controller.ts]
Controller负责传入的请求和客户端返回响应
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
```ts [app.module.ts]
module用于建立controller和provider的联系
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [],
  controllers: [AppController], // [!code ++]
  providers: [AppService], // [!code ++]
})
export class AppModule {}
```
```ts [app.service.ts]
Service用于处理业务逻辑，比如数据处理、业务逻辑处理等
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
:::

### NestJS错误机制

Nest提供了一个内置的HttpException类，用于处理HTTP错误,[NestJS文档](https://nest.nodejs.cn/exception-filters#throwing-standard-exceptions)比如：
```ts
throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
```
HttpException 构造函数采用两个必需的参数来确定响应:response 参数定义 JSON 响应主体和status 参数定义了 HTTP 状态代码。

HttpException的响应主体JSON为statusCode：默认为 status 参数中提供的 HTTP 状态代码，message：基于 status 的 HTTP 错误的简短描述

自定义异常过滤器：
```ts
http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

## Nest接入数据库

### 接入数据库

使用TypeOrmModule接入数据库模块：
```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: xxx,
      username: 'xxx',
      password: 'xxxxx',
      database: 'xxxx',
      autoLoadEntities: true, // 自动加载实体
      // synchronize: true, // 自动同步实体到数据库
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 创建实体

1. 创建实体文件
2. 注入TypeOrmModule
3. 注入Repository
4. 在Controller中使用Repository
::: code-group
```ts [user.entity.ts]
import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  nickname: string;

  @Column()
  active: number;

  @Column()
  avatar: string;
}
```
```ts [user.module.ts]
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 注册实体
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```
```ts [user.service.ts]
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
@Injectable()
export class UserService {
  constructor(
    //InjectRepository是typeorm提供的装饰器，用来注入typeorm的Repository类
    @InjectRepository(User)
    //Repository<User>是typeorm提供的Repository类，用来操作数据库
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.role = JSON.stringify(createUserDto.role);
    user.avatar = createUserDto.avatar;
    user.nickname = createUserDto.nickname;
    user.active = createUserDto.active;
    const sql = `INSERT INTO admin_user (username, password, role, avatar, nickname, active) VALUES ('${createUserDto.username}', '${createUserDto.password}', '${JSON.stringify(createUserDto.role)}', '${createUserDto.avatar}', '${createUserDto.nickname}', ${createUserDto.active})`;
    // return this.userRepository.save(user);
    return this.userRepository.query(sql);
  }
```
```ts [create-user.dto.ts]
//创建user约束模型
export class CreateUserDto {
  username: string;
  password: string;
  role: string;
  nickname: string;
  avatar: string;
  active: number;
}
```
```ts [user.controller.ts]
import {
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { wrapperResponse } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getUserByToken(@Req() req: any) {
    return wrapperResponse(
      this.userService.findByUsername(req.user.username),
      '获取用户信息成功',
    );
  }
}
```
:::

## Nest登录鉴权

### 创建Auth守卫

::: code-group
```ts [auth.module.ts]
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
import { JWT_SECRET } from './auth.jwt.sercert';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET,
      global: true,// 全局注册
      signOptions: { expiresIn: '10h' }, // 有效期
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // 全局注册guard
      useClass: AuthGuard, // 使用AuthGuard守卫
    },
  ],
})
export class AuthModule {}
```
```ts [auth.guard.ts]
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_Public } from './auth.decorator';
// 导入jwt模块
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './auth.jwt.sercert';

// 可注入的守卫类，用于验证请求的授权
@Injectable()
export class AuthGuard implements CanActivate {
  // 构造函数，注入JwtService和Reflector依赖
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  // 异步方法，用于激活守卫，判断请求是否可以继续执行
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 通过反射器获取当前处理程序和类的IS_Public元数据
    const isPublic = this.reflector.getAllAndOverride(IS_Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果处理程序或类是公开的，则允许请求继续
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaders(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 使用jwt验证token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

// 从请求头中提取token
function extractTokenFromHeaders(request) {
  const [type, token] = request.headers.authorization?.split(' ');
  return type === 'Bearer' ? token : undefined;
}
```
:::

### 使用Auth守卫和JWT

::: code-group
```ts [auth.controller.ts]
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';
import { wrapperResponse } from 'src/utils';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public() // 声明该路由不需要token验证
  @Post('login') // 登录不需要守卫
  @UseFilters(new HttpExceptionFilter()) // 全局异常过滤器
  async login(@Body() params) {
    return wrapperResponse(
      this.authService.login(params.username, params.password),
      '登录成功',
    );
  }
}
```
```ts [auth.decorator.ts]
import { SetMetadata } from '@nestjs/common';
export const IS_Public = 'isPublic';
// SetMetadata装饰器，设置元数据
export const Public = () => SetMetadata(IS_Public, true);
```
```ts [auth.service.ts]
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(username, password) {
    const user = await this.userService.findByUsername(username);
    // 使用md5加密密码,对密码进行验证
    const md5Password = md5(password).toUpperCase();

    if (user.password !== md5Password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, userid: user.id };
    return {
        //使用jwt生成token
      token: await this.jwtService.signAsync(payload),
    };
  }
}
```
:::

### 动态路由

1. 后端初始化路由表
```ts
menu.data.ts，初始化文件
export const MenuList = [
  {
    path: '/about',
    name: 'About',
    redirect: '/about/index',
    meta: {
      hideChildrenInMenu: true,
      icon: 'simple-icons:about-dot-me',
      title: 'routes.dashboard.about',
      orderNo: 100000,
    },
    children: [
      {
        path: 'index',
        name: 'AboutPage',
        meta: {
          title: 'routes.dashboard.about',
          icon: 'simple-icons:about-dot-me',
          hideMenu: true,
        },
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/analysis',
    meta: {
      orderNo: 10,
      icon: 'ion:grid-outline',
      title: 'routes.dashboard.dashboard',
    },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        meta: {
          title: 'routes.dashboard.analysis',
        },
      },
      {
        path: 'workbench',
        name: 'Workbench',
        meta: {
          title: 'routes.dashboard.workbench',
        },
      },
    ],
  },
  {
    path: '/charts',
    name: 'Charts',
    redirect: '/charts/echarts/map',
    meta: {
      orderNo: 500,
      icon: 'ion:bar-chart-outline',
      title: 'routes.demo.charts.charts',
    },
    children: [
      {
        path: 'baiduMap',
        name: 'BaiduMap',
        meta: {
          title: 'routes.demo.charts.baiduMap',
        },
      },
      {
        path: 'echarts',
        name: 'Echarts',
        meta: {
          title: 'Echarts',
        },
        redirect: '/charts/echarts/map',
        children: [
          {
            path: 'map',
            name: 'Map',
            meta: {
              title: 'routes.demo.charts.map',
            },
          },
          {
            path: 'line',
            name: 'Line',
            meta: {
              title: 'routes.demo.charts.line',
            },
          },
          {
            path: 'pie',
            name: 'Pie',
            meta: {
              title: 'routes.demo.charts.pie',
            },
          },
        ],
      },
    ],
  },
];
```
2. 前端路由过滤

   1. 在login后，获取用户信息，根据用户信息进行路由过滤
   2. 在路由过滤器中过滤不符合角色权限的路由
   3. 动态添加路由，并跳转到首页
::: code-group
```ts [user.ts]
// 登录
async login(
  params: LoginParams & {
    goHome?: boolean;
    mode?: ErrorMessageMode;
  },
): Promise<GetUserInfoModel | null> {
  try {
    const { goHome = true, mode, ...loginParams } = params;
    const data = await loginApi(loginParams, mode);
    const { token } = data;
    // save token
    this.setToken(token);
    return this.afterLoginAction(goHome); 
  } catch (error) {
    return Promise.reject(error);
  }
},
// 在login后，获取用户信息，根据用户信息进行路由过滤 // [!code ++]
async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
  if (!this.getToken) return null;
  // get user info
  const userInfo = await this.getUserInfoAction();
  // 检查超时
  const sessionTimeout = this.sessionTimeout;
  if (sessionTimeout) {
    this.setSessionTimeout(false);
  } else {
    const permissionStore = usePermissionStore();
    // isDynamicAddedRoute代表是否已经动态添加过路由
    if (!permissionStore.isDynamicAddedRoute) {
      //获取路由列表，buildRoutesAction为重点 // [!code ++]
      const routes = await permissionStore.buildRoutesAction(); // [!code ++]
      // 动态添加路由
      routes.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw);
      });
      // 添加其他路由，如404
      router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
      permissionStore.setDynamicAddedRoute(true);
    }
    // 进行路由跳转
    goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
  }
  return userInfo;
},
```
```ts [permission.ts]
// 构建路由，buildRouteAction主要逻辑 // [!code ++]
async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
const { t } = useI18n(); //国际化
const userStore = useUserStore(); // 获取用户信息
const appStore = useAppStoreWithOut(); // 获取项目配置
let routes: AppRouteRecordRaw[] = []; // 路由表
const roleList = toRaw(userStore.getRoleList) || []; // 获取角色列表
const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig; // 获取权限模式


// 路由过滤器 在 函数filter 作为回调传入遍历使用 // [!code ++]
const routeFilter = (route: AppRouteRecordRaw) => {
  const { meta } = route;
  // 抽出角色
  const { roles } = meta || {};
  if (!roles) return true;
  // 进行角色权限判断，如果用户角色包含路由角色
  return roleList.some((role) => roles.includes(role));
};

// 过滤掉菜单列表中的ignoreRoute路由 // [!code ++]
const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
  const { meta } = route;
  // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
  const { ignoreRoute } = meta || {};
  // arr.filter 返回 true 表示该元素通过测试
  return !ignoreRoute;
};

// 生成菜单列表
let myNewRoute;

// 生成组件 // [!code ++]
function getComponents(routesArr) {
  return routesArr.map(route=>{
    if(route.children && route.children.length>0){
      getComponents(route.children)
    }
      route.component = ROUTER_MAP[route.name]
      
      return route
  })
}
// 生成MenuList // [!code ++]
const covertMenuTree =  (menudata) => {
  const menuList = []
  menudata.forEach(item => {
    try {
      if(item.meta){
        item.meta = JSON.parse(item.meta)
      }
    } catch (error) {
      console.log(error);
    }
    if(item.pidL === 0){
      menuList.push(item)
    }else {
      const parent = menuList.find(menu => menu.id === item.pidL)
      if(!parent.children){
        parent.children = []
      }
      parent.children.push(item)
    }
  })
  
  return menuList
}
// 获取当前激活菜单
const getAllMenuList = () =>{
  return getActiveMenu()
}
try {
  const route = await getAllMenuList() // [!code ++]
  const menuList = covertMenuTree(route)// [!code ++]
    myNewRoute = getComponents(menuList)// [!code ++]
} catch (error) {
  throw new Error(error)
}


// 路由映射， 默认进入该case
case PermissionModeEnum.ROUTE_MAPPING: // [!code ++]
// 对非一级路由进行过滤
routes = filter(myNewRoute, routeFilter); // [!code ++]
// 对一级路由再次根据角色权限过滤
routes = routes.filter(routeFilter); // [!code ++]

// 将路由转换成菜单
const menuList = transformRouteToMenu(routes, true);
// 移除掉 ignoreRoute: true 的路由 非一级路由
routes = filter(routes, routeRemoveIgnoreFilter);
// 移除掉 ignoreRoute: true 的路由 一级路由；
routes = routes.filter(routeRemoveIgnoreFilter);
// 对菜单进行排序
menuList.sort((a, b) => {
  return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
});
// 设置菜单列表
this.setFrontMenuList(menuList);
// Convert multi-level routing to level 2 routing
// 将多级路由转换为 2 级路由
routes = flatMultiLevelRoutes(routes);
break;
```
```ts [router.map.ts]
建立路由映射表
import { asyncRoutes } from './index';
const newRoutes = {};
function generateRouterMap(routes) {
  return routes.map((route) => {
    if (route.children && route.children.length > 0) {
      generateRouterMap(route.children);
    }
    newRoutes[route.name] = route.component;
  });
}
generateRouterMap(asyncRoutes);
export const ROUTER_MAP = newRoutes;
```
:::

