// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMiaoCharacterInput = Readonly<Record<string, never>>;
export type RandomMiaoCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x16f00, 0x16f4a],
    [0x16f4f, 0x16f87],
    [0x16f8f, 0x16f9f],
  ],
} as const;

export const randomMiaoCharacterValueCount = 149;

export const calculateRandomMiaoCharacter = (
  random: RandomSource = Math.random,
): RandomMiaoCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMiaoCharacterExample = {
  input: {},
} satisfies ToolExample<RandomMiaoCharacterInput, RandomMiaoCharacterOutput>;

export const randomMiaoCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMiaoCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Miao Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/miao-character",
  inputs: [],
  outputs: [
    {
      format: "random/miao-character",
      id: "value",
      kind: "string",
      label: "Random Miao Character",
    },
  ],
  title: "Random Miao Character Generator",
});

export const runRandomMiaoCharacter = randomMiaoCharacterTool.execute;
export default randomMiaoCharacterTool;
