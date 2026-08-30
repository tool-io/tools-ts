// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBhaiksukiCharacterInput = Readonly<Record<string, never>>;
export type RandomBhaiksukiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11c00, 0x11c08],
    [0x11c0a, 0x11c36],
    [0x11c38, 0x11c45],
    [0x11c50, 0x11c6c],
  ],
} as const;

export const randomBhaiksukiCharacterValueCount = 97;

export const calculateRandomBhaiksukiCharacter = (
  random: RandomSource = Math.random,
): RandomBhaiksukiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBhaiksukiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBhaiksukiCharacterInput,
  RandomBhaiksukiCharacterOutput
>;

export const randomBhaiksukiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBhaiksukiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Bhaiksuki Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/bhaiksuki-character",
  inputs: [],
  outputs: [
    {
      format: "random/bhaiksuki-character",
      id: "value",
      kind: "string",
      label: "Random Bhaiksuki Character",
    },
  ],
  title: "Random Bhaiksuki Character Generator",
});

export const runRandomBhaiksukiCharacter = randomBhaiksukiCharacterTool.execute;
export default randomBhaiksukiCharacterTool;
