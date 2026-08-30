// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKhmerCharacterInput = Readonly<Record<string, never>>;
export type RandomKhmerCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1780, 0x17dd],
    [0x17e0, 0x17e9],
    [0x17f0, 0x17f9],
    [0x19e0, 0x19ff],
  ],
} as const;

export const randomKhmerCharacterValueCount = 146;

export const calculateRandomKhmerCharacter = (
  random: RandomSource = Math.random,
): RandomKhmerCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKhmerCharacterExample = {
  input: {},
} satisfies ToolExample<RandomKhmerCharacterInput, RandomKhmerCharacterOutput>;

export const randomKhmerCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKhmerCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Khmer Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/khmer-character",
  inputs: [],
  outputs: [
    {
      format: "random/khmer-character",
      id: "value",
      kind: "string",
      label: "Random Khmer Character",
    },
  ],
  title: "Random Khmer Character Generator",
});

export const runRandomKhmerCharacter = randomKhmerCharacterTool.execute;
export default randomKhmerCharacterTool;
