import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const normalize = (text: string): string =>
  text
    .normalize("NFC")
    .toLowerCase()
    .replace(/\p{P}|\s/gu, "");

export const anagramCheckerTool = createSimpleTool({
  id: "text/anagram-checker",
  title: "Anagram Checker",
  description:
    "Check whether two texts are anagrams by comparing sorted character multisets (case, spaces and punctuation ignored).",
  inputs: [
    { id: "textA", label: "First text", kind: "string" },
    { id: "textB", label: "Second text", kind: "string" },
  ],
  outputs: [{ id: "isAnagram", label: "Anagram result", kind: "boolean" }],
  calculate: (input) => {
    const a = [...normalize(input.textA as string)].sort().join("");
    const b = [...normalize(input.textB as string)].sort().join("");
    return { isAnagram: a === b };
  },
});
export const runAnagramChecker = anagramCheckerTool.execute;
export default anagramCheckerTool;

export type AnagramCheckerInput = {
  readonly textA: string;
  readonly textB: string;
};

export type AnagramCheckerOutput = {
  readonly isAnagram: boolean;
};

export const anagramCheckerExample = {
  input: {
    textA: "example",
    textB: "example",
  },
  output: {
    isAnagram: true,
  },
} satisfies ToolExample<AnagramCheckerInput, AnagramCheckerOutput>;
