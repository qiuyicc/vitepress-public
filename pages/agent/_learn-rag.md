## RAG：检索增强生成

大模型知道什么，取决于训练数据。问它**最近发生的事**或**企业内部私有文档**，它通常不知道；更糟的是它可能不说「不知道」，而是编一个听起来像真的答案——这就是**幻觉**。

怎么解决？

用户要问的内容，我们先去**内部知识库**查相关片段，塞进 Prompt，再交给大模型。模型有了背景材料，就能按材料回答。  
这就是 **RAG（Retrieval-Augmented Generation，检索增强生成）**：先检索，再生成。

一句话：**检索补知识，生成做表达**——开卷考试，而不是让模型硬背全部资料。

```
文档 → Embedding → 向量库
                      ↑
问题 → Embedding → 相似度检索 → 相关文档 → 拼进 Prompt → 聊天模型回答
```

示例脚本：`learnRag.mjs`。

### 为什么需要向量

怎么判断「哪段文档和问题相关」？关键词匹配不够：问「丽丽是谁」，文档写的是「丽丽是明明的姐姐」，字面不完全一样，但意思相关。

做法是把文本变成**向量**（一串数字），用空间里的距离/相似度衡量语义远近：意思相近 → 向量更近。常见度量包括余弦相似度；`MemoryVectorStore` 返回的则是**距离**（越小越相似）。

谁负责「文本 → 向量」？专门的 **Embedding（嵌入）模型**，不是普通聊天大模型。

| | 聊天模型（如 `glm-5.3-flash`） | Embedding 模型（如 `embedding-3`） |
|--|--|--|
| 干什么 | 生成文字回答 | 把文本变成向量 |
| RAG 里角色 | 最后根据上下文**答题** | 先把文档/问题**向量化**，才能检索 |
| 接口 | `/chat/completions` | `/embeddings` |

两者不能混用。

### 最小 RAG 流水线（`learnRag.mjs`）

#### 1. 两套模型

```js
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL, // 聊天：glm-5.3-flash
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: { baseURL: process.env.OPENAI_BASE_URL },
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "embedding-3", // 嵌入：智谱 Embedding，不是 glm-xxx
  configuration: { baseURL: process.env.OPENAI_BASE_URL },
});
```

智谱 `baseURL` 下，Embedding 用 `embedding-2` / `embedding-3`（以控制台文档为准），不要写 OpenAI 的 `text-embedding-3-small` 之类名字，更不要写成聊天模型名。

#### 2. Document：知识切片

每条知识 = `pageContent`（正文）+ `metadata`（标签）。

- 正文参与向量化和检索
- metadata 方便以后过滤（按人物、章节等）；最小示例里还没用上过滤

```js
new Document({
  pageContent: "丽丽是明明的姐姐，它送给明明一支钢笔，明明非常高兴。",
  metadata: {
    chapter: "丽丽故事",
    character: "丽丽",
    type: "礼物",
    gift: "钢笔",
  },
});
```

#### 3. Vector Store：向量库

`MemoryVectorStore.fromDocuments(documents, embeddings)`：对每篇文档做一次 Embedding，存进**内存向量库**。

- 适合学习、小数据
- 进程关掉就没了；生产常用 FAISS / Chroma / PGVector 等持久化方案

#### 4. 相似度检索：一次拿文档 + 分数

```js
const results = await vectorStore.similaritySearchWithScore(question, 3);
```

内部做了三件事：

1. 把问题也 embed 成向量
2. 和库里向量算距离
3. 返回最相近的 Top-K（这里是 3）及分数

不必再先 `retriever.invoke()` 再 `similaritySearchWithScore()` 用 `find` 对齐——那样会**重复 embedding 检索**，逻辑也冗余。一次 `similaritySearchWithScore` 就够。

`MemoryVectorStore` 的 score 是**距离**（越小越像）。打印时可用 `1 - score` 转成「越大越像」的展示值，仅作观感，不是严格概率。

#### 5. 拼 Prompt + 聊天模型生成

```js
const context = docs.map((doc) => doc.pageContent).join("\n");

const prompt = `
You are a helpful assistant that can answer questions about the following context,
if the question is not related to the context, you should say "I don't know":
${context}
Question: ${question}
Answer:
`;

const response = await model.invoke(prompt);
```

关键纪律：

- 有上下文 → 按材料答
- 无关 → 说不知道（压幻觉）

模型只负责读上下文写答案，不负责当永久知识库。

### 跑通结果

问「丽丽是谁？」时，三条文档都会按相似度排出来；最相关的是丽丽那条，模型最终答出「丽丽是明明的姐姐。」

![RAG 检索分数与最终回答](/ragTestResult.png)

可以读出两层信息：

1. **检索层**：三条都返回了（`k: 3`），分数不同，丽丽相关段落排最前
2. **生成层**：模型主要依据最相关上下文作答，而不是瞎编

### 职责分工

| 组件 | 职责 |
|--|--|
| Document | 切知识：正文 + 元数据 |
| Embedding | 理解语义：文本 → 向量 |
| Vector Store | 存和查向量 |
| similaritySearchWithScore | 按语义找 Top-K |
| Prompt + Chat 模型 | 读上下文、写自然语言答案 |

### 和前面 Agent / Tool / MCP 的对比

| | Tool / MCP Agent | 这个 RAG |
|--|--|--|
| 模型怎么拿外部信息 | 主动调工具（读文件、查地图） | 被动：先检索再塞进 Prompt |
| 知识形态 | API / 文件 / 实时能力 | 预先向量化的文档库 |
| 典型场景 | 做事、查最新数据 | 基于私有文档问答 |

可组合：Agent 里某个 Tool 就是「去向量库检索」，那就是 **RAG + Agent**。

### 这一节要记住的

1. RAG = 检索相关片段 → 放进 Prompt → 再生成，用来补私有/新知识、减幻觉  
2. 相关性靠 **Embedding + 向量相似度**，不是纯关键词  
3. **聊天模型**和 **Embedding 模型**是两类，职责不同  
4. 最小实现：`Document` → `MemoryVectorStore` → `similaritySearchWithScore` → 拼 Prompt → `ChatOpenAI`
```ts
import "dotenv/config";
import {
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'embedding-3',
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const documents = [
  // 人物故事1
  new Document({
    pageContent:
      "明明是一个非常聪明的人，他总是能够想出很多好的主意，他的主意总是能够帮助别人解决问题。",
    metadata: {
      chapter: "西游记1",
      character: "明明",
      type: "人物故事",
      mood: "开心",
    },
  }),
  // 人物故事2
  new Document({
    pageContent: "东东是明明的同学，他在体育上超过明明，在数学上不如明明。",
    metadata: {
      chapter: "明明故事2",
      character: "东东",
      type: "人物故事",
      mood: "沮丧",
    },
  }),
  // 人物故事3
  new Document({
    pageContent: "丽丽是明明的姐姐，它送给明明一支钢笔，明明非常高兴。",
    metadata: {
      chapter: "丽丽故事",
      character: "丽丽",
      type: "礼物",
      gift: "钢笔",
    },
  }),
];

const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings,
);

const questions = ["丽丽是谁？"];

for (const question of questions) {
  // 一次检索：同时拿到文档和距离分数
  const results = await vectorStore.similaritySearchWithScore(question, 3);
  const docs = results.map(([doc]) => doc);

  for (const [doc, score] of results) {
    // MemoryVectorStore 返回的是距离（越小越相似），转成相似度仅作展示
    const similarity = (1 - score).toFixed(4);
    console.log(`${doc.pageContent} - ${similarity}`);
  }

  const context = docs.map((doc) => doc.pageContent).join("\n");

  const prompt = `
  You are a helpful assistant that can answer questions about the following context,if the question is not related to the context, you should say "I don't know":
  ${context}
  Question: ${question}
  Answer:
  `;

  const response = await model.invoke(prompt);
  console.log(response.content);
}
```
