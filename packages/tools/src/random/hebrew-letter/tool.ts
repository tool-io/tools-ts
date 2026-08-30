// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHebrewLetterInput = Readonly<Record<string, never>>;
export type RandomHebrewLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x5d0, 0x5ea],
    [0x5ef, 0x5f2],
    [0xfb1d, 0xfb1d],
    [0xfb1f, 0xfb28],
    [0xfb2a, 0xfb36],
    [0xfb38, 0xfb3c],
    [0xfb3e, 0xfb3e],
    [0xfb40, 0xfb41],
    [0xfb43, 0xfb44],
    [0xfb46, 0xfb4f],
  ],
} as const;

export const randomHebrewLetterValueCount = 75;

export const calculateRandomHebrewLetter = (
  random: RandomSource = Math.random,
): RandomHebrewLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHebrewLetterExample = {
  input: {},
} satisfies ToolExample<RandomHebrewLetterInput, RandomHebrewLetterOutput>;

export const randomHebrewLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHebrewLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Hebrew Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/hebrew-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hebrew-letter",
      id: "value",
      kind: "string",
      label: "Random Hebrew Letter",
    },
  ],
  title: "Random Hebrew Letter Generator",
});

export const runRandomHebrewLetter = randomHebrewLetterTool.execute;
export default randomHebrewLetterTool;
