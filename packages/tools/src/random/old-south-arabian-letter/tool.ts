// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldSouthArabianLetterInput = Readonly<Record<string, never>>;
export type RandomOldSouthArabianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10a60, 0x10a7c]] } as const;

export const randomOldSouthArabianLetterValueCount = 29;

export const calculateRandomOldSouthArabianLetter = (
  random: RandomSource = Math.random,
): RandomOldSouthArabianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldSouthArabianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldSouthArabianLetterInput,
  RandomOldSouthArabianLetterOutput
>;

export const randomOldSouthArabianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldSouthArabianLetter(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Old South Arabian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-south-arabian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-south-arabian-letter",
      id: "value",
      kind: "string",
      label: "Random Old South Arabian Letter",
    },
  ],
  title: "Random Old South Arabian Letter Generator",
});

export const runRandomOldSouthArabianLetter =
  randomOldSouthArabianLetterTool.execute;
export default randomOldSouthArabianLetterTool;
