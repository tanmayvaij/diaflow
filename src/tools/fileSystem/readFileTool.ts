import { Type } from "@google/genai";
import { readFileSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError } from "../../utils";

/**
 * DiaFlow Tool: readFile
 *
 * This tool reads the contents of a file from the given path using the specified encoding.
 *
 * ✅ Use Case:
 *   - Retrieve configuration, JSON, or text data stored in local files.
 *   - Helpful for workflows that need to analyze or transform file contents.
 *
 * ⚙️ Implementation:
 *   - Uses Node.js `fs.readFileSync` with the provided `encoding`.
 *   - Returns the raw file content as a string.
 *   - Errors (e.g., file not found, permission denied) are caught and reported
 *     via `reportToolError`.
 *
 * 📝 Example Input:
 * {
 *   "filePath": "./config/settings.json",
 *   "encoding": "utf-8"
 * }
 *
 * 📝 Example Response:
 * {
 *   success: true,
 *   data: "{ \"theme\": \"dark\", \"autosave\": true }",
 *   error: undefined
 * }
 */
export const readFileTool = (): DiaFlowTool => {
  return {
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
    handler: ({ filePath, encoding }) => {
      try {
        return {
          success: true,
          data: readFileSync(filePath, encoding).toString(),
          error: undefined,
        };
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
