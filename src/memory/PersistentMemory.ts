import { Content } from "@google/genai";
import { BaseMemory, ToolResponse } from "../@types";
import { Collection, MongoClient } from "mongodb";

export class PersistentMemory implements BaseMemory {
  private client!: MongoClient;
  private collection!: Collection<Content>;

  constructor(private mongoUri: string) {}

  private async connect() {
    if (this.collection) return;
    this.client = new MongoClient(this.mongoUri);
    await this.client.connect();
    this.collection = this.client.db("diaflow").collection("memory");
  }

  async addUserText(text: string) {
    await this.connect();
    await this.collection.insertOne({ role: "user", parts: [{ text }] });
  }

  async addToolCall(name: string, args: Record<string, any>) {
    await this.connect();
    await this.collection.insertOne({
      role: "model",
      parts: [{ functionCall: { name, args } }],
    });
  }

  async addToolResponse(name: string, result: ToolResponse) {
    await this.connect();
    await this.collection.insertOne({
      role: "user",
      parts: [{ functionResponse: { name, response: { result } } }],
    });
  }

  async addModelText(text: string) {
    await this.connect();
    await this.collection.insertOne({ role: "model", parts: [{ text }] });
  }

  async getContent(): Promise<Content> {
    await this.connect();
    return (await this.collection.find().toArray()) as Content;
  }

  async reset() {
    await this.connect();
    await this.collection.deleteMany();
  }
}
