// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/tr.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTurkishAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomTurkishAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "Ç", "D", "E", "F", "G", "Ğ", "H", "I", "İ", "J", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"] } as const;

export const randomTurkishAlphabetLetterValueCount = 29;

export const calculateRandomTurkishAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomTurkishAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTurkishAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomTurkishAlphabetLetterInput,
  RandomTurkishAlphabetLetterOutput
>;

export const randomTurkishAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTurkishAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Turkish alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/turkish-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/turkish-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Turkish Alphabet Letter",
    },
  ],
  title: "Random Turkish Alphabet Letter Generator",
});

export const runRandomTurkishAlphabetLetter = randomTurkishAlphabetLetterTool.execute;
export default randomTurkishAlphabetLetterTool;
