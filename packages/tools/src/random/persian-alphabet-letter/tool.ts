// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/fa.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPersianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomPersianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"] } as const;

export const randomPersianAlphabetLetterValueCount = 32;

export const calculateRandomPersianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomPersianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPersianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomPersianAlphabetLetterInput,
  RandomPersianAlphabetLetterOutput
>;

export const randomPersianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPersianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Persian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/persian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/persian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Persian Alphabet Letter",
    },
  ],
  title: "Random Persian Alphabet Letter Generator",
});

export const runRandomPersianAlphabetLetter = randomPersianAlphabetLetterTool.execute;
export default randomPersianAlphabetLetterTool;
