// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPsalterPahlaviCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomPsalterPahlaviCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x10b80, 0x10b91],
    [0x10b99, 0x10b9c],
    [0x10ba9, 0x10baf],
  ],
} as const;

export const randomPsalterPahlaviCharacterValueCount = 30;

export const calculateRandomPsalterPahlaviCharacter = (
  random: RandomSource = Math.random,
): RandomPsalterPahlaviCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPsalterPahlaviCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomPsalterPahlaviCharacterInput,
  RandomPsalterPahlaviCharacterOutput
>;

export const randomPsalterPahlaviCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPsalterPahlaviCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Psalter Pahlavi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/psalter-pahlavi-character",
  inputs: [],
  outputs: [
    {
      format: "random/psalter-pahlavi-character",
      id: "value",
      kind: "string",
      label: "Random Psalter Pahlavi Character",
    },
  ],
  title: "Random Psalter Pahlavi Character Generator",
});

export const runRandomPsalterPahlaviCharacter =
  randomPsalterPahlaviCharacterTool.execute;
export default randomPsalterPahlaviCharacterTool;
