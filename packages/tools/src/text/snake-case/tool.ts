import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SnakeCaseInput = {
  readonly text?: string;
};

export type SnakeCaseOutput = {
  readonly snakeCased: string;
};

export const calculateSnakeCase = (input: SnakeCaseInput): SnakeCaseOutput => {
  return {
    snakeCased: (input.text ?? "My API Endpoint v2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase(),
  };
};

export const snakeCaseExample = {
  input: {
    text: "My API Endpoint v2",
  },
  output: {
    snakeCased: "my_api_endpoint_v2",
  },
} satisfies ToolExample<SnakeCaseInput, SnakeCaseOutput>;

export const snakeCaseTool = createSimpleTool({
  id: "text/snake-case",
  title: "Snake Case Converter",
  description:
    "Convert camelCase, PascalCase, kebab-case or spaced text into lower snake_case.",
  inputs: [
    {
      description: "Text to convert.",
      default: "My API Endpoint v2",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Snake_cased text.",
      id: "snakeCased",
      kind: "string",
      label: "Snake case",
    },
  ],
  calculate: (input) =>
    calculateSnakeCase({ text: input.text as string | undefined }),
});

export const runSnakeCase = snakeCaseTool.execute;
export default snakeCaseTool;
