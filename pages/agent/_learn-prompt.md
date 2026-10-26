## Prompt Template：组件化管理 Prompt

把 Prompt 写成一长串硬编码字符串很难维护：人设、背景、任务、格式搅在一起，改一处容易牵全身。  
LangChain 的 Prompt Template 做的事就是：**模板 + 变量填充**，并按场景拆成「字符串模板 / 聊天消息模板 / Few-shot / 动态示例选择」。

脚本：`learnPrompt.mjs`（文末注释切换各个 demo）。

```
PromptTemplate              → 单字符串，{var} 填充
PipelinePromptTemplate      → 多段子模板拼成最终字符串
ChatPromptTemplate          → 产出 Message[]（system / human / ai）
Message*PromptTemplate      → 单条消息模板，再组进 ChatPrompt
MessagesPlaceholder         → 预留动态消息槽（如 history）
FewShotPromptTemplate       → 把示例拼进 Prompt
ExampleSelector             → 动态挑选要拼哪些示例
```

| API | 产出 | 典型用途 |
|--|--|--|
| `PromptTemplate` | `string` | 简单补全、非 Chat 场景 |
| `PipelinePromptTemplate` | `string` | 人设 / 背景 / 任务 / 格式拆分再组合 |
| `ChatPromptTemplate` | `Message[]` | Chat 模型主流写法 |
| `System/HumanMessagePromptTemplate` | 单条 Message | 模块化声明角色与用户内容 |
| `MessagesPlaceholder` | 展开多条 Message | 注入对话历史 |
| `FewShotPromptTemplate` | `string` | 固定或动态 few-shot |
| `LengthBasedExampleSelector` | 选 examples | 按长度预算塞示例 |
| `SemanticSimilarityExampleSelector` | 选 examples | 按语义相似度挑示例 |

约定：

- `format` → 字符串；`formatMessages` → `BaseMessage[]`，可直接 `model.invoke` / `stream`
- Chat 模型优先用 `ChatPromptTemplate` + `formatMessages`，别再手拼一整段再当 user 扔进去（除非刻意）

---

### 1. PromptTemplate：最基础的字符串模板

```js
import { PromptTemplate } from "@langchain/core/prompts";

const tpl = PromptTemplate.fromTemplate(
  `公司：{company}\n部门：{department}\n请写周报`,
);
const prompt = await tpl.format({
  company: "深圳XX科技有限公司",
  department: "研发部",
});
// → 纯字符串，可 model.stream(prompt)
```

`{变量名}` 就是输入位；`format` 时传入同名对象即可。

---

### 2. PipelinePromptTemplate：拆分再组合

大 Prompt 建议按职责切开，例如周报场景：**人设 / 背景 / 任务 / 格式**，最后用 `finalPrompt` 拼起来。

```js
const personaPrompt = PromptTemplate.fromTemplate(
  `你是一名严谨不失人情味的团队负责人…`,
);
const backgroundPrompt = PromptTemplate.fromTemplate(
  `公司名称：{company}\n部门：{department}\n…\n本周进度：{week_progress}`,
);
const taskPrompt = PromptTemplate.fromTemplate(`任务：写一份给老板的团队周报…`);
const formatPrompt = PromptTemplate.fromTemplate(
  `输出格式：Markdown、summary、表格…`,
);

const finalPrompt = PromptTemplate.fromTemplate(
  `{persona}\n\n{background}\n\n{task}\n\n{format}`,
);

const pipelinePrompt = new PipelinePromptTemplate({
  pipelinePrompts: [
    { name: "persona", prompt: personaPrompt },
    { name: "background", prompt: backgroundPrompt },
    { name: "task", prompt: taskPrompt },
    { name: "format", prompt: formatPrompt },
  ],
  finalPrompt,
});

// 只需传「叶子模板」里的变量；pipeline 会先填子段，再填进 final
const prompt = await pipelinePrompt.format(weekReportVars);
```

**用处**：组件化管理——改格式不影响人设；复用 background 段到别的任务；长 Prompt 可读、可测。

---

### 3. ChatPromptTemplate.fromMessages + formatMessages

Chat 模型吃的是 **消息列表**，不是单字符串。`fromMessages` 用 role + 模板声明结构，`formatMessages` 填充变量得到 `Message[]`。

```js
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", `你是团队负责人…\n输出格式要求：…`],
  [
    "human",
    `请写周报。\n公司：{company}\n部门：{department}\n…\n进度：{week_progress}`,
  ],
]);

const messages = await chatPrompt.formatMessages(weekReportVars);
// [SystemMessage, HumanMessage]
await model.stream(messages);
```

**用处**：对齐 Chat API 的 system / user / assistant 角色；人设放 system，业务变量放 human，边界清晰。

---

### 4. SystemMessagePromptTemplate / HumanMessagePromptTemplate

和例子 3 等价，只是把 `["system", "..."]` 写成显式对象，方便单独 `format`、复用、单元测试。

```js
const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
  `你是团队负责人…输出格式…`,
);
const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
  `公司：{company}\n…\n进度：{week_progress}`,
);

// 单独 format → 一条 SystemMessage / HumanMessage
const systemMessage = await systemMessagePrompt.format({});

const chatPrompt = ChatPromptTemplate.fromMessages([
  systemMessagePrompt,
  humanMessagePrompt,
]);
const messages = await chatPrompt.formatMessages(weekReportVars);
```

**用处**：消息级组件化；system / human 可在多条链路间复用。还有 `AIMessagePromptTemplate`（few-shot 里模拟助手回复）。

---

### 5. MessagesPlaceholder：动态消息槽

模板里预留一个「洞」，`formatMessages` 时塞进一整段 `Message[]`（最常见是 **chat history**）。

```js
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "你是团队助理，请结合对话历史简洁回答。"],
  new MessagesPlaceholder("history"), // 可传 { optional: true }
  ["human", "{question}"],
]);

const messages = await chatPrompt.formatMessages({
  history: [
    new HumanMessage("我们部门是研发部，汇报对象是张三。"),
    new AIMessage("好的，已记住…"),
    // …
  ],
  question: "请用一句话复述：部门、汇报对象、本周目标？",
});
// → [system, ...history 展开, 当前 human]
```

**用处**：把 Memory 取出的历史嵌进固定模板，而不用手拼数组顺序。和 Memory 笔记里的 `[system, ...history, human]` 是同一套路，只是模板化了。

---

### 6. FewShotPromptTemplate：示例驱动

把若干 input/output 样例拼进 Prompt，引导模型按同样格式回答（few-shot）。

```js
const examples = [
  { emotion: "高兴", synonym: "开心" },
  { emotion: "悲伤", synonym: "难过" },
  { emotion: "愤怒", synonym: "生气" },
];

const examplePrompt = PromptTemplate.fromTemplate(
  "情绪：{emotion}\n近义词：{synonym}",
);

const fewShotPrompt = new FewShotPromptTemplate({
  examples,           // 固定示例；或改用 exampleSelector 动态选
  examplePrompt,      // 单条示例怎么渲染
  prefix: "请把情绪词改写成近义词，严格按示例格式输出。",
  suffix: "情绪：{emotion}\n近义词：",
  inputVariables: ["emotion"],
  exampleSeparator: "\n\n",
});

const prompt = await fewShotPrompt.format({ emotion: "焦虑" });
```

拼出来的结构大致是：

```
prefix
示例1
示例2
…
suffix（含当前输入）
```

**用处**：格式约束、风格对齐、小样本教任务；示例多了再上 ExampleSelector，避免撑爆上下文。

---

### 7. LengthBasedExampleSelector：按长度预算选示例

示例太多时，按「累计长度上限」从前到后塞，超了就停。

```js
import { LengthBasedExampleSelector } from "@langchain/core/example_selectors";

const exampleSelector = await LengthBasedExampleSelector.fromExamples(
  examples,
  {
    examplePrompt,
    maxLength: 40,                      // 长度预算
    getTextLength: (text) => text.length, // 中文建议按字符数
  },
);

const fewShotPrompt = new FewShotPromptTemplate({
  exampleSelector, // 替代固定 examples
  examplePrompt,
  prefix: "…",
  suffix: "情绪：{emotion}\n近义词：",
  inputVariables: ["emotion"],
});
```

`maxLength` 放宽（如 200）会多塞进一些示例——用预算控制 few-shot 体积。

**用处**：上下文紧张时优先保证「能塞下」；不关心语义相关性，只关心长度。

---

### 8. SemanticSimilarityExampleSelector：按语义选示例

用 embedding + 向量库，从示例库里挑和**当前输入最相似**的 k 条，再交给 `FewShotPromptTemplate`。

```js
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  examples,
  embeddings,          // OpenAIEmbeddings 等
  MemoryVectorStore,   // 也可用 Milvus 等
  {
    k: 2,                    // 取最相似的 2 条
    inputKeys: ["emotion"],  // 只用这些字段做检索，避免 synonym 干扰
  },
);

// query「累坏了」→ 常会选到「疲惫」「紧张」这类语义近邻
const selected = await exampleSelector.selectExamples({ emotion: "累坏了" });

const fewShotPrompt = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: "…",
  suffix: "情绪：{emotion}\n近义词：",
  inputVariables: ["emotion"],
});
```

**用处**：示例库很大时，只注入「和本题相关」的 few-shot，比全量或纯按长度更有效。代价是要调 embedding API、维护向量库。

---

### 怎么选：一张决策表

| 场景 | 推荐 |
|--|--|
| 简单补全 / 非 Chat | `PromptTemplate` |
| 长 Prompt 要拆人设/任务/格式 | `PipelinePromptTemplate` |
| Chat 模型、多角色 | `ChatPromptTemplate` + `formatMessages` |
| system/human 要单独复用 | `System/HumanMessagePromptTemplate` |
| 要嵌对话历史 | `MessagesPlaceholder` |
| 要示范格式 / 风格 | `FewShotPromptTemplate` |
| 示例多、怕超上下文 | `LengthBasedExampleSelector` |
| 示例多、要相关 | `SemanticSimilarityExampleSelector` |

实践上常见组合：

```
ChatPromptTemplate
  ├─ system（人设 + 格式）
  ├─ MessagesPlaceholder("history")   ← Memory
  └─ human（当前问题）

或：

FewShotPromptTemplate
  ├─ exampleSelector（Length / Semantic）
  └─ 再把结果当 human 内容，或继续塞进 ChatPrompt
```
