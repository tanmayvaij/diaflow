<h1 align="center">🌊 DiaFlow</h1>

<p align="center">
  <b>Composable AI Agent Framework</b> for building multi-model workflows with ease.  
</p>

<p align="center">
  <a href="https://github.com/tanmayvaij/diaflow-core">Core</a> •
  <a href="https://github.com/tanmayvaij/diaflow-gemini">Gemini</a> •
  <a href="https://github.com/tanmayvaij/diaflow-openrouter">OpenRouter</a> •
  <a href="https://github.com/tanmayvaij/diagem-cli-bot">Examples</a>
</p>

---

## 🧩 Overview

DiaFlow is a **modular framework** for building AI-driven workflows and conversational agents.  
It separates the **core orchestration layer** from **LLM backends**, making it flexible, extendable, and cloud-agnostic.

Whether you're integrating **Gemini**, **OpenRouter**, or your own LLM — DiaFlow keeps the experience consistent and developer-friendly.

---

## 📦 Monorepo Layout

| Package | Description |
|----------|--------------|
| [`diaflow-core`](https://github.com/tanmayvaij/diaflow-core) | Core runtime for agent logic, tools, and orchestration. |
| [`diaflow-gemini`](https://github.com/tanmayvaij/diaflow-gemini) | Connector for Google Gemini models (`gemini-2.0-flash`, `gemini-1.5-pro`, etc). |
| [`diaflow-openrouter`](https://github.com/tanmayvaij/diaflow-openrouter) | Adapter for OpenRouter API supporting multiple open models. |

Each module is **standalone**, but they work best when composed together.

---

## ⚡ Quick Start

### 1️⃣ Install a module

```bash
npm install diaflow-gemini
# or
npm install diaflow-openrouter
````

### 2️⃣ Create an agent

```ts
import Agent from "diaflow-gemini";

const agent = new Agent({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash",
});

const reply = await agent.run("Hello DiaFlow!");
console.log("🤖 AI:", reply);
```

### 3️⃣ Environment Variables

```bash
GEMINI_API_KEY=your_key_here
```

---

## 💡 Example Projects

| Example            | Description                                    | Repository                                             |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| **diagem-cli-bot** | A minimal CLI chatbot using `diaflow-gemini`   | [View →](https://github.com/tanmayvaij/diagem-cli-bot) |
| *(coming soon)*    | Web and API examples with `diaflow-openrouter` | —                                                      |

---

## 🧠 Design Philosophy

DiaFlow is built around three principles:

1. **Composability** — Everything is modular and replaceable.
2. **Simplicity** — Small surface area, no magic.
3. **Extensibility** — Easy to add custom tools, models, or workflows.

---

## 🗺️ Roadmap

* [ ] Unified CLI for agent creation and flow management
* [ ] Visual flow editor for defining logic nodes
* [ ] Plugins for memory, vector stores, and APIs
* [ ] Example integrations with LangChain and FastAPI

---

## 🧑‍💻 Author

Built by [**Tanmay Vaij**](https://github.com/tanmayvaij) with 💙
Follow for updates and upcoming releases!

---

## 📄 License

MIT License © 2025 Tanmay Vaij
