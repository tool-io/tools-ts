// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomChamCharacterInput = Readonly<Record<string, never>>;
export type RandomChamCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xaa00, 0xaa36],
    [0xaa40, 0xaa4d],
    [0xaa50, 0xaa59],
    [0xaa5c, 0xaa5f],
  ],
} as const;

export const randomChamCharacterValueCount = 83;

export const calculateRandomChamCharacter = (
  random: RandomSource = Math.random,
): RandomChamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomChamCharacterExample = {
  input: {},
} satisfies ToolExample<RandomChamCharacterInput, RandomChamCharacterOutput>;

export const randomChamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomChamCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Cham Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/cham-character",
  inputs: [],
  outputs: [
    {
      format: "random/cham-character",
      id: "value",
      kind: "string",
      label: "Random Cham Character",
    },
  ],
  title: "Random Cham Character Generator",
});

export const runRandomChamCharacter = randomChamCharacterTool.execute;
export default randomChamCharacterTool;
