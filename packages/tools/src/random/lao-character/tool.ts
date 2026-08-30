// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLaoCharacterInput = Readonly<Record<string, never>>;
export type RandomLaoCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xe81, 0xe82],
    [0xe84, 0xe84],
    [0xe86, 0xe8a],
    [0xe8c, 0xea3],
    [0xea5, 0xea5],
    [0xea7, 0xebd],
    [0xec0, 0xec4],
    [0xec6, 0xec6],
    [0xec8, 0xece],
    [0xed0, 0xed9],
    [0xedc, 0xedf],
  ],
} as const;

export const randomLaoCharacterValueCount = 83;

export const calculateRandomLaoCharacter = (
  random: RandomSource = Math.random,
): RandomLaoCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLaoCharacterExample = {
  input: {},
} satisfies ToolExample<RandomLaoCharacterInput, RandomLaoCharacterOutput>;

export const randomLaoCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLaoCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Lao Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/lao-character",
  inputs: [],
  outputs: [
    {
      format: "random/lao-character",
      id: "value",
      kind: "string",
      label: "Random Lao Character",
    },
  ],
  title: "Random Lao Character Generator",
});

export const runRandomLaoCharacter = randomLaoCharacterTool.execute;
export default randomLaoCharacterTool;
