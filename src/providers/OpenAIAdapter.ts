import { BaseAdapterConfig, OpenRouterModels } from "../@types";
import { BaseAdapter } from "./BaseAdapter";
import OpenAI from "openai";

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
    return "";
  }
}
