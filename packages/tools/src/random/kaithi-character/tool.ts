// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKaithiCharacterInput = Readonly<Record<string, never>>;
export type RandomKaithiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x966, 0x96f],
    [0x2e31, 0x2e31],
    [0xa830, 0xa839],
    [0x11080, 0x110bc],
    [0x110be, 0x110c2],
  ],
} as const;

export const randomKaithiCharacterValueCount = 87;

export const calculateRandomKaithiCharacter = (
  random: RandomSource = Math.random,
): RandomKaithiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKaithiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKaithiCharacterInput,
  RandomKaithiCharacterOutput
>;

export const randomKaithiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKaithiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Kaithi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kaithi-character",
  inputs: [],
  outputs: [
    {
      format: "random/kaithi-character",
      id: "value",
      kind: "string",
      label: "Random Kaithi Character",
    },
  ],
  title: "Random Kaithi Character Generator",
});

export const runRandomKaithiCharacter = randomKaithiCharacterTool.execute;
export default randomKaithiCharacterTool;
