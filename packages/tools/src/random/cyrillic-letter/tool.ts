// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCyrillicLetterInput = Readonly<Record<string, never>>;
export type RandomCyrillicLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x400, 0x481],
    [0x48a, 0x52f],
    [0x1c80, 0x1c8a],
    [0x1d2b, 0x1d2b],
    [0x1d78, 0x1d78],
    [0xa640, 0xa66e],
    [0xa67f, 0xa69d],
    [0x1e030, 0x1e06d],
  ],
} as const;

export const randomCyrillicLetterValueCount = 450;

export const calculateRandomCyrillicLetter = (
  random: RandomSource = Math.random,
): RandomCyrillicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCyrillicLetterExample = {
  input: {},
} satisfies ToolExample<RandomCyrillicLetterInput, RandomCyrillicLetterOutput>;

export const randomCyrillicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCyrillicLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Cyrillic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/cyrillic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/cyrillic-letter",
      id: "value",
      kind: "string",
      label: "Random Cyrillic Letter",
    },
  ],
  title: "Random Cyrillic Letter Generator",
});

export const runRandomCyrillicLetter = randomCyrillicLetterTool.execute;
export default randomCyrillicLetterTool;
