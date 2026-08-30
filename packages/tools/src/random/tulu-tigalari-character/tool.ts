// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTuluTigalariCharacterInput = Readonly<Record<string, never>>;
export type RandomTuluTigalariCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xce6, 0xcef],
    [0x1cf2, 0x1cf2],
    [0x1cf4, 0x1cf4],
    [0xa830, 0xa835],
    [0xa8f1, 0xa8f1],
    [0x11380, 0x11389],
    [0x1138b, 0x1138b],
    [0x1138e, 0x1138e],
    [0x11390, 0x113b5],
    [0x113b7, 0x113c0],
    [0x113c2, 0x113c2],
    [0x113c5, 0x113c5],
    [0x113c7, 0x113ca],
    [0x113cc, 0x113d5],
    [0x113d7, 0x113d8],
    [0x113e1, 0x113e2],
  ],
} as const;

export const randomTuluTigalariCharacterValueCount = 99;

export const calculateRandomTuluTigalariCharacter = (
  random: RandomSource = Math.random,
): RandomTuluTigalariCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTuluTigalariCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTuluTigalariCharacterInput,
  RandomTuluTigalariCharacterOutput
>;

export const randomTuluTigalariCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTuluTigalariCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tulu-Tigalari Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tulu-tigalari-character",
  inputs: [],
  outputs: [
    {
      format: "random/tulu-tigalari-character",
      id: "value",
      kind: "string",
      label: "Random Tulu-Tigalari Character",
    },
  ],
  title: "Random Tulu-Tigalari Character Generator",
});

export const runRandomTuluTigalariCharacter =
  randomTuluTigalariCharacterTool.execute;
export default randomTuluTigalariCharacterTool;
