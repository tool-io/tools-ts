// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMendeKikakuiCharacterInput = Readonly<Record<string, never>>;
export type RandomMendeKikakuiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1e800, 0x1e8c4],
    [0x1e8c7, 0x1e8d6],
  ],
} as const;

export const randomMendeKikakuiCharacterValueCount = 213;

export const calculateRandomMendeKikakuiCharacter = (
  random: RandomSource = Math.random,
): RandomMendeKikakuiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMendeKikakuiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMendeKikakuiCharacterInput,
  RandomMendeKikakuiCharacterOutput
>;

export const randomMendeKikakuiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMendeKikakuiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Mende Kikakui Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/mende-kikakui-character",
  inputs: [],
  outputs: [
    {
      format: "random/mende-kikakui-character",
      id: "value",
      kind: "string",
      label: "Random Mende Kikakui Character",
    },
  ],
  title: "Random Mende Kikakui Character Generator",
});

export const runRandomMendeKikakuiCharacter =
  randomMendeKikakuiCharacterTool.execute;
export default randomMendeKikakuiCharacterTool;
