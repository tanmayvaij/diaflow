import { Content, FunctionDeclaration } from "@google/genai";
import { ZodObject } from "zod";

export interface BaseAdapterConfig {
  tools?: DiaFlowTool[];
  responseJsonSchema?: ZodObject;
  memory?: BaseMemory;
  verbose?: boolean;
}

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

export type OpenRouterModels =
  | "alibaba/tongyi-deepresearch-30b-a3b:free"
  | "meituan/longcat-flash-chat:free"
  | "nvidia/nemotron-nano-9b-v2:free"
  | "deepseek/deepseek-chat-v3.1:free"
  | "openai/gpt-oss-20b:free";

export type GeminiModels =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-image"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite";

export type ProvidersConfigs =
  | {
      provider: "gemini";
      model: GeminiModels;
    }
  | {
      provider: "openrouter";
      model: OpenRouterModels;
    };
