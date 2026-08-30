// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNushuCharacterInput = Readonly<Record<string, never>>;
export type RandomNushuCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x16fe1, 0x16fe1],
    [0x1b170, 0x1b2fb],
  ],
} as const;

export const randomNushuCharacterValueCount = 397;

export const calculateRandomNushuCharacter = (
  random: RandomSource = Math.random,
): RandomNushuCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNushuCharacterExample = {
  input: {},
} satisfies ToolExample<RandomNushuCharacterInput, RandomNushuCharacterOutput>;

export const randomNushuCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNushuCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Nushu Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/nushu-character",
  inputs: [],
  outputs: [
    {
      format: "random/nushu-character",
      id: "value",
      kind: "string",
      label: "Random Nushu Character",
    },
  ],
  title: "Random Nushu Character Generator",
});

export const runRandomNushuCharacter = randomNushuCharacterTool.execute;
export default randomNushuCharacterTool;
