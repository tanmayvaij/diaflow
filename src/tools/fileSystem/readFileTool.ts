import { Type } from "@google/genai";
import { readFileSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError, toolResponse } from "../../utils";

export const readFileTool = (): DiaFlowTool => {
  return {
    declaration: {
      name: "readFile",
      description:
        "Reads the content of a file at the specified path using the provided encoding. Useful for workflows that need to access configuration files, logs, JSON data, or other text-based resources from the local filesystem, and returns the raw content as a string for further processing or analysis.",
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
