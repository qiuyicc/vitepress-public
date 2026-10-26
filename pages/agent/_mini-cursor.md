## 学习实现 mini Cursor：Prompt + 多工具自动干活

上一节只有一个 `readFile`：模型读完文件就分析。这一节把工具扩成 **读 / 写 / 列目录 / 跑命令**，再靠 System Prompt 规定工作方式。模型自己决定下一步调哪个工具。目标不是「会聊天」，而是：**给一句任务，Agent 在本机把项目写出来、装依赖、跑起来**。这就是缩小版 Cursor 的核心循环。

工具实现放在 `all-tools.mjs`，循环放在 `learnMiniCursor.mjs`。

### 和上一节差在哪

| | 上一节 | 这一节 |
|--|--------|--------|
| 工具数量 | 1 个读文件 | 4 个：读、写、列目录、执行命令 |
| 循环 | `while` 直到没有 `tool_calls` | `for` 最多 30 轮，防止死循环 |
| 提示词 | 「要读文件就调工具」 | 角色是项目管理助手，并写明 Windows 环境 |
| 任务 | 读一个脚本并解释 | 创建 Vue Todo、装依赖、`pnpm run dev` |

模型仍然**不碰磁盘、不跑 shell**。它只发出 `tool_calls`；本地 `invoke` 才真正写文件、执行 `pnpm`。

### 四件工具（`all-tools.mjs`）

`bindTools` 发给模型的是 `name` + `description` + `schema`。`name` 必须和 Prompt 里写的一致（上一节 `readFile` / `readFileTool` 对不上，这里统一成带 `Tool` 后缀）。

**readFileTool**

异步读文件，返回全文。模型改代码前通常先读现有文件。

```js
const readFileTool = tool(
  async ({ filePath }) => {
    const content = await fs.readFile(filePath, "utf8");
    console.log(
      `工具调用readFileTool读取文件:${filePath}，内容：${content.length}字符`,
    );
    return content;
  },
  {
    name: "readFileTool",
    description:
      "用此工具读取文件，当用户要求读取文件、查询文件内容、分析文件内容时使用",
    schema: z.object({
      filePath: z.string().describe("文件路径"),
    }),
  },
);
```

**writeFileTool**

写之前 `mkdir(..., { recursive: true })`，路径不存在也能写。成功/失败都返回**字符串**给模型，不要把异常直接甩出循环。

```js
const writeFileTool = tool(
  async ({ filePath, content }) => {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, content, "utf-8");
      return `文件写入成功${filePath}`;
    } catch (error) {
      return `文件写入失败${filePath}`;
    }
  },
  {
    name: "writeFileTool",
    description: "向指定路径写入文件内容，自动创建目录",
    schema: z.object({
      filePath: z.string().describe("文件路径"),
      content: z.string().describe("文件内容"),
    }),
  },
);
```

**listDirectoryTool**

`readdir` 后格式化成列表。任务里写了「列出目录确认项目」，模型会在写完后调它核对结构。

```js
const listDirectoryTool = tool(
  async ({ directoryPath }) => {
    try {
      const files = await fs.readdir(directoryPath);
      return `目录内容:\n${files.map((f) => `- ${f}`).join("\n")}`;
    } catch (error) {
      return `列出目录失败${directoryPath}`;
    }
  },
  {
    name: "listDirectoryTool",
    description: "列出指定路径下的所有文件",
    schema: z.object({
      directoryPath: z.string().describe("目录路径"),
    }),
  },
);
```

**executeCommandTool**

这是「能跑起来」的关键。`spawn` + `shell: true` 才能执行 `pnpm i` 这种带空格的命令；`workingDirectory` 可选，默认 `process.cwd()`。

`stdio: ["pipe", "inherit", "inherit"]`：stdin 自己管，stdout/stderr 直接打到当前终端，所以你能看到 pnpm 的进度条。`child.stdin.write("\n\n")` 用来应付脚手架里「按回车确认」的交互。

注意：返回给模型的只是「成功/失败 + 命令字符串」，**不是完整终端输出**。人看 inherit 的实时日志，模型只知道命令有没有跑完。长时间挂起的 `pnpm run dev` 会占住这一轮工具调用，直到进程退出。

```js
const executeCommandTool = tool(
  async ({ command, workingDirectory }) => {
    const cwd = workingDirectory || process.cwd();
    return new Promise((resolve) => {
      const child = spawn(command, {
        cwd,
        stdio: ["pipe", "inherit", "inherit"],
        shell: true,
      });
      child.stdin.write("\n\n");
      child.stdin.end();
      let errorMsg = "";
      child.on("error", (error) => {
        errorMsg = error.message;
      });
      child.on("close", (code) => {
        if (code === 0) {
          resolve(`命令执行成功:${command}${workingDirectory}`);
        } else {
          resolve(`命令执行失败:${errorMsg}`);
        }
      });
    });
  },
  {
    name: "executeCommandTool",
    description: "执行系统命令，支持指定工作目录，实时显示输出",
    schema: z.object({
      command: z.string().describe("要执行的命令"),
      workingDirectory: z.string().optional().describe("工作目录"),
    }),
  },
);
```

最后 `export` 四个工具，循环脚本按名字 import。

### Agent 循环（`learnMiniCursor.mjs`）

绑定工具和上一节一样：`model.bindTools(tools)`。差别在 **System Prompt** 和 **带上限的 for 循环**。

Prompt 做三件事：

1. 告诉模型当前工作目录（`${process.cwd()}`），路径才写得对  
2. 列出四个工具的用途，名称和 `tool()` 的 `name` 对齐  
3. 约束环境（Windows 命令）和回复风格（只说做了什么）

没有这几条，模型可能发出 `ls`、Unix 路径，或在没调工具时空想项目结构。

```js
async function runAgentWithTools(query, maxL = 30) {
  const messages = [
    new SystemMessage(`你是一个项目管理助手，使用工具完成任务。
      当前工作目录：${process.cwd()}
      工具:
      1. readFileTool：读取文件；
      2. writeFileTool：写入文件；
      3. executeCommandTool：执行命令；
      4. listDirectoryTool：列出目录
      重要规则：
      1. 当前环境处于windows环境,使用windows可以执行的命令;
      2. 回复简洁明确，只说做了什么；
      `),
    new HumanMessage(query),
  ];

  for (let i = 0; i < maxL; i++) {
    console.log(`正在等待AI思考...`);
    const response = await modelWithTools.invoke(messages);
    messages.push(response);
    if (!response.tool_calls || response.tool_calls.length === 0) {
      console.log(`最终回复：${response.content}`);
      return response.content;
    }
    for (const toolCall of response.tool_calls) {
      const foundTool = tools.find((t) => t.name === toolCall.name);
      if (foundTool) {
        const toolResult = await foundTool.invoke(toolCall.args);
        messages.push(
          new ToolMessage({
            content: toolResult,
            tool_call_id: toolCall.id,
          }),
        );
      }
    }
  }
  return messages[messages.length - 1].content;
}
```

循环要点：

1. **先 `messages.push(response)`**，再执行工具。和上一节相同：下一轮必须看到带 `tool_calls` 的 AIMessage。  
2. **没有 `tool_calls` 就结束**，把 `content` 当最终回复。  
3. **`maxL = 30`**：写项目会连续很多轮 write + list + command，没有上限可能一直调工具。  
4. 这里按 `tool_calls` **顺序 await**，不像上一节 `Promise.all`。写文件再 `pnpm i` 必须有先后。  
5. 找不到工具时这一版直接跳过。生产里应回一条「工具不存在」的 `ToolMessage`，否则模型会空等结果。

任务写在 `HumanMessage` 里，步骤越清楚，模型越少跑偏：

```js
const case1 = `创建一个TodoList应用
1. 实现添加、删除、编辑、标记完成；
2. 分类筛选；
3. 样式渐变背景、卡片圆角、阴影；
4. 添加动画
5. 列出目录确认项目；
之后：
1. 使用pnpm i安装依赖；
2. 使用pnpm run dev 启动服务；
`;

await runAgentWithTools(case1);
```

### 实际跑起来长什么样

模型自己拆步骤：写 `style.css` / `App.vue` → 用 Windows 命令清掉多余目录 → `listDirectoryTool` 核对 → `pnpm i` → `pnpm run dev`。中间每一轮都会打印「正在等待AI思考...」，对应循环里又一次 `invoke`。

![mini Cursor 自动写文件、装依赖、启动开发服务器](/miniCursor.png)

截图里能对上工具实现：

- `writeFileTool写入文件:...，内容：384字符`：日志里带字符数，和读/写工具的 `console.log` 一致  
- `rmdir /s /q src\components`：Prompt 要求 Windows 命令，模型没有用 `rm -rf`  
- `listDirectoryTool列出目录:...共11个文件`：任务第 5 步「列出目录确认项目」被执行了  
- `pnpm i` 的 Packages 输出走 `stdio inherit`，出现在当前终端，不是模型编的  
- 最后 `pnpm run dev` 拉起 Vite，说明 Agent 已经从「写代码」走到「把服务跑起来」

数据流可以看成：

```
HumanMessage（创建 Todo + 装依赖 + 启动）
        ↓ invoke
AIMessage + tool_calls（write / rmdir / list / pnpm …）
        ↓ 本地 tool.invoke
        ↓ ToolMessage 写回 messages
        ↓ 再 invoke，直到没有 tool_calls 或满 30 轮
```

Cursor 之类产品在这层之上还有：更细的编辑工具、权限确认、流式展示、打断与重试。这一节已经具备同一骨架：**Prompt 约束行为，模型选工具，本地执行，结果再进对话。**
