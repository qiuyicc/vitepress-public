## 结构化输出：Output Parser 与 Tool

大模型默认吐的是**自然语言字符串**。业务里常要 JSON / XML 等固定结构，方便入库、渲染、调接口。两条主路：

| 路线 | 思路 | 典型 API |
|--|--|--|
| **Output Parser** | Prompt 里写格式说明 → 模型按格式生成文本 → 本地 `parse` | `JsonOutputParser`、`StructuredOutputParser`、`XMLOutputParser` |
| **Tool / Structured Output** | 用 function calling，参数本身就是结构化对象 | `tool` + `bindTools`、`withStructuredOutput` |

脚本：`learnStructor.mjs`。

```
Prompt + getFormatInstructions()  ──►  模型文本  ──►  parser.parse / stream
tool schema / withStructuredOutput ──►  tool_calls.args（更稳）
流式展示 / XML 等非 JSON            ──►  仍要靠 Output Parser
```

约定：`parse` 要 **字符串**（如 `response.content`），且多为 **async**，需 `await`。

---

### 1. JsonOutputParser：通用 JSON

在 Prompt 里要求返回 JSON，再 `parse`：

```js
import { JsonOutputParser } from "@langchain/core/output_parsers";

const parser = new JsonOutputParser();
const question = `请介绍爱因斯坦，以 JSON 返回字段 name、age…
${parser.getFormatInstructions()}
`;

const response = await model.invoke(question);
const result = await parser.parse(response.content);
// ❌ parser.parse(response) 会报 s.trim is not a function
```

`getFormatInstructions()` / `parse()` 就是 Output Parser 的基本闭环。

---

### 2. StructuredOutputParser：带字段描述的结构

可以按「字段名 → 描述」建 schema，或用 **Zod**：

```js
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// 不要写 new：fromXxx 是静态工厂
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  name: "姓名",
  age: "年龄",
  gender: "性别",
  birthday: "出生日期",
  nationality: "国籍",
  achievements: "主要成就",
});

// 或用 Zod（类型更强）
const schema = z.object({
  name: z.string().describe("姓名"),
  age: z.number().describe("年龄"),
  gender: z.string().describe("性别"),
  birthday: z.string().describe("出生日期"),
  nationality: z.string().describe("国籍"),
  achievements: z.string().describe("主要成就"),
});
const parser2 = StructuredOutputParser.fromZodSchema(schema);

const question = `请介绍下爱因斯坦，按下面格式返回 JSON：
${parser2.getFormatInstructions()}
`;
const res = await model.invoke(question);
console.log(await parser2.parse(res.content));
```

原理仍是：**格式说明进 Prompt → 模型生成 → 本地按 schema 解析**。

---

### 3. Tool：用 tool_calls 拿结构化结果

模型训练时对 tool 参数约束更强，一般比「纯 Prompt + 本地 parse」更稳。  
**必须用 `tool()` 包装**；裸对象塞 `bindTools` 容易缺 `type: "function"`（智谱会报 `tools[0].type cannot be empty`）。

```js
import { tool } from "@langchain/core/tools";

const getPersonInfo = tool(async (input) => JSON.stringify(input), {
  name: "get_person_info",
  description: "用结构化字段返回人物信息",
  schema,
});

const modelWithTool = model.bindTools([getPersonInfo], {
  tool_choice: { type: "function", function: { name: "get_person_info" } },
});

const response = await modelWithTool.invoke("请介绍下爱因斯坦");
console.log(response.tool_calls?.[0]?.args);
```

---

### 4. withStructuredOutput（日常首选）

自动判断：支持 tool_calls 就走 tool；否则回退 Output Parser。业务侧一般直接拿对象：

```js
const structured = model.withStructuredOutput(schema, {
  name: "get_person_info",
  method: "functionCalling",
});
const result = await structured.invoke("请介绍下爱因斯坦");
// { name, age, gender, birthday, nationality, achievements }
```

---

### 5. 流式：何时还要 Parser

| 场景 | 建议 |
|--|--|
| 一次性要完整对象 | `withStructuredOutput` / `bindTools` |
| 边生成边展示文本 | `StringOutputParser` + `stream` |
| 边生成边补全 JSON 字段 | `JsonOutputParser` + `stream` |
| 边生成边展示 tool 参数 | `JsonOutputKeyToolsParser` 或拼 `tool_call_chunks` |
| XML / YAML 等非 JSON | 对应 Output Parser（如 `XMLOutputParser`） |

#### 5a 文本流式

```js
const textChain = model.pipe(new StringOutputParser());
for await (const chunk of await textChain.stream("用一两句话介绍爱因斯坦")) {
  process.stdout.write(chunk);
}
```

#### 5b JSON 流式（字段逐步出现）

```js
const jsonChain = model.pipe(new JsonOutputParser());
for await (const partial of await jsonChain.stream(promptWithFormatInstructions)) {
  console.log("partial →", partial); // name → age → … 逐渐补全
}
```

#### 5c tool_calls 流式

```js
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { parsePartialJson } from "@langchain/core/output_parsers";

const toolsParser = new JsonOutputKeyToolsParser({
  keyName: "get_person_info",
  returnSingle: true,
});
const toolChain = modelWithTool.pipe(toolsParser);

for await (const partial of await toolChain.stream("请介绍下爱因斯坦")) {
  console.log("partial →", partial); // tool args 对象
}

// 或手搓 chunks：
let argsJson = "";
for await (const chunk of await modelWithTool.stream("请介绍下牛顿")) {
  for (const tc of chunk.tool_call_chunks ?? []) {
    if (tc.args) {
      argsJson += tc.args;
      console.log(parsePartialJson(argsJson));
    }
  }
}
```

部分网关可能把整段 `arguments` 一次推完，增量步数会很少，但写法仍是标准 tool 流式。

---

### 6. XML Output Parser

XML 不在 tool JSON Schema 主路径上，适合 Parser：

```js
import { XMLOutputParser } from "@langchain/core/output_parsers";

const xmlParser = new XMLOutputParser({
  tags: ["person", "name", "age", "gender", "birthday", "nationality", "achievements"],
});

const prompt = `请介绍爱因斯坦，严格按 XML 返回：
${xmlParser.getFormatInstructions()}
`;

const res = await model.invoke(prompt);
console.log(await xmlParser.parse(res.content));
// { person: [ { name: "..." }, { age: "..." }, ... ] }

// 流式
const xmlChain = model.pipe(xmlParser);
for await (const partial of await xmlChain.stream(prompt)) {
  console.log("partial →", partial);
}
```

---

### 怎么选

| 需求 | 优先 |
|--|--|
| 日常 JSON 对象入库 | `withStructuredOutput` |
| 自己控 Prompt、多格式 | `StructuredOutputParser` / `JsonOutputParser` |
| 流式 UI、逐步填表 | `JsonOutputParser` 或 `JsonOutputKeyToolsParser` |
| XML / 自定义标记语言 | `XMLOutputParser`（或对应 Parser） |

### 这一节要记住的

1. Output Parser = **格式说明进 Prompt + 本地 parse**；`parse` 传 `content` 字符串并 `await`  
2. `fromNamesAndDescriptions` / `fromZodSchema` **不要加 `new`**  
3. `bindTools` 要用 `tool()`；推荐封装 `withStructuredOutput`  
4. 流式与 XML 等场景，Parser 仍然不可少  
5. 示例脚本：`learnStructor.mjs`
