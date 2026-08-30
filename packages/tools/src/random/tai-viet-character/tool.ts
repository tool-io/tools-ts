// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTaiVietCharacterInput = Readonly<Record<string, never>>;
export type RandomTaiVietCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xaa80, 0xaac2],
    [0xaadb, 0xaadf],
  ],
} as const;

export const randomTaiVietCharacterValueCount = 72;

export const calculateRandomTaiVietCharacter = (
  random: RandomSource = Math.random,
): RandomTaiVietCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTaiVietCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTaiVietCharacterInput,
  RandomTaiVietCharacterOutput
>;

export const randomTaiVietCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTaiVietCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tai Viet Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tai-viet-character",
  inputs: [],
  outputs: [
    {
      format: "random/tai-viet-character",
      id: "value",
      kind: "string",
      label: "Random Tai Viet Character",
    },
  ],
  title: "Random Tai Viet Character Generator",
});

export const runRandomTaiVietCharacter = randomTaiVietCharacterTool.execute;
export default randomTaiVietCharacterTool;
