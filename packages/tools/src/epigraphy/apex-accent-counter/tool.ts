import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApexAccentCounterInput = {
  readonly text: string;
};

export type ApexAccentCounterOutput = {
  readonly accentedVowels: number;
  readonly totalVowels: number;
  readonly accentDensity: number;
};

const VOWEL_PATTERN = /[aeiou\u00e6]/g;
const ACCENTED_VOWEL_PATTERN = /[\u00e1\u00e9\u00ed\u00f3\u00fa\u01fd]/g;

export const calculateApexAccentCounter = (
  input: ApexAccentCounterInput,
): ApexAccentCounterOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const normalized = input.text.normalize("NFC").toLowerCase();
  const stripped = normalized.normalize("NFD").replace(/\p{M}/gu, "");
  const totalVowels = stripped.match(VOWEL_PATTERN)?.length ?? 0;
  const accentedVowels = normalized.match(ACCENTED_VOWEL_PATTERN)?.length ?? 0;
  return {
    accentedVowels,
    totalVowels,
    accentDensity: totalVowels === 0 ? 0 : accentedVowels / totalVowels,
  };
};

export const apexAccentCounterExample = {
  input: { text: "\u00c1VIT\u00c1" },
  output: {
    accentedVowels: 2,
    totalVowels: 3,
    accentDensity: 0.6666666666666666,
  },
} satisfies ToolExample<ApexAccentCounterInput, ApexAccentCounterOutput>;

export const apexAccentCounterTool = createSimpleTool({
  id: "epigraphy/apex-accent-counter",
  title: "Apex Accent Presence Counter for Vowels",
  description:
    "Counts vowels carrying an apex-style acute accent, combining marks included, and reports their density among all vowels.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Transcription possibly containing accented vowels.",
    },
  ],
  outputs: [
    {
      id: "accentedVowels",
      kind: "integer",
      label: "Accented vowels",
      description: "Number of acutely accented vowels.",
    },
    {
      id: "totalVowels",
      kind: "integer",
      label: "Total vowels",
      description: "Number of unaccented and accented vowels.",
    },
    {
      id: "accentDensity",
      kind: "number",
      label: "Density",
      description:
        "Accented vowels divided by total vowels, zero when vowel-free.",
    },
  ],
  calculate: (input) =>
    calculateApexAccentCounter(input as unknown as ApexAccentCounterInput),
});

export const runApexAccentCounter = apexAccentCounterTool.execute;
export default apexAccentCounterTool;
