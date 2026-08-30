// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMeroiticCursiveCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomMeroiticCursiveCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x109a0, 0x109b7],
    [0x109bc, 0x109cf],
    [0x109d2, 0x109ff],
  ],
} as const;

export const randomMeroiticCursiveCharacterValueCount = 90;

export const calculateRandomMeroiticCursiveCharacter = (
  random: RandomSource = Math.random,
): RandomMeroiticCursiveCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMeroiticCursiveCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMeroiticCursiveCharacterInput,
  RandomMeroiticCursiveCharacterOutput
>;

export const randomMeroiticCursiveCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMeroiticCursiveCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Meroitic Cursive Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/meroitic-cursive-character",
  inputs: [],
  outputs: [
    {
      format: "random/meroitic-cursive-character",
      id: "value",
      kind: "string",
      label: "Random Meroitic Cursive Character",
    },
  ],
  title: "Random Meroitic Cursive Character Generator",
});

export const runRandomMeroiticCursiveCharacter =
  randomMeroiticCursiveCharacterTool.execute;
export default randomMeroiticCursiveCharacterTool;
