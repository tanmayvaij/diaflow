import { join } from "path";
import { BaseMemory, ToolResponse } from "../@types";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { Content } from "@google/genai";

export class FileMemory implements BaseMemory {
  private filePath;

  constructor(filePath?: string) {
    this.filePath = filePath ? filePath : join(process.cwd(), "memory.jsonl");
  }

  private appendToFile(entry: Content) {
    appendFileSync(this.filePath, JSON.stringify(entry) + "\n", "utf-8");
  }

  async addUserText(text: string) {
    this.appendToFile({ role: "user", parts: [{ text }] });
  }

  async addToolCall(name: string, args: Record<string, any>) {
    this.appendToFile({
      role: "model",
      parts: [{ functionCall: { name, args } }],
    });
  }

  async addToolResponse(name: string, result: ToolResponse) {
    this.appendToFile({
      role: "user",
      parts: [
        {
          functionResponse: {
            name,
            response: { result },
          },
        },
      ],
    });
  }

  async addModelText(text: string) {
    this.appendToFile({ role: "model", parts: [{ text }] });
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
