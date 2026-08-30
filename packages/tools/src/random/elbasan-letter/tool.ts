// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomElbasanLetterInput = Readonly<Record<string, never>>;
export type RandomElbasanLetterOutput = { readonly value: string };

const source = { ranges: [[0x10500, 0x10527]] } as const;

export const randomElbasanLetterValueCount = 40;

export const calculateRandomElbasanLetter = (
  random: RandomSource = Math.random,
): RandomElbasanLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomElbasanLetterExample = {
  input: {},
} satisfies ToolExample<RandomElbasanLetterInput, RandomElbasanLetterOutput>;

export const randomElbasanLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomElbasanLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Elbasan Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/elbasan-letter",
  inputs: [],
  outputs: [
    {
      format: "random/elbasan-letter",
      id: "value",
      kind: "string",
      label: "Random Elbasan Letter",
    },
  ],
  title: "Random Elbasan Letter Generator",
});

export const runRandomElbasanLetter = randomElbasanLetterTool.execute;
export default randomElbasanLetterTool;
