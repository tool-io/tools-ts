// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTeluguDigitInput = Readonly<Record<string, never>>;
export type RandomTeluguDigitOutput = { readonly value: string };

const source = { ranges: [[0xc66, 0xc6f]] } as const;

export const randomTeluguDigitValueCount = 10;

export const calculateRandomTeluguDigit = (
  random: RandomSource = Math.random,
): RandomTeluguDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTeluguDigitExample = { input: {} } satisfies ToolExample<
  RandomTeluguDigitInput,
  RandomTeluguDigitOutput
>;

export const randomTeluguDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTeluguDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 telugu digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/telugu-digit",
  inputs: [],
  outputs: [
    {
      format: "random/telugu-digit",
      id: "value",
      kind: "string",
      label: "Random Telugu Digit",
    },
  ],
  title: "Random Telugu Digit Generator",
});

export const runRandomTeluguDigit = randomTeluguDigitTool.execute;
export default randomTeluguDigitTool;
