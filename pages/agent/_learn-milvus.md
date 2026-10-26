## 学习向量数据库 Milvus

上一节用 `MemoryVectorStore` 把向量存在**进程内存**里，一关就没了。这一节换成专业向量库 **Milvus**：用 Docker 起服务，用 Attu / Node SDK 做增删改查，再接到 RAG，做成「AI 日记」——用自然语言做语义检索。

MySQL 擅长按 id、关键词、多表关联做**精确查询**；语义相近、说法不一样的内容，更适合进 Milvus。实践里常 **双写**：业务 CRUD 走 MySQL，向量检索走 Milvus。

示例脚本：`learnMilvus.mjs`。

```
Docker Compose 起 Milvus（etcd + minio + standalone）
        ↓
Attu / Node SDK 连接 localhost:19530
        ↓
创建 Collection（Schema）→ 建索引 → load
        ↓
日记文本 Embedding → insert
        ↓
search 语义检索
        ↓
检索结果拼 Prompt → Chat 模型回答（RAG Demo）
```

### 1. Docker 启动 Milvus

用官方 standalone compose（目录如 `F:\milvus`）：

```bash
docker compose -f .\milvus-standalone-docker-compose.yml up -d
```

会起三个容器：`etcd`（元数据）、`minio`（对象存储）、`milvus-standalone`（向量服务）。默认 gRPC 端口 **19530**。

也可用 Docker Desktop：确认 **Engine running** 后，对 **milvus** 项目点 Start，看到 `Running (3/3)` 即可。

### 2. 用 Attu 连接与查看

Attu 是官方 GUI。连上 `127.0.0.1:19530` 后，可在 **数据** 页看集合 `Ai_Diary`：主键、向量、正文、实体数量等。

![Attu 查看 Ai_Diary 集合数据](/AttuView.png)

### 3. Milvus 数据模型

层次：**Database → Collection → Entity（行）**。

Collection 必须先定 **Schema（字段结构）**。本例字段：

| 字段 | 类型 | 作用 |
|--|--|--|
| `id` | Int64，主键 | 日记 ID |
| `vector` | FloatVector，dim=1024 | 内容向量 |
| `content` | VarChar | 日记正文 |
| `date` | VarChar | 日期 |
| `mood` | VarChar | 心情 |
| `tags` | Array\<VarChar\> | 标签 |

向量字段要建 **Index** 才能高效检索；查询前还要 **loadCollection** 把集合载入内存。

### 4. 用到的库

| 库 / 符号 | 作用 |
|--|--|
| `@zilliz/milvus2-sdk-node` | Node 官方 SDK：`MilvusClient`、CRUD、search |
| `DataType` / `IndexType` / `MetricType` | 字段类型、索引类型、距离度量（如 COSINE） |
| `@langchain/openai` 的 `OpenAIEmbeddings` | 智谱 `embedding-3`，文本 → 向量 |
| `@langchain/openai` 的 `ChatOpenAI` | 聊天模型，RAG 最后生成回答 |
| `dotenv` | 读 `.env` 里的密钥与 baseURL |

SDK 参数多用 **snake_case**：`collection_name`、`data_type`、`field_name`、`metric_type` 等。

### 5. 连接客户端

```js
const milvusClient = new MilvusClient({
  address: "localhost:19530",
});

await milvusClient.connectPromise; // 等 gRPC 连上
```

`OpenAIEmbeddings` 的 `dimensions` 要和 Schema 里 `dim` 一致（这里是 1024）。

```js
async function getEmbeddings(text) {
  return embeddings.embedQuery(text);
}
```

### 6. 建库：Collection → Index → Load → Insert

`main()` 完成初始化与写入：

```js
await milvusClient.createCollection({
  collection_name: collectName, // Ai_Diary
  fields: [
    { name: "id", data_type: DataType.Int64, is_primary_key: true },
    { name: "vector", data_type: DataType.FloatVector, dim: vSize },
    { name: "content", data_type: DataType.VarChar, max_length: 1000 },
    { name: "date", data_type: DataType.VarChar, max_length: 50 },
    { name: "mood", data_type: DataType.VarChar, max_length: 50 },
    {
      name: "tags",
      data_type: DataType.Array,
      element_type: DataType.VarChar,
      max_capacity: 10,
      max_length: 50,
    },
  ],
});

await milvusClient.createIndex({
  collection_name: collectName,
  field_name: "vector",
  index_type: IndexType.FLAT,
  metric_type: MetricType.COSINE,
});

await milvusClient.loadCollection({ collection_name: collectName });

const rows = await Promise.all(
  diaryData.map(async (item) => ({
    ...item,
    vector: await getEmbeddings(item.content),
  })),
);

await milvusClient.insert({
  collection_name: collectName,
  data: rows,
});
```

相关 API：

| 方法 | 作用 |
|--|--|
| `hasCollection` / `dropCollection` | 判断 / 删除已有集合（方便重跑演示） |
| `createCollection` | 按 Schema 建集合 |
| `createIndex` | 给向量字段建索引 |
| `loadCollection` | 加载到内存，才能 search |
| `insert` | 写入实体（含向量） |

跑通日志：连接 → 建集合 → 建索引 → 加载 → 插入成功。

![建库并插入日记数据](/runMilvusDataResult.png)

### 7. 语义检索 Search

把问题也 Embedding，再 `search` Top-K：

```js
async function retrieveRelatedDiary(query, k = 2) {
  const vector = await getEmbeddings(query);
  const searchRes = await milvusClient.search({
    collection_name: collectName,
    data: vector,
    limit: k,
    metric_type: MetricType.COSINE,
    output_fields: ["id", "content", "date", "mood", "tags"],
  });
  // search 返回对象，命中列表在 results 里
  return searchRes.results ?? [];
}
```

返回示意：每条含 `score`（相似度）、`content`、`date`、`mood`、`tags`、`id`。例如问「哪天很开心」，会命中学习/聚会等相关日记。

![向量检索返回带 score 的日记](/queryMilvusResult.png)

### 8. RAG Demo：AI 日记问答

流程与前面 RAG 相同，向量库换成 Milvus：

1. `retrieveRelatedDiary` 取相关日记  
2. 拼成 `context`  
3. 写入 Prompt，调用 `ChatOpenAI`  
4. 返回自然语言回答  

```js
async function answerDiaryQuestion(query, k = 2) {
  const relatedDiary = await retrieveRelatedDiary(query, k);
  const context = relatedDiary
    .map(
      (diary, i) =>
        `日记${i + 1}：${diary.content}，日期：${diary.date}，心情：${diary.mood}，标签：${diary.tags}`,
    )
    .join("\n");

  const prompt = `
你是一个日记助手，根据以下日记内容回答用户的问题：
${context}
用户的问题：${query}
...
`;

  const answer = await model.invoke(prompt);
  return answer.content;
}
```

问「最近我做了什么让我开心的事？」时：先检索到聚会、工作等条目，再由模型整理成温暖回答。

![Milvus + RAG 日记问答 Demo](/milvusWithRag.png)

### 9. MySQL vs Milvus（怎么选）

| | MySQL | Milvus |
|--|--|--|
| 擅长 | id、关键词、多表 JOIN、精确条件 | 向量相似度、自然语言语义检索 |
| 典型问法 | `WHERE date = '2026-01-04'` | 「哪天很开心？」「最近开心的事」 |
| 本项目 | 可存日记原文与业务字段 | 存向量，负责「找相关片段」 |

生产常见做法：**双写**——写日记时 MySQL 存结构化数据，同时 Embedding 写入 Milvus；问答时用 Milvus 检索，需要精确过滤再回 MySQL。

### 这一节要记住的

1. Docker 起 standalone → `localhost:19530`；Attu 可看数据  
2. 模型：**Database → Collection（Schema）→ Entity**；向量要 **Index + Load**  
3. Node SDK：`createCollection` → `createIndex` → `loadCollection` → `insert` → `search`  
4. `search` 的命中在 `.results`；再拼 Prompt 就是 RAG  
5. 精确查询用 MySQL，语义检索用 Milvus，实践中常双写

```ts
import "dotenv/config";
import {
  MilvusClient,
  DataType,
  MetricType,
  IndexType,
} from "@zilliz/milvus2-sdk-node";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

const collectName = "Ai_Diary";
const vSize = 1024;

// 初始化大模型
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 初始化OpenAI Embeddings
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "embedding-3",
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  dimensions: vSize,
});

const milvusClient = new MilvusClient({
  // address: process.env.MILVUS_HOST,
  // port: process.env.MILVUS_PORT,
  // username: process.env.MILVUS_USERNAME,
  // password: process.env.MILVUS_PASSWORD,
  address: "localhost:19530",
});

async function getEmbeddings(text) {
  return embeddings.embedQuery(text);
}

// 模拟日记
const diaryData = [
  {
    id: 1,
    content: "今天天气很好，我去公园散步，心情愉快，春天很美好",
    date: "2026-01-01",
    mood: "Happy",
    tags: ["春天", "公园", "散步", "心情愉快"],
  },
  {
    id: 2,
    content: "今天天气很差，我去公园散步，心情很差，春天很糟糕",
    date: "2026-01-02",
    mood: "Bad",
    tags: ["春天", "公园", "散步", "心情很差"],
  },
  {
    id: 3,
    content: "今天工作很忙，完成了一个项目，团队合作很愉快",
    date: "2026-01-03",
    mood: "Happy",
    tags: ["工作", "项目", "团队合作", "心情愉快"],
  },
  {
    id: 4,
    content: "今天去和朋友聚会，喝了点酒，很开心",
    date: "2026-01-04",
    mood: "Happy",
    tags: ["聚会", "喝酒", "开心", "心情愉快"],
  },
  {
    id: 5,
    content: "今天学习了唐诗三百首，很开心",
    date: "2026-01-05",
    mood: "Happy",
    tags: ["学习", "唐诗三百首", "开心", "心情愉快"],
  },
];

async function main() {
  try {
    console.log("Connecting to Milvus...");
    await milvusClient.connectPromise;
    console.log("Connected to Milvus");
    // SDK 使用 snake_case：collection_name / data_type / dim / element_type
    const hasCollection = await milvusClient.hasCollection({
      collection_name: collectName,
    });
    if (hasCollection.value) {
      await milvusClient.dropCollection({ collection_name: collectName });
      console.log("Old collection dropped");
    }

    await milvusClient.createCollection({
      collection_name: collectName,
      fields: [
        {
          name: "id",
          data_type: DataType.Int64,
          description: "ID",
          is_primary_key: true,
        },
        {
          name: "vector",
          data_type: DataType.FloatVector,
          description: "Vector",
          dim: vSize,
        },
        {
          name: "content",
          data_type: DataType.VarChar,
          description: "Content",
          max_length: 1000,
        },
        {
          name: "date",
          data_type: DataType.VarChar,
          description: "Date",
          max_length: 50,
        },
        {
          name: "mood",
          data_type: DataType.VarChar,
          description: "Mood",
          max_length: 50,
        },
        {
          name: "tags",
          data_type: DataType.Array,
          element_type: DataType.VarChar,
          max_capacity: 10,
          max_length: 50,
          description: "Tags",
        },
      ],
    });
    console.log("Collection created");

    // 创建索引
    await milvusClient.createIndex({
      collection_name: collectName,
      field_name: "vector",
      index_type: IndexType.FLAT,
      metric_type: MetricType.COSINE,
      params: {
        nlist: 1024,
      },
    });
    console.log("Index created");

    // 加载集合
    await milvusClient.loadCollection({
      collection_name: collectName,
    });
    console.log("Collection loaded");

    // 插入日记数据（勿再用同名 const 遮蔽外层 diaryData）
    const rows = await Promise.all(
      diaryData.map(async (item) => {
        const vector = await getEmbeddings(item.content);
        return {
          ...item,
          vector,
        };
      }),
    );

    await milvusClient.insert({
      collection_name: collectName,
      data: rows,
    });
    console.log("Data inserted");
  } catch (error) {
    console.error(error);
  }
}

// 查询
// async function search(query) {
//   try {
//     // 连接到 Milvus
//     console.log("Connecting to Milvus...");
//     await milvusClient.connectPromise;
//     console.log("Connected to Milvus");
//     // 查询
//     const query = "喝酒是哪天？";
//     console.log(`Querying... :${query}`);
//     const vector = await getEmbeddings(query);
//     const results = await milvusClient.search({
//       collection_name: collectName,
//       data: vector,
//       limit: 2,
//       metric_type: MetricType.COSINE,
//       output_fields: ["id", "content", "date", "mood", "tags"],
//     });
//     console.log("Search results:", results);
//     results.forEach((result) => {
//       console.log(`ID: ${result.id}`);
//       console.log(`Content: ${result.content}`);
//       console.log(`Date: ${result.date}`);
//       console.log(`Mood: ${result.mood}`);
//       console.log(`Tags: ${result.tags}`);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
// search();

// 检索相关日记：search 返回的是对象，命中列表在 .results 里
async function retrieveRelatedDiary(query, k = 2) {
  console.log(`Querying... :${query}`);
  const vector = await getEmbeddings(query);
  const searchRes = await milvusClient.search({
    collection_name: collectName,
    data: vector,
    limit: k,
    metric_type: MetricType.COSINE,
    output_fields: ["id", "content", "date", "mood", "tags"],
  });
  console.log("Search results:", searchRes);
  return searchRes.results ?? [];
}

// 使用 RAG 回答日记问题
async function answerDiaryQuestion(query, k = 2) {
  try {
    const relatedDiary = await retrieveRelatedDiary(query, k);
    console.log("Related diary:", relatedDiary);
    if (!relatedDiary.length) {
      return "没有找到相关日记";
    }

    relatedDiary.forEach((result) => {
      console.log(`ID: ${result.id}`);
      console.log(`Content: ${result.content}`);
      console.log(`Date: ${result.date}`);
      console.log(`Mood: ${result.mood}`);
      console.log(`Tags: ${result.tags}`);
    });

    const context = relatedDiary
      .map((diary, i) => {
        return `日记${i + 1}：${diary.content}，日期：${diary.date}，心情：${diary.mood}，标签：${diary.tags}`;
      })
      .join("\n");
    // console.log("Context:", context);

    const prompt = `
你是一个日记助手，根据以下日记内容回答用户的问题：
${context}
用户的问题：${query}
回答要求：
1. 如果日记中有相关信息，请结合日记给出详细、温暖的回答；
2. 如果日记中没有相关信息，请礼貌说明找不到；
3. 用“你”称呼日记作者；
4. 回答要有同理心、亲切。
`;

    const answer = await model.invoke(prompt);
    return answer.content;
  } catch (error) {
    console.error(error);
    return "回答失败，请稍后重试";
  }
}

async function run() {
  try {
    console.log("Connecting to Milvus...");
    await milvusClient.connectPromise;
    console.log("Connected to Milvus");

    // 查询前确保集合已加载到内存
    await milvusClient.loadCollection({ collection_name: collectName });

    const answer = await answerDiaryQuestion("最近我做了什么让我开心的事？");
    console.log("Answer:", answer);
  } catch (error) {
    console.error(error);
  }
}
run();
```
