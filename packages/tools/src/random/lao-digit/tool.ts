// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLaoDigitInput = Readonly<Record<string, never>>;
export type RandomLaoDigitOutput = { readonly value: string };

const source = { ranges: [[0xed0, 0xed9]] } as const;

export const randomLaoDigitValueCount = 10;

export const calculateRandomLaoDigit = (
  random: RandomSource = Math.random,
): RandomLaoDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLaoDigitExample = { input: {} } satisfies ToolExample<
  RandomLaoDigitInput,
  RandomLaoDigitOutput
>;

export const randomLaoDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLaoDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 lao digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/lao-digit",
  inputs: [],
  outputs: [
    {
      format: "random/lao-digit",
      id: "value",
      kind: "string",
      label: "Random Lao Digit",
    },
  ],
  title: "Random Lao Digit Generator",
});

export const runRandomLaoDigit = randomLaoDigitTool.execute;
export default randomLaoDigitTool;
