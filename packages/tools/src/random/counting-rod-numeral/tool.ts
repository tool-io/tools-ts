// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCountingRodNumeralInput = Readonly<Record<string, never>>;
export type RandomCountingRodNumeralOutput = { readonly value: string };

const source = { ranges: [[0x1d360, 0x1d371]] } as const;

export const randomCountingRodNumeralValueCount = 18;

export const calculateRandomCountingRodNumeral = (
  random: RandomSource = Math.random,
): RandomCountingRodNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCountingRodNumeralExample = {
  input: {},
} satisfies ToolExample<
  RandomCountingRodNumeralInput,
  RandomCountingRodNumeralOutput
>;

export const randomCountingRodNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCountingRodNumeral(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Counting Rod Numeral using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/counting-rod-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/counting-rod-numeral",
      id: "value",
      kind: "string",
      label: "Random Counting Rod Numeral",
    },
  ],
  title: "Random Counting Rod Numeral Generator",
});

export const runRandomCountingRodNumeral = randomCountingRodNumeralTool.execute;
export default randomCountingRodNumeralTool;
