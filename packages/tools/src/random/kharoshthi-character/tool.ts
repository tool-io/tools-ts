// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKharoshthiCharacterInput = Readonly<Record<string, never>>;
export type RandomKharoshthiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10a00, 0x10a03],
    [0x10a05, 0x10a06],
    [0x10a0c, 0x10a13],
    [0x10a15, 0x10a17],
    [0x10a19, 0x10a35],
    [0x10a38, 0x10a3a],
    [0x10a3f, 0x10a48],
    [0x10a50, 0x10a58],
  ],
} as const;

export const randomKharoshthiCharacterValueCount = 68;

export const calculateRandomKharoshthiCharacter = (
  random: RandomSource = Math.random,
): RandomKharoshthiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKharoshthiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKharoshthiCharacterInput,
  RandomKharoshthiCharacterOutput
>;

export const randomKharoshthiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKharoshthiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Kharoshthi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kharoshthi-character",
  inputs: [],
  outputs: [
    {
      format: "random/kharoshthi-character",
      id: "value",
      kind: "string",
      label: "Random Kharoshthi Character",
    },
  ],
  title: "Random Kharoshthi Character Generator",
});

export const runRandomKharoshthiCharacter =
  randomKharoshthiCharacterTool.execute;
export default randomKharoshthiCharacterTool;
