// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPersianDigitInput = Readonly<Record<string, never>>;
export type RandomPersianDigitOutput = { readonly value: string };

const source = { ranges: [[0x6f0, 0x6f9]] } as const;

export const randomPersianDigitValueCount = 10;

export const calculateRandomPersianDigit = (
  random: RandomSource = Math.random,
): RandomPersianDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPersianDigitExample = { input: {} } satisfies ToolExample<
  RandomPersianDigitInput,
  RandomPersianDigitOutput
>;

export const randomPersianDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPersianDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 persian digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/persian-digit",
  inputs: [],
  outputs: [
    {
      format: "random/persian-digit",
      id: "value",
      kind: "string",
      label: "Random Persian Digit",
    },
  ],
  title: "Random Persian Digit Generator",
});

export const runRandomPersianDigit = randomPersianDigitTool.execute;
export default randomPersianDigitTool;
