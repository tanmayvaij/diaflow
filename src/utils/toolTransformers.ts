import { FunctionDeclaration, Type } from "@google/genai";
import { DiaFlowTool } from "../@types";
import { ChatCompletionFunctionTool } from "openai/resources";

export const toolTransformers = {
  gemini: (tools: DiaFlowTool[]): FunctionDeclaration[] =>
    tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      ...(tool.parameters && {
        parameters: {
          type: Type.OBJECT,
          properties: tool.parameters,
          required: Object.keys(tool.parameters),
        },
      }),
    })),

  openrouter: (tools: DiaFlowTool[]): ChatCompletionFunctionTool[] =>
    tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        strict: true,
        ...(tool.parameters && {
          parameters: {
            type: "object",
            properties: tool.parameters,
            required: Object.keys(tool.parameters),
          },
        }),
      },
    })),
};
