// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSundaneseDigitInput = Readonly<Record<string, never>>;
export type RandomSundaneseDigitOutput = { readonly value: string };

const source = { ranges: [[0x1bb0, 0x1bb9]] } as const;

export const randomSundaneseDigitValueCount = 10;

export const calculateRandomSundaneseDigit = (
  random: RandomSource = Math.random,
): RandomSundaneseDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSundaneseDigitExample = { input: {} } satisfies ToolExample<
  RandomSundaneseDigitInput,
  RandomSundaneseDigitOutput
>;

export const randomSundaneseDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSundaneseDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 sundanese digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/sundanese-digit",
  inputs: [],
  outputs: [
    {
      format: "random/sundanese-digit",
      id: "value",
      kind: "string",
      label: "Random Sundanese Digit",
    },
  ],
  title: "Random Sundanese Digit Generator",
});

export const runRandomSundaneseDigit = randomSundaneseDigitTool.execute;
export default randomSundaneseDigitTool;
