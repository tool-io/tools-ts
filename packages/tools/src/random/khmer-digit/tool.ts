// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKhmerDigitInput = Readonly<Record<string, never>>;
export type RandomKhmerDigitOutput = { readonly value: string };

const source = { ranges: [[0x17e0, 0x17e9]] } as const;

export const randomKhmerDigitValueCount = 10;

export const calculateRandomKhmerDigit = (
  random: RandomSource = Math.random,
): RandomKhmerDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKhmerDigitExample = { input: {} } satisfies ToolExample<
  RandomKhmerDigitInput,
  RandomKhmerDigitOutput
>;

export const randomKhmerDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKhmerDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 khmer digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/khmer-digit",
  inputs: [],
  outputs: [
    {
      format: "random/khmer-digit",
      id: "value",
      kind: "string",
      label: "Random Khmer Digit",
    },
  ],
  title: "Random Khmer Digit Generator",
});

export const runRandomKhmerDigit = randomKhmerDigitTool.execute;
export default randomKhmerDigitTool;
