// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAdlamDigitInput = Readonly<Record<string, never>>;
export type RandomAdlamDigitOutput = { readonly value: string };

const source = { ranges: [[0x1e950, 0x1e959]] } as const;

export const randomAdlamDigitValueCount = 10;

export const calculateRandomAdlamDigit = (
  random: RandomSource = Math.random,
): RandomAdlamDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAdlamDigitExample = { input: {} } satisfies ToolExample<
  RandomAdlamDigitInput,
  RandomAdlamDigitOutput
>;

export const randomAdlamDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAdlamDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 adlam digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/adlam-digit",
  inputs: [],
  outputs: [
    {
      format: "random/adlam-digit",
      id: "value",
      kind: "string",
      label: "Random Adlam Digit",
    },
  ],
  title: "Random Adlam Digit Generator",
});

export const runRandomAdlamDigit = randomAdlamDigitTool.execute;
export default randomAdlamDigitTool;
