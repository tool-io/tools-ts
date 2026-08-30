// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNandinagariCharacterInput = Readonly<Record<string, never>>;
export type RandomNandinagariCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x951],
    [0x964, 0x965],
    [0xce6, 0xcef],
    [0x1ce9, 0x1ce9],
    [0x1cf2, 0x1cf2],
    [0x1cfa, 0x1cfa],
    [0xa830, 0xa835],
    [0x119a0, 0x119a7],
    [0x119aa, 0x119d7],
    [0x119da, 0x119e4],
  ],
} as const;

export const randomNandinagariCharacterValueCount = 87;

export const calculateRandomNandinagariCharacter = (
  random: RandomSource = Math.random,
): RandomNandinagariCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNandinagariCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomNandinagariCharacterInput,
  RandomNandinagariCharacterOutput
>;

export const randomNandinagariCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNandinagariCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Nandinagari Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/nandinagari-character",
  inputs: [],
  outputs: [
    {
      format: "random/nandinagari-character",
      id: "value",
      kind: "string",
      label: "Random Nandinagari Character",
    },
  ],
  title: "Random Nandinagari Character Generator",
});

export const runRandomNandinagariCharacter =
  randomNandinagariCharacterTool.execute;
export default randomNandinagariCharacterTool;
