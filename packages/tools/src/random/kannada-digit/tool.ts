// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKannadaDigitInput = Readonly<Record<string, never>>;
export type RandomKannadaDigitOutput = { readonly value: string };

const source = { ranges: [[0xce6, 0xcef]] } as const;

export const randomKannadaDigitValueCount = 10;

export const calculateRandomKannadaDigit = (
  random: RandomSource = Math.random,
): RandomKannadaDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKannadaDigitExample = { input: {} } satisfies ToolExample<
  RandomKannadaDigitInput,
  RandomKannadaDigitOutput
>;

export const randomKannadaDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKannadaDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 kannada digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/kannada-digit",
  inputs: [],
  outputs: [
    {
      format: "random/kannada-digit",
      id: "value",
      kind: "string",
      label: "Random Kannada Digit",
    },
  ],
  title: "Random Kannada Digit Generator",
});

export const runRandomKannadaDigit = randomKannadaDigitTool.execute;
export default randomKannadaDigitTool;
