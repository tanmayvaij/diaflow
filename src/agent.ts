import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { Memory } from "./memory";

export class Agent {
  private ai: GoogleGenAI;
  private config: GenerateContentConfig;
  private toolsMap: Record<string, (args: any) => any>;
  private model: GeminiModels;
  private memory: Memory;
  private responseJsonSchema: unknown;

  constructor({
    apiKey,
    config,
    tools,
    model = "gemini-2.0-flash",
    memory,
    responseJsonSchema,
  }: {
    apiKey: string;
    config: GenerateContentConfig;
    tools: Tool[];
    model?: GeminiModels;
    responseJsonSchema?: unknown;
    memory: Memory;
  }) {
    this.ai = new GoogleGenAI({ apiKey });
    this.model = model;
    this.config = {
      ...config,
      tools: [{ functionDeclarations: tools.map((tool) => tool.declaration) }],
      responseMimeType: responseJsonSchema ? "application/json" : "text/plain",
      responseJsonSchema,
    };
    this.toolsMap = Object.fromEntries(
      tools.map((tool) => [tool.declaration.name, tool.handler])
    );
    this.memory = memory;
    this.responseJsonSchema = responseJsonSchema;
  }

  async runAgent(text: string) {
    this.memory.add({
      role: "user",
      parts: [{ text }],
    });

    while (true) {
      const response = await this.ai.models.generateContent({
        model: this.model,
        config: this.config || {},
        contents: this.memory.getContent(),
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]!;

        console.log(`functionCall  ->  ${JSON.stringify(functionCall)}`);

        const { name, args } = functionCall;

        const toolResponse = this.toolsMap[name as string]!(args as any);

        console.log(`toolResponse  ->  ${JSON.stringify(toolResponse)}`);

        this.memory.add({
          role: "model",
          parts: [
            {
              functionCall,
            },
          ],
        });
        this.memory.add({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: name!,
                response: { result: toolResponse },
              },
            },
          ],
        });
      } else if (this.responseJsonSchema) return JSON.parse(response.text!);

      return response.text;
    }
  }
}
