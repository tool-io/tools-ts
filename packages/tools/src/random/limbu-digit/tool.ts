// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLimbuDigitInput = Readonly<Record<string, never>>;
export type RandomLimbuDigitOutput = { readonly value: string };

const source = { ranges: [[0x1946, 0x194f]] } as const;

export const randomLimbuDigitValueCount = 10;

export const calculateRandomLimbuDigit = (
  random: RandomSource = Math.random,
): RandomLimbuDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLimbuDigitExample = { input: {} } satisfies ToolExample<
  RandomLimbuDigitInput,
  RandomLimbuDigitOutput
>;

export const randomLimbuDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLimbuDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 limbu digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/limbu-digit",
  inputs: [],
  outputs: [
    {
      format: "random/limbu-digit",
      id: "value",
      kind: "string",
      label: "Random Limbu Digit",
    },
  ],
  title: "Random Limbu Digit Generator",
});

export const runRandomLimbuDigit = randomLimbuDigitTool.execute;
export default randomLimbuDigitTool;
