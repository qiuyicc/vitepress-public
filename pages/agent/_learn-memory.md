## Memory：让对话「记得」刚才说过什么

大模型本身是无状态的：每一轮 `invoke` 只看你这次塞进 Prompt 的 messages。  
所谓 Memory，就是**在本地维护历史消息（或摘要 / 向量），下次再拼进上下文**，模型才知道「你觉得味道怎么样」里的「味道」指的是上一轮推荐的红烧肉。

单纯 `messages.push` 会一路涨到上下文上限（如 100k / 200k tokens），所以要学 **Memory 管理**。

### 两个维度：存储层 vs 逻辑层

| 维度 | 管什么 | 代表 |
|--|--|--|
| **存储层** ChatMessageHistory | 消息存在哪 | 内存 / 文件 / Redis / DB |
| **逻辑层** 策略 | 塞进模型前怎么处理 | 截断 / 总结 / 检索 |

旧版 LangChain 有 `BufferMemory`、`BufferWindowMemory`、`ConversationSummaryMemory` 等高层封装，现已偏弃用；更常见是自己组合：

- `InMemoryChatMessageHistory` / `FileSystemChatMessageHistory` 做存储  
- 自己写 trim / summarize / Milvus search 做策略  
- 官方也提供更灵活的 `trimMessages` 等工具  

约定（后面例子统一）：

- **SystemMessage 不进 history**，每次 `invoke` 再拼到最前：`[system, ...history]`  
- 单条用 `addMessage`，多条用 `addMessages([...])`

```
用户输入
   ↓
取出 history（内存 / 文件 / Milvus…）
   ↓
策略：全量 | 截断 | 总结 | 检索相关片段
   ↓
[System, ...处理后的历史, 当前用户消息] → 模型
   ↓
把本轮 human + ai 写回存储
```

---

### 1. 短时记忆：InMemoryChatMessageHistory

存在**进程内存**，关进程即丢。适合当次会话。

脚本：`learnHistory.mjs`（`inMemoryDemo`）。

```js
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const history = new InMemoryChatMessageHistory();
const systemMessage = new SystemMessage("你是一个美食助手,分享美食");

await history.addMessage(new HumanMessage("推荐一个美食"));
const message1 = [systemMessage, ...(await history.getMessages())];
const response1 = await model.invoke(message1);
await history.addMessage(response1);

await history.addMessage(new HumanMessage("你觉得味道怎么样"));
const message2 = [systemMessage, ...(await history.getMessages())];
const response2 = await model.invoke(message2);
await history.addMessage(response2);
```

第二轮没有再说「红烧肉」，模型仍能接上，因为 history 里带着第一轮推荐。

![InMemory 多轮对话：第二轮追问味道仍指红烧肉](/InChatMessageMemoryRes.png)

---

### 2. 长时记忆：FileSystemChatMessageHistory

消息落到 JSON 文件，进程重启后还能续聊。

脚本：`learnHistory.mjs`（写入）、`learnHistory2.mjs`（读出续聊）。

```js
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system";

// 必须传对象，不是 (filePath, sessionId)
const history = new FileSystemChatMessageHistory({
  sessionId: "session1",
  filePath: "./message.json",
});

// 写入：只存 human / ai，System 每次再拼
await history.addMessage(userMessage);
const payload = [systemMessage, ...(await history.getMessages())];
const res = await model.invoke(payload);
await history.addMessage(res);
```

另一脚本恢复：

```js
const restoreHistory = new FileSystemChatMessageHistory({
  sessionId: "session1",
  filePath: "./message.json",
});
const messages = await restoreHistory.getMessages(); // 例如 4 条：两轮问答
await restoreHistory.addMessage(new HumanMessage("需要哪些食材"));
const res = await model.invoke([
  systemMessage,
  ...(await restoreHistory.getMessages()),
]);
```

文件结构大致是 `store[userId][sessionId].messages`（默认 `userId` 为空字符串）。

---

### 3. 策略一：截断（Trim）

**思想：** 上下文装不下时，丢掉旧消息，只留最近一段。实现简单，但早期关键信息会丢。

脚本：`learnMemoryTrim.mjs`，用 `js-tiktoken`（`cl100k_base`）计 token。

#### 按消息条数

```js
function trimByMessageCount(messages, maxMessages) {
  if (messages.length <= maxMessages) return messages;
  return messages.slice(-maxMessages); // 保留最近 N 条
}
```

#### 按 token 数

```js
import { getEncoding } from "js-tiktoken";
const enc = getEncoding("cl100k_base");

function countTokens(msg) {
  return enc.encode(String(msg.content ?? "")).length + 4;
}

function trimByTokenCount(messages, maxTokens) {
  const kept = [];
  let used = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const cost = countTokens(messages[i]);
    if (used + cost > maxTokens) break;
    kept.unshift(messages[i]);
    used += cost;
  }
  return kept;
}
```

**结果示意：** 完整 16 条对话 → 按条数留最近 4 条 → 按 80 tokens 可能只剩约 3 条；再问「总结刚才聊过的菜」时，模型只能看到截断窗口内的内容（如甜点、火锅），早期川菜可能已不在上下文里。

---

### 4. 策略二：总结（Summarize）

**思想：** 不直接扔掉旧消息，而是压成**摘要**，再拼上最近几条原文。信息密度更高，但仍可能丢失细节。

脚本：`learnMemorySummary.mjs`。

关键 API：`getBufferString` 把消息数组变成可读对话文本，再交给模型摘要。

```js
import { getBufferString, AIMessage } from "@langchain/core/messages";

async function summarizeMessages(messages, { existingSummary = "", keepRecent = 2 } = {}) {
  const oldPart = messages.slice(0, -keepRecent);
  const recentPart = messages.slice(-keepRecent);

  const buffer = getBufferString(oldPart, "用户", "助手");
  // =>
  // 用户: ...
  // 助手: ...

  const res = await model.invoke([
    new SystemMessage("请把历史对话压缩成简洁中文摘要，保留关键事实，不要编造。"),
    new HumanMessage(
      (existingSummary ? `已有摘要：\n${existingSummary}\n` : "") +
        `请总结下面的对话：\n${buffer}`,
    ),
  ]);

  const summaryMsg = new AIMessage(`【对话摘要】${res.content}`);
  return { summary: res.content, kept: [summaryMsg, ...recentPart] };
}
```

#### 触发方式

| 触发 | 条件 |
|--|--|
| 按消息条数 | `history.length > MAX_MESSAGES` 时总结 |
| 按 token | `totalTokens(history) > MAX_TOKENS` 时总结（js-tiktoken） |

**结果形态：**

```
[【对话摘要】用户曾问川菜…推荐水煮鱼…约好明天聊火锅]
[用户] 明天聊火锅
[助手] 好，下次聊底料和涮菜顺序。
```

继续问「明天适合聊什么」时，模型仍能结合摘要与最近原文回答「火锅」。

---

### 5. 策略三：检索（Retrieve + Milvus）

**思想：** 长对话不全塞进上下文；把每一轮写成向量存进 Milvus，提问时**语义检索相关轮次**（可带时间、轮次），拼进 Prompt。适合长期记忆、跨会话回忆。

脚本：`learnMemoryRetrieve.mjs`（连接方式同 `learnMilvus.mjs`）。

#### Schema（集合 `Ai_ChatMemory`）

| 字段 | 含义 |
|--|--|
| `id` | 主键 |
| `sessionId` | 会话 |
| `turn` | 轮次 |
| `time` | 时间 |
| `user` / `assistant` | 本轮原文 |
| `content` | 整轮文本（嵌入用） |
| `vector` | 向量 |

#### 主流程

```js
// 1) ensureCollection：createCollection → createIndex → loadCollection
// 2) seed：模拟多轮对话 insert
// 3) 检索
const hits = await milvusClient.search({
  collection_name: COLLECTION,
  data: await embeddings.embedQuery(query),
  limit: 3,
  filter: `sessionId == "${SESSION_ID}"`,
  metric_type: MetricType.COSINE,
  output_fields: ["turn", "time", "user", "assistant", "content"],
});

// 4) 按 turn 排序拼上下文 → Prompt → 模型回答
// 5) 本轮再 insert 回 Milvus（turn 递增），供后续检索
```

**跑通结果示例：**

- 问「我之前问过鱼片怎么做才嫩吗？」→ 命中第 3 轮，复述「蛋清+淀粉、控油温」  
- 再问「明天适合继续聊什么？」→ 命中第 5 轮「明天想聊火锅」，并写入新轮次  

```bash
node .\learnMemoryRetrieve.mjs
node .\learnMemoryRetrieve.mjs "水煮鱼食材有哪些？"
```

---

### 三种策略怎么选

| 策略 | 优点 | 代价 | 适用 |
|--|--|--|--|
| **截断** | 实现最简单、延迟低 | 旧信息硬丢 | 短会话、只关心最近几轮 |
| **总结** | 保留全局要点 | 多一次 LLM 调用；细节可能糊 | 中等长度会话 |
| **检索** | 可长期、可跨会话、按需取 | 要向量库 + Embedding | 长记忆、知识型助手 |

可组合：近期消息截断保留原文 + 更早的做总结 + 全量进 Milvus 按需检索。

---

### 相关脚本一览

| 脚本 | 内容 |
|--|--|
| `learnHistory.mjs` | InMemory / FileSystem 存取 |
| `learnHistory2.mjs` | 从 `message.json` 恢复续聊 |
| `learnMemoryTrim.mjs` | 按条数 / token 截断 |
| `learnMemorySummary.mjs` | `getBufferString` + 按条数 / token 触发总结 |
| `learnMemoryRetrieve.mjs` | Milvus 检索式长期 Memory |

### 这一节要记住的

1. Memory = 本地维护历史，再拼进 messages；模型本身不记得上一轮  
2. **存储**（内存/文件/库）和 **策略**（截断/总结/检索）分开看  
3. System 建议不进 history；`addMessage` vs `addMessages([...])`  
4. `FileSystemChatMessageHistory` 构造参数是 `{ sessionId, filePath }`  
5. 截断用 `slice` / tiktoken；总结用 `getBufferString`；检索用 Milvus + RAG 回写  
