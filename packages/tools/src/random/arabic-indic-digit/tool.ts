// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomArabicIndicDigitInput = Readonly<Record<string, never>>;
export type RandomArabicIndicDigitOutput = { readonly value: string };

const source = { ranges: [[0x660, 0x669]] } as const;

export const randomArabicIndicDigitValueCount = 10;

export const calculateRandomArabicIndicDigit = (
  random: RandomSource = Math.random,
): RandomArabicIndicDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomArabicIndicDigitExample = { input: {} } satisfies ToolExample<
  RandomArabicIndicDigitInput,
  RandomArabicIndicDigitOutput
>;

export const randomArabicIndicDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomArabicIndicDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 arabic-indic digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/arabic-indic-digit",
  inputs: [],
  outputs: [
    {
      format: "random/arabic-indic-digit",
      id: "value",
      kind: "string",
      label: "Random Arabic-Indic Digit",
    },
  ],
  title: "Random Arabic-Indic Digit Generator",
});

export const runRandomArabicIndicDigit = randomArabicIndicDigitTool.execute;
export default randomArabicIndicDigitTool;
