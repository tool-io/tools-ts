// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMayanNumeralInput = Readonly<Record<string, never>>;
export type RandomMayanNumeralOutput = { readonly value: string };

const source = { ranges: [[0x1d2e0, 0x1d2f3]] } as const;

export const randomMayanNumeralValueCount = 20;

export const calculateRandomMayanNumeral = (
  random: RandomSource = Math.random,
): RandomMayanNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMayanNumeralExample = {
  input: {},
} satisfies ToolExample<RandomMayanNumeralInput, RandomMayanNumeralOutput>;

export const randomMayanNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMayanNumeral(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Mayan Numeral using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/mayan-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/mayan-numeral",
      id: "value",
      kind: "string",
      label: "Random Mayan Numeral",
    },
  ],
  title: "Random Mayan Numeral Generator",
});

export const runRandomMayanNumeral = randomMayanNumeralTool.execute;
export default randomMayanNumeralTool;
