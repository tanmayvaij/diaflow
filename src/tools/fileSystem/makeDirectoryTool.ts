import { Type } from "@google/genai";
import { mkdirSync } from "fs";
import { DiaFlowTool } from "../../@types";
import { reportToolError } from "../../utils";

/**
 * DiaFlow Tool: makeDirectory
 *
 * This tool creates a new directory at the specified path.
 *
 * ✅ Use Case:
 *   - Helps agents create project folders, logs, or workspace directories dynamically.
 *   - Can be combined with writeFile/readFile tools to manage file system structures.
 *
 * ⚙️ Implementation:
 *   - Uses Node.js `fs.mkdirSync` with `{ recursive: true }` to ensure
 *     nested directories can be created without errors.
 *   - Returns a standardized success/error response as per DiaFlow tool convention.
 *
 * 📝 Example Input:
 * {
 *   "dirPath": "./output/logs"
 * }
 *
 * 📝 Example Response:
 * {
 *   success: true,
 *   data: "directory created on location: ./output/logs",
 *   error: undefined
 * }
 */
export const makeDirectoryTool = (): DiaFlowTool => {
  return {
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
        return reportToolError(error);
      }
    },
  };
};
