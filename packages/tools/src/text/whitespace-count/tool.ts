import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WhitespaceCountInput = {
  readonly text: string;
};

export type WhitespaceCountOutput = {
  readonly whitespaceCount: number;
};

export const whitespaceCountExample = {
  input: { text: "one two\nthree\tfour" },
  output: { whitespaceCount: 3 },
} satisfies ToolExample<WhitespaceCountInput, WhitespaceCountOutput>;

export const whitespaceCountTool = createSimpleTool({
  id: "text/whitespace-count",
  title: "Whitespace Counter",
  description:
    "Count how many Unicode whitespace characters appear in the given text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "whitespaceCount",
      label: "Whitespace count",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const whitespacePattern = /\s/g;
    return {
      whitespaceCount:
        (input.text as string).match(whitespacePattern)?.length ?? 0,
    };
  },
});
export const runWhitespaceCount = whitespaceCountTool.execute;
export default whitespaceCountTool;
