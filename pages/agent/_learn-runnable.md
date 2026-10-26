## Runnable / LCEL：把写逻辑变成组装 Chain

前面几篇是「零件」：

- **Prompt Template**：管输入长什么样  
- **StructuredOutputParser**：管输出怎么解析（`getFormatInstructions()` 生成给模型看的格式说明）  
- **Memory / MessagesPlaceholder**：管历史怎么嵌进对话  

这一篇是「流水线」：用 **Runnable** 把零件声明式拼成 chain。这种写法叫 **LCEL**（LangChain Expression Language）。

脚本：`learnRunnable.mjs`。

### 统一接口：invoke / stream / batch

几乎所有 Runnable（Prompt、Model、Parser、自定义 Lambda…）都支持：

| 方法 | 含义 |
|--|--|
| `invoke` | 跑一次，等整条链出最终结果 |
| `stream` | 边跑边吐增量（适合打字机效果） |
| `batch` | 多条输入并发（多个独立 invoke） |

```
输入
  → step1.invoke
  → step2.invoke
  → …
  → 最终输出
```

`chain.invoke(x)` ≈ 依次调用链上每个组件的 `invoke`，上一步输出是下一步输入。

---

### 从命令式到声明式

以前（Prompt + 模型 + 结构化解析）要手写三步：

```js
const question = await prompt.format({
  person: "爱因斯坦",
  format_instructions: parser.getFormatInstructions(),
});
const response = await model.invoke(question);
const result = await parser.parse(response.content);
```

用 `RunnableSequence` 声明成一条链：

```js
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const chain = RunnableSequence.from([
  prompt,                  // { person, format_instructions } → 字符串
  model,                   // 字符串 → AIMessage
  new StringOutputParser(),// AIMessage → string（parser 要吃字符串）
  parser,                  // string → 结构化对象
]);

const result = await chain.invoke({
  person: "爱因斯坦",
  format_instructions: parser.getFormatInstructions(),
});
```

等价的 `.pipe()` 写法：

```js
const chain = prompt.pipe(model).pipe(new StringOutputParser()).pipe(parser);
```

`getFormatInstructions()` 仍是结构化输出那一套：根据 schema 生成「请按此 JSON Schema 输出」的说明文字，塞进 Prompt 占位符。

用 `RunnablePassthrough.assign` 可自动注入，调用方只传业务字段：

```js
const chain = RunnableSequence.from([
  RunnablePassthrough.assign({
    format_instructions: () => parser.getFormatInstructions(),
  }),
  prompt,
  model,
  new StringOutputParser(),
  parser,
]);

await chain.invoke({ person: "居里夫人" });
```

---

### API 一览

| API | 一句话 |
|--|--|
| `RunnableSequence` / `.pipe()` | 串行流水线 |
| `RunnableLambda` | 任意函数 → Runnable |
| `RunnableMap`（Parallel） | 同一输入并行多步，合成对象 |
| `RunnableBranch` | 按条件 if / else if / else |
| `RouterRunnable` | 按 `key` 显式路由 |
| `RunnableEach` | 数组逐项跑同一 Runnable |
| `RunnablePassthrough` | 透传；`.assign` 追加字段 |
| `RunnablePick` | 只保留对象里指定 key |
| `RunnableWithMessageHistory` | 给 chain 自动挂会话历史 |

---

### 1. RunnableLambda：函数变 Runnable

```js
const toUpper = RunnableLambda.from((text) => text.toUpperCase());
const addLen = RunnableLambda.from((text) => ({
  text,
  length: text.length,
}));

await toUpper.pipe(addLen).invoke("hello lcel");
// { text: 'HELLO LCEL', length: 10 }
```

**用处**：清洗输入、拼字段、接第三方逻辑，都能进 LCEL。

---

### 2. RunnableMap：并行扇出再合并

同一份输入同时进多条支路，结果合成一个对象（也叫 `RunnableParallel`）。

```js
const chain = RunnableMap.from({
  upper: RunnableLambda.from((s) => s.toUpperCase()),
  reverse: RunnableLambda.from((s) => s.split("").reverse().join("")),
  length: RunnableLambda.from((s) => s.length),
});

await chain.invoke("LangChain");
// { upper: 'LANGCHAIN', reverse: 'niahCgnaL', length: 9 }
```

**用处**：同时做「检索 + 改写问题 + 取元数据」等互不依赖的步骤。

---

### 3. RunnableBranch：条件分支

按条件依次判断，命中就走对应分支；都不中走默认（最后一项）。

```js
const branch = RunnableBranch.from([
  [(x) => x.topic.includes("周报"), (x) => `【周报助手】${x.question}`],
  [(x) => x.topic.includes("代码"), (x) => `【代码助手】${x.question}`],
  (x) => `【通用助手】${x.question}`, // default
]);
```

**用处**：意图分类后走不同子链（周报 / 代码 / 闲聊）。

---

### 4. RouterRunnable：按 key 路由

和 Branch 不同：**调用方自己指定**走哪条，不在内部猜条件。

```js
const router = new RouterRunnable({
  runnables: {
    upper: RunnableLambda.from((text) => text.toUpperCase()),
    reverse: RunnableLambda.from((text) =>
      text.split("").reverse().join(""),
    ),
  },
});

await router.invoke({ key: "upper", input: "Hello" });   // HELLO
await router.invoke({ key: "reverse", input: "Hello" }); // olleH
```

| | RunnableBranch | RouterRunnable |
|--|--|--|
| 谁决定走哪条 | 链内条件函数 | 调用方传 `key` |
| 输入形态 | 业务对象 | `{ key, input }` |

---

### 5. RunnableEach：批量逐项

对数组每一项跑同一个 Runnable，返回等长数组。

```js
const each = new RunnableEach({
  bound: RunnableLambda.from((s) => s.toUpperCase()),
});

await each.invoke(["a", "bc", "def"]); // ['A', 'BC', 'DEF']
```

**用处**：多文档摘要、多条候选统一后处理。

---

### 6. RunnablePassthrough：透传与 assign

```js
// 透传：输入即输出
await new RunnablePassthrough().invoke({ a: 1, b: 2 });

// assign：保留原字段，并行算新字段再合并
const withAssign = RunnablePassthrough.assign({
  upper: (input) => input.text.toUpperCase(),
  length: (input) => input.text.length,
});

await withAssign.invoke({ text: "hi", user: "qiuyi" });
// { text: 'hi', user: 'qiuyi', upper: 'HI', length: 2 }
```

**用处**：在链中段「原样往下传」的同时挂上 `format_instructions`、检索结果等。

---

### 7. RunnablePick：只留需要的字段

常接在 `Map` / `assign` 后面，把多余字段丢掉，避免污染下一步 Prompt。

```js
const chain = RunnableSequence.from([
  RunnablePassthrough.assign({
    upper: (input) => input.text.toUpperCase(),
    reverse: (input) => input.text.split("").reverse().join(""),
    length: (input) => input.text.length,
  }),
  new RunnablePick(["upper", "length"]),
]);

await chain.invoke({ text: "abc" }); // { upper: 'ABC', length: 3 }
```

---

### 8. RunnableWithMessageHistory：Chain + 会话历史

把 Memory 挂到 LCEL 上：自动把历史塞进 `MessagesPlaceholder`，并把本轮 human / ai 写回 store。

```js
const promptWithHistory = ChatPromptTemplate.fromMessages([
  ["system", "你是助手，回答简短。结合历史对话回答。"],
  new MessagesPlaceholder("history"),
  ["human", "{question}"],
]);

const chain = promptWithHistory.pipe(model).pipe(new StringOutputParser());

const store = {};
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (!store[sessionId]) {
      store[sessionId] = new InMemoryChatMessageHistory();
    }
    return store[sessionId];
  },
  inputMessagesKey: "question",
  historyMessagesKey: "history",
});

const cfg = { configurable: { sessionId: "demo-session" } };
await chainWithHistory.invoke({ question: "我叫小明" }, cfg);
await chainWithHistory.invoke({ question: "我叫什么？" }, cfg);
// 第二轮能答出「小明」
```

要点：

- 必须传 `configurable.sessionId`，用来区分会话  
- Prompt 里要有与 `historyMessagesKey` 同名的 `MessagesPlaceholder`  
- 官方已偏推荐 LangGraph 持久化；学习/小项目用这个仍然直观  

和 Memory 笔记的关系：那边是手拼 `[system, ...history, human]`；这里是同一套路的 **Runnable 封装**。

---

### 怎么选

| 场景 | 用 |
|--|--|
| Prompt → Model → Parser 串起来 | `RunnableSequence` / `.pipe()` |
| 自定义一小步变换 | `RunnableLambda` |
| 多路并行再合并 | `RunnableMap` |
| 按意图走不同子链 | `RunnableBranch` |
| 上游已算好路由名 | `RouterRunnable` |
| 列表逐条处理 | `RunnableEach` |
| 保留输入并追加字段 | `RunnablePassthrough.assign` |
| 裁剪字段给下一步 | `RunnablePick` |
| 多轮对话自动带历史 | `RunnableWithMessageHistory` |

常见骨架：

```
RunnablePassthrough.assign({ …补充字段 })
  → Prompt / ChatPrompt（可含 MessagesPlaceholder）
  → Model
  → StringOutputParser / StructuredOutputParser
```
