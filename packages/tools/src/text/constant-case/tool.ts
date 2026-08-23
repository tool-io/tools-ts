import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConstantCaseInput = {
  readonly text: string;
};

export type ConstantCaseOutput = {
  readonly formatted: string;
  readonly wordCount: number;
};

export const calculateConstantCase = (
  input: ConstantCaseInput,
): ConstantCaseOutput => {
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
      .map((word: string): string => word.toUpperCase())
      .join("_"),
    wordCount: words.length,
  };
};

export const constantCaseExample = {
  input: {
    text: "parse HTTPResponse body_2",
  },
  output: {
    formatted: "PARSE_HTTP_RESPONSE_BODY_2",
    wordCount: 5,
  },
} satisfies ToolExample<ConstantCaseInput, ConstantCaseOutput>;

export const constantCaseTool = createSimpleTool({
  id: "text/constant-case",
  title: "Constant Case Converter",
  description:
    "Convert text into CONSTANT_CASE by splitting on delimiters and case boundaries, then joining uppercase words with underscores.",
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
      description: "Text converted to CONSTANT_CASE.",
      id: "formatted",
      kind: "string",
      label: "Constant case",
    },
    {
      description: "Number of words detected before joining.",
      id: "wordCount",
      kind: "integer",
      label: "Word count",
    },
  ],
  calculate: (input) => calculateConstantCase({ text: input.text as string }),
});

export const runConstantCase = constantCaseTool.execute;
export default constantCaseTool;
