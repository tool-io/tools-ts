// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSaurashtraCharacterInput = Readonly<Record<string, never>>;
export type RandomSaurashtraCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa880, 0xa8c5],
    [0xa8ce, 0xa8d9],
  ],
} as const;

export const randomSaurashtraCharacterValueCount = 82;

export const calculateRandomSaurashtraCharacter = (
  random: RandomSource = Math.random,
): RandomSaurashtraCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSaurashtraCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSaurashtraCharacterInput,
  RandomSaurashtraCharacterOutput
>;

export const randomSaurashtraCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSaurashtraCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Saurashtra Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/saurashtra-character",
  inputs: [],
  outputs: [
    {
      format: "random/saurashtra-character",
      id: "value",
      kind: "string",
      label: "Random Saurashtra Character",
    },
  ],
  title: "Random Saurashtra Character Generator",
});

export const runRandomSaurashtraCharacter =
  randomSaurashtraCharacterTool.execute;
export default randomSaurashtraCharacterTool;
