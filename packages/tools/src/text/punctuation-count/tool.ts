import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const punctuationCountTool = createSimpleTool({
  id: "text/punctuation-count",
  title: "Punctuation Counter",
  description:
    "Count the Unicode punctuation characters in text using the P category.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "punctuationCount", label: "Punctuation count", kind: "integer" },
  ],
  calculate: (input) => {
    const punctuationPattern = /\p{P}/gu;
    return {
      punctuationCount:
        (input.text as string).match(punctuationPattern)?.length ?? 0,
    };
  },
});
export const runPunctuationCount = punctuationCountTool.execute;
export default punctuationCountTool;

export type PunctuationCountInput = {
  readonly text: string;
};

export type PunctuationCountOutput = {
  readonly punctuationCount: number;
};

export const punctuationCountExample = {
  input: {
    text: "example",
  },
  output: {
    punctuationCount: 0,
  },
} satisfies ToolExample<PunctuationCountInput, PunctuationCountOutput>;
