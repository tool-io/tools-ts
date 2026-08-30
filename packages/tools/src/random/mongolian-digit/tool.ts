// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMongolianDigitInput = Readonly<Record<string, never>>;
export type RandomMongolianDigitOutput = { readonly value: string };

const source = { ranges: [[0x1810, 0x1819]] } as const;

export const randomMongolianDigitValueCount = 10;

export const calculateRandomMongolianDigit = (
  random: RandomSource = Math.random,
): RandomMongolianDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMongolianDigitExample = { input: {} } satisfies ToolExample<
  RandomMongolianDigitInput,
  RandomMongolianDigitOutput
>;

export const randomMongolianDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMongolianDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 mongolian digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/mongolian-digit",
  inputs: [],
  outputs: [
    {
      format: "random/mongolian-digit",
      id: "value",
      kind: "string",
      label: "Random Mongolian Digit",
    },
  ],
  title: "Random Mongolian Digit Generator",
});

export const runRandomMongolianDigit = randomMongolianDigitTool.execute;
export default randomMongolianDigitTool;
