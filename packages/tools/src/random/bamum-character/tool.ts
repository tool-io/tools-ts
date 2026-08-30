// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBamumCharacterInput = Readonly<Record<string, never>>;
export type RandomBamumCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa6a0, 0xa6f7],
    [0x16800, 0x16a38],
  ],
} as const;

export const randomBamumCharacterValueCount = 657;

export const calculateRandomBamumCharacter = (
  random: RandomSource = Math.random,
): RandomBamumCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBamumCharacterExample = {
  input: {},
} satisfies ToolExample<RandomBamumCharacterInput, RandomBamumCharacterOutput>;

export const randomBamumCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBamumCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Bamum Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/bamum-character",
  inputs: [],
  outputs: [
    {
      format: "random/bamum-character",
      id: "value",
      kind: "string",
      label: "Random Bamum Character",
    },
  ],
  title: "Random Bamum Character Generator",
});

export const runRandomBamumCharacter = randomBamumCharacterTool.execute;
export default randomBamumCharacterTool;
