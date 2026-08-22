import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsonantVowelRatioInput = {
  readonly text: string;
};

export type ConsonantVowelRatioOutput = {
  readonly ratio: number;
};

export const consonantVowelRatioExample = {
  input: { text: "Hello" },
  output: { ratio: 1.5 },
} satisfies ToolExample<ConsonantVowelRatioInput, ConsonantVowelRatioOutput>;

export const consonantVowelRatioTool = createSimpleTool({
  id: "text/consonant-vowel-ratio",
  title: "Consonant-Vowel Ratio Calculator",
  description:
    "Divide ASCII consonant letters by vowel letters in text, treating y as a consonant.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "ratio",
      label: "Consonant-to-vowel ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const text = input.text as string;
    const vowels = text.match(/[aeiou]/gi)?.length ?? 0;
    if (vowels === 0)
      simpleError("text", "Text must contain at least one vowel letter.");
    const letters = text.match(/[a-z]/gi)?.length ?? 0;
    return { ratio: (letters - vowels) / vowels };
  },
});
export const runConsonantVowelRatio = consonantVowelRatioTool.execute;
export default consonantVowelRatioTool;
