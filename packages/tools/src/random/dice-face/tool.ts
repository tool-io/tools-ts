// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDiceFaceInput = Readonly<Record<string, never>>;
export type RandomDiceFaceOutput = { readonly value: string };

const source = { ranges: [[0x2680, 0x2685]] } as const;

export const randomDiceFaceValueCount = 6;

export const calculateRandomDiceFace = (
  random: RandomSource = Math.random,
): RandomDiceFaceOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDiceFaceExample = {
  input: {},
} satisfies ToolExample<RandomDiceFaceInput, RandomDiceFaceOutput>;

export const randomDiceFaceTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDiceFace(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Dice Face using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/dice-face",
  inputs: [],
  outputs: [
    {
      format: "random/dice-face",
      id: "value",
      kind: "string",
      label: "Random Dice Face",
    },
  ],
  title: "Random Dice Face Generator",
});

export const runRandomDiceFace = randomDiceFaceTool.execute;
export default randomDiceFaceTool;
