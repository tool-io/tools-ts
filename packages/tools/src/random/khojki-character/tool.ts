// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKhojkiCharacterInput = Readonly<Record<string, never>>;
export type RandomKhojkiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xae6, 0xaef],
    [0xa830, 0xa839],
    [0x11200, 0x11211],
    [0x11213, 0x11241],
  ],
} as const;

export const randomKhojkiCharacterValueCount = 85;

export const calculateRandomKhojkiCharacter = (
  random: RandomSource = Math.random,
): RandomKhojkiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKhojkiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKhojkiCharacterInput,
  RandomKhojkiCharacterOutput
>;

export const randomKhojkiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKhojkiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Khojki Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/khojki-character",
  inputs: [],
  outputs: [
    {
      format: "random/khojki-character",
      id: "value",
      kind: "string",
      label: "Random Khojki Character",
    },
  ],
  title: "Random Khojki Character Generator",
});

export const runRandomKhojkiCharacter = randomKhojkiCharacterTool.execute;
export default randomKhojkiCharacterTool;
