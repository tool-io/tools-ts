// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldPersianCharacterInput = Readonly<Record<string, never>>;
export type RandomOldPersianCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x103a0, 0x103c3],
    [0x103c8, 0x103d5],
  ],
} as const;

export const randomOldPersianCharacterValueCount = 50;

export const calculateRandomOldPersianCharacter = (
  random: RandomSource = Math.random,
): RandomOldPersianCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldPersianCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldPersianCharacterInput,
  RandomOldPersianCharacterOutput
>;

export const randomOldPersianCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldPersianCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Old Persian Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/old-persian-character",
  inputs: [],
  outputs: [
    {
      format: "random/old-persian-character",
      id: "value",
      kind: "string",
      label: "Random Old Persian Character",
    },
  ],
  title: "Random Old Persian Character Generator",
});

export const runRandomOldPersianCharacter =
  randomOldPersianCharacterTool.execute;
export default randomOldPersianCharacterTool;
