// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTifinaghCharacterInput = Readonly<Record<string, never>>;
export type RandomTifinaghCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x302, 0x302],
    [0x304, 0x304],
    [0x306, 0x309],
    [0x323, 0x323],
    [0x2d30, 0x2d67],
    [0x2d6f, 0x2d70],
    [0x2d7f, 0x2d7f],
  ],
} as const;

export const randomTifinaghCharacterValueCount = 66;

export const calculateRandomTifinaghCharacter = (
  random: RandomSource = Math.random,
): RandomTifinaghCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTifinaghCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTifinaghCharacterInput,
  RandomTifinaghCharacterOutput
>;

export const randomTifinaghCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTifinaghCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tifinagh Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tifinagh-character",
  inputs: [],
  outputs: [
    {
      format: "random/tifinagh-character",
      id: "value",
      kind: "string",
      label: "Random Tifinagh Character",
    },
  ],
  title: "Random Tifinagh Character Generator",
});

export const runRandomTifinaghCharacter = randomTifinaghCharacterTool.execute;
export default randomTifinaghCharacterTool;
