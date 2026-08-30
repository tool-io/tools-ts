// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTaiThamCharacterInput = Readonly<Record<string, never>>;
export type RandomTaiThamCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1a20, 0x1a5e],
    [0x1a60, 0x1a7c],
    [0x1a7f, 0x1a89],
    [0x1a90, 0x1a99],
    [0x1aa0, 0x1aad],
  ],
} as const;

export const randomTaiThamCharacterValueCount = 127;

export const calculateRandomTaiThamCharacter = (
  random: RandomSource = Math.random,
): RandomTaiThamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTaiThamCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTaiThamCharacterInput,
  RandomTaiThamCharacterOutput
>;

export const randomTaiThamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTaiThamCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tai Tham Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tai-tham-character",
  inputs: [],
  outputs: [
    {
      format: "random/tai-tham-character",
      id: "value",
      kind: "string",
      label: "Random Tai Tham Character",
    },
  ],
  title: "Random Tai Tham Character Generator",
});

export const runRandomTaiThamCharacter = randomTaiThamCharacterTool.execute;
export default randomTaiThamCharacterTool;
