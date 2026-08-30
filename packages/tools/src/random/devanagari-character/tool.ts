// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDevanagariCharacterInput = Readonly<Record<string, never>>;
export type RandomDevanagariCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2bc, 0x2bc],
    [0x900, 0x952],
    [0x955, 0x97f],
    [0x1cd0, 0x1cf4],
    [0x1cf8, 0x1cf9],
    [0x20f0, 0x20f0],
    [0xa830, 0xa839],
    [0xa8e0, 0xa8ff],
    [0x11b00, 0x11b0a],
  ],
} as const;

export const randomDevanagariCharacterValueCount = 220;

export const calculateRandomDevanagariCharacter = (
  random: RandomSource = Math.random,
): RandomDevanagariCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDevanagariCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomDevanagariCharacterInput,
  RandomDevanagariCharacterOutput
>;

export const randomDevanagariCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDevanagariCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Devanagari Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/devanagari-character",
  inputs: [],
  outputs: [
    {
      format: "random/devanagari-character",
      id: "value",
      kind: "string",
      label: "Random Devanagari Character",
    },
  ],
  title: "Random Devanagari Character Generator",
});

export const runRandomDevanagariCharacter =
  randomDevanagariCharacterTool.execute;
export default randomDevanagariCharacterTool;
