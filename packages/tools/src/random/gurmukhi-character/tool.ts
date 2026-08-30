// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGurmukhiCharacterInput = Readonly<Record<string, never>>;
export type RandomGurmukhiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xa01, 0xa03],
    [0xa05, 0xa0a],
    [0xa0f, 0xa10],
    [0xa13, 0xa28],
    [0xa2a, 0xa30],
    [0xa32, 0xa33],
    [0xa35, 0xa36],
    [0xa38, 0xa39],
    [0xa3c, 0xa3c],
    [0xa3e, 0xa42],
    [0xa47, 0xa48],
    [0xa4b, 0xa4d],
    [0xa51, 0xa51],
    [0xa59, 0xa5c],
    [0xa5e, 0xa5e],
    [0xa66, 0xa76],
    [0xa830, 0xa839],
  ],
} as const;

export const randomGurmukhiCharacterValueCount = 94;

export const calculateRandomGurmukhiCharacter = (
  random: RandomSource = Math.random,
): RandomGurmukhiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGurmukhiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomGurmukhiCharacterInput,
  RandomGurmukhiCharacterOutput
>;

export const randomGurmukhiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGurmukhiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Gurmukhi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/gurmukhi-character",
  inputs: [],
  outputs: [
    {
      format: "random/gurmukhi-character",
      id: "value",
      kind: "string",
      label: "Random Gurmukhi Character",
    },
  ],
  title: "Random Gurmukhi Character Generator",
});

export const runRandomGurmukhiCharacter = randomGurmukhiCharacterTool.execute;
export default randomGurmukhiCharacterTool;
