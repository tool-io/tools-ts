// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDevanagariDigitInput = Readonly<Record<string, never>>;
export type RandomDevanagariDigitOutput = { readonly value: string };

const source = { ranges: [[0x966, 0x96f]] } as const;

export const randomDevanagariDigitValueCount = 10;

export const calculateRandomDevanagariDigit = (
  random: RandomSource = Math.random,
): RandomDevanagariDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDevanagariDigitExample = { input: {} } satisfies ToolExample<
  RandomDevanagariDigitInput,
  RandomDevanagariDigitOutput
>;

export const randomDevanagariDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDevanagariDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 devanagari digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/devanagari-digit",
  inputs: [],
  outputs: [
    {
      format: "random/devanagari-digit",
      id: "value",
      kind: "string",
      label: "Random Devanagari Digit",
    },
  ],
  title: "Random Devanagari Digit Generator",
});

export const runRandomDevanagariDigit = randomDevanagariDigitTool.execute;
export default randomDevanagariDigitTool;
