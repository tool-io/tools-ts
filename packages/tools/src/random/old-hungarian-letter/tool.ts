// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldHungarianLetterInput = Readonly<Record<string, never>>;
export type RandomOldHungarianLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10c80, 0x10cb2],
    [0x10cc0, 0x10cf2],
  ],
} as const;

export const randomOldHungarianLetterValueCount = 102;

export const calculateRandomOldHungarianLetter = (
  random: RandomSource = Math.random,
): RandomOldHungarianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldHungarianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldHungarianLetterInput,
  RandomOldHungarianLetterOutput
>;

export const randomOldHungarianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldHungarianLetter(
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
    "Choose one assigned Unicode 18.0 Old Hungarian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-hungarian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-hungarian-letter",
      id: "value",
      kind: "string",
      label: "Random Old Hungarian Letter",
    },
  ],
  title: "Random Old Hungarian Letter Generator",
});

export const runRandomOldHungarianLetter = randomOldHungarianLetterTool.execute;
export default randomOldHungarianLetterTool;
