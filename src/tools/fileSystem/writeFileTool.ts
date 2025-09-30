import { Type } from "@google/genai";
import { writeFileSync } from "fs";
import { DiaFlowTool } from "../../@types";

export const writeFileTool: DiaFlowTool = {
  declaration: {
    name: "writeFile",
    description: "Writes given content in a file present on a given path",
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
  handler: ({
    filePath,
    content,
    encoding,
  }: {
    filePath: string;
    content: string;
    encoding: BufferEncoding;
  }) => {
    try {
      writeFileSync(filePath, content, encoding);
      return {
        success: true,
        data: `content written to file: ${filePath} with encoding ${encoding}`,
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
