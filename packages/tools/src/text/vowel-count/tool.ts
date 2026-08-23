import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VowelCountInput = {
  readonly text: string;
};

export type VowelCountOutput = {
  readonly vowelCount: number;
};

export const vowelCountExample = {
  input: { text: "Hello World" },
  output: { vowelCount: 3 },
} satisfies ToolExample<VowelCountInput, VowelCountOutput>;

export const vowelCountTool = createSimpleTool({
  id: "text/vowel-count",
  title: "Vowel Count Tool",
  description:
    "Count ASCII vowels a, e, i, o and u case-insensitively in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "vowelCount",
      label: "Vowel count",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => ({
    vowelCount: ((input.text as string).match(/[aeiou]/gi) ?? []).length,
  }),
});
export const runVowelCount = vowelCountTool.execute;
export default vowelCountTool;
