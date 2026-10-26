## 实战：Milvus + RAG 电子书助手

上一节用短日记演示了 Milvus 存向量 + RAG。这一节换成**真实 EPUB**：加载《蛊真人》、只取前 30 章做 demo，按章再切块、写入集合 `Ai_Ebook`，再用自然语言提问。

示例脚本：`milvusRag.mjs`。书籍文件放在项目目录：`《蛊真人》+作者：蛊真人.epub`。

### 核心思想

| 点 | 说明 |
|--|--|
| 为何不能整本塞 Prompt | 上下文窗口有限，且噪声大；要先检索相关片段 |
| 为何先按章再切块 | 一章仍太长；保留 `chapterName` 方便溯源，块内再用 Splitter |
| 为何只要前 30 章 | demo 控制 Embedding 成本与耗时；全书 2000+ 章可同样扩 |
| 和日记 Demo 的差别 | 数据源从手写数组 → EPubLoader；Schema 增加书/章元数据 |

```
EPUB
  ↓ EPubLoader(splitChapters)
按章 Document[]（demo: 前 30 章）
  ↓ RecursiveCharacterTextSplitter
小块（约 143 chunks）
  ↓ embedDocuments + insert → Milvus Ai_Ebook
用户问题
  ↓ Embedding + search(filter bookid)
Top-K 片段拼 Prompt
  ↓ ChatOpenAI
回答（禁止编造未索引剧情）
```

### 用到的库

| 库 | 作用 |
|--|--|
| `@zilliz/milvus2-sdk-node` | `MilvusClient`：建集合、索引、插入、检索 |
| `@langchain/community/.../epub` | `EPubLoader`：EPUB → 按章 `Document` |
| `epub2` / `html-to-text` | EPubLoader 依赖 |
| `@langchain/textsplitters` | `RecursiveCharacterTextSplitter` |
| `@langchain/openai` | `OpenAIEmbeddings` + `ChatOpenAI` |

### 1. 配置与连接

```js
const COLLECTION = "Ai_Ebook";
const BOOK_ID = "guzhenren";
const BOOK_NAME = "蛊真人";
const V_SIZE = 1024;
const MAX_CHAPTERS = 30;
const SEARCH_K = 4;
const FORCE_INGEST = process.env.FORCE_INGEST === "1";

const milvusClient = new MilvusClient({ address: "localhost:19530" });
```

- `BOOK_ID`：灌库与检索时用 `filter` 限定本书，一套集合可多书共存  
- `FORCE_INGEST=1`：强制删掉该书旧数据再灌；默认已有数据则跳过  

解析 epub 路径时优先固定文件名，找不到再扫目录下任意 `.epub`（避免中文文件名编码坑）。

### 2. 确保集合存在：Schema → Index → Load

字段设计：

| 字段 | 类型 | 作用 |
|--|--|--|
| `id` | Int64 主键 | 分块唯一 ID |
| `bookid` | VarChar | 书籍 ID，检索过滤 |
| `bookName` | VarChar | 书名 |
| `chapterName` | VarChar | 章节名（溯源） |
| `index` | Int64 | 分块序号 |
| `content` | VarChar(4000) | 分块正文 |
| `vector` | FloatVector dim=1024 | 正文向量 |

```js
async function ensureCollection() {
  await milvusClient.connectPromise;

  const exists = await milvusClient.hasCollection({
    collection_name: COLLECTION,
  });

  if (!exists.value) {
    await milvusClient.createCollection({
      collection_name: COLLECTION,
      fields: [
        { name: "id", data_type: DataType.Int64, is_primary_key: true },
        { name: "bookid", data_type: DataType.VarChar, max_length: 64 },
        { name: "bookName", data_type: DataType.VarChar, max_length: 128 },
        { name: "chapterName", data_type: DataType.VarChar, max_length: 256 },
        { name: "index", data_type: DataType.Int64 },
        { name: "content", data_type: DataType.VarChar, max_length: 4000 },
        { name: "vector", data_type: DataType.FloatVector, dim: V_SIZE },
      ],
    });
  }

  await milvusClient.createIndex({
    collection_name: COLLECTION,
    field_name: "vector",
    index_type: IndexType.FLAT,
    metric_type: MetricType.COSINE,
  });

  await milvusClient.loadCollection({ collection_name: COLLECTION });
}
```

思想：**先有 Schema，再索引，再 load**；查询前集合必须在内存中。

### 3. 加载 EPUB：按章 → 限 30 章 → 再切块

```js
async function loadAndSplitEpub(epubPath) {
  const loader = new EPubLoader(epubPath, { splitChapters: true });
  const chapters = await loader.load();
  const limited = chapters.slice(0, MAX_CHAPTERS);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 80,
    separators: ["\n\n", "\n", "。", "！", "？", "；", " ", ""],
  });

  const docs = [];
  for (let ci = 0; ci < limited.length; ci++) {
    const chapter = limited[ci];
    const chapterName =
      chapter.metadata?.chapter || `第${ci + 1}章`;
    const chunks = await splitter.splitDocuments([chapter]);
    for (const chunk of chunks) {
      docs.push({
        chapterName: String(chapterName).slice(0, 250),
        content: chunk.pageContent,
      });
    }
  }
  return docs;
}
```

实际跑通日志：

```
Chapters total=2354, use first 30 for demo
Split into 143 chunks
```

两层切分的意义：

1. **按章**：元数据带章节名，回答时可引用「出自第×节」  
2. **按字符块**：控制单块长度，检索粒度更细、Embedding 更稳  

### 4. 批量向量化并插入

```js
const vectors = await embeddings.embedDocuments(
  slice.map((d) => d.content),
);

const rows = slice.map((d, j) => ({
  id: idBase + i + j,
  bookid: BOOK_ID,
  bookName: BOOK_NAME,
  chapterName: d.chapterName,
  index: i + j,
  content: d.content.slice(0, 3900),
  vector: vectors[j],
}));

await milvusClient.insert({ collection_name: COLLECTION, data: rows });
```

要点：

- 用 `embedDocuments` **批量** Embedding，比一条条 `embedQuery` 高效  
- 每批约 16 条，边 embed 边 insert  
- 结束后 `flushSync` + 再 `loadCollection`，保证立刻可搜  
- 二次运行：`query` 发现该 `bookid` 已有数据则跳过灌库  

### 5. 检索 + RAG 问答

```js
async function retrieveChunks(query, k = SEARCH_K) {
  const vector = await getEmbeddings(query);
  const searchRes = await milvusClient.search({
    collection_name: COLLECTION,
    data: vector,
    limit: k,
    filter: `bookid == "${BOOK_ID}"`,
    metric_type: MetricType.COSINE,
    output_fields: ["id", "bookName", "chapterName", "index", "content"],
  });
  return searchRes.results ?? [];
}

async function answerQuestion(query, k = SEARCH_K) {
  const hits = await retrieveChunks(query, k);
  const context = hits
    .map((h, i) => `片段${i + 1}（章节：${h.chapterName}）：\n${h.content}`)
    .join("\n\n");

  const prompt = `
你是《${BOOK_NAME}》电子书助手。请只根据下列原文片段回答。
若片段中没有答案，请说「根据已索引的前${MAX_CHAPTERS}章内容无法确定」，不要编造。

【原文片段】
${context}

【用户问题】
${query}
`;

  const res = await model.invoke(prompt);
  return res.content;
}
```

- `filter: bookid == "..."`：多书共集合时只搜本书  
- Prompt 明确「只根据片段 + 未覆盖章节勿编造」→ 压幻觉  

### 6. 跑通结果

![切分后的 Document chunks（可见 overlap）](/epubMilvus.png)

```bash
node .\milvusRag.mjs "方源是谁？"
```

**检索层**（Top-4，带章节）：

```
Question: 方源是谁？
[1] score=0.5420 chapter=第九节 渐行渐远
[2] score=0.5358 chapter=第二十节 学堂家老无语了
[3] score=0.5323 chapter=第二十节 学堂家老无语了
[4] score=0.5315 chapter=第四节 古月方源！
```

**生成层**（摘要）：模型根据片段回答——方源是古月家族主角、孪生弟弟方正、丙等资质却炼化月光蛊夺魁、重生者、与舅父舅母围绕遗产博弈等，并能标出章节来源。

入口：

```bash
# 默认问题
node .\milvusRag.mjs

# 自定义问题
node .\milvusRag.mjs "月光蛊是什么？"

# 强制重新灌前 30 章
# PowerShell:
$env:FORCE_INGEST="1"; node .\milvusRag.mjs "方源是谁？"
```

### 和前面各节怎么串起来

| 能力 | 来自哪一节 | 本实战怎么用 |
|--|--|--|
| Embedding + 拼 Prompt | RAG 笔记 | 检索后生成答案 |
| Loader + Splitter | Loader/Splitter 笔记 | EPubLoader + Recursive 切块 |
| Milvus Schema/Index/Search | Milvus 笔记 | 持久化向量库 + filter |

日记 Demo 证明「短文本 + Milvus」；电子书助手证明「长文档两级切分 + 元数据过滤 + RAG」同一套路可上生产形态的知识库问答。

### 这一节要记住的

1. 长书：**按章保留元数据 → 再按 chunk 切 → 向量入库**  
2. demo 用 `MAX_CHAPTERS` 控成本；检索用 `bookid` filter  
3. 批量 `embedDocuments` + 分批 `insert`；已有数据可跳过灌库  
4. Prompt 约束「只依据已索引片段」，避免模型补全书剧情  
5. `search` 命中在 `.results`，上下文里带上 `chapterName` 便于引用
