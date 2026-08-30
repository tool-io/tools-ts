// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPauCinHauCharacterInput = Readonly<Record<string, never>>;
export type RandomPauCinHauCharacterOutput = { readonly value: string };

const source = { ranges: [[0x11ac0, 0x11af8]] } as const;

export const randomPauCinHauCharacterValueCount = 57;

export const calculateRandomPauCinHauCharacter = (
  random: RandomSource = Math.random,
): RandomPauCinHauCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPauCinHauCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomPauCinHauCharacterInput,
  RandomPauCinHauCharacterOutput
>;

export const randomPauCinHauCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPauCinHauCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Pau Cin Hau Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/pau-cin-hau-character",
  inputs: [],
  outputs: [
    {
      format: "random/pau-cin-hau-character",
      id: "value",
      kind: "string",
      label: "Random Pau Cin Hau Character",
    },
  ],
  title: "Random Pau Cin Hau Character Generator",
});

export const runRandomPauCinHauCharacter = randomPauCinHauCharacterTool.execute;
export default randomPauCinHauCharacterTool;
