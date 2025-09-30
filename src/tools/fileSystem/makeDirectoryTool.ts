import { Type } from "@google/genai";
import { mkdirSync } from "fs";
import { DiaFlowTool } from "../../@types";

export const makeDirectoryTool: DiaFlowTool = {
  declaration: {
    name: "makeDirectory",
    description: "Creates a directory on a given path",
    parameters: {
      type: Type.OBJECT,
      properties: {
        dirPath: {
          type: Type.STRING,
          description: "Path where the directory has to be created",
        },
      },
      required: ["dirPath"],
    },
  },
  handler: ({ dirPath }: { dirPath: string }) => {
    try {
      mkdirSync(dirPath, { recursive: true });
      return {
        success: true,
        data: `directory created on location: ${dirPath}`,
        error: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
