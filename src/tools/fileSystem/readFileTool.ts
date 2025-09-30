import { Type } from "@google/genai";
import { readFileSync } from "fs";
import { DiaFlowTool } from "../../@types";

export const readFileTool: DiaFlowTool = {
  declaration: {
    name: "readFile",
    description: "Reads a file present on a given path",
    parameters: {
      type: Type.OBJECT,
      properties: {
        filePath: {
          type: Type.STRING,
          description: "path of the file that has to be read",
        },
        encoding: {
          type: Type.STRING,
          description: "encoding of the file",
        },
      },
      required: ["filePath", "encoding"],
    },
  },
  handler: ({
    filePath,
    encoding,
  }: {
    filePath: string;
    encoding: BufferEncoding;
  }) => {
    try {
      return {
        success: true,
        data: readFileSync(filePath, encoding),
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
