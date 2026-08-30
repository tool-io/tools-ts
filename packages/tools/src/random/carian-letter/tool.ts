// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCarianLetterInput = Readonly<Record<string, never>>;
export type RandomCarianLetterOutput = { readonly value: string };

const source = { ranges: [[0x102a0, 0x102d0]] } as const;

export const randomCarianLetterValueCount = 49;

export const calculateRandomCarianLetter = (
  random: RandomSource = Math.random,
): RandomCarianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCarianLetterExample = {
  input: {},
} satisfies ToolExample<RandomCarianLetterInput, RandomCarianLetterOutput>;

export const randomCarianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCarianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Carian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/carian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/carian-letter",
      id: "value",
      kind: "string",
      label: "Random Carian Letter",
    },
  ],
  title: "Random Carian Letter Generator",
});

export const runRandomCarianLetter = randomCarianLetterTool.execute;
export default randomCarianLetterTool;
