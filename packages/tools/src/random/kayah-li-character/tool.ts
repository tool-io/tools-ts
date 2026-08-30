// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKayahLiCharacterInput = Readonly<Record<string, never>>;
export type RandomKayahLiCharacterOutput = { readonly value: string };

const source = { ranges: [[0xa900, 0xa92f]] } as const;

export const randomKayahLiCharacterValueCount = 48;

export const calculateRandomKayahLiCharacter = (
  random: RandomSource = Math.random,
): RandomKayahLiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKayahLiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKayahLiCharacterInput,
  RandomKayahLiCharacterOutput
>;

export const randomKayahLiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKayahLiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Kayah Li Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kayah-li-character",
  inputs: [],
  outputs: [
    {
      format: "random/kayah-li-character",
      id: "value",
      kind: "string",
      label: "Random Kayah Li Character",
    },
  ],
  title: "Random Kayah Li Character Generator",
});

export const runRandomKayahLiCharacter = randomKayahLiCharacterTool.execute;
export default randomKayahLiCharacterTool;
