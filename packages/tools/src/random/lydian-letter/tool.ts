// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLydianLetterInput = Readonly<Record<string, never>>;
export type RandomLydianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10920, 0x10939]] } as const;

export const randomLydianLetterValueCount = 26;

export const calculateRandomLydianLetter = (
  random: RandomSource = Math.random,
): RandomLydianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLydianLetterExample = {
  input: {},
} satisfies ToolExample<RandomLydianLetterInput, RandomLydianLetterOutput>;

export const randomLydianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLydianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Lydian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/lydian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/lydian-letter",
      id: "value",
      kind: "string",
      label: "Random Lydian Letter",
    },
  ],
  title: "Random Lydian Letter Generator",
});

export const runRandomLydianLetter = randomLydianLetterTool.execute;
export default randomLydianLetterTool;
