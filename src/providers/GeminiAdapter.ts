import { FunctionDeclaration, GoogleGenAI } from "@google/genai";
import { BaseAdapterConfig } from "../@types";
import z from "zod";
import { BaseAdapter } from "./BaseAdapter";
import { toolTransformers } from "../utils";

export class GeminiAdapter extends BaseAdapter<"gemini"> {
  private ai: GoogleGenAI;
  private geminiTools: FunctionDeclaration[];

  constructor(config: BaseAdapterConfig<"gemini">) {
    super(config);
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.geminiTools = toolTransformers.gemini(this.tools ?? []);
  }

  async run(prompt: string): Promise<string | Record<string, unknown>> {
    this.log("▶️  User input:", prompt);

    this.memory.addUserText(prompt);

    while (true) {
      const response = await this.ai.models.generateContent({
        model: this.model,
        config: {
          systemInstruction: "" + this.systemInstructionForTools,
          ...(this.tools && {
            tools: [
              {
                functionDeclarations: this.geminiTools,
              },
            ],
          }),
        },
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
      return response.text as string;
    }
  }
}
