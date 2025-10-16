import { BaseAdapterConfig, OpenRouterModels } from "../@types";
import { BaseAdapter } from "./BaseAdapter";
import OpenAI from "openai";
import { writeFileSync } from "fs";
import { reportToolError, toolResponse } from "../utils";
import { Type } from "@google/genai";
import {
  ChatCompletionMessageCustomToolCall,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

type ChatCompletionMessageCustomToolCallWithFunc =
  ChatCompletionMessageCustomToolCall & {
    function: {
      name: string;
      arguments: any;
    };
  };

const tools: { declaration: ChatCompletionTool; handler: (obj: any) => any }[] =
  [
    {
      declaration: {
        type: "function",
        function: {
          name: "writeFile",
          description:
            "Writes the provided content to a file at the specified path using the given encoding. Useful for saving configuration, logs, JSON data, or other text-based information to the local filesystem, ensuring data is persisted for further processing or later retrieval.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              filePath: {
                type: Type.STRING,
                description:
                  "path of the file where the content is to be written",
              },
              content: {
                type: Type.STRING,
                description: "content which is to be written in the file",
              },
              encoding: {
                type: Type.STRING,
                description: "encoding of the file",
              },
            },
            required: ["filePath", "content", "encoding"],
          },
        },
      },
      handler: ({ filePath, content, encoding }) => {
        try {
          writeFileSync(filePath, content, encoding);
          return toolResponse(
            `content written to file: ${filePath} with encoding ${encoding}`
          );
        } catch (error) {
          return reportToolError(error);
        }
      },
    },
  ];

export class OpenAIAdapter extends BaseAdapter {
  private ai: OpenAI;
  private model: OpenRouterModels;

  constructor({
    apiKey,
    model = "alibaba/tongyi-deepresearch-30b-a3b:free",
    baseURL,
    ...baseConfig
  }: BaseAdapterConfig & {
    apiKey: string;
    model?: OpenRouterModels;
    baseURL: string;
  }) {
    super(baseConfig);
    this.ai = new OpenAI({ apiKey, baseURL });
    this.model = model;
  }

  async run(prompt: string): Promise<string | Record<string, unknown>> {
    this.log("▶️  User input:", prompt);

    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: prompt },
    ];

    // this.memory.addUserText(prompt);

    while (true) {
      const response = await this.ai.chat.completions.create({
        model: this.model,
        messages,
        tools: tools.map((tool) => tool.declaration),
      });

      const result = response.choices[0]?.message;

      if (result?.tool_calls && result.tool_calls.length > 0) {
        const { name, arguments: args } = (
          result.tool_calls[0] as ChatCompletionMessageCustomToolCallWithFunc
        ).function;

        this.log("🛠️  Model requested tool:", name, "with args:", args);

        const toolResponse = await this.toolsMap[name as string]!(args);

        this.log("✔️  Tool response:", toolResponse.data);

        //   // this.memory.addToolCall(name!, args!);
        messages.push({
          role: "tool",
          tool_call_id: result.tool_calls[0]?.id as string,
          content: JSON.stringify(toolResponse),
        });

        //   // this.memory.addToolResponse(name!, toolResponse);

        continue;
      }

      // this.memory.addModelText(response.output_text.trim());
      messages.push({
        role: "assistant",
        content: result?.content![0] as string,
      });

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
      
      return result?.content![0] as string
    }
  }
}
