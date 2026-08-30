// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGeorgianLetterInput = Readonly<Record<string, never>>;
export type RandomGeorgianLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10a0, 0x10c5],
    [0x10c7, 0x10c7],
    [0x10cd, 0x10cd],
    [0x10d0, 0x10fa],
    [0x10fc, 0x10ff],
    [0x1c90, 0x1cba],
    [0x1cbd, 0x1cbf],
    [0x2d00, 0x2d25],
    [0x2d27, 0x2d27],
    [0x2d2d, 0x2d2d],
  ],
} as const;

export const randomGeorgianLetterValueCount = 173;

export const calculateRandomGeorgianLetter = (
  random: RandomSource = Math.random,
): RandomGeorgianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGeorgianLetterExample = {
  input: {},
} satisfies ToolExample<RandomGeorgianLetterInput, RandomGeorgianLetterOutput>;

export const randomGeorgianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGeorgianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Georgian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/georgian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/georgian-letter",
      id: "value",
      kind: "string",
      label: "Random Georgian Letter",
    },
  ],
  title: "Random Georgian Letter Generator",
});

export const runRandomGeorgianLetter = randomGeorgianLetterTool.execute;
export default randomGeorgianLetterTool;
