// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDograCharacterInput = Readonly<Record<string, never>>;
export type RandomDograCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x96f],
    [0xa830, 0xa839],
    [0x11800, 0x1183b],
  ],
} as const;

export const randomDograCharacterValueCount = 82;

export const calculateRandomDograCharacter = (
  random: RandomSource = Math.random,
): RandomDograCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDograCharacterExample = {
  input: {},
} satisfies ToolExample<RandomDograCharacterInput, RandomDograCharacterOutput>;

export const randomDograCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDograCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Dogra Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/dogra-character",
  inputs: [],
  outputs: [
    {
      format: "random/dogra-character",
      id: "value",
      kind: "string",
      label: "Random Dogra Character",
    },
  ],
  title: "Random Dogra Character Generator",
});

export const runRandomDograCharacter = randomDograCharacterTool.execute;
export default randomDograCharacterTool;
