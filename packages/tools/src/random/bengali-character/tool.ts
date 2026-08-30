// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBengaliCharacterInput = Readonly<Record<string, never>>;
export type RandomBengaliCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x951, 0x952],
    [0x964, 0x965],
    [0x980, 0x983],
    [0x985, 0x98c],
    [0x98f, 0x990],
    [0x993, 0x9a8],
    [0x9aa, 0x9b0],
    [0x9b2, 0x9b2],
    [0x9b6, 0x9b9],
    [0x9bc, 0x9c4],
    [0x9c7, 0x9c8],
    [0x9cb, 0x9ce],
    [0x9d7, 0x9d7],
    [0x9dc, 0x9dd],
    [0x9df, 0x9e3],
    [0x9e6, 0x9fe],
    [0x1cd0, 0x1cd0],
    [0x1cd2, 0x1cd2],
    [0x1cd5, 0x1cd6],
    [0x1cd8, 0x1cd8],
    [0x1ce1, 0x1ce1],
    [0x1cea, 0x1cea],
    [0x1ced, 0x1ced],
    [0x1cf2, 0x1cf2],
    [0x1cf5, 0x1cf7],
    [0xa8f1, 0xa8f1],
    [0x11df0, 0x11df1],
  ],
} as const;

export const randomBengaliCharacterValueCount = 116;

export const calculateRandomBengaliCharacter = (
  random: RandomSource = Math.random,
): RandomBengaliCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBengaliCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBengaliCharacterInput,
  RandomBengaliCharacterOutput
>;

export const randomBengaliCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBengaliCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Bengali Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/bengali-character",
  inputs: [],
  outputs: [
    {
      format: "random/bengali-character",
      id: "value",
      kind: "string",
      label: "Random Bengali Character",
    },
  ],
  title: "Random Bengali Character Generator",
});

export const runRandomBengaliCharacter = randomBengaliCharacterTool.execute;
export default randomBengaliCharacterTool;
