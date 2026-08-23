import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CamelCaseInput = {
  readonly text: string;
};

export type CamelCaseOutput = {
  readonly formatted: string;
  readonly wordCount: number;
};

export const calculateCamelCase = (input: CamelCaseInput): CamelCaseOutput => {
  const words = input.text
    .replace(/([a-z\u00E0-\u00FC0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-.]+/g)
    .filter(Boolean);
  if (words.length === 0)
    return simpleError(
      "text",
      "Text must contain at least one word.",
      "empty_text",
    );
  return {
    formatted: words
      .map((word: string, index: number): string =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(""),
    wordCount: words.length,
  };
};

export const camelCaseExample = {
  input: {
    text: "parse HTTPResponse body_2",
  },
  output: {
    formatted: "parseHttpResponseBody2",
    wordCount: 5,
  },
} satisfies ToolExample<CamelCaseInput, CamelCaseOutput>;

export const camelCaseTool = createSimpleTool({
  id: "text/camel-case",
  title: "Camel Case Converter",
  description:
    "Convert text into camelCase by splitting on delimiters and case boundaries, lowercasing the first word and capitalizing the rest.",
  inputs: [
    {
      description: "Identifier or phrase to convert.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Text converted to camelCase.",
      id: "formatted",
      kind: "string",
      label: "Camel case",
    },
    {
      description: "Number of words detected before joining.",
      id: "wordCount",
      kind: "integer",
      label: "Word count",
    },
  ],
  calculate: (input) => calculateCamelCase({ text: input.text as string }),
});

export const runCamelCase = camelCaseTool.execute;
export default camelCaseTool;
