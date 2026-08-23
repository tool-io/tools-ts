import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WordFrequencyInput = {
  readonly text: string;
  readonly caseSensitive?: boolean;
};

export type WordFrequencyOutput = {
  readonly totalWords: number;
  readonly uniqueWords: number;
  readonly mostFrequent: string;
  readonly frequencies: Record<string, unknown>;
};

export const calculateWordFrequency = (
  input: WordFrequencyInput,
): WordFrequencyOutput => {
  const source = input.caseSensitive ? input.text : input.text.toLowerCase();
  const words = source.match(/[\p{L}\p{N}']+/gu) ?? [];
  if (words.length === 0)
    simpleError("text", "Text must contain at least one word.", "empty_text");
  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  const frequencies: Record<string, number> = {};
  for (const word of [...counts.keys()].sort())
    frequencies[word] = counts.get(word)!;
  const ranked = [...counts.entries()].sort(
    (first, second) => second[1] - first[1] || (first[0] < second[0] ? -1 : 1),
  );
  return {
    totalWords: words.length,
    uniqueWords: counts.size,
    mostFrequent: ranked[0]![0],
    frequencies,
  };
};

export const wordFrequencyExample = {
  input: {
    text: "The quick brown fox jumps over the lazy dog. The dog barks!",
    caseSensitive: false,
  },
  output: {
    totalWords: 12,
    uniqueWords: 9,
    mostFrequent: "the",
    frequencies: {
      barks: 1,
      brown: 1,
      dog: 2,
      fox: 1,
      jumps: 1,
      lazy: 1,
      over: 1,
      quick: 1,
      the: 3,
    },
  },
} satisfies ToolExample<WordFrequencyInput, WordFrequencyOutput>;

export const wordFrequencyTool = createSimpleTool({
  id: "text/word-frequency",
  title: "Word Frequency Counter",
  description:
    "Count how often each word appears in a text and report totals plus the most frequent word.",
  inputs: [
    {
      description: "Text to analyse.",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      description: "Treat differently cased words as distinct.",
      default: false,
      id: "caseSensitive",
      kind: "boolean",
      label: "Case sensitive",
    },
  ],
  outputs: [
    {
      description: "Total number of words found.",
      id: "totalWords",
      kind: "integer",
      label: "Total words",
    },
    {
      description: "Number of distinct words.",
      id: "uniqueWords",
      kind: "integer",
      label: "Unique words",
    },
    {
      description: "Most frequent word, ties broken alphabetically.",
      id: "mostFrequent",
      kind: "string",
      label: "Most frequent",
    },
    {
      description: "Word counts sorted alphabetically.",
      id: "frequencies",
      kind: "object",
      label: "Frequencies",
    },
  ],
  calculate: (input) =>
    calculateWordFrequency({
      caseSensitive: input.caseSensitive as boolean,
      text: input.text as string,
    }),
});

export const runWordFrequency = wordFrequencyTool.execute;
export default wordFrequencyTool;
