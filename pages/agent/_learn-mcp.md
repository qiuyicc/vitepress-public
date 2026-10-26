## MCP：可跨进程调用的 Tool

上一节的 Tool 写在**同一个进程**里（`tool()` + `bindTools`）。这一节换成 **MCP（Model Context Protocol）**：把工具做成独立进程/服务，任何 MCP Client（Cursor、LangChain 等）都能按同一协议发现和调用。

### MCP 是什么

一句话：**可跨进程调用的 Tool 协议。**

| 点 | 含义 |
|--|--|
| 跨进程 | 工具不塞进主程序，单独跑一个 MCP Server |
| 本地通信 | 常用 **stdio**（标准输入/输出） |
| 远程通信 | 用 **HTTP** |
| 不限语言 | Server 用什么语言写都行，Client 只认协议 |
| 生态 | 可自写，也可接现成的 MCP Server |
| 对 LangChain | 用 `@langchain/mcp-adapters` 包一层后，和普通 Tool 用法一样 |

两端对应两个脚本：

- `learnMCP.mjs` → **MCP Server**（提供工具和资源）
- `langchainMcpTest.mjs` → **MCP Client**（拉工具，交给大模型用）

```
langchainMcpTest.mjs (Client)          learnMCP.mjs (Server)
─────────────────────                  ────────────────────
MultiServerMCPClient  --stdio-->       McpServer + StdioServerTransport
getTools()            发现工具          registerTool("query_user")
list/readResource()   读文档            registerResource("docs://guide")
tool.invoke(args)     真正调用          query_user 回调查 database
```

### Cursor 里怎么接

在 `~/.cursor/mcp.json` 里声明用 `node` 启动 Server：

```json
{
  "mcpServers": {
    "my-mcp": {
      "command": "node",
      "args": ["F:\\learnAgent\\learnMCP.mjs"]
    }
  }
}
```

配置本身没问题。若 Cursor 发现不了工具，先确认 Server 能独立启动（导入路径要带 `.js` 后缀，例如 `@modelcontextprotocol/sdk/server/mcp.js`）。

---

### 例子 1：MCP Server（`learnMCP.mjs`）

#### 用到的库

| 库 | 作用 |
|--|--|
| `@modelcontextprotocol/sdk/server/mcp.js` | 提供 `McpServer`：建 Server、注册 Tool/Resource |
| `@modelcontextprotocol/sdk/server/stdio.js` | 提供 `StdioServerTransport`：用 stdin/stdout 和 Client 通信 |
| `zod` | 定义工具入参 schema（类型、描述），Client/模型靠它知道该传什么 |

#### 代码在干什么

**1. 模拟数据库**

内存里放几个用户（`001` / `002` / `003`），给 `query_user` 查。

**2. 创建 Server**

```js
const server = new McpServer({
  name: "my-mcp",
  version: "1.0.00",
});
```

**3. 注册工具 `query_user`**

```js
server.registerTool(
  "query_user",
  {
    description: "查询数据库中的用户信息，输入用户ID，返回用户的详细信息",
    inputSchema: {
      userId: z.string().describe("用户ID:如001、002"),
    },
  },
  async ({ userId }) => {
    const user = database.users[userId];
    if (!user) {
      return {
        content: [{ type: "text", text: `用户ID${userId}不存在` }],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `用户信息：姓名${user.name},邮箱:${user.email}`,
        },
      ],
    };
  },
);
```

- 名字、说明、入参 schema：给 Client / 模型看
- 回调：真正查库，返回 MCP 规定的 `content: [{ type, text }]`

**4. 注册资源（使用指南）**

```js
server.registerResource(
  "使用指南",
  "docs://guide",
  {
    description: "My-MCP使用指南",
    mimeType: "text/plain",
  },
  async () => {
    return {
      contents: [
        {
          uri: "docs://guide",
          mimeType: "text/plain",
          text: "MCP server使用指南，功能：提供用户查询角色，在MCP Client中对话，会自动调用相应工具",
        },
      ],
    };
  },
);
```

Resource 是**只读文档/数据**，不是可执行工具。`docs://guide` 是这份资源的 **URI（唯一地址）**。

**5. 用 stdio 挂上并监听**

```js
const transport = new StdioServerTransport();
await server.connect(transport);
```

流程：**注册能力 → stdio 连接 → 等 Client 来调工具 / 读资源**。

---

### 例子 2：MCP Client + Agent（`langchainMcpTest.mjs`）

#### 用到的库

| 库 | 作用 |
|--|--|
| `dotenv/config` | 读 `.env`，注入 `OPENAI_*` |
| `@langchain/core/messages` | `SystemMessage` / `HumanMessage` / `ToolMessage` |
| `@langchain/mcp-adapters` | 把 MCP 的工具/资源转成 LangChain Tool |
| `@langchain/openai` | `ChatOpenAI`，对接 OpenAI 兼容接口（如智谱） |

#### 类 / 函数在干什么

| 代码 | 做什么 |
|--|--|
| `new ChatOpenAI({…})` | 创建大模型客户端 |
| `new MultiServerMCPClient({ mcpServers })` | 创建 MCP 客户端；用 `node` 拉起 `learnMCP.mjs` |
| `await mcpServer.getTools()` | **必须 await**；发现工具，得到 LangChain 工具数组 |
| `model.bindTools(tools)` | 把工具 schema 绑到模型上 |
| `await mcpServer.listResources()` | 列出各 Server 上的 Resource（元数据，通常无正文） |
| `await mcpServer.readResource(serverName, uri)` | 按 URI 读取 Resource 正文 |
| `new SystemMessage(...)` | 把读到的指南塞进系统提示 |
| `new HumanMessage(query)` | 用户问题 |
| `modelWithTools.invoke(messages)` | 调模型；可能直接答，也可能返回 `tool_calls` |
| `foundTool.invoke(args)` | 执行工具（再跨进程打到 MCP Server） |
| `new ToolMessage({ content, tool_call_id })` | 工具结果写回对话 |
| `mcpServer.close()` | 关掉连接 / 子进程 |

注意：`getTools()` 返回的是 `Promise`。漏写 `await` 会直接报 `tools.map is not a function`。

工具调用字段用 LangChain 格式：`toolCall.name` / `toolCall.args`（不是 `toolCall.function.name`）。

跑通后查询用户 `002`：

![LangChain + MCP 查询用户002](/mcpAnswer1.png)

![My-MCP Server 可用工具说明](/mcpAnswer2.png)

---

### Resource：为什么要传 URI，数据怎么流

`listResources()` 只拿到**目录（元数据）**，不带正文。  
`readResource(serverName, uri)` 才是**按地址取内容**。

URI 就像文件路径：告诉 Server「读哪一份」。Server 注册时写的是 `docs://guide`，Client 必须把同一个 URI 传回去。

#### `listResources()` 返回结构

类型大致是：`Record<服务器名, 资源元数据[]>`

只有一个 Server、一个 Resource 时：

```js
res = {
  "my-mcp": [
    {
      uri: "docs://guide",          // 真正用来读取的地址
      name: "使用指南",
      description: "My-MCP使用指南",
      mimeType: "text/plain"
      // 通常没有正文 text
    }
  ]
}
```

多个 Server、多份文档时：

```js
{
  "my-mcp": [
    { uri: "docs://guide", name: "使用指南", ... },
    { uri: "docs://faq",   name: "常见问题", ... }
  ],
  "other-mcp": [
    { uri: "file:///readme.md", name: "readme", ... }
  ]
}
```

#### 循环在拆什么

```js
const res = await mcpServer.listResources();

for (const [serverName, resources] of Object.entries(res)) {
  // serverName = "my-mcp"
  // resources  = [{ uri: "docs://guide", name: "使用指南", ... }]
  for (const resource of resources) {
    const content = await mcpServer.readResource(serverName, resource.uri);
    // 等价于：readResource("my-mcp", "docs://guide")
  }
}
```

- `serverName`：连哪个 MCP 进程（可同时挂多个）
- `resource.uri`：在这个进程里读哪份资源

#### `readResource` 返回

返回内容块数组，大致像：

```js
[
  {
    uri: "docs://guide",
    mimeType: "text/plain",
    text: "MCP server使用指南，功能：提供用户查询角色，在MCP Client中对话，会自动调用相应工具"
  }
]
```

拼进 System Prompt 时，更稳妥是取 `content[0].text`，不要直接 `` `${content}` ``（数组/对象转字符串可能不友好）。

#### 数据流动

```
learnMCP.mjs
  registerResource("使用指南", "docs://guide", ...)
        │  登记：名字 + URI + 说明（不立刻给正文）
        ▼
langchainMcpTest.mjs
  listResources()
        │
        ▼
  res = { "my-mcp": [{ uri: "docs://guide", name: "使用指南", ... }] }
        │  发现「有哪些文档」
        ▼
  readResource("my-mcp", "docs://guide")
        │  用 URI 精确取正文
        ▼
  content = [{ uri, mimeType, text: "..." }]
        │
        ▼
  拼进 SystemMessage → 给大模型当上下文
```

类比：

| MCP | 类比 |
|--|--|
| `listResources()` | 打开文件夹，只看到文件名列表 |
| `resource.uri` | 某个文件的完整路径 |
| `readResource(server, uri)` | 打开指定路径读文件内容 |
| `serverName` | 哪台电脑 / 哪个磁盘上的文件夹 |

---

### 和上一节 Tool 的差别

| | 普通 LangChain Tool | MCP Tool |
|--|--|--|
| 运行位置 | 和 Agent 同一进程 | 独立 Server 进程 |
| 注册方式 | `tool()` | Server 上 `registerTool` |
| Client 获取 | 自己 `import` / 手写数组 | `getTools()` / Cursor 自动发现 |
| 复用 | 绑死在当前项目 | Cursor、LangChain、其他 MCP Client 都能用 |
| 文档类内容 | 通常写进 System Prompt | 可用 `registerResource` + `readResource` |

核心没变：模型仍然只发 `tool_calls`，真正干活的是本地/远端执行层。变的是：**执行层可以跨进程、跨语言、跨产品复用。**

```ts
import "dotenv/config";
import {
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const mcpServer = new MultiServerMCPClient({
  mcpServers: {
    "my-mcp": {
      command: "node",
      args: ["F:\\learnAgent\\learnMCP.mjs"],
    },
  },
});

// getTools() 返回 Promise，必须 await 才能得到工具数组
const tools = await mcpServer.getTools();
const modelWithTools = model.bindTools(tools);
let resourcesContetn = "";
// 加入resources
const res = await mcpServer.listResources();

for (const [serverName, resources] of Object.entries(res)) {
  for (const resource of resources) {
    const content = await mcpServer.readResource(serverName, resource.uri);
    resourcesContetn += `${content}\n`;
  }
}
console.log(resourcesContetn);

async function run(query, maxL = 30) {
  const messages = [
    new SystemMessage(resourcesContetn),
    new HumanMessage(query)];

  for (let i = 0; i < maxL; i++) {
    console.log(`正在等待AI思考...`);
    const response = await modelWithTools.invoke(messages);
    messages.push(response);
    // 检查工具是否有用
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

try {
    // await run("My-MCP Server 使用指南是什么");
    await run("查询用户002的信息");
} finally {
  await mcpServer.close();
}

```
