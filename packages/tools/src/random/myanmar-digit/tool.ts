// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMyanmarDigitInput = Readonly<Record<string, never>>;
export type RandomMyanmarDigitOutput = { readonly value: string };

const source = { ranges: [[0x1040, 0x1049]] } as const;

export const randomMyanmarDigitValueCount = 10;

export const calculateRandomMyanmarDigit = (
  random: RandomSource = Math.random,
): RandomMyanmarDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMyanmarDigitExample = { input: {} } satisfies ToolExample<
  RandomMyanmarDigitInput,
  RandomMyanmarDigitOutput
>;

export const randomMyanmarDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMyanmarDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 myanmar digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/myanmar-digit",
  inputs: [],
  outputs: [
    {
      format: "random/myanmar-digit",
      id: "value",
      kind: "string",
      label: "Random Myanmar Digit",
    },
  ],
  title: "Random Myanmar Digit Generator",
});

export const runRandomMyanmarDigit = randomMyanmarDigitTool.execute;
export default randomMyanmarDigitTool;
