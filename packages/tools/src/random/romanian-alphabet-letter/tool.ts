// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ro.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRomanianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomRomanianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Ă", "Â", "B", "C", "D", "E", "F", "G", "H", "I", "Î", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "Ș", "T", "Ț", "U", "V", "W", "X", "Y", "Z"] } as const;

export const randomRomanianAlphabetLetterValueCount = 31;

export const calculateRandomRomanianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomRomanianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRomanianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomRomanianAlphabetLetterInput,
  RandomRomanianAlphabetLetterOutput
>;

export const randomRomanianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRomanianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Romanian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/romanian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/romanian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Romanian Alphabet Letter",
    },
  ],
  title: "Random Romanian Alphabet Letter Generator",
});

export const runRandomRomanianAlphabetLetter = randomRomanianAlphabetLetterTool.execute;
export default randomRomanianAlphabetLetterTool;
