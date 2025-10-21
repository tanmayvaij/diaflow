import { ProviderConfigMap } from "../@types";

export abstract class BaseMemory<P extends keyof ProviderConfigMap> {
  abstract addMessage(
    message: ProviderConfigMap[P]["message"]
  ): Promise<void> | void;

  abstract getContent():
    | ProviderConfigMap[P]["message"][]
    | Promise<ProviderConfigMap[P]["message"][]>;

  abstract reset(): void;
}
