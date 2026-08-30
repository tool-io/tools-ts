// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBugineseCharacterInput = Readonly<Record<string, never>>;
export type RandomBugineseCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1a00, 0x1a1b],
    [0x1a1e, 0x1a1f],
    [0xa9cf, 0xa9cf],
  ],
} as const;

export const randomBugineseCharacterValueCount = 31;

export const calculateRandomBugineseCharacter = (
  random: RandomSource = Math.random,
): RandomBugineseCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBugineseCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBugineseCharacterInput,
  RandomBugineseCharacterOutput
>;

export const randomBugineseCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBugineseCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Buginese Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/buginese-character",
  inputs: [],
  outputs: [
    {
      format: "random/buginese-character",
      id: "value",
      kind: "string",
      label: "Random Buginese Character",
    },
  ],
  title: "Random Buginese Character Generator",
});

export const runRandomBugineseCharacter = randomBugineseCharacterTool.execute;
export default randomBugineseCharacterTool;
