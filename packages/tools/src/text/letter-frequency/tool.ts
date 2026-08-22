import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const letterFrequencyTool = createSimpleTool({
  id: "text/letter-frequency",
  title: "Letter Frequency Counter",
  description:
    "Count how often each letter (case-insensitive) appears in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      description: "Lowercase letter mapped to its occurrence count.",
      id: "frequency",
      label: "Letter frequency",
      kind: "object",
    },
  ],
  calculate: (input) => {
    const frequency: Record<string, number> = {};
    for (const character of (input.text as string).toLowerCase()) {
      if (!/[a-z]/u.test(character)) continue;
      frequency[character] = (frequency[character] ?? 0) + 1;
    }
    return { frequency };
  },
});
export const runLetterFrequency = letterFrequencyTool.execute;
export default letterFrequencyTool;

export type LetterFrequencyInput = {
  readonly text: string;
};

export type LetterFrequencyOutput = {
  readonly frequency: Record<string, unknown>;
};

export const letterFrequencyExample = {
  input: {
    text: "example",
  },
  output: {
    frequency: {
      e: 2,
      x: 1,
      a: 1,
      m: 1,
      p: 1,
      l: 1,
    },
  },
} satisfies ToolExample<LetterFrequencyInput, LetterFrequencyOutput>;
