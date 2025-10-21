import { ChatCompletionFunctionTool } from "openai/resources";
import { BaseAdapterConfig } from "../@types";
import { BaseAdapter } from "./BaseAdapter";
import axios from "axios";
import { toolTransformers } from "../utils";

export class OpenRouterAdapter extends BaseAdapter<"openrouter"> {
  private openRouterTools: ChatCompletionFunctionTool[];

  constructor(baseConfig: BaseAdapterConfig<"openrouter">) {
    super(baseConfig);
    this.openRouterTools = toolTransformers.openrouter(this.tools ?? []);
  }

  async run(prompt: string): Promise<string | Record<string, unknown>> {
    this.log("▶️  User input:", prompt);

    this.memory.addMessage({ role: "user", content: prompt });

    while (true) {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: this.model,
          messages: this.memory.getContent(),
          tools: this.openRouterTools,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const llmCall = response.data.choices[0].message;

      if (llmCall?.tool_calls) {
        const { name, arguments: args } = llmCall.tool_calls[0].function;

        this.log("🛠️  Model requested tool:", name, "with args:", args);

        const toolResponse = await this.toolsMap[name as string]!(
          JSON.parse(args)
        );

        this.log("✔️  Tool response:", toolResponse.data);

        this.memory.addMessage(llmCall);

        this.memory.addMessage({
          role: "tool",
          tool_call_id: llmCall.tool_calls[0].id,
          content: JSON.stringify(toolResponse),
        });

        continue;
      }

      // if (this.responseJsonSchema) {
      //   const formattedResponse = await this.ai.models.generateContent({
      //     model: this.model,
      //     config: {
      //       responseMimeType: "application/json",
      //       responseJsonSchema: z.toJSONSchema(this.responseJsonSchema),
      //       systemInstruction:
      //         "You are a formatter agent, your only job is to format data into the required json structure",
      //     },
      //     contents: await this.memory.getContent(),
      //   });

      //   this.log("✴️  Formatter response:", formattedResponse.text);

      //   return this.responseJsonSchema.parse(
      //     JSON.parse(formattedResponse.text!)
      //   );
      // }

      // this.log("✴️  Final text response:", response.output_text.trim());

      return llmCall.content.trim();
    }
  }
}
