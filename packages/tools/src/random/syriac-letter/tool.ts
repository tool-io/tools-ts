// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSyriacLetterInput = Readonly<Record<string, never>>;
export type RandomSyriacLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x710, 0x710],
    [0x712, 0x72f],
    [0x74d, 0x74f],
    [0x860, 0x86a],
  ],
} as const;

export const randomSyriacLetterValueCount = 46;

export const calculateRandomSyriacLetter = (
  random: RandomSource = Math.random,
): RandomSyriacLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSyriacLetterExample = {
  input: {},
} satisfies ToolExample<RandomSyriacLetterInput, RandomSyriacLetterOutput>;

export const randomSyriacLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSyriacLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Syriac Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/syriac-letter",
  inputs: [],
  outputs: [
    {
      format: "random/syriac-letter",
      id: "value",
      kind: "string",
      label: "Random Syriac Letter",
    },
  ],
  title: "Random Syriac Letter Generator",
});

export const runRandomSyriacLetter = randomSyriacLetterTool.execute;
export default randomSyriacLetterTool;
