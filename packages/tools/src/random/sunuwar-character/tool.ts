// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSunuwarCharacterInput = Readonly<Record<string, never>>;
export type RandomSunuwarCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x300, 0x301],
    [0x303, 0x303],
    [0x30d, 0x30d],
    [0x310, 0x310],
    [0x32d, 0x32d],
    [0x331, 0x331],
    [0x11bc0, 0x11be1],
    [0x11bf0, 0x11bf9],
  ],
} as const;

export const randomSunuwarCharacterValueCount = 51;

export const calculateRandomSunuwarCharacter = (
  random: RandomSource = Math.random,
): RandomSunuwarCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSunuwarCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSunuwarCharacterInput,
  RandomSunuwarCharacterOutput
>;

export const randomSunuwarCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSunuwarCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Sunuwar Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/sunuwar-character",
  inputs: [],
  outputs: [
    {
      format: "random/sunuwar-character",
      id: "value",
      kind: "string",
      label: "Random Sunuwar Character",
    },
  ],
  title: "Random Sunuwar Character Generator",
});

export const runRandomSunuwarCharacter = randomSunuwarCharacterTool.execute;
export default randomSunuwarCharacterTool;
