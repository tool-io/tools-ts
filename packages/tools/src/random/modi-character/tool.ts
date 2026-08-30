// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomModiCharacterInput = Readonly<Record<string, never>>;
export type RandomModiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa830, 0xa839],
    [0x11600, 0x11644],
    [0x11650, 0x11659],
  ],
} as const;

export const randomModiCharacterValueCount = 89;

export const calculateRandomModiCharacter = (
  random: RandomSource = Math.random,
): RandomModiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomModiCharacterExample = {
  input: {},
} satisfies ToolExample<RandomModiCharacterInput, RandomModiCharacterOutput>;

export const randomModiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomModiCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Modi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/modi-character",
  inputs: [],
  outputs: [
    {
      format: "random/modi-character",
      id: "value",
      kind: "string",
      label: "Random Modi Character",
    },
  ],
  title: "Random Modi Character Generator",
});

export const runRandomModiCharacter = randomModiCharacterTool.execute;
export default randomModiCharacterTool;
