// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/lt.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLithuanianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomLithuanianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Ą", "B", "C", "Č", "D", "E", "Ę", "Ė", "F", "G", "H", "I", "Į", "Y", "J", "K", "L", "M", "N", "O", "P", "R", "S", "Š", "T", "U", "Ų", "Ū", "V", "Z", "Ž"] } as const;

export const randomLithuanianAlphabetLetterValueCount = 32;

export const calculateRandomLithuanianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomLithuanianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLithuanianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomLithuanianAlphabetLetterInput,
  RandomLithuanianAlphabetLetterOutput
>;

export const randomLithuanianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLithuanianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Lithuanian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/lithuanian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/lithuanian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Lithuanian Alphabet Letter",
    },
  ],
  title: "Random Lithuanian Alphabet Letter Generator",
});

export const runRandomLithuanianAlphabetLetter = randomLithuanianAlphabetLetterTool.execute;
export default randomLithuanianAlphabetLetterTool;
