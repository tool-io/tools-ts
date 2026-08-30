// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKawiCharacterInput = Readonly<Record<string, never>>;
export type RandomKawiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11f00, 0x11f10],
    [0x11f12, 0x11f3a],
    [0x11f3e, 0x11f5a],
  ],
} as const;

export const randomKawiCharacterValueCount = 87;

export const calculateRandomKawiCharacter = (
  random: RandomSource = Math.random,
): RandomKawiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKawiCharacterExample = {
  input: {},
} satisfies ToolExample<RandomKawiCharacterInput, RandomKawiCharacterOutput>;

export const randomKawiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKawiCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Kawi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kawi-character",
  inputs: [],
  outputs: [
    {
      format: "random/kawi-character",
      id: "value",
      kind: "string",
      label: "Random Kawi Character",
    },
  ],
  title: "Random Kawi Character Generator",
});

export const runRandomKawiCharacter = randomKawiCharacterTool.execute;
export default randomKawiCharacterTool;
