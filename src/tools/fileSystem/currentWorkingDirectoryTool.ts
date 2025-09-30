import { DiaFlowTool } from "../../@types";

export const currentWorkingDirectoryTools: DiaFlowTool = {
  declaration: {
    name: "currentWorkingDirectory",
    description: "Gets the current working directory path",
  },
  handler: () => {
    try {
      return {
        success: true,
        data: `Current working directory: ${process.cwd()}`,
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
