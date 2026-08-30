// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomThaiCharacterInput = Readonly<Record<string, never>>;
export type RandomThaiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x2d7, 0x2d7],
    [0x303, 0x303],
    [0x331, 0x331],
    [0xe01, 0xe3a],
    [0xe40, 0xe5b],
  ],
} as const;

export const randomThaiCharacterValueCount = 90;

export const calculateRandomThaiCharacter = (
  random: RandomSource = Math.random,
): RandomThaiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomThaiCharacterExample = {
  input: {},
} satisfies ToolExample<RandomThaiCharacterInput, RandomThaiCharacterOutput>;

export const randomThaiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomThaiCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Thai Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/thai-character",
  inputs: [],
  outputs: [
    {
      format: "random/thai-character",
      id: "value",
      kind: "string",
      label: "Random Thai Character",
    },
  ],
  title: "Random Thai Character Generator",
});

export const runRandomThaiCharacter = randomThaiCharacterTool.execute;
export default randomThaiCharacterTool;
