// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomJavaneseDigitInput = Readonly<Record<string, never>>;
export type RandomJavaneseDigitOutput = { readonly value: string };

const source = { ranges: [[0xa9d0, 0xa9d9]] } as const;

export const randomJavaneseDigitValueCount = 10;

export const calculateRandomJavaneseDigit = (
  random: RandomSource = Math.random,
): RandomJavaneseDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomJavaneseDigitExample = { input: {} } satisfies ToolExample<
  RandomJavaneseDigitInput,
  RandomJavaneseDigitOutput
>;

export const randomJavaneseDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomJavaneseDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 javanese digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/javanese-digit",
  inputs: [],
  outputs: [
    {
      format: "random/javanese-digit",
      id: "value",
      kind: "string",
      label: "Random Javanese Digit",
    },
  ],
  title: "Random Javanese Digit Generator",
});

export const runRandomJavaneseDigit = randomJavaneseDigitTool.execute;
export default randomJavaneseDigitTool;
