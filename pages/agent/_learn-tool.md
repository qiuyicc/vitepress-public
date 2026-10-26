## 学习 Tool

### 准备工作

1. 找到一家有免费额度的 AI，开通并使用。这里用智谱 GLM。
![开通智谱免费额度](/freeAi.png)
2. 创建 API Key 并记录。
3. 密钥放到 `.env`，用 `dotenv` 加载；连接脚本使用兼容 OpenAI Chat Completions 的接口：

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
})

const response = await model.invoke("Hello, how are you?");
console.log(response.content);
```

4. 执行脚本，确认能通。
![跑通模型调用](/freeaiRes.png)

### 这段脚本在干什么

数据按这个圈走，直到模型不再调用工具：

```
messages: [System, Human]
        ↓ invoke
res: AIMessage + tool_calls[{ name, args, id }]
        ↓ 本地 tool.invoke(args)
        ↓ messages += ToolMessage(id, 文件内容或错误)
        ↓ invoke
res: 可能再 tool_calls，或 content = 最终分析
```

最后打印 `res.content`。LangChain 也有高层 Agent 封装；下面是手动写循环，逻辑更透明。

### 用到的库和概念

**dotenv**

`import "dotenv/config"` 启动时读项目根目录 `.env`，写进 `process.env`。密钥、baseURL、模型名不要写死在源码里。

**LangChain**

把 LLM 接进应用的库：统一消息类型、工具绑定、多模型适配。这里用：

- `@langchain/openai` 的 `ChatOpenAI`：按 OpenAI Chat 协议请求（智谱 `baseURL` 兼容这套接口）
- `@langchain/core`：消息、`tool()`、和模型无关的核心类型

没有 LangChain 也可以直接打 HTTP；它把「消息数组 + 工具 schema + 返回的 tool_calls」收成同一套对象。

**ChatOpenAI**

```js
const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
})
```

- `modelName` / `apiKey` / `baseURL`：连哪家、哪个模型
- `temperature: 0`：工具调用时少随机，路径仍可能写错
- 这个对象还不会自动执行工具，只是能聊天。执行靠后面的 `while`

**tool（LangChain 工具）**

`tool(实现函数, { name, description, schema })` 把一段普通 JS 包装成模型可调用的能力：

| 字段 | 作用 |
|------|------|
| `name` | 必须和模型发出的 `tool_calls[].name` 对上，这里是 `readFile` |
| `description` | 模型靠这段决定该不该用这个工具 |
| `schema` | 参数长什么样，会转成发给模型的 JSON Schema |
| 实现函数 | 真正干活；模型不会跑这段，只有 `tool.invoke(...)` 才会跑 |

`bindTools(tools)` 只告诉模型「你可以点这些按钮」；谁按、什么时候按，是你的循环。

**z（Zod）**

声明和校验数据结构。`z.object({ filePath: z.string().describe("文件路径") })` 表示参数必须是 `{ filePath: "某个字符串" }`。`.describe()` 会进给模型看的 schema。

实现写成 `async ({ filePath }) => ...`，因为传入的是**整个参数对象**，不是单独一个字符串。写成 `async (filePath)` 时，`fs.readFileSync` 会收到 Object，报 `path` 类型错误。

**Messages**

聊天不是一段纯文本，而是带角色的消息列表，对应 `system` / `user` / `assistant` / `tool`。

| 类型 | 角色 | 用途 |
|------|------|------|
| `SystemMessage` | 系统 | 人设、何时用工具、工作流程 |
| `HumanMessage` | 用户 | 本次任务 |
| 模型返回的 `res`（AIMessage） | 助手 | 普通文字，或带 `tool_calls` |
| `ToolMessage` | 工具结果 | 必须带 `tool_call_id`，和某次调用一一对应 |

模型看到 `ToolMessage` 才知道「上次让你读文件，结果是这些内容或失败信息」。全部记忆都在 `messages` 数组里，没有隐藏全局状态。

::: warning 工具名要一致
提示词里写了 `readFileTool`，真正注册的 `name` 是 `readFile`。模型一般跟 schema 的 `name` 走，两边最好写成同一个名字。
:::

### 编写 readFileTool 与 Agent 循环

完整脚本：

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import * as fs from "fs";
import { z } from "zod";

const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
})

const readFileTool = tool(async ({ filePath }) => {
    const content = fs.readFileSync(filePath, "utf8");
    console.log(`工具调用readFileTool读取文件:${filePath}，内容：${content.length}字符`);
    return content;
}, {
    name: "readFile",
    description: "用此工具读取文件，当用户要求读取文件、查询文件内容、分析文件内容时使用",
    schema: z.object({
        filePath: z.string().describe("文件路径"),
    }),
});

const tools = [readFileTool];
const modelWithTools = model.bindTools(tools);
const messages = [
    new SystemMessage("你是一个助手，当用户要求读取文件、查询文件内容、分析文件内容时使用readFile工具。工作流程:1.用户要求读取文件时，立即调用readFile工具;2.等待工具返回内容；3.基于文件内容进行分析和解释"),
    new HumanMessage("读取文件/learnAgent/learnTool.mjs的内容"),
];
let res = await modelWithTools.invoke(messages);
console.log(res);

messages.push(res);
while (res.tool_calls && res.tool_calls.length > 0) {
    console.log(`工具调用:${res.tool_calls.length}个工具`);
    const toolResult = await Promise.all(res.tool_calls.map(async (toolCall) => {
        const selected = tools.find((t) => t.name === toolCall.name);
        if (!selected) {
            throw new Error(`工具${toolCall.name}不存在`);
        }
        console.log(`执行工具:${toolCall.name}`);
        try {
            return await selected.invoke(toolCall.args);
        } catch (error) {
            console.error(`工具${toolCall.name}执行失败:${error}`);
            return `工具${toolCall.name}执行失败:${error}`;
        }
    }));
    res.tool_calls.forEach((toolCall, index) => {
        messages.push(new ToolMessage({
            tool_call_id: toolCall.id,
            content: toolResult[index],
        }));
    });
    res = await modelWithTools.invoke(messages);
}

console.log("最终答案：", res.content);
```

循环里值得单独看的点：

1. **必须 `messages.push(res)`**  
   否则下一轮不知道自己已经请求过工具，也缺 `tool_call_id` 上下文。

2. **`let res` 不能写成 `const`**  
   每一轮都要换成新的模型输出，`const` 再赋值会直接崩掉。

3. **`Promise.all` 并行执行多个 tool_call**  
   一轮可以点多个工具。`map` 保持顺序，后面 `forEach` 用同一下标贴 `ToolMessage`。

4. **`ToolMessage` 必须带对应的 `tool_call_id`**  
   协议要求每个调用都有一条结果。

### 第一轮模型返回长什么样

`content` 往往是空的，真正有用的是 `tool_calls` 和 `finish_reason: "tool_calls"`：

```js
AIMessage {
  content: "",
  response_metadata: {
    finish_reason: "tool_calls",
    model_name: "glm-5.3-flash",
  },
  tool_calls: [
    {
      name: "readFile",
      args: { filePath: "/learnAgent/learnTool.mjs" },
      type: "tool_call",
      id: "call_-7225738354703196572",
    },
  ],
}
```

提示词规定「要读文件就先调工具，等结果再分析」，避免模型编造文件内容。

![模型调用工具并给出分析](/freeaiResponse.png)
