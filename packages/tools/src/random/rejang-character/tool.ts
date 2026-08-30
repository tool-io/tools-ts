// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRejangCharacterInput = Readonly<Record<string, never>>;
export type RandomRejangCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa930, 0xa953],
    [0xa95f, 0xa95f],
  ],
} as const;

export const randomRejangCharacterValueCount = 37;

export const calculateRandomRejangCharacter = (
  random: RandomSource = Math.random,
): RandomRejangCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRejangCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomRejangCharacterInput,
  RandomRejangCharacterOutput
>;

export const randomRejangCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRejangCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Rejang Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/rejang-character",
  inputs: [],
  outputs: [
    {
      format: "random/rejang-character",
      id: "value",
      kind: "string",
      label: "Random Rejang Character",
    },
  ],
  title: "Random Rejang Character Generator",
});

export const runRandomRejangCharacter = randomRejangCharacterTool.execute;
export default randomRejangCharacterTool;
