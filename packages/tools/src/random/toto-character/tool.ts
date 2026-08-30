// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTotoCharacterInput = Readonly<Record<string, never>>;
export type RandomTotoCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x1e290, 0x1e2ae],
  ],
} as const;

export const randomTotoCharacterValueCount = 32;

export const calculateRandomTotoCharacter = (
  random: RandomSource = Math.random,
): RandomTotoCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTotoCharacterExample = {
  input: {},
} satisfies ToolExample<RandomTotoCharacterInput, RandomTotoCharacterOutput>;

export const randomTotoCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTotoCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Toto Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/toto-character",
  inputs: [],
  outputs: [
    {
      format: "random/toto-character",
      id: "value",
      kind: "string",
      label: "Random Toto Character",
    },
  ],
  title: "Random Toto Character Generator",
});

export const runRandomTotoCharacter = randomTotoCharacterTool.execute;
export default randomTotoCharacterTool;
