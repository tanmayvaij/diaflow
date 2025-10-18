import { BaseAdapterConfig } from "./@types";
import { GeminiAdapter, OpenRouterAdapter } from "./providers";
import { BaseAdapter } from "./providers/BaseAdapter";

class DiaFlowAgent {
  private adapter: BaseAdapter<"gemini"> | BaseAdapter<"openrouter">;

  constructor(
    baseConfig: BaseAdapterConfig<"gemini"> | BaseAdapterConfig<"openrouter">
  ) {
    switch (baseConfig.provider) {
      case "gemini":
        this.adapter = new GeminiAdapter(baseConfig);
        break;
      case "openrouter":
        this.adapter = new OpenRouterAdapter(baseConfig);
        break;
    }
  }

  async run(prompt: string) {
    return this.adapter.run(prompt);
  }
}

export default DiaFlowAgent;
