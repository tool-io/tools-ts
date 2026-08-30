// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGujaratiDigitInput = Readonly<Record<string, never>>;
export type RandomGujaratiDigitOutput = { readonly value: string };

const source = { ranges: [[0xae6, 0xaef]] } as const;

export const randomGujaratiDigitValueCount = 10;

export const calculateRandomGujaratiDigit = (
  random: RandomSource = Math.random,
): RandomGujaratiDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGujaratiDigitExample = { input: {} } satisfies ToolExample<
  RandomGujaratiDigitInput,
  RandomGujaratiDigitOutput
>;

export const randomGujaratiDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGujaratiDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 gujarati digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/gujarati-digit",
  inputs: [],
  outputs: [
    {
      format: "random/gujarati-digit",
      id: "value",
      kind: "string",
      label: "Random Gujarati Digit",
    },
  ],
  title: "Random Gujarati Digit Generator",
});

export const runRandomGujaratiDigit = randomGujaratiDigitTool.execute;
export default randomGujaratiDigitTool;
