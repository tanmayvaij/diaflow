import { join } from "path";
import { ProviderConfigMap } from "../@types";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { Content } from "@google/genai";
import { BaseMemory } from "./BaseMemory";

export class FileMemory<
  P extends keyof ProviderConfigMap
> extends BaseMemory<P> {
  private filePath;

  constructor(config?: { filePath?: string }) {
    super();
    this.filePath = config?.filePath ?? join(process.cwd(), "memory.jsonl");
  }

  addMessage(message: ProviderConfigMap[P]["message"]): Promise<void> | void {
    appendFileSync(this.filePath, JSON.stringify(message) + "\n", "utf-8");
  }

  async getContent() {
    return readFileSync(this.filePath, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((content) => JSON.parse(content)) as Content[];
  }

  async reset() {
    writeFileSync(this.filePath, "", "utf-8");
  }
}
