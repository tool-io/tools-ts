// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTangsaCharacterInput = Readonly<Record<string, never>>;
export type RandomTangsaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x16a70, 0x16abe],
    [0x16ac0, 0x16ac9],
  ],
} as const;

export const randomTangsaCharacterValueCount = 89;

export const calculateRandomTangsaCharacter = (
  random: RandomSource = Math.random,
): RandomTangsaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTangsaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTangsaCharacterInput,
  RandomTangsaCharacterOutput
>;

export const randomTangsaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTangsaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tangsa Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tangsa-character",
  inputs: [],
  outputs: [
    {
      format: "random/tangsa-character",
      id: "value",
      kind: "string",
      label: "Random Tangsa Character",
    },
  ],
  title: "Random Tangsa Character Generator",
});

export const runRandomTangsaCharacter = randomTangsaCharacterTool.execute;
export default randomTangsaCharacterTool;
