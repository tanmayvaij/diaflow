import { DiaFlowTool } from "../../@types";
import { reportToolError } from "../../utils";

export const fetchWebPage = (): DiaFlowTool => {
  return {
    declaration: {
      name: "fetchWebPage",
      description: "Gets the data from the web page",
    },
    handler: () => {
      try {
        return {
          success: true,
          data: `Current working directory: ${process.cwd()}`,
          error: undefined,
        };
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
