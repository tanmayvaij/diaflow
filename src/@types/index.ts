import { Content, FunctionDeclaration } from "@google/genai";

export interface ToolResponse {
  success: boolean;
  data: string | undefined;
  error: string | undefined;
}

export interface DiaFlowTool {
  declaration: FunctionDeclaration;
  handler: (args: Record<string, any>) => Promise<ToolResponse> | ToolResponse;
}

export interface BaseMemory {
  addUserText(text: string): Promise<void> | void;
  addToolCall(name: string, args: Record<string, any>): Promise<void> | void;
  addToolResponse(name: string, result: ToolResponse): Promise<void> | void;
  addModelText(text: string): Promise<void> | void;
  getContent(): Promise<Content[]> | Content[];
  reset(): Promise<void> | void;
}

export type GeminiModels =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-image"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite";
