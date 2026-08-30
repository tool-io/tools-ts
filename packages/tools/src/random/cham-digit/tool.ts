// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomChamDigitInput = Readonly<Record<string, never>>;
export type RandomChamDigitOutput = { readonly value: string };

const source = { ranges: [[0xaa50, 0xaa59]] } as const;

export const randomChamDigitValueCount = 10;

export const calculateRandomChamDigit = (
  random: RandomSource = Math.random,
): RandomChamDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomChamDigitExample = { input: {} } satisfies ToolExample<
  RandomChamDigitInput,
  RandomChamDigitOutput
>;

export const randomChamDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomChamDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 cham digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/cham-digit",
  inputs: [],
  outputs: [
    {
      format: "random/cham-digit",
      id: "value",
      kind: "string",
      label: "Random Cham Digit",
    },
  ],
  title: "Random Cham Digit Generator",
});

export const runRandomChamDigit = randomChamDigitTool.execute;
export default randomChamDigitTool;
