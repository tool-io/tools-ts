// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGarayCharacterInput = Readonly<Record<string, never>>;
export type RandomGarayCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x60c, 0x60c],
    [0x61b, 0x61b],
    [0x61f, 0x61f],
    [0x10d40, 0x10d65],
    [0x10d69, 0x10d85],
    [0x10d8e, 0x10d8f],
  ],
} as const;

export const randomGarayCharacterValueCount = 72;

export const calculateRandomGarayCharacter = (
  random: RandomSource = Math.random,
): RandomGarayCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGarayCharacterExample = {
  input: {},
} satisfies ToolExample<RandomGarayCharacterInput, RandomGarayCharacterOutput>;

export const randomGarayCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGarayCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Garay Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/garay-character",
  inputs: [],
  outputs: [
    {
      format: "random/garay-character",
      id: "value",
      kind: "string",
      label: "Random Garay Character",
    },
  ],
  title: "Random Garay Character Generator",
});

export const runRandomGarayCharacter = randomGarayCharacterTool.execute;
export default randomGarayCharacterTool;
