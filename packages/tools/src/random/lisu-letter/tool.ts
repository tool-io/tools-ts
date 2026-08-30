// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLisuLetterInput = Readonly<Record<string, never>>;
export type RandomLisuLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x2cd, 0x2cd],
    [0xa4d0, 0xa4fd],
    [0x11fb0, 0x11fb0],
  ],
} as const;

export const randomLisuLetterValueCount = 49;

export const calculateRandomLisuLetter = (
  random: RandomSource = Math.random,
): RandomLisuLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLisuLetterExample = {
  input: {},
} satisfies ToolExample<RandomLisuLetterInput, RandomLisuLetterOutput>;

export const randomLisuLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLisuLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Lisu Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/lisu-letter",
  inputs: [],
  outputs: [
    {
      format: "random/lisu-letter",
      id: "value",
      kind: "string",
      label: "Random Lisu Letter",
    },
  ],
  title: "Random Lisu Letter Generator",
});

export const runRandomLisuLetter = randomLisuLetterTool.execute;
export default randomLisuLetterTool;
