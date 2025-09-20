import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { createInterface } from "readline/promises";
import { config as dotenvConfig } from "dotenv";
import {
  makeDirectory,
  turnOnHallLights,
  turnOnKitchenLights,
  writeFile,
} from "./tools";
import {
  makeDirectoryDeclaration,
  turnOnHallLightsDeclaration,
  turnOnKitchenLightsDeclaration,
  writeFileDeclaration,
} from "./toolsDeclaration";
import { ContentListUnion } from "@google/genai";

dotenvConfig();

const rl = createInterface({ input: process.stdin, output: process.stdout });

const toolsMap = {
  turnOnHallLights,
  turnOnKitchenLights,
  makeDirectory,
  writeFile,
};

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("Add GEMINI_API_KEY in the .env file and then retry");
  process.exit(0);
}

const config: GenerateContentConfig = {
  systemInstruction: `
    You are an AI agent with tools for:
    - Creating directories
    - Writing files
    - Controlling lights

    You can use these tools to create HTML/CSS/JS projects by writing files in directories.
    When the user asks for a website, you should:
    1. Create a folder.
    2. Write HTML, CSS, JS files as needed.
    3. Use relative paths from the current directory.
    Always use the tools for these operations.
`,
  tools: [
    {
      functionDeclarations: [
        turnOnHallLightsDeclaration,
        turnOnKitchenLightsDeclaration,
        makeDirectoryDeclaration,
        writeFileDeclaration,
      ],
    },
  ],
};

const ai = new GoogleGenAI({ apiKey });

const contents: ContentListUnion = [
  {
    role: "user",
    parts: [
      {
        text: `The current working directory is ${process.cwd()}. 
You can use relative paths from here for file and folder operations.`,
      },
    ],
  },
];

const runAgent = async () => {
  while (true) {
    const userInput = await rl.question("User: ");

    if (userInput === "exit") break;

    contents.push({
      role: "user",
      parts: [
        {
          text: userInput,
        },
      ],
    });

    while (true) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config,
        contents,
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]!;

        console.log(`functionCall  ->  ${JSON.stringify(functionCall)}`);

        const { name, args } = functionCall;

        const toolResponse = toolsMap[name as keyof typeof toolsMap](
          args as any
        );

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
  }
};

runAgent();
