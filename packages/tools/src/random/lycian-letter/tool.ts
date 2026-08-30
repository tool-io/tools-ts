// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLycianLetterInput = Readonly<Record<string, never>>;
export type RandomLycianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10280, 0x1029c]] } as const;

export const randomLycianLetterValueCount = 29;

export const calculateRandomLycianLetter = (
  random: RandomSource = Math.random,
): RandomLycianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLycianLetterExample = {
  input: {},
} satisfies ToolExample<RandomLycianLetterInput, RandomLycianLetterOutput>;

export const randomLycianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLycianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Lycian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/lycian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/lycian-letter",
      id: "value",
      kind: "string",
      label: "Random Lycian Letter",
    },
  ],
  title: "Random Lycian Letter Generator",
});

export const runRandomLycianLetter = randomLycianLetterTool.execute;
export default randomLycianLetterTool;
