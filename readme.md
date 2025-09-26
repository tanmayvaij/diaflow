# DiaFlow

**DiaFlow** is a lightweight **AI agent framework** built on top of [Google GenAI](https://ai.google.dev/).
It enables you to easily create **tool-using agents** with **memory** and **structured JSON outputs** powered by **Zod**.

Think of it as a simpler alternative to **LangChain** (chain-based execution) and **LangGraph** (graph-based execution).
With DiaFlow, you can create **sequential** or **graph-like agent workflows** — all with minimal setup.

---

## ✨ Features

* 🛠 **Tool Calling** – Define function declarations + handlers that the model can call.
* 🧠 **Memory Support** – Maintain multi-turn conversations or run statelessly.
* 📦 **Structured Outputs** – Enforce response schemas using **Zod validation**.
* 🔗 **Composable Agents** – Connect multiple agents to form graph-based flows.
* ⚡ **TypeScript-first** – Full typings for better DX.
* 🔌 **Lightweight** – No bloated dependencies.

---

## 📦 Installation

```bash
npm install diaflow
```

or with yarn:

```bash
yarn add diaflow
```

---

## 🚀 Quick Start

```ts
import { Agent, Memory } from "diaflow";
import * as z from "zod";

// Example tools
import { tools } from "./tools";

const agent = new Agent({
  apiKey: process.env.GENAI_API_KEY!,
  tools,
  memory: new Memory(),
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

DiaFlow lets you define **tools** (functions the AI can call) like this:

```ts
import { Tool } from "diaflow";
import { mkdirSync } from "fs";
import { resolve } from "path";

export const tools: Tool[] = [
  {
    declaration: {
      name: "makeDirectory",
      description: "Creates a directory at the given path",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string", description: "Path to create" },
        },
        required: ["filePath"],
      },
    },
    handler: ({ filePath }: { filePath: string }) => {
      mkdirSync(resolve(filePath), { recursive: true });
      return { success: true, message: `Created at ${filePath}` };
    },
  },
];
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

## 📊 Graph-Like Execution

DiaFlow supports **graph-style workflows** by chaining multiple agents:

```ts
const agentA = new Agent({ ... });
const agentB = new Agent({ ... });

const outputA = await agentA.runAgent("Fetch user details");
const outputB = await agentB.runAgent(outputA);
```

This allows branching, sequencing, or parallel agent orchestration.

---

## 📜 License

MIT © 2025 [Tanmay Vaij](https://github.com/tanmayvaij)

---
