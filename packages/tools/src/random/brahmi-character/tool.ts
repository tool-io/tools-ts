// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBrahmiCharacterInput = Readonly<Record<string, never>>;
export type RandomBrahmiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11000, 0x1104d],
    [0x11052, 0x11075],
    [0x1107f, 0x1107f],
  ],
} as const;

export const randomBrahmiCharacterValueCount = 115;

export const calculateRandomBrahmiCharacter = (
  random: RandomSource = Math.random,
): RandomBrahmiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBrahmiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBrahmiCharacterInput,
  RandomBrahmiCharacterOutput
>;

export const randomBrahmiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBrahmiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Brahmi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/brahmi-character",
  inputs: [],
  outputs: [
    {
      format: "random/brahmi-character",
      id: "value",
      kind: "string",
      label: "Random Brahmi Character",
    },
  ],
  title: "Random Brahmi Character Generator",
});

export const runRandomBrahmiCharacter = randomBrahmiCharacterTool.execute;
export default randomBrahmiCharacterTool;
