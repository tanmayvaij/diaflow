import {
  Content,
  FunctionDeclaration,
  GenerateContentConfig,
  GoogleGenAI,
} from "@google/genai";

interface Tool {
  declaration: FunctionDeclaration;
  handler: (args: any) => any;
}

class Agent {
  private ai: GoogleGenAI;
  private contents: Content[] = [];
  private config: GenerateContentConfig;
  private toolsMap: Record<string, (args: any) => any>;

  constructor({
    apiKey,
    config,
    tools,
  }: {
    apiKey: string;
    config: GenerateContentConfig;
    tools: Tool[];
  }) {
    this.ai = new GoogleGenAI({ apiKey });
    this.config = {
      ...config,
      tools: [{ functionDeclarations: tools.map((tool) => tool.declaration) }],
    };
    this.toolsMap = Object.fromEntries(
      tools.map((tool) => [tool.declaration.name, tool.handler])
    );
  }

  async runAgent(text: string) {
    this.contents.push({
      role: "user",
      parts: [{ text }],
    });

    while (true) {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: this.config || {},
        contents: this.contents,
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]!;

        console.log(`functionCall  ->  ${JSON.stringify(functionCall)}`);

        const { name, args } = functionCall;

        const toolResponse = this.toolsMap[name as string]!(args as any);

        console.log(`toolResponse  ->  ${JSON.stringify(toolResponse)}`);

        this.contents.push({
          role: "model",
          parts: [
            {
              functionCall,
            },
          ],
        });
        this.contents.push({
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
}
