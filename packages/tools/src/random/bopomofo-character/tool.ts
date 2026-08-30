// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBopomofoCharacterInput = Readonly<Record<string, never>>;
export type RandomBopomofoCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2c7, 0x2c7],
    [0x2c9, 0x2cb],
    [0x2d9, 0x2d9],
    [0x2ea, 0x2eb],
    [0x3001, 0x3003],
    [0x3008, 0x3011],
    [0x3013, 0x301f],
    [0x302a, 0x302d],
    [0x3030, 0x3030],
    [0x3037, 0x3037],
    [0x30fb, 0x30fb],
    [0x3105, 0x312f],
    [0x31a0, 0x31bf],
    [0xfe45, 0xfe46],
    [0xff61, 0xff65],
  ],
} as const;

export const randomBopomofoCharacterValueCount = 122;

export const calculateRandomBopomofoCharacter = (
  random: RandomSource = Math.random,
): RandomBopomofoCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBopomofoCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBopomofoCharacterInput,
  RandomBopomofoCharacterOutput
>;

export const randomBopomofoCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBopomofoCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Bopomofo Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/bopomofo-character",
  inputs: [],
  outputs: [
    {
      format: "random/bopomofo-character",
      id: "value",
      kind: "string",
      label: "Random Bopomofo Character",
    },
  ],
  title: "Random Bopomofo Character Generator",
});

export const runRandomBopomofoCharacter = randomBopomofoCharacterTool.execute;
export default randomBopomofoCharacterTool;
