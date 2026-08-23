import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SyllableCountApproxInput = {
  readonly text: string;
};

export type SyllableCountApproxOutput = {
  readonly syllableCount: number;
};

const syllablesPerWord = (word: string): number => {
  const groups = word.match(/[aeiouy]+/g);
  let count = groups === null ? 0 : groups.length;
  if (count > 1 && word.endsWith("e")) count -= 1;
  return Math.max(1, count);
};

export const syllableCountExample = {
  input: { text: "hello world" },
  output: { syllableCount: 3 },
} satisfies ToolExample<SyllableCountApproxInput, SyllableCountApproxOutput>;

export const syllableCountTool = createSimpleTool({
  id: "text/syllable-count-approx",
  title: "Syllable Count Approx Tool",
  description:
    "Approximate English syllable counts from vowel groups per word.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "syllableCount",
      label: "Syllable count",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => {
    const matches = (input.text as string).toLowerCase().match(/[a-z]+/g);
    const words = matches ?? [];
    if (words.length === 0)
      simpleError("text", "Text must contain at least one word.", "empty_text");
    return {
      syllableCount: words.reduce(
        (total, word) => total + syllablesPerWord(word),
        0,
      ),
    };
  },
});
export const runSyllableCountApprox = syllableCountTool.execute;
export default syllableCountTool;
