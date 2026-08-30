// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOghamCharacterInput = Readonly<Record<string, never>>;
export type RandomOghamCharacterOutput = { readonly value: string };

const source = { ranges: [[0x1681, 0x169c]] } as const;

export const randomOghamCharacterValueCount = 28;

export const calculateRandomOghamCharacter = (
  random: RandomSource = Math.random,
): RandomOghamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOghamCharacterExample = {
  input: {},
} satisfies ToolExample<RandomOghamCharacterInput, RandomOghamCharacterOutput>;

export const randomOghamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOghamCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Ogham Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ogham-character",
  inputs: [],
  outputs: [
    {
      format: "random/ogham-character",
      id: "value",
      kind: "string",
      label: "Random Ogham Character",
    },
  ],
  title: "Random Ogham Character Generator",
});

export const runRandomOghamCharacter = randomOghamCharacterTool.execute;
export default randomOghamCharacterTool;
