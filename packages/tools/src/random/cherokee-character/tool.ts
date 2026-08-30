// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCherokeeCharacterInput = Readonly<Record<string, never>>;
export type RandomCherokeeCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x300, 0x302],
    [0x304, 0x304],
    [0x30b, 0x30c],
    [0x323, 0x324],
    [0x330, 0x331],
    [0x13a0, 0x13f5],
    [0x13f8, 0x13fd],
    [0xab70, 0xabbf],
  ],
} as const;

export const randomCherokeeCharacterValueCount = 182;

export const calculateRandomCherokeeCharacter = (
  random: RandomSource = Math.random,
): RandomCherokeeCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCherokeeCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomCherokeeCharacterInput,
  RandomCherokeeCharacterOutput
>;

export const randomCherokeeCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCherokeeCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Cherokee Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/cherokee-character",
  inputs: [],
  outputs: [
    {
      format: "random/cherokee-character",
      id: "value",
      kind: "string",
      label: "Random Cherokee Character",
    },
  ],
  title: "Random Cherokee Character Generator",
});

export const runRandomCherokeeCharacter = randomCherokeeCharacterTool.execute;
export default randomCherokeeCharacterTool;
