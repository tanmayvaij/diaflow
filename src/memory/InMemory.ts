import { Content } from "@google/genai";
import { ToolResponse } from "../@types";
import { BaseMemory } from "./BaseMemory";

export class InMemory extends BaseMemory {
  private contents: Content[] = [];

  addUserText(text: string) {
    this.contents.push({ role: "user", parts: [{ text }] });
  }

  addToolCall(name: string, args: Record<string, any>) {
    this.contents.push({
      role: "model",
      parts: [{ functionCall: { name, args } }],
    });
  }

  addToolResponse(name: string, result: ToolResponse) {
    this.contents.push({
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

  addModelText(text: string) {
    this.contents.push({ role: "model", parts: [{ text }] });
  }

  getContent() {
    return this.contents;
  }

  reset() {
    this.contents = [];
  }
}
