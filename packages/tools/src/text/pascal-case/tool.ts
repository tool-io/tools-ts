import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PascalCaseInput = {
  readonly text: string;
};

export type PascalCaseOutput = {
  readonly pascal: string;
  readonly wordCount: number;
};

export const calculatePascalCase = (
  input: PascalCaseInput,
): PascalCaseOutput => {
  const words = input.text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  if (!words.length)
    return simpleError(
      "text",
      "Text must contain at least one alphanumeric word.",
      "empty_text",
    );
  return {
    pascal: words
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(""),
    wordCount: words.length,
  };
};

export const pascalCaseExample = {
  input: {
    text: "hello world-foo barBaz qux",
  },
  output: {
    pascal: "HelloWorldFooBarBazQux",
    wordCount: 6,
  },
} satisfies ToolExample<PascalCaseInput, PascalCaseOutput>;

export const pascalCaseTool = createSimpleTool({
  id: "text/pascal-case",
  title: "Pascal Case Converter",
  description:
    "Convert text into PascalCase by capitalizing every detected word and joining them.",
  inputs: [
    {
      description:
        "Free-form text; words may be separated by spaces, punctuation or camelCase humps.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Words capitalized and concatenated without separators.",
      id: "pascal",
      kind: "string",
      label: "pascal",
    },
    {
      description: "Number of detected words.",
      id: "wordCount",
      kind: "integer",
      label: "wordCount",
    },
  ],
  calculate: (input) => calculatePascalCase({ text: input.text as string }),
});

export const runPascalCase = pascalCaseTool.execute;
export default pascalCaseTool;
