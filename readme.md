# DiaFlow

**DiaFlow** is a lightweight **AI agent framework** built on top of [Google GenAI](https://ai.google.dev/).  
It enables you to create **tool-using agents** with **memory** and **structured JSON outputs** powered by **Zod**.

Unlike other frameworks that try to support many providers, DiaFlow is focused entirely on Gemini models.
👉 This keeps the API simple, ensures the best integration, and makes it beginner-friendly since Gemini is currently the only top-tier LLM with a generous free tier.

Think of it as a simpler alternative to **LangChain** or **LangGraph** — with a focus on **Gemini** models and minimal setup.

---

## ✨ Features

- 🛠 **Tool Calling** – Define function declarations + handlers that the model can call.
- 🧠 **Memory Support** – Maintain multi-turn conversations or run statelessly.
- 📦 **Structured Outputs** – Enforce response schemas using **Zod validation**.
- 🔗 **Composable Agents** – Chain multiple agents to form workflows.
- ⚡ **TypeScript-first** – Strong typings for agents, tools, and schemas.
- 🔌 **Lightweight** – Only depends on `@google/genai` + `zod`.

---

## 📦 Installation

```bash
npm install diaflow
````

or with yarn:

```bash
yarn add diaflow
```

---

## 🚀 Quick Start

```ts
import DiaFlowAgent, { Memory } from "diaflow";
import * as z from "zod";
import { tools } from "./tools"; // your tools

const agent = new DiaFlowAgent({
  apiKey: process.env.GENAI_API_KEY!,
  tools,
  memory: new Memory(),
  model: "gemini-2.0-flash", // default
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

## 🛠 Defining Tools

Tools are functions the AI can call.
Each tool has a **declaration** (for the model) and a **handler** (actual code execution).

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
        dirPath: {
          type: "string",
          description: "Path where the directory has to be created",
        },
      },
      required: ["dirPath"],
    },
  },
  handler: ({ dirPath }: { dirPath: string }) => {
    mkdirSync(dirPath, { recursive: true });
    return {
      success: true,
      data: `Directory created at ${dirPath}`,
      error: undefined,
    };
  },
});
```

---

## 🧠 Memory Example

```ts
import { Memory } from "diaflow";

const memory = new Memory();
memory.add({ role: "user", parts: [{ text: "Hello" }] });

console.log(memory.getContent());
```

---

## 📂 Built-in Tools

DiaFlow ships with a set of **filesystem tools** (`diaflow/src/tools/fileSystem`):

* `readFileTool` – Reads a file from disk
* `writeFileTool` – Writes content to a file
* `makeDirectoryTool` – Creates directories
* `currentWorkingDirectoryTool` – Returns the process CWD

Import them easily:

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

## 📊 Graph-Like Execution

Agents can be chained to form workflows:

```ts
const agentA = new DiaFlowAgent({ ... });
const agentB = new DiaFlowAgent({ ... });

const outputA = await agentA.runAgent("Fetch user details");
const outputB = await agentB.runAgent(outputA);
```

This allows branching, sequencing, or parallel orchestration.

---

## 📜 License

MIT © 2025 [Tanmay Vaij](https://github.com/tanmayvaij)
