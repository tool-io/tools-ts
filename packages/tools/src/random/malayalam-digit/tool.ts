// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMalayalamDigitInput = Readonly<Record<string, never>>;
export type RandomMalayalamDigitOutput = { readonly value: string };

const source = { ranges: [[0xd66, 0xd6f]] } as const;

export const randomMalayalamDigitValueCount = 10;

export const calculateRandomMalayalamDigit = (
  random: RandomSource = Math.random,
): RandomMalayalamDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMalayalamDigitExample = { input: {} } satisfies ToolExample<
  RandomMalayalamDigitInput,
  RandomMalayalamDigitOutput
>;

export const randomMalayalamDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMalayalamDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 malayalam digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/malayalam-digit",
  inputs: [],
  outputs: [
    {
      format: "random/malayalam-digit",
      id: "value",
      kind: "string",
      label: "Random Malayalam Digit",
    },
  ],
  title: "Random Malayalam Digit Generator",
});

export const runRandomMalayalamDigit = randomMalayalamDigitTool.execute;
export default randomMalayalamDigitTool;
