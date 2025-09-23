import { config } from "dotenv";
import { Agent } from "./agent";
import { geminiConfig } from "./config";
import { tools } from "./tools";
import { Memory } from "./memory";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("Add GEMINI_API_KEY in the .env file and then retry");
  process.exit(0);
}

const memory = new Memory();

const agent1 = new Agent({ apiKey, config: geminiConfig, tools, memory });

const main = async () => {
  const res1 = await agent1.runAgent("Hello, my name is tanmay.")
  console.log(res1);
};

main()
