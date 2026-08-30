// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGurmukhiDigitInput = Readonly<Record<string, never>>;
export type RandomGurmukhiDigitOutput = { readonly value: string };

const source = { ranges: [[0xa66, 0xa6f]] } as const;

export const randomGurmukhiDigitValueCount = 10;

export const calculateRandomGurmukhiDigit = (
  random: RandomSource = Math.random,
): RandomGurmukhiDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGurmukhiDigitExample = { input: {} } satisfies ToolExample<
  RandomGurmukhiDigitInput,
  RandomGurmukhiDigitOutput
>;

export const randomGurmukhiDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGurmukhiDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 gurmukhi digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/gurmukhi-digit",
  inputs: [],
  outputs: [
    {
      format: "random/gurmukhi-digit",
      id: "value",
      kind: "string",
      label: "Random Gurmukhi Digit",
    },
  ],
  title: "Random Gurmukhi Digit Generator",
});

export const runRandomGurmukhiDigit = randomGurmukhiDigitTool.execute;
export default randomGurmukhiDigitTool;
