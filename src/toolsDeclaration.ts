import { FunctionDeclaration, Type } from "@google/genai";

export const turnOnHallLightsDeclaration: FunctionDeclaration = {
  name: "turnOnHallLights",
  description: "Turns on N number of lights of the hall",
  parameters: {
    type: Type.OBJECT,
    properties: {
      numberOfLights: {
        type: Type.NUMBER,
        description:
          "the count of lights of the hall that need to be turned on",
      },
    },
    required: ["numberOfLights"],
  },
};

export const turnOnKitchenLightsDeclaration: FunctionDeclaration = {
  name: "turnOnKitchenLights",
  description: "Turns on N number of lights of the kitchen",
  parameters: {
    type: Type.OBJECT,
    properties: {
      numberOfLights: {
        type: Type.NUMBER,
        description:
          "the count of lights of the kitchen that need to be turned on",
      },
    },
    required: ["numberOfLights"],
  },
};

export const makeDirectoryDeclaration: FunctionDeclaration = {
  name: "makeDirectory",
  description: "Creates directory on the given path",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description:
          "path of the location in which the directory is to be created",
      },
    },
    required: ["filePath"],
  },
};

export const writeFileDeclaration: FunctionDeclaration = {
  name: "writeFile",
  description: "Writes content in the file mentioned on the given path",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: "path of the file in which the content is to be written",
      },
      content: {
        type: Type.STRING,
        description: "Content which is to be written in the file",
      },
    },
    required: ["filePath", "content"],
  },
};
