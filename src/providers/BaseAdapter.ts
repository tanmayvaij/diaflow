import {
  ToolResponse,
  BaseMemory,
  BaseAdapterConfig,
  ProviderModelMap,
  DiaFlowTool,
} from "../@types";
import z from "zod";
import { InMemory } from "../memory";

export abstract class BaseAdapter<P extends keyof ProviderModelMap> {
  protected apiKey: string;

  protected provider: P;
  protected model: ProviderModelMap[P];

  protected toolsMap: Record<
    string,
    (args: any) => ToolResponse | Promise<ToolResponse>
  >;

  protected tools: DiaFlowTool[] | undefined;

  protected memory: BaseMemory;
  protected responseJsonSchema: z.ZodObject<any> | undefined;
  protected verbose: boolean;
  protected systemInstructionForTools: string;

  constructor({
    apiKey,
    tools,
    memory,
    responseJsonSchema,
    verbose = false,
    provider,
    model,
  }: BaseAdapterConfig<P>) {
    this.apiKey = apiKey;

    this.provider = provider;

    this.memory = memory ?? new InMemory();
    this.responseJsonSchema = responseJsonSchema;
    this.verbose = verbose;

    this.tools = tools;
    this.toolsMap = Object.fromEntries(
      this.tools?.map((tool) => [tool.name, tool.handler]) ?? []
    );

    this.model = model;

    this.systemInstructionForTools =
      this.tools
        ?.map((tool) => [tool.name, tool.description])
        .reduce((allToolsDesc, toolDesc) => {
          return (
            allToolsDesc! + "\n\n- **" + toolDesc[0] + "**\n\n" + toolDesc[1]
          );
        }, "## 🧰 Available Tools \n\nYou currently have access to the following tools, plan tasks and select to use them appropriately whenever needed:") ??
      "";
  }

  protected log(...args: any[]) {
    if (this.verbose) console.log("[DiaFlowAgent]", ...args);
  }

  abstract run(prompt: string): Promise<string | Record<string, unknown>>;
}
