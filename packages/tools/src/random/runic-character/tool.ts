// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRunicCharacterInput = Readonly<Record<string, never>>;
export type RandomRunicCharacterOutput = { readonly value: string };

const source = { ranges: [[0x16a0, 0x16f8]] } as const;

export const randomRunicCharacterValueCount = 89;

export const calculateRandomRunicCharacter = (
  random: RandomSource = Math.random,
): RandomRunicCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRunicCharacterExample = {
  input: {},
} satisfies ToolExample<RandomRunicCharacterInput, RandomRunicCharacterOutput>;

export const randomRunicCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRunicCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Runic Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/runic-character",
  inputs: [],
  outputs: [
    {
      format: "random/runic-character",
      id: "value",
      kind: "string",
      label: "Random Runic Character",
    },
  ],
  title: "Random Runic Character Generator",
});

export const runRandomRunicCharacter = randomRunicCharacterTool.execute;
export default randomRunicCharacterTool;
