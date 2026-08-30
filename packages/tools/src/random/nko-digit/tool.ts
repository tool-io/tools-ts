// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNkoDigitInput = Readonly<Record<string, never>>;
export type RandomNkoDigitOutput = { readonly value: string };

const source = { ranges: [[0x7c0, 0x7c9]] } as const;

export const randomNkoDigitValueCount = 10;

export const calculateRandomNkoDigit = (
  random: RandomSource = Math.random,
): RandomNkoDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNkoDigitExample = { input: {} } satisfies ToolExample<
  RandomNkoDigitInput,
  RandomNkoDigitOutput
>;

export const randomNkoDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNkoDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 nko digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/nko-digit",
  inputs: [],
  outputs: [
    {
      format: "random/nko-digit",
      id: "value",
      kind: "string",
      label: "Random NKo Digit",
    },
  ],
  title: "Random NKo Digit Generator",
});

export const runRandomNkoDigit = randomNkoDigitTool.execute;
export default randomNkoDigitTool;
