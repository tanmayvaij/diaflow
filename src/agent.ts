import { Content, GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { GeminiModels, Tool } from "./@types";
import { Memory } from "./memory";
import z from "zod";

class DiaFlowAgent {
  private ai: GoogleGenAI;
  private config: GenerateContentConfig;
  private toolsMap: Record<string, (args: any) => any | Promise<any>>;
  private model: GeminiModels;
  private memory: Memory | undefined;
  private responseJsonSchema: z.ZodObject<any> | undefined;
  private contents: Content[] = [];

  constructor({
    apiKey,
    config,
    tools,
    model = "gemini-2.0-flash",
    memory,
    responseJsonSchema,
  }: {
    apiKey: string;
    config?: GenerateContentConfig;
    tools?: Tool[];
    model?: GeminiModels;
    responseJsonSchema?: z.ZodObject;
    memory?: Memory;
  }) {
    this.ai = new GoogleGenAI({ apiKey });
    this.model = model;
    this.config = {
      ...config,
      tools: tools
        ? [{ functionDeclarations: tools.map((tool) => tool.declaration) }]
        : [],
    };
    this.toolsMap = Object.fromEntries(
      tools?.map((tool) => [tool.declaration.name, tool.handler]) ?? []
    );
    this.memory = memory;
    this.responseJsonSchema = responseJsonSchema;
  }

  private getHistory() {
    return this.memory ? this.memory.getContent() : this.contents;
  }

  private addToHistory(content: Content) {
    if (this.memory) this.memory.add(content);
    else this.contents.push(content);
  }

  async runAgent(text: string) {
    this.addToHistory({
      role: "user",
      parts: [{ text }],
    });

    while (true) {
      const response = await this.ai.models.generateContent({
        model: this.model,
        config: this.config || {},
        contents: this.getHistory(),
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]!;

        console.log(`functionCall  ->  ${JSON.stringify(functionCall)}`);

        const { name, args } = functionCall;

        const toolResponse = await this.toolsMap[name as string]!(args as any);

        console.log(`toolResponse  ->  ${JSON.stringify(toolResponse)}`);

        this.addToHistory({
          role: "model",
          parts: [
            {
              functionCall,
            },
          ],
        });
        this.addToHistory({
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

        continue;
      }

      if (this.responseJsonSchema) {
        const formattedResponse = await this.ai.models.generateContent({
          model: this.model,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(this.responseJsonSchema),
            systemInstruction:
              "You are a formatter agent, your only job is to format data into the required json structure",
          },
          contents: this.getHistory(),
        });

        return this.responseJsonSchema.parse(
          JSON.parse(formattedResponse.text!)
        );
      }

      return response.text;
    }
  }
}

export default DiaFlowAgent;
