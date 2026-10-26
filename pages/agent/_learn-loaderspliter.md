## Loader 与 Splitter：把真实知识喂进 RAG

上一节 `learnRag.mjs` 里，知识是手写的三个 `Document`。真实场景里，知识可能来自 Word、PDF、网页 URL、甚至视频字幕——显然不能手敲，要用 **Loader** 转成 `Document`，再经 Embedding 进向量库。

很多文档又很大（一整本书的 PDF）。整篇直接向量化，检索粒度太粗、上下文噪声也大，所以还要 **Splitter**：先切成小块（chunk），再向量化。

这一节脚本：`loader-and-splitter.mjs`。流水线是：

```
URL / 文件
   ↓ Loader（CheerioWebBaseLoader）
Document[]（整页/整文件）
   ↓ Splitter（RecursiveCharacterTextSplitter）
小 Document[]（chunks）
   ↓ Embedding → MemoryVectorStore
相似度检索 → 拼 Prompt → 聊天模型回答
```

### 为什么需要 Loader

知识来源很多：本地文件、网页、数据库……LangChain Community 提供各类 Loader，统一产出 `Document`（`pageContent` + `metadata`）。

本例用网页 Loader：抓掘金文章，只取正文段落。

```js
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const cheerioLoader = new CheerioWebBaseLoader(
  "https://juejin.cn/post/7233327509919547452",
  {
    selector: ".main-area p", // CSS 选择器：只要正文 p，少广告噪声
  },
);

const docs = await cheerioLoader.load();
```

`load()` 返回 `Document[]`。`metadata` 里通常有 `source`（URL）、`title` 等，后面检索时仍能追溯来源。

### 为什么需要 Splitter

不是「一行一个 Document」。常见做法是设 **chunkSize**：把按分隔符切开的文字往当前块里堆，够大了再开下一块；并用 **chunkOverlap** 让相邻块重叠一点，避免关键句被拦腰切断后两边都缺上下文。

本例用 `RecursiveCharacterTextSplitter`：按你给的分隔符列表**递归**尝试切分（先用粗分隔符，一块仍太大再用更细的）。

```js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每块目标大小（字符量级）
  chunkOverlap: 40, // 相邻块重叠，保上下文连续
  separators: ["。", "？", "！"], // 中文优先按句号等切
});

const splitDocs = await splitter.splitDocuments(docs);
```

切完后打印 `splitDocs`，能看到：

- 多块 `Document`，每块 `pageContent` 更短
- 相邻块末尾/开头可能重复同一句（overlap 的效果）
- `metadata.source` 仍指向原文章 URL

![切分后的 Document chunks（可见 overlap）](/chunkSplitter.png)

### 建库、检索、问答

切分后的流程和上一节 RAG 一样，只是文档来源从「手写」变成了「Loader + Splitter」：

```js
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings,
);

// 可选：包装成 Retriever（Runnable），k 在创建时定好
const retriever = vectorStore.asRetriever({ k: 2 });

const question = ["父亲去世对作者本人产生了什么影响？"];

for (const q of question) {
  // 一次拿到文档 + 分数；不必再 invoke + find 对齐
  const scoreResult = await vectorStore.similaritySearchWithScore(q, 2);

  console.log("检索到的文档和相似度评分:");
  scoreResult.forEach(([doc, score]) => {
    console.log(`相似度评分: ${score}`);
    console.log(`文档内容: ${doc.pageContent}`);
  });

  const context = scoreResult.map(([doc]) => doc.pageContent).join("\n");
  const prompt = `
You are a helpful assistant that can answer questions about the following context:
${context}
Question: ${q}
Answer:
`;

  const response = await model.invoke(prompt);
  console.log(response.content);
}
```

#### `retriever.invoke` / `getRelevantDocuments` / `similaritySearchWithScore`

| API | 调谁 | 返回 | 说明 |
|--|--|--|--|
| `getRelevantDocuments(q)` | Retriever（旧写法） | `Document[]` | 旧接口；新版本优先 `invoke` |
| `retriever.invoke(q)` | Retriever（Runnable） | `Document[]` | 推荐；无分数；`k` 来自 `asRetriever` |
| `similaritySearchWithScore(q, 2)` | VectorStore | `[Document, number][]` | 带距离分；`k` 每次可传 |

`MemoryVectorStore` 的 score 是**距离**（越小越像）。本例打印的是原始距离。

三种里检索语义相近；若只要带分数的上下文，用 `similaritySearchWithScore` **一次**即可，不必再叠加 `retriever.invoke`。

`scoreResult` 格式示意：

```js
[
  [
    {
      pageContent: "……与父亲去世相关的段落……",
      metadata: {
        source: "https://juejin.cn/post/...",
        title: "...",
      },
    },
    0.38, // 距离分数
  ],
  [ /* 第二相关的 Document + score */ ],
]
```

### 跑通结果

问「父亲去世对作者本人产生了什么影响？」时：检索到相关 chunk（带分数），模型据此归纳情感冲击、对亲情的反思、更珍惜陪伴等。

![Loader + Splitter RAG 检索与回答](/runLoaderSplitterResult.png)

### 完整代码（`loader-and-splitter.mjs`）

```js
import "dotenv/config";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
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
  modelName: "embedding-3",
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const cheerioLoader = new CheerioWebBaseLoader(
  "https://juejin.cn/post/7233327509919547452",
  {
    selector: ".main-area p",
  },
);

const docs = await cheerioLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 40,
  separators: ["。", "？", "！"],
});

const splitDocs = await splitter.splitDocuments(docs);

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings,
);

const question = ["父亲去世对作者本人产生了什么影响？"];

for (const q of question) {
  const scoreResult = await vectorStore.similaritySearchWithScore(q, 2);

  console.log("检索到的文档和相似度评分:");
  scoreResult.forEach(([doc, score]) => {
    console.log(`相似度评分: ${score}`);
    console.log(`文档内容: ${doc.pageContent}`);
  });

  const context = scoreResult.map(([doc]) => doc.pageContent).join("\n");
  const prompt = `
You are a helpful assistant that can answer questions about the following context:
${context}
Question: ${q}
Answer:
`;

  const response = await model.invoke(prompt);
  console.log(response.content);
}
```

运行：

```bash
node .\loader-and-splitter.mjs
```

### 和上一节手写 Document 的差别

| | `learnRag.mjs` | `loader-and-splitter.mjs` |
|--|--|--|
| 知识从哪来 | 手写 3 条 `Document` | 网页 Loader 抓取 |
| 要不要切 | 不用（本来就短） | Splitter 切 chunk |
| 后面 | Embedding → 检索 → 生成 | 一样 |

Loader / Splitter 解决的是：**真实、大块知识如何变成可检索的小 Document**；检索与生成逻辑仍是标准 RAG。

### 这一节要记住的

1. **Loader**：任意来源 → `Document[]`  
2. **Splitter**：大文档 → 带 overlap 的小 chunk，再向量化  
3. `chunkSize` / `chunkOverlap` / `separators` 决定切分质量  
4. 检索优先一次 `similaritySearchWithScore`；`retriever.invoke` 适合接链、不需要分数时用
