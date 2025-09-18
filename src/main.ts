import { GoogleGenAI } from "@google/genai";
import { createInterface } from "readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });

import { config } from "dotenv";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("Add GEMINI_API_KEY in the .env file and then retry");
  process.exit(0);
}

const ai = new GoogleGenAI({ apiKey });

const chat = ai.chats.create({ model: "gemini-2.0-flash" });

const runAgent = async () => {
  const userInput = await rl.question("User: ");

  if (userInput === "exit") process.exit(0);

  const response = await chat.sendMessage({ message: userInput });

  console.log(`Ai: ${response.text}`);

  runAgent();
};

runAgent();
