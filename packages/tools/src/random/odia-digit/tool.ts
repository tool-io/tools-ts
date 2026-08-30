// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOdiaDigitInput = Readonly<Record<string, never>>;
export type RandomOdiaDigitOutput = { readonly value: string };

const source = { ranges: [[0xb66, 0xb6f]] } as const;

export const randomOdiaDigitValueCount = 10;

export const calculateRandomOdiaDigit = (
  random: RandomSource = Math.random,
): RandomOdiaDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOdiaDigitExample = { input: {} } satisfies ToolExample<
  RandomOdiaDigitInput,
  RandomOdiaDigitOutput
>;

export const randomOdiaDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOdiaDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 odia digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/odia-digit",
  inputs: [],
  outputs: [
    {
      format: "random/odia-digit",
      id: "value",
      kind: "string",
      label: "Random Odia Digit",
    },
  ],
  title: "Random Odia Digit Generator",
});

export const runRandomOdiaDigit = randomOdiaDigitTool.execute;
export default randomOdiaDigitTool;
