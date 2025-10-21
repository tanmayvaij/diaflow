import { BaseAdapterConfig } from "./@types";
import { GeminiAdapter, OpenRouterAdapter } from "./providers";
import { BaseAdapter } from "./providers/BaseAdapter";

class DiaFlowAgent {
  private adapter: BaseAdapter<"gemini"> | BaseAdapter<"openrouter">;

  constructor(
    config: BaseAdapterConfig<"gemini"> | BaseAdapterConfig<"openrouter">
  ) {
    switch (config.provider) {
      case "gemini":
        this.adapter = new GeminiAdapter(config);
        break;
      case "openrouter":
        this.adapter = new OpenRouterAdapter(config);
        break;
    }
  }

  async run(prompt: string) {
    return this.adapter.run(prompt);
  }
}

export default DiaFlowAgent;
