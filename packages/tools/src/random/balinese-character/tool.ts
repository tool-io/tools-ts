// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBalineseCharacterInput = Readonly<Record<string, never>>;
export type RandomBalineseCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1b00, 0x1b4c],
    [0x1b4e, 0x1b7f],
  ],
} as const;

export const randomBalineseCharacterValueCount = 127;

export const calculateRandomBalineseCharacter = (
  random: RandomSource = Math.random,
): RandomBalineseCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBalineseCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBalineseCharacterInput,
  RandomBalineseCharacterOutput
>;

export const randomBalineseCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBalineseCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Balinese Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/balinese-character",
  inputs: [],
  outputs: [
    {
      format: "random/balinese-character",
      id: "value",
      kind: "string",
      label: "Random Balinese Character",
    },
  ],
  title: "Random Balinese Character Generator",
});

export const runRandomBalineseCharacter = randomBalineseCharacterTool.execute;
export default randomBalineseCharacterTool;
