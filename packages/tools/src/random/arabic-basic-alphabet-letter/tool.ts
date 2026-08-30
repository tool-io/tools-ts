// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ar.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomArabicBasicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomArabicBasicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"] } as const;

export const randomArabicBasicAlphabetLetterValueCount = 28;

export const calculateRandomArabicBasicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomArabicBasicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomArabicBasicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomArabicBasicAlphabetLetterInput,
  RandomArabicBasicAlphabetLetterOutput
>;

export const randomArabicBasicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomArabicBasicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern basic Arabic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/arabic-basic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/arabic-basic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Arabic Basic Alphabet Letter",
    },
  ],
  title: "Random Arabic Basic Alphabet Letter Generator",
});

export const runRandomArabicBasicAlphabetLetter = randomArabicBasicAlphabetLetterTool.execute;
export default randomArabicBasicAlphabetLetterTool;
