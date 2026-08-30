// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBuhidCharacterInput = Readonly<Record<string, never>>;
export type RandomBuhidCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1735, 0x1736],
    [0x1740, 0x1753],
  ],
} as const;

export const randomBuhidCharacterValueCount = 22;

export const calculateRandomBuhidCharacter = (
  random: RandomSource = Math.random,
): RandomBuhidCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBuhidCharacterExample = {
  input: {},
} satisfies ToolExample<RandomBuhidCharacterInput, RandomBuhidCharacterOutput>;

export const randomBuhidCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBuhidCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Buhid Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/buhid-character",
  inputs: [],
  outputs: [
    {
      format: "random/buhid-character",
      id: "value",
      kind: "string",
      label: "Random Buhid Character",
    },
  ],
  title: "Random Buhid Character Generator",
});

export const runRandomBuhidCharacter = randomBuhidCharacterTool.execute;
export default randomBuhidCharacterTool;
