// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTibetanCharacterInput = Readonly<Record<string, never>>;
export type RandomTibetanCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xf00, 0xf47],
    [0xf49, 0xf6c],
    [0xf71, 0xf97],
    [0xf99, 0xfbc],
    [0xfbe, 0xfcc],
    [0xfce, 0xfd4],
    [0xfd9, 0xfda],
    [0x3008, 0x300b],
  ],
} as const;

export const randomTibetanCharacterValueCount = 211;

export const calculateRandomTibetanCharacter = (
  random: RandomSource = Math.random,
): RandomTibetanCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTibetanCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTibetanCharacterInput,
  RandomTibetanCharacterOutput
>;

export const randomTibetanCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTibetanCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tibetan Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tibetan-character",
  inputs: [],
  outputs: [
    {
      format: "random/tibetan-character",
      id: "value",
      kind: "string",
      label: "Random Tibetan Character",
    },
  ],
  title: "Random Tibetan Character Generator",
});

export const runRandomTibetanCharacter = randomTibetanCharacterTool.execute;
export default randomTibetanCharacterTool;
