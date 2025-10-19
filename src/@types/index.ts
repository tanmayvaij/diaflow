import { Content, FunctionDeclaration } from "@google/genai";
import { ZodObject } from "zod";

export interface ProviderModelMap {
  gemini: GeminiModels;
  openrouter: OpenRouterModels;
}

export interface BaseAdapterConfig<P extends keyof ProviderModelMap> {
  apiKey: string;
  tools?: DiaFlowTool[];
  responseJsonSchema?: ZodObject;
  memory?: BaseMemory;
  verbose?: boolean;
  provider: P;
  model: ProviderModelMap[P];
}

export interface ToolResponse {
  success: boolean;
  data: string | undefined;
  error: string | undefined;
}

export interface DiaFlowTool {
  declaration: {
    name: string;
    description: string;
    parameters?: {
      properties: Record<string, { type: string; description: string }>;
    };
  };
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
  | "openai/gpt-oss-20b:free"
  | "z-ai/glm-4.5-air:free"
  | "qwen/qwen3-coder:free"
  | "moonshotai/kimi-k2:free"
  | "cognitivecomputations/dolphin-mistral-24b-venice-edition:free"
  | "google/gemma-3n-e2b-it:free"
  | "tencent/hunyuan-a13b-instruct:free"
  | "tngtech/deepseek-r1t2-chimera:free"
  | "mistralai/mistral-small-3.2-24b-instruct:free";

export type GeminiModels =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-image"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite";
