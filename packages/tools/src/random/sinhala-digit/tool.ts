// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSinhalaDigitInput = Readonly<Record<string, never>>;
export type RandomSinhalaDigitOutput = { readonly value: string };

const source = { ranges: [[0xde6, 0xdef]] } as const;

export const randomSinhalaDigitValueCount = 10;

export const calculateRandomSinhalaDigit = (
  random: RandomSource = Math.random,
): RandomSinhalaDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSinhalaDigitExample = { input: {} } satisfies ToolExample<
  RandomSinhalaDigitInput,
  RandomSinhalaDigitOutput
>;

export const randomSinhalaDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSinhalaDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 sinhala digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/sinhala-digit",
  inputs: [],
  outputs: [
    {
      format: "random/sinhala-digit",
      id: "value",
      kind: "string",
      label: "Random Sinhala Digit",
    },
  ],
  title: "Random Sinhala Digit Generator",
});

export const runRandomSinhalaDigit = randomSinhalaDigitTool.execute;
export default randomSinhalaDigitTool;
