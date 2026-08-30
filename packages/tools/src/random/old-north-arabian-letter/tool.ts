// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldNorthArabianLetterInput = Readonly<Record<string, never>>;
export type RandomOldNorthArabianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10a80, 0x10a9c]] } as const;

export const randomOldNorthArabianLetterValueCount = 29;

export const calculateRandomOldNorthArabianLetter = (
  random: RandomSource = Math.random,
): RandomOldNorthArabianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldNorthArabianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldNorthArabianLetterInput,
  RandomOldNorthArabianLetterOutput
>;

export const randomOldNorthArabianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldNorthArabianLetter(
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
    "Choose one assigned Unicode 18.0 Old North Arabian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-north-arabian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-north-arabian-letter",
      id: "value",
      kind: "string",
      label: "Random Old North Arabian Letter",
    },
  ],
  title: "Random Old North Arabian Letter Generator",
});

export const runRandomOldNorthArabianLetter =
  randomOldNorthArabianLetterTool.execute;
export default randomOldNorthArabianLetterTool;
