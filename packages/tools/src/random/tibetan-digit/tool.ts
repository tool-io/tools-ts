// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTibetanDigitInput = Readonly<Record<string, never>>;
export type RandomTibetanDigitOutput = { readonly value: string };

const source = { ranges: [[0xf20, 0xf29]] } as const;

export const randomTibetanDigitValueCount = 10;

export const calculateRandomTibetanDigit = (
  random: RandomSource = Math.random,
): RandomTibetanDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTibetanDigitExample = { input: {} } satisfies ToolExample<
  RandomTibetanDigitInput,
  RandomTibetanDigitOutput
>;

export const randomTibetanDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTibetanDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 tibetan digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/tibetan-digit",
  inputs: [],
  outputs: [
    {
      format: "random/tibetan-digit",
      id: "value",
      kind: "string",
      label: "Random Tibetan Digit",
    },
  ],
  title: "Random Tibetan Digit Generator",
});

export const runRandomTibetanDigit = randomTibetanDigitTool.execute;
export default randomTibetanDigitTool;
