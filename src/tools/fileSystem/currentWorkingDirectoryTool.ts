import { DiaFlowTool } from "../../@types";
import { reportToolError, toolResponse } from "../../utils";

/**
 * DiaFlow Tool: currentWorkingDirectory
 *
 * This tool retrieves the absolute path of the process's current working directory.
 *
 * ✅ Use Case:
 *   - Useful when agents or workflows need to understand the execution context.
 *   - Can be combined with file system tools (read/write/mkdir) to resolve relative paths.
 *
 * ⚙️ Implementation:
 *   - Uses Node.js `process.cwd()` to get the current working directory.
 *   - Returns a standardized success/error response as per DiaFlow tool convention.
 *
 * 📝 Example Response:
 * {
 *   success: true,
 *   data: "Current working directory: /Users/tanmay/projects/diaflow",
 *   error: undefined
 * }
 */
export const currentWorkingDirectoryTool = (): DiaFlowTool => {
  return {
    declaration: {
      name: "currentWorkingDirectory",
      description: "Gets the current working directory path",
    },
    handler: () => {
      try {
        return toolResponse(`Current working directory: ${process.cwd()}`);
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
