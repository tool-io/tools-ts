// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSundaneseCharacterInput = Readonly<Record<string, never>>;
export type RandomSundaneseCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1b80, 0x1bbf],
    [0x1cc0, 0x1cc7],
  ],
} as const;

export const randomSundaneseCharacterValueCount = 72;

export const calculateRandomSundaneseCharacter = (
  random: RandomSource = Math.random,
): RandomSundaneseCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSundaneseCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSundaneseCharacterInput,
  RandomSundaneseCharacterOutput
>;

export const randomSundaneseCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSundaneseCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Sundanese Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/sundanese-character",
  inputs: [],
  outputs: [
    {
      format: "random/sundanese-character",
      id: "value",
      kind: "string",
      label: "Random Sundanese Character",
    },
  ],
  title: "Random Sundanese Character Generator",
});

export const runRandomSundaneseCharacter = randomSundaneseCharacterTool.execute;
export default randomSundaneseCharacterTool;
