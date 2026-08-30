// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSoyomboCharacterInput = Readonly<Record<string, never>>;
export type RandomSoyomboCharacterOutput = { readonly value: string };

const source = { ranges: [[0x11a50, 0x11aa2]] } as const;

export const randomSoyomboCharacterValueCount = 83;

export const calculateRandomSoyomboCharacter = (
  random: RandomSource = Math.random,
): RandomSoyomboCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSoyomboCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSoyomboCharacterInput,
  RandomSoyomboCharacterOutput
>;

export const randomSoyomboCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSoyomboCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Soyombo Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/soyombo-character",
  inputs: [],
  outputs: [
    {
      format: "random/soyombo-character",
      id: "value",
      kind: "string",
      label: "Random Soyombo Character",
    },
  ],
  title: "Random Soyombo Character Generator",
});

export const runRandomSoyomboCharacter = randomSoyomboCharacterTool.execute;
export default randomSoyomboCharacterTool;
