import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { GeminiModels, DiaFlowTool, ToolResponse, BaseMemory } from "./@types";
import z from "zod";
import { InMemory } from "./memory";

class DiaFlowAgent {
  private ai: GoogleGenAI;
  private config: GenerateContentConfig;
  private toolsMap: Record<
    string,
    (args: any) => ToolResponse | Promise<ToolResponse>
  >;
  private model: GeminiModels;
  private memory: BaseMemory;
  private responseJsonSchema: z.ZodObject<any> | undefined;
  private verbose: boolean;

  constructor({
    apiKey,
    config,
    tools,
    model = "gemini-2.0-flash",
    memory,
    responseJsonSchema,
    verbose = false,
  }: {
    apiKey: string;
    config?: GenerateContentConfig;
    tools?: DiaFlowTool[];
    model?: GeminiModels;
    responseJsonSchema?: z.ZodObject;
    memory?: BaseMemory;
    verbose?: boolean;
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
    this.memory = memory ?? new InMemory();
    this.responseJsonSchema = responseJsonSchema;
    this.verbose = verbose;
  }

  private log(...args: any[]) {
    if (this.verbose) console.log("[DiaFlowAgent]", ...args);
  }

  async run(text: string) {
    this.log("▶️  User input:", text);

    this.memory.addUserText(text);

    while (true) {
      const response = await this.ai.models.generateContent({
        model: this.model,
        config: this.config || {},
        contents: await this.memory.getContent(),
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]!;

        const { name, args } = functionCall;

        this.log("🛠️  Model requested tool:", name, "with args:", args);

        const toolResponse = await this.toolsMap[name as string]!(args as any);

        this.log("✔️  Tool response:", toolResponse.data);

        this.memory.addToolCall(name!, args!);
        this.memory.addToolResponse(name!, toolResponse);

        continue;
      }

      this.memory.addModelText(response.text!);

      if (this.responseJsonSchema) {
        const formattedResponse = await this.ai.models.generateContent({
          model: this.model,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(this.responseJsonSchema),
            systemInstruction:
              "You are a formatter agent, your only job is to format data into the required json structure",
          },
          contents: await this.memory.getContent(),
        });

        this.log("✴️  Formatter response:", formattedResponse.text);

        return this.responseJsonSchema.parse(
          JSON.parse(formattedResponse.text!)
        );
      }

      this.log("✴️  Final text response:", response.text);
      return response.text;
    }
  }
}

export default DiaFlowAgent;
