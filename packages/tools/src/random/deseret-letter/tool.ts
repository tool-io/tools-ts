// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDeseretLetterInput = Readonly<Record<string, never>>;
export type RandomDeseretLetterOutput = { readonly value: string };

const source = { ranges: [[0x10400, 0x1044f]] } as const;

export const randomDeseretLetterValueCount = 80;

export const calculateRandomDeseretLetter = (
  random: RandomSource = Math.random,
): RandomDeseretLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDeseretLetterExample = {
  input: {},
} satisfies ToolExample<RandomDeseretLetterInput, RandomDeseretLetterOutput>;

export const randomDeseretLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDeseretLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Deseret Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/deseret-letter",
  inputs: [],
  outputs: [
    {
      format: "random/deseret-letter",
      id: "value",
      kind: "string",
      label: "Random Deseret Letter",
    },
  ],
  title: "Random Deseret Letter Generator",
});

export const runRandomDeseretLetter = randomDeseretLetterTool.execute;
export default randomDeseretLetterTool;
