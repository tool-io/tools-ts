import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const longestWordTool = createSimpleTool({
  id: "text/longest-word",
  title: "Longest Word Finder",
  description:
    "Find the first longest whitespace-delimited word in text and its length.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "word", label: "Longest word", kind: "string" },
    { id: "length", label: "Length", kind: "integer" },
  ],
  calculate: (input) => {
    const words = wordsOf(input.text as string);
    if (words.length === 0)
      simpleError("text", "Provide at least one word.", "empty_text");
    let word = words[0]!;
    for (const candidate of words) {
      if (candidate.length > word.length) word = candidate;
    }
    return { length: word.length, word };
  },
});
export const runLongestWord = longestWordTool.execute;
export default longestWordTool;

export type LongestWordInput = {
  readonly text: string;
};

export type LongestWordOutput = {
  readonly word: string;
  readonly length: number;
};

export const longestWordExample = {
  input: {
    text: "example",
  },
  output: {
    length: 7,
    word: "example",
  },
} satisfies ToolExample<LongestWordInput, LongestWordOutput>;
