// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCopticLetterInput = Readonly<Record<string, never>>;
export type RandomCopticLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x374, 0x374],
    [0x3e2, 0x3ef],
    [0x2c80, 0x2ce4],
    [0x2ceb, 0x2cee],
    [0x2cf2, 0x2cf3],
  ],
} as const;

export const randomCopticLetterValueCount = 122;

export const calculateRandomCopticLetter = (
  random: RandomSource = Math.random,
): RandomCopticLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCopticLetterExample = {
  input: {},
} satisfies ToolExample<RandomCopticLetterInput, RandomCopticLetterOutput>;

export const randomCopticLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCopticLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Coptic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/coptic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/coptic-letter",
      id: "value",
      kind: "string",
      label: "Random Coptic Letter",
    },
  ],
  title: "Random Coptic Letter Generator",
});

export const runRandomCopticLetter = randomCopticLetterTool.execute;
export default randomCopticLetterTool;
