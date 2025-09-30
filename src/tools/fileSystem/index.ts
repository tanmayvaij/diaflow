import { currentWorkingDirectoryTools } from "./currentWorkingDirectoryTool";
import { makeDirectoryTool } from "./makeDirectoryTool";
import { readFileTool } from "./readFileTool";
import { writeFileTool } from "./writeFileTool";

export const fileSystemTools = {
  readFileTool,
  writeFileTool,
  makeDirectoryTool,
  currentWorkingDirectoryTools,
};
