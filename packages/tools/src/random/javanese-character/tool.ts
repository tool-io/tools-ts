// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomJavaneseCharacterInput = Readonly<Record<string, never>>;
export type RandomJavaneseCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa980, 0xa9cd],
    [0xa9cf, 0xa9d9],
    [0xa9de, 0xa9df],
  ],
} as const;

export const randomJavaneseCharacterValueCount = 91;

export const calculateRandomJavaneseCharacter = (
  random: RandomSource = Math.random,
): RandomJavaneseCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomJavaneseCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomJavaneseCharacterInput,
  RandomJavaneseCharacterOutput
>;

export const randomJavaneseCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomJavaneseCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Javanese Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/javanese-character",
  inputs: [],
  outputs: [
    {
      format: "random/javanese-character",
      id: "value",
      kind: "string",
      label: "Random Javanese Character",
    },
  ],
  title: "Random Javanese Character Generator",
});

export const runRandomJavaneseCharacter = randomJavaneseCharacterTool.execute;
export default randomJavaneseCharacterTool;
