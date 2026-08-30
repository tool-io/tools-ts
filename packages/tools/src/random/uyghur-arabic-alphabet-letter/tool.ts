// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ug.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUyghurArabicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomUyghurArabicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ە", "ب", "پ", "ت", "ج", "چ", "خ", "د", "ر", "ز", "ژ", "س", "ش", "غ", "ف", "ق", "ك", "گ", "ڭ", "ل", "م", "ن", "ھ", "و", "ۇ", "ۆ", "ئۈ", "ۋ", "ې", "ى", "ي"] } as const;

export const randomUyghurArabicAlphabetLetterValueCount = 32;

export const calculateRandomUyghurArabicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomUyghurArabicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUyghurArabicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomUyghurArabicAlphabetLetterInput,
  RandomUyghurArabicAlphabetLetterOutput
>;

export const randomUyghurArabicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUyghurArabicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Uyghur Arabic-script alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/uyghur-arabic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/uyghur-arabic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Uyghur Arabic Alphabet Letter",
    },
  ],
  title: "Random Uyghur Arabic Alphabet Letter Generator",
});

export const runRandomUyghurArabicAlphabetLetter = randomUyghurArabicAlphabetLetterTool.execute;
export default randomUyghurArabicAlphabetLetterTool;
