// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOlChikiDigitInput = Readonly<Record<string, never>>;
export type RandomOlChikiDigitOutput = { readonly value: string };

const source = { ranges: [[0x1c50, 0x1c59]] } as const;

export const randomOlChikiDigitValueCount = 10;

export const calculateRandomOlChikiDigit = (
  random: RandomSource = Math.random,
): RandomOlChikiDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOlChikiDigitExample = { input: {} } satisfies ToolExample<
  RandomOlChikiDigitInput,
  RandomOlChikiDigitOutput
>;

export const randomOlChikiDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOlChikiDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 ol chiki digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/ol-chiki-digit",
  inputs: [],
  outputs: [
    {
      format: "random/ol-chiki-digit",
      id: "value",
      kind: "string",
      label: "Random Ol Chiki Digit",
    },
  ],
  title: "Random Ol Chiki Digit Generator",
});

export const runRandomOlChikiDigit = randomOlChikiDigitTool.execute;
export default randomOlChikiDigitTool;
