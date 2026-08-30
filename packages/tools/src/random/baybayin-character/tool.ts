// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBaybayinCharacterInput = Readonly<Record<string, never>>;
export type RandomBaybayinCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1700, 0x1715],
    [0x171f, 0x171f],
    [0x1735, 0x1736],
  ],
} as const;

export const randomBaybayinCharacterValueCount = 25;

export const calculateRandomBaybayinCharacter = (
  random: RandomSource = Math.random,
): RandomBaybayinCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBaybayinCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBaybayinCharacterInput,
  RandomBaybayinCharacterOutput
>;

export const randomBaybayinCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBaybayinCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Baybayin Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/baybayin-character",
  inputs: [],
  outputs: [
    {
      format: "random/baybayin-character",
      id: "value",
      kind: "string",
      label: "Random Baybayin Character",
    },
  ],
  title: "Random Baybayin Character Generator",
});

export const runRandomBaybayinCharacter = randomBaybayinCharacterTool.execute;
export default randomBaybayinCharacterTool;
