import { Content } from "@google/genai";
import { ToolResponse } from "../@types";

export abstract class BaseMemory {
  abstract addUserText(text: string): void;
  abstract addToolCall(name: string, args: Record<string, any>): void;
  abstract addToolResponse(name: string, result: ToolResponse): void;
  abstract addModelText(text: string): void;
  abstract getContent(): Content[];
  abstract reset(): void;
}
