import { Type } from "@google/genai";
import { writeFileSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError, toolResponse } from "../../utils";

export const writeFileTool = (): DiaFlowTool => {
  return {
    declaration: {
      name: "writeFile",
      description:
        "Writes the provided content to a file at the specified path using the given encoding. Useful for saving configuration, logs, JSON data, or other text-based information to the local filesystem, ensuring data is persisted for further processing or later retrieval.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: "path of the file where the content is to be written",
          },
          content: {
            type: Type.STRING,
            description: "content which is to be written in the file",
          },
          encoding: {
            type: Type.STRING,
            description: "encoding of the file",
          },
        },
        required: ["filePath", "content", "encoding"],
      },
    },
    handler: ({ filePath, content, encoding }) => {
      try {
        writeFileSync(filePath, content, encoding);
        return toolResponse(
          `content written to file: ${filePath} with encoding ${encoding}`
        );
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
