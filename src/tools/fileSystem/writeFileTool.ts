import { Type } from "@google/genai";
import { writeFileSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError } from "../../utils";

/**
 * DiaFlow Tool: writeFile
 *
 * This tool writes the provided content to a file at the specified path with the given encoding.
 *
 * ✅ Use Case:
 *   - Create or update files such as logs, configs, or generated reports.
 *   - Can be combined with `makeDirectory` to ensure paths exist before writing.
 *
 * ⚙️ Implementation:
 *   - Uses Node.js `fs.writeFileSync` with the given encoding.
 *   - Overwrites the file if it already exists.
 *   - Errors (e.g., invalid path, permission denied) are caught and reported
 *     via `reportToolError`.
 *
 * 📝 Example Input:
 * {
 *   "filePath": "./output/report.txt",
 *   "content": "Hello World!",
 *   "encoding": "utf-8"
 * }
 *
 * 📝 Example Response:
 * {
 *   success: true,
 *   data: "content written to file: ./output/report.txt with encoding utf-8",
 *   error: undefined
 * }
 *
 * ⚠️ Note:
 *   - Overwrites existing files by default.
 *   - Ensure correct file permissions and paths to prevent accidental data loss.
 */
export const writeFileTool = (): DiaFlowTool => {
  return {
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
        return reportToolError(error);
      }
    },
  };
};
