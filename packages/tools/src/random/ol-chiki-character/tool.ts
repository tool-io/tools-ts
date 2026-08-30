// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOlChikiCharacterInput = Readonly<Record<string, never>>;
export type RandomOlChikiCharacterOutput = { readonly value: string };

const source = { ranges: [[0x1c50, 0x1c7f]] } as const;

export const randomOlChikiCharacterValueCount = 48;

export const calculateRandomOlChikiCharacter = (
  random: RandomSource = Math.random,
): RandomOlChikiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOlChikiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOlChikiCharacterInput,
  RandomOlChikiCharacterOutput
>;

export const randomOlChikiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOlChikiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Ol Chiki Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ol-chiki-character",
  inputs: [],
  outputs: [
    {
      format: "random/ol-chiki-character",
      id: "value",
      kind: "string",
      label: "Random Ol Chiki Character",
    },
  ],
  title: "Random Ol Chiki Character Generator",
});

export const runRandomOlChikiCharacter = randomOlChikiCharacterTool.execute;
export default randomOlChikiCharacterTool;
