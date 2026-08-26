import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LetterFrequencyHistogramInput = {
  readonly text: string;
};

export type LetterFrequencyHistogramOutput = {
  readonly counts: readonly number[];
  readonly mostCommonLetter: string;
  readonly totalLetters: number;
};

export const calculateLetterFrequencyHistogram = (
  input: LetterFrequencyHistogramInput,
): LetterFrequencyHistogramOutput => {
  const counts = new Array<number>(26).fill(0);
  let totalLetters = 0;
  const normalized = input.text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  for (const character of normalized) {
    const code = character.charCodeAt(0) - 97;
    if (code >= 0 && code < 26) {
      counts[code] += 1;
      totalLetters += 1;
    }
  }
  if (totalLetters === 0)
    return simpleError(
      "text",
      "The text must contain at least one A-Z letter.",
      "no_letters",
    );
  let bestIndex = 0;
  for (let index = 1; index < 26; index += 1)
    if (counts[index]! > counts[bestIndex]!) bestIndex = index;
  return {
    counts,
    mostCommonLetter: String.fromCharCode(65 + bestIndex),
    totalLetters,
  };
};

export const letterFrequencyHistogramExample = {
  input: { text: "ABRA CADABA" },
  output: {
    counts: [
      5, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0,
    ],
    mostCommonLetter: "A",
    totalLetters: 10,
  },
} satisfies ToolExample<
  LetterFrequencyHistogramInput,
  LetterFrequencyHistogramOutput
>;

export const letterFrequencyHistogramTool = createSimpleTool({
  id: "epigraphy/letter-frequency-histogram",
  title: "Letter Frequency Distribution Epigraphic Corpus Histogram",
  description:
    "Build a 26-slot A-Z frequency histogram for an inscription text, folding diacritics into their base Latin letters and reporting the total plus the first most frequent letter.",
  inputs: [
    {
      description: "Inscription or corpus text to analyze.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Counts for A through Z in alphabetical order.",
      id: "counts",
      kind: "numberList",
      label: "Counts",
    },
    {
      description:
        "Uppercase letter with the highest count (earliest on ties).",
      id: "mostCommonLetter",
      kind: "string",
      label: "Most common",
    },
    {
      description: "Number of counted letters.",
      id: "totalLetters",
      kind: "integer",
      label: "Total letters",
    },
  ],
  calculate: (input) =>
    calculateLetterFrequencyHistogram(
      input as unknown as LetterFrequencyHistogramInput,
    ),
});

export const runLetterFrequencyHistogram = letterFrequencyHistogramTool.execute;
export default letterFrequencyHistogramTool;
