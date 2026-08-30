// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBassaVahLetterInput = Readonly<Record<string, never>>;
export type RandomBassaVahLetterOutput = { readonly value: string };

const source = { ranges: [[0x16ad0, 0x16aed]] } as const;

export const randomBassaVahLetterValueCount = 30;

export const calculateRandomBassaVahLetter = (
  random: RandomSource = Math.random,
): RandomBassaVahLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBassaVahLetterExample = {
  input: {},
} satisfies ToolExample<RandomBassaVahLetterInput, RandomBassaVahLetterOutput>;

export const randomBassaVahLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBassaVahLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Bassa Vah Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/bassa-vah-letter",
  inputs: [],
  outputs: [
    {
      format: "random/bassa-vah-letter",
      id: "value",
      kind: "string",
      label: "Random Bassa Vah Letter",
    },
  ],
  title: "Random Bassa Vah Letter Generator",
});

export const runRandomBassaVahLetter = randomBassaVahLetterTool.execute;
export default randomBassaVahLetterTool;
