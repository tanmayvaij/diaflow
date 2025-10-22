# ⚡ DiaFlow  ·  *Universal AI Agent Framework*

[![npm version](https://img.shields.io/npm/v/diaflow.svg?color=blue)](https://www.npmjs.com/package/diaflow)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tanmayvaij/diaflow?style=social)](https://github.com/tanmayvaij/diaflow/stargazers)

**DiaFlow** is a **universal, provider-agnostic AI Agent Framework** for building **tool-using, memory-aware agents** that work across **Gemini**, **OpenRouter**, and other LLM providers.

> 🧩 Think of DiaFlow as a **multi-provider LangChain alternative**, built with simplicity, type safety, and full modularity.

---

## 🌟 Features (v2.0.0)

✅ **Multi-Provider Support**
Run on **Google Gemini**, **OpenRouter**, or any provider — unified interface via `ProviderConfigMap`.

🧠 **Modular Memory System**
Switch between `InMemory`, `FileMemory`, or `PersistentMemory` (MongoDB) backends.
Memory types auto-adapt to provider message formats.

🛠 **Universal Tool Layer**
Define a tool once, use it everywhere — automatic conversion to provider-specific formats.
Comes with built-in **filesystem tools**.

🧾 **Typed Structured Outputs**
Use **Zod** schemas to validate and enforce structured agent responses.

⚙️ **Composable & Extensible**
Extend Adapters, Tools, Memory, and Providers — everything is pluggable.

---

## 📦 Installation

```bash
npm install diaflow
# or
yarn add diaflow
```

---

## 🚀 Quick Start

```ts
import { DiaFlowAgent, InMemory, tools } from "diaflow";

const agent = new DiaFlowAgent({
  provider: "openrouter",
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: "mistral/mixtral-8x7b",
  tools: [
    tools.fileSystemTools.readFileTool(),
    tools.fileSystemTools.writeFileTool(),
  ],
  memory: new InMemory({ provider: "openrouter" }),
  verbose: true,
});

(async () => {
  const result = await agent.run("Read and summarize package.json");
  console.log(result);
})();
```

---

## 🧰 Define a Universal Tool

```ts
import { mkdirSync } from "fs";

export const makeDirectoryTool = () => ({
  declaration: {
    name: "makeDirectory",
    description: "Creates a directory at a specified path",
    parameters: {
      type: "object",
      properties: {
        dirPath: { type: "string", description: "Path of directory to create" },
      },
      required: ["dirPath"],
    },
  },
  handler: async ({ dirPath }: { dirPath: string }) => {
    mkdirSync(dirPath, { recursive: true });
    return { success: true, data: `Created directory at ${dirPath}` };
  },
});
```

> 💡 The same tool automatically adapts to Gemini or OpenRouter format behind the scenes.

---

## 🧠 Memory Systems

DiaFlow includes **multiple memory backends** to persist context across turns.

### 🕐 In-Memory (default)

```ts
import { InMemory } from "diaflow";
const memory = new InMemory({ provider: "gemini" });
```

### 💾 File-Based

```ts
import { FileMemory } from "diaflow";
const memory = new FileMemory({ provider: "openrouter", filePath: "memory.jsonl" });
```

### 🗄️ Persistent (MongoDB)

```ts
import { PersistentMemory } from "diaflow";
const memory = new PersistentMemory({
  provider: "openrouter",
  mongoUri: process.env.MONGO_URI!,
});
```

---

## 🔗 Chaining Agents

```ts
const fetcher = new DiaFlowAgent({ ... });
const summarizer = new DiaFlowAgent({ ... });

const data = await fetcher.run("Fetch user info");
const summary = await summarizer.run(data);
```

---

## 🧾 Structured Outputs

Use **Zod** schemas to enforce response shape:

```ts
responseJsonSchema: z.object({
  success: z.boolean(),
  summary: z.string(),
}),
```

---

## 🧩 Architecture Overview

```
┌─────────────────────────────┐
│         DiaFlowAgent        │
│  ├── BaseAdapter (Provider) │
│  ├── BaseMemory (Context)   │
│  └── Tools (Actions)        │
└─────────────────────────────┘
            │
            ▼
   Provider-Specific Adapter
 (Gemini / OpenRouter / etc.)
```

---

## 🔮 Roadmap

| Feature                    | Status         | Description                                |
| -------------------------- | -------------- | ------------------------------------------ |
| 🧩 Provider Plugin System  | 🚧 In Progress | Add Claude, Ollama, Anthropic support      |
| 🧰 Community Tool Registry | 🧠 Planned     | `@diaflow/tool-aws`, `@diaflow/tool-shell` |
| 🧠 VectorDB Memory         | 🧠 Planned     | Long-term semantic memory                  |
| ☁️ Deploy Agent            | 🚧 Prototype   | Auto-deploy projects to AWS/Vercel         |
| 🧩 REST + CLI Layer        | 🔜 Planned     | Run DiaFlow as a local service             |

---

## 👨‍💻 Example Use Cases

* 🤖 Build **tool-using AI agents** (code editors, web scrapers, or chatbots)
* 🧩 Prototype **AI workflows** with composable memory
* 🧠 Develop **autonomous systems** with contextual recall
* ☁️ Automate **cloud tasks** (deploy, fetch logs, run scripts)

---

## 💡 Why DiaFlow?

| Feature          | DiaFlow | LangChain  | Custom SDK |
| ---------------- | ------- | ---------- | ---------- |
| Multi-Provider   | ✅       | ⚠️ Limited | ❌          |
| Type Safety      | ✅       | ⚠️ Partial | ❌          |
| Tool Flexibility | ✅       | ✅          | ⚠️         |
| Simplicity       | ✅       | ❌ Complex  | ❌ Manual   |
| Open Source      | ✅       | ✅          | ⚠️ Varies  |

---

## 🧭 Future Vision

> DiaFlow aims to be the **core engine** for running intelligent agents — portable, provider-agnostic, and open to community-built tools.

---

## 📜 License

MIT © 2025 [**Tanmay Vaij**](https://github.com/tanmayvaij)

---

### 🖤 Support the Project

If you like **DiaFlow**, consider:

* ⭐ **Starring the repo**
* 🧩 Contributing new tools or memory backends
* 💬 Sharing feedback via Issues or Discussions
