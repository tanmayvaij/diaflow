import { mkdirSync } from "fs";
import { reportToolError, toolResponse } from "../../utils";
import { DiaFlowTool } from "../../@types";

export const makeDirectoryTool = (): DiaFlowTool => {
  return {
      name: "makeDirectory",
      description:
        "Creates a new directory at the specified path, including any necessary parent directories. Useful for preparing folder structures for file storage, logs, or project organization, ensuring that nested directories are automatically created without errors.",
      parameters: {
        type: "object",
        properties: {
          dirPath: {
            type: "string",
            description: "Path where the directory has to be created",
          },
        },
      },
    handler: ({ dirPath }) => {
      try {
        mkdirSync(dirPath, { recursive: true });
        return toolResponse(`directory created on location: ${dirPath}`);
      } catch (error) {
        return reportToolError(error);
      }
    },
  };
};
