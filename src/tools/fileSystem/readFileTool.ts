import { Type } from "@google/genai";
import { readFileSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError, toolResponse } from "../../utils";

export const readFileTool = (): DiaFlowTool => {
  return {
    declaration: {
      name: "readFile",
      description: `
      
      `,
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
    handler: ({ filePath, encoding }) => {
      try {
        return toolResponse(readFileSync(filePath, encoding).toString());
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
