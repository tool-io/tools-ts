import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StopwordCountInput = {
  readonly text: string;
};

export type StopwordCountOutput = {
  readonly stopwordCount: number;
};

export const stopwordCountExample = {
  input: { text: "To be or not to be" },
  output: { stopwordCount: 6 },
} satisfies ToolExample<StopwordCountInput, StopwordCountOutput>;

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

export const stopwordCountTool = createSimpleTool({
  id: "text/stopword-count",
  title: "Stopword Counter",
  description:
    "Count whitespace-delimited words that match common English stopwords, ignoring case.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "stopwordCount",
      label: "Stopword count",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => ({
    stopwordCount: wordsOf(input.text as string).filter((word) =>
      stopwords.has(word.toLowerCase()),
    ).length,
  }),
});
export const runStopwordCount = stopwordCountTool.execute;
export default stopwordCountTool;
