// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomYiSyllableInput = Readonly<Record<string, never>>;
export type RandomYiSyllableOutput = { readonly value: string };

const source = { ranges: [[0xa000, 0xa48c]] } as const;

export const randomYiSyllableValueCount = 1165;

export const calculateRandomYiSyllable = (
  random: RandomSource = Math.random,
): RandomYiSyllableOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomYiSyllableExample = {
  input: {},
} satisfies ToolExample<RandomYiSyllableInput, RandomYiSyllableOutput>;

export const randomYiSyllableTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomYiSyllable(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Yi Syllable using injected randomness.",
  id: "random/yi-syllable",
  inputs: [],
  outputs: [
    {
      format: "random/yi-syllable",
      id: "value",
      kind: "string",
      label: "Random Yi Syllable",
    },
  ],
  title: "Random Yi Syllable Generator",
});

export const runRandomYiSyllable = randomYiSyllableTool.execute;
export default randomYiSyllableTool;
