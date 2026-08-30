// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldTurkicCharacterInput = Readonly<Record<string, never>>;
export type RandomOldTurkicCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x205a, 0x205a],
    [0x2e30, 0x2e30],
    [0x10c00, 0x10c48],
  ],
} as const;

export const randomOldTurkicCharacterValueCount = 75;

export const calculateRandomOldTurkicCharacter = (
  random: RandomSource = Math.random,
): RandomOldTurkicCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldTurkicCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldTurkicCharacterInput,
  RandomOldTurkicCharacterOutput
>;

export const randomOldTurkicCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldTurkicCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Old Turkic Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/old-turkic-character",
  inputs: [],
  outputs: [
    {
      format: "random/old-turkic-character",
      id: "value",
      kind: "string",
      label: "Random Old Turkic Character",
    },
  ],
  title: "Random Old Turkic Character Generator",
});

export const runRandomOldTurkicCharacter = randomOldTurkicCharacterTool.execute;
export default randomOldTurkicCharacterTool;
