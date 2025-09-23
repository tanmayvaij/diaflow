import { Type } from "@google/genai";
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

export const tools: Tool[] = [
  {
    declaration: {
      name: "turnOnHallLights",
      description: "Turns on N number of lights of the hall",
      parameters: {
        type: Type.OBJECT,
        properties: {
          numberOfLights: {
            type: Type.NUMBER,
            description:
              "the count of lights of the hall that need to be turned on",
          },
        },
        required: ["numberOfLights"],
      },
    },
    handler: ({ numberOfLights }: { numberOfLights: number }) => {
      return { message: "hall lights are on", numberOfLights };
    },
  },
  {
    declaration: {
      name: "turnOnKitchenLights",
      description: "Turns on N number of lights of the kitchen",
      parameters: {
        type: Type.OBJECT,
        properties: {
          numberOfLights: {
            type: Type.NUMBER,
            description:
              "the count of lights of the kitchen that need to be turned on",
          },
        },
        required: ["numberOfLights"],
      },
    },
    handler: ({ numberOfLights }: { numberOfLights: number }) => {
      return { message: "kitchen lights are on", numberOfLights };
    },
  },
  {
    declaration: {
      name: "makeDirectory",
      description: "Creates directory on the given path",
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description:
              "path of the location in which the directory is to be created",
          },
        },
        required: ["filePath"],
      },
    },
    handler: ({ filePath }: { filePath: string }) => {
      try {
        mkdirSync(resolve(filePath), { recursive: true });
        return {
          success: true,
          message: `Directory created on path ${filePath}`,
        };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    },
  },
  {
    declaration: {
      name: "writeFile",
      description: "Writes content in the file mentioned on the given path",
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description:
              "path of the file in which the content is to be written",
          },
          content: {
            type: Type.STRING,
            description: "Content which is to be written in the file",
          },
        },
        required: ["filePath", "content"],
      },
    },
    handler: ({ filePath, content }: { filePath: string; content: string }) => {
      try {
        writeFileSync(resolve(filePath), content, "utf-8");
        return { success: true, message: `file written on path ${filePath}` };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    },
  },
];
