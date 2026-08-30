// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBalineseDigitInput = Readonly<Record<string, never>>;
export type RandomBalineseDigitOutput = { readonly value: string };

const source = { ranges: [[0x1b50, 0x1b59]] } as const;

export const randomBalineseDigitValueCount = 10;

export const calculateRandomBalineseDigit = (
  random: RandomSource = Math.random,
): RandomBalineseDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBalineseDigitExample = { input: {} } satisfies ToolExample<
  RandomBalineseDigitInput,
  RandomBalineseDigitOutput
>;

export const randomBalineseDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBalineseDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 balinese digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/balinese-digit",
  inputs: [],
  outputs: [
    {
      format: "random/balinese-digit",
      id: "value",
      kind: "string",
      label: "Random Balinese Digit",
    },
  ],
  title: "Random Balinese Digit Generator",
});

export const runRandomBalineseDigit = randomBalineseDigitTool.execute;
export default randomBalineseDigitTool;
