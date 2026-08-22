import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StopwordRemovalInput = {
  readonly text: string;
};

export type StopwordRemovalOutput = {
  readonly result: string;
};

export const stopwordRemovalExample = {
  input: { text: "The quick brown fox jumps over the lazy dog" },
  output: { result: "quick brown fox jumps over lazy dog" },
} satisfies ToolExample<StopwordRemovalInput, StopwordRemovalOutput>;

const stopwords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "if",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "to",
  "from",
  "in",
  "on",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "can",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "not",
  "no",
]);

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const stopwordRemovalTool = createSimpleTool({
  id: "text/stopword-removal",
  title: "Stopword Remover",
  description:
    "Remove common English stopwords from text, preserving original tokens and order.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "result", label: "Text without stopwords", kind: "string" }],
  calculate: (input) => ({
    result: wordsOf(input.text as string)
      .filter((word) => !stopwords.has(word.toLowerCase()))
      .join(" "),
  }),
});
export const runStopwordRemoval = stopwordRemovalTool.execute;
export default stopwordRemovalTool;
