import { BaseAdapterConfig, ProvidersConfigs } from "./@types";
import { GeminiAdapter, OpenAIAdapter } from "./providers";
import { BaseAdapter } from "./providers/BaseAdapter";

class DiaFlowAgent {
  private adapter: BaseAdapter;

  constructor({
    apiKey,
    provider,
    model,
    ...baseConfig
  }: BaseAdapterConfig & ProvidersConfigs & { apiKey: string }) {
    switch (provider) {
      case "gemini":
        this.adapter = new GeminiAdapter({
          apiKey,
          model: model || "gemini-2.0-flash",
          ...baseConfig,
        });
        break;
      case "openrouter":
        this.adapter = new OpenAIAdapter({
          apiKey,
          model: model || "alibaba/tongyi-deepresearch-30b-a3b:free",
          baseURL: "https://openrouter.ai/api/v1",
          ...baseConfig,
        });
        break;
    }
  }

  async run(prompt: string) {
    return this.adapter.run(prompt);
  }
}

export default DiaFlowAgent;
