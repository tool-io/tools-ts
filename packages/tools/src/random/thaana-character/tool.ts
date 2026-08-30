// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomThaanaCharacterInput = Readonly<Record<string, never>>;
export type RandomThaanaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x60c, 0x60c],
    [0x61b, 0x61b],
    [0x61f, 0x61f],
    [0x660, 0x669],
    [0x780, 0x7b1],
    [0xfdf2, 0xfdf2],
    [0xfdfd, 0xfdfd],
  ],
} as const;

export const randomThaanaCharacterValueCount = 65;

export const calculateRandomThaanaCharacter = (
  random: RandomSource = Math.random,
): RandomThaanaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomThaanaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomThaanaCharacterInput,
  RandomThaanaCharacterOutput
>;

export const randomThaanaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomThaanaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Thaana Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/thaana-character",
  inputs: [],
  outputs: [
    {
      format: "random/thaana-character",
      id: "value",
      kind: "string",
      label: "Random Thaana Character",
    },
  ],
  title: "Random Thaana Character Generator",
});

export const runRandomThaanaCharacter = randomThaanaCharacterTool.execute;
export default randomThaanaCharacterTool;
