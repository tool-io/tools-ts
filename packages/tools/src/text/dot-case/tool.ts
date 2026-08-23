import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DotCaseInput = {
  readonly text: string;
};

export type DotCaseOutput = {
  readonly formatted: string;
  readonly wordCount: number;
};

export const calculateDotCase = (input: DotCaseInput): DotCaseOutput => {
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
      .map((word: string): string => word.toLowerCase())
      .join("."),
    wordCount: words.length,
  };
};

export const dotCaseExample = {
  input: {
    text: "parse HTTPResponse body_2",
  },
  output: {
    formatted: "parse.http.response.body.2",
    wordCount: 5,
  },
} satisfies ToolExample<DotCaseInput, DotCaseOutput>;

export const dotCaseTool = createSimpleTool({
  id: "text/dot-case",
  title: "Dot Case Converter",
  description:
    "Convert text into dot.case by splitting on delimiters and case boundaries, then joining lowercase words with dots.",
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
      description: "Text converted to dot.case.",
      id: "formatted",
      kind: "string",
      label: "Dot case",
    },
    {
      description: "Number of words detected before joining.",
      id: "wordCount",
      kind: "integer",
      label: "Word count",
    },
  ],
  calculate: (input) => calculateDotCase({ text: input.text as string }),
});

export const runDotCase = dotCaseTool.execute;
export default dotCaseTool;
