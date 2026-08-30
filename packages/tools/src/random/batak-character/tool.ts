// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBatakCharacterInput = Readonly<Record<string, never>>;
export type RandomBatakCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1bc0, 0x1bf3],
    [0x1bfc, 0x1bff],
  ],
} as const;

export const randomBatakCharacterValueCount = 56;

export const calculateRandomBatakCharacter = (
  random: RandomSource = Math.random,
): RandomBatakCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBatakCharacterExample = {
  input: {},
} satisfies ToolExample<RandomBatakCharacterInput, RandomBatakCharacterOutput>;

export const randomBatakCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBatakCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Batak Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/batak-character",
  inputs: [],
  outputs: [
    {
      format: "random/batak-character",
      id: "value",
      kind: "string",
      label: "Random Batak Character",
    },
  ],
  title: "Random Batak Character Generator",
});

export const runRandomBatakCharacter = randomBatakCharacterTool.execute;
export default randomBatakCharacterTool;
