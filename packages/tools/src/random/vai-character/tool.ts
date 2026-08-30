// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomVaiCharacterInput = Readonly<Record<string, never>>;
export type RandomVaiCharacterOutput = { readonly value: string };

const source = { ranges: [[0xa500, 0xa62b]] } as const;

export const randomVaiCharacterValueCount = 300;

export const calculateRandomVaiCharacter = (
  random: RandomSource = Math.random,
): RandomVaiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomVaiCharacterExample = {
  input: {},
} satisfies ToolExample<RandomVaiCharacterInput, RandomVaiCharacterOutput>;

export const randomVaiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomVaiCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Vai Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/vai-character",
  inputs: [],
  outputs: [
    {
      format: "random/vai-character",
      id: "value",
      kind: "string",
      label: "Random Vai Character",
    },
  ],
  title: "Random Vai Character Generator",
});

export const runRandomVaiCharacter = randomVaiCharacterTool.execute;
export default randomVaiCharacterTool;
