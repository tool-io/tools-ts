// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAhomCharacterInput = Readonly<Record<string, never>>;
export type RandomAhomCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11700, 0x1171a],
    [0x1171d, 0x1172b],
    [0x11730, 0x11746],
  ],
} as const;

export const randomAhomCharacterValueCount = 65;

export const calculateRandomAhomCharacter = (
  random: RandomSource = Math.random,
): RandomAhomCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAhomCharacterExample = {
  input: {},
} satisfies ToolExample<RandomAhomCharacterInput, RandomAhomCharacterOutput>;

export const randomAhomCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAhomCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Ahom Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ahom-character",
  inputs: [],
  outputs: [
    {
      format: "random/ahom-character",
      id: "value",
      kind: "string",
      label: "Random Ahom Character",
    },
  ],
  title: "Random Ahom Character Generator",
});

export const runRandomAhomCharacter = randomAhomCharacterTool.execute;
export default randomAhomCharacterTool;
