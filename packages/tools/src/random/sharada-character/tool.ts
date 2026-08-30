// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSharadaCharacterInput = Readonly<Record<string, never>>;
export type RandomSharadaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x951],
    [0x1cd7, 0x1cd7],
    [0x1cd9, 0x1cd9],
    [0x1cdc, 0x1cdd],
    [0x1ce0, 0x1ce0],
    [0x1cea, 0x1cea],
    [0x1ced, 0x1ced],
    [0xa830, 0xa835],
    [0xa838, 0xa838],
    [0x11180, 0x111df],
    [0x11b60, 0x11b67],
  ],
} as const;

export const randomSharadaCharacterValueCount = 119;

export const calculateRandomSharadaCharacter = (
  random: RandomSource = Math.random,
): RandomSharadaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSharadaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSharadaCharacterInput,
  RandomSharadaCharacterOutput
>;

export const randomSharadaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSharadaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Sharada Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/sharada-character",
  inputs: [],
  outputs: [
    {
      format: "random/sharada-character",
      id: "value",
      kind: "string",
      label: "Random Sharada Character",
    },
  ],
  title: "Random Sharada Character Generator",
});

export const runRandomSharadaCharacter = randomSharadaCharacterTool.execute;
export default randomSharadaCharacterTool;
