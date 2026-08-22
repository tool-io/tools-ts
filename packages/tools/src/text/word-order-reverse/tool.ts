import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WordOrderReverseInput = {
  readonly text: string;
};

export type WordOrderReverseOutput = {
  readonly result: string;
};

export const wordOrderReverseExample = {
  input: { text: "the quick brown fox jumps" },
  output: { result: "jumps fox brown quick the" },
} satisfies ToolExample<WordOrderReverseInput, WordOrderReverseOutput>;

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const wordOrderReverseTool = createSimpleTool({
  id: "text/word-order-reverse",
  title: "Word Order Reverser",
  description:
    "Reverse the order of whitespace-separated words and join them with single spaces.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "result", label: "Reversed text", kind: "string" }],
  calculate: (input) => ({
    result: wordsOf(input.text as string)
      .reverse()
      .join(" "),
  }),
});
export const runWordOrderReverse = wordOrderReverseTool.execute;
export default wordOrderReverseTool;
