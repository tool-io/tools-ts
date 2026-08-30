// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ckb.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSoraniKurdishAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomSoraniKurdishAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ئ", "ا", "ب", "پ", "ت", "ج", "چ", "ح", "خ", "د", "ر", "ڕ", "ز", "ژ", "س", "ش", "ع", "غ", "ف", "ڤ", "ق", "ک", "گ", "ل", "ڵ", "م", "ن", "ه", "ە", "و", "ۆ", "وو", "ی", "ێ"] } as const;

export const randomSoraniKurdishAlphabetLetterValueCount = 34;

export const calculateRandomSoraniKurdishAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomSoraniKurdishAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSoraniKurdishAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomSoraniKurdishAlphabetLetterInput,
  RandomSoraniKurdishAlphabetLetterOutput
>;

export const randomSoraniKurdishAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSoraniKurdishAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Sorani Kurdish alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/sorani-kurdish-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/sorani-kurdish-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Sorani Kurdish Alphabet Letter",
    },
  ],
  title: "Random Sorani Kurdish Alphabet Letter Generator",
});

export const runRandomSoraniKurdishAlphabetLetter = randomSoraniKurdishAlphabetLetterTool.execute;
export default randomSoraniKurdishAlphabetLetterTool;
