import { ProviderConfigMap } from "../@types";
import { BaseMemory } from "./BaseMemory";

export class InMemory<P extends keyof ProviderConfigMap> extends BaseMemory<P> {
  private messages: ProviderConfigMap[P]["message"][] = [];

  addMessage(message: ProviderConfigMap[P]["message"]): void {
    this.messages.push(message);
  }

  getContent(): ProviderConfigMap[P]["message"][] {
    return this.messages;
  }

  reset(): void {
    this.messages = [];
  }
}
