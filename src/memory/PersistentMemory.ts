import { Content } from "@google/genai";
import { ProviderConfigMap } from "../@types";
import { Collection, MongoClient, OptionalUnlessRequiredId } from "mongodb";
import { BaseMemory } from "./BaseMemory";

export class PersistentMemory<
  P extends keyof ProviderConfigMap
> extends BaseMemory<P> {
  private client: MongoClient;
  private collection!: Collection<ProviderConfigMap[P]["message"]>;

  constructor({ mongoUri }: { mongoUri: string }) {
    super();
    this.client = new MongoClient(mongoUri);
  }

  private async connect() {
    if (this.collection) return;
    await this.client.connect();
    this.collection = this.client.db("diaflow").collection("memory");
  }

  async addMessage(message: ProviderConfigMap[P]["message"]): Promise<void> {
    await this.connect();
    await this.collection.insertOne(
      message as OptionalUnlessRequiredId<ProviderConfigMap[P]["message"]>
    );
  }

  async getContent(): Promise<ProviderConfigMap[P]["message"][]> {
    await this.connect();
    return (await this.collection.find().toArray()) as Content[];
  }

  async reset() {
    await this.connect();
    await this.collection.deleteMany();
  }
}
