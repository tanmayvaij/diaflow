import { readFileSync } from "fs";
import { reportToolError, toolResponse } from "../../utils";
import { DiaFlowTool } from "../../@types";

export const readFileTool = (): DiaFlowTool => {
  return {
    name: "readFile",
    description:
      "Reads the content of a file at the specified path using the provided encoding. Useful for workflows that need to access configuration files, logs, JSON data, or other text-based resources from the local filesystem, and returns the raw content as a string for further processing or analysis.",
    parameters: {
      properties: {
        filePath: {
          type: "string",
          description: "path of the file that has to be read",
        },
        encoding: {
          type: "string",
          description: "encoding of the file",
        },
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
