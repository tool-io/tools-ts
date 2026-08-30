// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOsmanyaDigitInput = Readonly<Record<string, never>>;
export type RandomOsmanyaDigitOutput = { readonly value: string };

const source = { ranges: [[0x104a0, 0x104a9]] } as const;

export const randomOsmanyaDigitValueCount = 10;

export const calculateRandomOsmanyaDigit = (
  random: RandomSource = Math.random,
): RandomOsmanyaDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOsmanyaDigitExample = { input: {} } satisfies ToolExample<
  RandomOsmanyaDigitInput,
  RandomOsmanyaDigitOutput
>;

export const randomOsmanyaDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOsmanyaDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 osmanya digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/osmanya-digit",
  inputs: [],
  outputs: [
    {
      format: "random/osmanya-digit",
      id: "value",
      kind: "string",
      label: "Random Osmanya Digit",
    },
  ],
  title: "Random Osmanya Digit Generator",
});

export const runRandomOsmanyaDigit = randomOsmanyaDigitTool.execute;
export default randomOsmanyaDigitTool;
