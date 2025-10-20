import { DiaFlowTool } from "../../@types";
import { reportToolError, toolResponse } from "../../utils";

export const currentWorkingDirectoryTool = (): DiaFlowTool => {
  return {
    name: "currentWorkingDirectory",
    description:
      "Returns the current working directory of the Node.js process. Useful for determining the base path where the agent or application is running, especially when performing file operations, managing relative paths, or verifying the runtime environment.",
    handler: () => {
      try {
        return toolResponse(`Current working directory: ${process.cwd()}`);
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
