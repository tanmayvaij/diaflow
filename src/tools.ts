import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

export const turnOnHallLights = ({
  numberOfLights,
}: {
  numberOfLights: number;
}) => {
  return { message: "hall lights are on", numberOfLights };
};

export const turnOnKitchenLights = ({
  numberOfLights,
}: {
  numberOfLights: number;
}) => {
  return { message: "kitchen lights are on", numberOfLights };
};

export const makeDirectory = ({ filePath }: { filePath: string }) => {
  try {
    mkdirSync(resolve(filePath), { recursive: true });
    return { success: true, message: `Directory created on path ${filePath}` };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

export const writeFile = ({
  filePath,
  content,
}: {
  filePath: string;
  content: string;
}) => {
  try {
    writeFileSync(resolve(filePath), content, "utf-8");
    return { success: true, message: `file written on path ${filePath}` };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};
