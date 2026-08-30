// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRomanNumeralInput = Readonly<Record<string, never>>;
export type RandomRomanNumeralOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2160, 0x216f],
    [0x2180, 0x2183],
    [0x2185, 0x2188],
  ],
} as const;

export const randomRomanNumeralValueCount = 24;

export const calculateRandomRomanNumeral = (
  random: RandomSource = Math.random,
): RandomRomanNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRomanNumeralExample = {
  input: {},
} satisfies ToolExample<RandomRomanNumeralInput, RandomRomanNumeralOutput>;

export const randomRomanNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRomanNumeral(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Roman Numeral using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/roman-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/roman-numeral",
      id: "value",
      kind: "string",
      label: "Random Roman Numeral",
    },
  ],
  title: "Random Roman Numeral Generator",
});

export const runRandomRomanNumeral = randomRomanNumeralTool.execute;
export default randomRomanNumeralTool;
