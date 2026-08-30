// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomThaiDigitInput = Readonly<Record<string, never>>;
export type RandomThaiDigitOutput = { readonly value: string };

const source = { ranges: [[0xe50, 0xe59]] } as const;

export const randomThaiDigitValueCount = 10;

export const calculateRandomThaiDigit = (
  random: RandomSource = Math.random,
): RandomThaiDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomThaiDigitExample = { input: {} } satisfies ToolExample<
  RandomThaiDigitInput,
  RandomThaiDigitOutput
>;

export const randomThaiDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomThaiDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 thai digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/thai-digit",
  inputs: [],
  outputs: [
    {
      format: "random/thai-digit",
      id: "value",
      kind: "string",
      label: "Random Thai Digit",
    },
  ],
  title: "Random Thai Digit Generator",
});

export const runRandomThaiDigit = randomThaiDigitTool.execute;
export default randomThaiDigitTool;
