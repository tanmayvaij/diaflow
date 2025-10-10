# ⚡ DiaFlow

**DiaFlow** is a lightweight, modular **AI Agent Framework** for building **tool-using, memory-aware agents** powered by **Google Gemini** models.
It provides a clean abstraction for **tools**, **memory**, and **structured outputs** — making it easy to build intelligent, multi-step AI systems.

> 🧩 Think of DiaFlow as a **Gemini-focused LangChain** — simple, typed, and fully open-source.

---

## 🌟 Highlights (v1.2.0)

* 🧠 **Modular Memory System**

  * `InMemory`, `FileMemory`, and `PersistentMemory` (MongoDB or Prisma-based)
* 🛠 **Tool System**

  * Define tool declarations + handlers for any function
  * Ships with built-in filesystem tools
* 🧾 **Structured Outputs**

  * Validate model responses using **Zod schemas**
* ⚡ **Composable Agents**

  * Chain multiple agents or workflows


---

## 📦 Installation

```bash
npm install diaflow
```

or

```bash
yarn add diaflow
```

---

## 🚀 Quick Start

```ts
import { DiaFlowAgent, InMemory } from "diaflow";
import * as z from "zod";
import { tools } from "./tools";

const agent = new DiaFlowAgent({
  apiKey: process.env.GENAI_API_KEY!,
  tools,
  memory: new InMemory(),
  model: "gemini-2.0-flash",
  responseJsonSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
});

(async () => {
  const result = await agent.runAgent("Create a directory called testdir");
  console.log(result);
})();
```

---

## 🧰 Defining a Tool

```ts
import { DiaFlowTool } from "diaflow";
import { mkdirSync } from "fs";

export const makeDirectoryTool = (): DiaFlowTool => ({
  declaration: {
    name: "makeDirectory",
    description: "Creates a directory on a given path",
    parameters: {
      type: "object",
      properties: {
        dirPath: { type: "string", description: "Directory path" },
      },
      required: ["dirPath"],
    },
  },
  handler: ({ dirPath }: { dirPath: string }) => {
    mkdirSync(dirPath, { recursive: true });
    return {
      success: true,
      data: `Directory created at ${dirPath}`,
    };
  },
});
```

---

## 🧠 Memory Backends

DiaFlow supports multiple **memory storage strategies**:

### 1️⃣ In-Memory

Ephemeral memory — resets when the process restarts.

```ts
import { InMemory } from "diaflow";
const memory = new InMemory();
```

---

### 2️⃣ File-Based Memory

Persistent JSONL memory (each message stored line-by-line).

```ts
import { FileMemory } from "diaflow";
const memory = new FileMemory("memory.jsonl");
```

---

### 3️⃣ Persistent Memory (MongoDB / Prisma)

Database-backed context storage.

```ts
import { PersistentMemory } from "diaflow";

const memory = new PersistentMemory({
  dbUrl: process.env.MONGODB_URL!,
  dbType: "mongodb",
  collectionName: "agent_memory",
});
```

---

## 📂 Built-in Tools

DiaFlow ships with common **filesystem tools**:

* `readFileTool` – Read file contents
* `writeFileTool` – Write data to a file
* `makeDirectoryTool` – Create directories
* `currentWorkingDirectoryTool` – Get the current working directory

```ts
import { tools } from "diaflow";

const agent = new DiaFlowAgent({
  apiKey: process.env.GENAI_API_KEY!,
  tools: [
    tools.fileSystemTools.readFileTool(),
    tools.fileSystemTools.writeFileTool(),
  ],
});
```

---

## 🔗 Chaining Agents

Create multi-step workflows by composing agents.

```ts
const agentA = new DiaFlowAgent({ ... });
const agentB = new DiaFlowAgent({ ... });

const outputA = await agentA.runAgent("Fetch user info");
const outputB = await agentB.runAgent(outputA);
```

---

## 🧩 Advanced Concepts

### 🧾 Structured JSON Outputs

Ensure every agent response follows a schema:

```ts
responseJsonSchema: z.object({
  success: z.boolean(),
  summary: z.string(),
});
```

### 🤖 Ollama Support (Planned)

Run agents across local or cloud-based LLMs seamlessly.

---


## 📜 License

MIT © 2025 [Tanmay Vaij](https://github.com/tanmayvaij)

