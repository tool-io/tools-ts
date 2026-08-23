import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KebabCaseInput = {
  readonly text: string;
};

export type KebabCaseOutput = {
  readonly kebab: string;
  readonly wordCount: number;
};

export const calculateKebabCase = (input: KebabCaseInput): KebabCaseOutput => {
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
    kebab: words.map((word) => word.toLowerCase()).join("-"),
    wordCount: words.length,
  };
};

export const kebabCaseExample = {
  input: {
    text: "Hello World, kebabCase Sample",
  },
  output: {
    kebab: "hello-world-kebab-case-sample",
    wordCount: 5,
  },
} satisfies ToolExample<KebabCaseInput, KebabCaseOutput>;

export const kebabCaseTool = createSimpleTool({
  id: "text/kebab-case",
  title: "Kebab Case Converter",
  description:
    "Convert text into kebab-case by lowercasing detected words and joining them with single hyphens.",
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
      description: "Lowercased words joined by single hyphens.",
      id: "kebab",
      kind: "string",
      label: "kebab",
    },
    {
      description: "Number of detected words.",
      id: "wordCount",
      kind: "integer",
      label: "wordCount",
    },
  ],
  calculate: (input) => calculateKebabCase({ text: input.text as string }),
});

export const runKebabCase = kebabCaseTool.execute;
export default kebabCaseTool;
