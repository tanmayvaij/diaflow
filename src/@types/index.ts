import { FunctionDeclaration } from "@google/genai";

export interface ToolResponse {
  success: boolean;
  data: string | undefined;
  error: string | undefined;
}

export interface DiaFlowTool {
  declaration: FunctionDeclaration;
  handler: (args: Record<string, any>) => Promise<ToolResponse> | ToolResponse;
}

export type GeminiModels =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-image"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite";
