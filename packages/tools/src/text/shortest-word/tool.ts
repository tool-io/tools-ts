import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShortestWordInput = {
  readonly text: string;
};

export type ShortestWordOutput = {
  readonly length: number;
  readonly word: string;
};

export const shortestWordExample = {
  input: { text: "I love functional programming" },
  output: { length: 1, word: "I" },
} satisfies ToolExample<ShortestWordInput, ShortestWordOutput>;

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const shortestWordTool = createSimpleTool({
  id: "text/shortest-word",
  title: "Shortest Word Finder",
  description:
    "Find the first shortest whitespace-delimited word in text and its length.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "word", label: "Shortest word", kind: "string" },
    { id: "length", label: "Length", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    const words = wordsOf(input.text as string);
    if (words.length === 0)
      simpleError("text", "Provide at least one word.", "empty_text");
    let word = words[0]!;
    for (const candidate of words) {
      if (candidate.length < word.length) word = candidate;
    }
    return { length: word.length, word };
  },
});
export const runShortestWord = shortestWordTool.execute;
export default shortestWordTool;
