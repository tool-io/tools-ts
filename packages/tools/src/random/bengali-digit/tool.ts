// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBengaliDigitInput = Readonly<Record<string, never>>;
export type RandomBengaliDigitOutput = { readonly value: string };

const source = { ranges: [[0x9e6, 0x9ef]] } as const;

export const randomBengaliDigitValueCount = 10;

export const calculateRandomBengaliDigit = (
  random: RandomSource = Math.random,
): RandomBengaliDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBengaliDigitExample = { input: {} } satisfies ToolExample<
  RandomBengaliDigitInput,
  RandomBengaliDigitOutput
>;

export const randomBengaliDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBengaliDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 bengali digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/bengali-digit",
  inputs: [],
  outputs: [
    {
      format: "random/bengali-digit",
      id: "value",
      kind: "string",
      label: "Random Bengali Digit",
    },
  ],
  title: "Random Bengali Digit Generator",
});

export const runRandomBengaliDigit = randomBengaliDigitTool.execute;
export default randomBengaliDigitTool;
