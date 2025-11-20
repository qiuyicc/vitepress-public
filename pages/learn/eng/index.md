# 前端工程化

## 规范

### 提交规范

#### Angular 提交规范

```md
<type>(<scope>): <subject>

# 空行

<body> 可选，描述修改内容
空行
<footer> 可选，用于说明不兼容变动和问题关闭
不兼容变动：当前代码与上一版本不兼容，则以 BREAKING CHANGE 开头，关联
变动描述 、 变动理由 和 迁移方法
问题关闭：当前代码已修复某些 Issue ，则以 Closes 开头，关联目标 Issu

例如：本次修改了按钮颜色
feat(View): 修改 xxx 按钮颜色
```

```js
feat	     功能	     新增功能，迭代项目需求
fix	         修复	     修复缺陷，修复上一版本存在问题
docs	     文档	     更新文档，仅修改文档不修改代码
style	     样式	     变动格式，不影响代码逻辑
refactor     重构	     重构代码，非新增功能也非修复缺陷
perf	     性能	     优化性能，提高代码执行性能
test	     测试	     新增测试，追加测试用例验证代码
build	     构建	     更新构建，改动构建工具或外部依赖
ci	         脚本        更新脚本，改动CI或执行脚本配置
chore	     事务	     变动事务，改动其他不影响代码的事务
revert	     回滚	     回滚版本，撤销某次代码提交
merge	     合并	     合并分支，合并分支代码到其他分支
sync	     同步	     同步分支，同步分支代码到其他分支
impr	     改进	     改进功能，升级当前功能模块
```

#### commitizen

commitizen 是一个用于规范化 Git commit 信息的工具，它可以帮助我们生成符合 Angular 提交规范的 commit 信息。

```bash
npm i -D commitizen cz-conventional-changelog
```
```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  }
}
```
```bash
npm run commit 然后选择相应的选项即可
```
自定义提交规范,可以使用 cz-customizable 工具来自定义提交规范
[cz-customizable](https://github.com/leoforfree/cz-customizable)
```bash
npm i -D cz-customizable
```
```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```
在根目录下创建 .cz-config.js 文件
```js
module.exports = {
  types: [
    { value: "feat", name: "feat:添加新功能" },
    { value: "fix", name: "fix:修复bug" },
    { value: "docs", name: "docs:文档修改" },
    {
      value: "style",
      name: "style:样式修改",
    },
    {
      value: "refactor",
      name: "refactor:代码重构",
    },
    {
      value: "perf",
      name: "perf:性能优化",
    },
    { value: "test", name: "test:添加测试" },
    {
      value: "chore",
        name: "chore:构建过程或辅助工具的修改以及库的修改",
    },
    { value: "revert", name: "revert:回退" },
    { value: "WIP", name: "WIP:开发中" },
  ],

  // scopes: [
  //   { name: "accounts" },
  //   { name: "admin" },
  //   { name: "exampleScope" },
  //   { name: "changeMe" },
  // ],

  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  prependTicketToHead: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  // it needs to match the value for field type. Eg.: 'fix'

  scopeOverrides: {
    fix: [
      { name: "merge" },
      { name: "style" },
      { name: "e2eTest" },
      { name: "unitTest" },
    ],
  },

  // override the messages, defaults are as follows
  messages: {
    type: "选择修改的类型:",
    scope: "选择修改的影响范围:",
    subject: "选择修改的简短描述:",
    body: "选择修改的详细描述:",
    breaking: "选择修改的破坏性变更:",
    footer: "选择修改的关联issue:",
    confirmCommit: "确定要提交吗?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  // skip any questions you want
  // skipQuestions: ['scope', 'body'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
```

#### commitlint
commitlint 是一个用于规范化 Git commit 信息的工具，它可以帮助我们生成符合 Angular 提交规范的 commit 信息。Commitlint 需要通过 Git hooks 才能自动检查提交信息。仅安装包不会自动生效。
```bash
npm i -D commitlint @commitlint/config-conventional
```
```json
{
  "scripts": {
    "commit": "commitlint"
  }
}
```
```js
module.exports = {
  extends: ["@commitlint/config-conventional"]
}
```
```bash
npm install --save-dev husky
npm run prepare
```
```json
git commit -m "测试提交"
// 可以发现成功生效了commitlint的检查
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```
