import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { createInterface } from "readline/promises";
import { config } from "dotenv";
import { geminiConfig } from "./config";
import { tools } from "./tools";
import { contents } from "./contents";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("Add GEMINI_API_KEY in the .env file and then retry");
  process.exit(0);
}

const ai = new GoogleGenAI({ apiKey });

const runAgent = async ({
  text,
  config,
}: {
  text: string;
  config?: GenerateContentConfig;
}) => {
  contents.push({
    role: "user",
    parts: [{ text }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: config || {},
      contents,
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]!;

      console.log(`functionCall  ->  ${JSON.stringify(functionCall)}`);

      const { name, args } = functionCall;

      const toolResponse = tools[name as keyof typeof tools](args as any);

      console.log(`toolResponse  ->  ${JSON.stringify(toolResponse)}`);

      contents.push({
        role: "model",
        parts: [
          {
            functionCall,
          },
        ],
      });
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: name!,
              response: { result: toolResponse },
            },
          },
        ],
      });
    } else {
      console.log(`Ai: ${response.text}`);
      break;
    }
  }
};

const main = async () => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  while (true) {
    const userInput = await rl.question("User: ");
    if (userInput === "exit") process.exit(0);
    await runAgent({ text: userInput, config: geminiConfig });
  }
};

main();
