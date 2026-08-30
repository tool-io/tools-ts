// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomYezidiLetterInput = Readonly<Record<string, never>>;
export type RandomYezidiLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10e80, 0x10ea9],
    [0x10eb0, 0x10eb1],
  ],
} as const;

export const randomYezidiLetterValueCount = 44;

export const calculateRandomYezidiLetter = (
  random: RandomSource = Math.random,
): RandomYezidiLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomYezidiLetterExample = {
  input: {},
} satisfies ToolExample<RandomYezidiLetterInput, RandomYezidiLetterOutput>;

export const randomYezidiLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomYezidiLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Yezidi Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/yezidi-letter",
  inputs: [],
  outputs: [
    {
      format: "random/yezidi-letter",
      id: "value",
      kind: "string",
      label: "Random Yezidi Letter",
    },
  ],
  title: "Random Yezidi Letter Generator",
});

export const runRandomYezidiLetter = randomYezidiLetterTool.execute;
export default randomYezidiLetterTool;
