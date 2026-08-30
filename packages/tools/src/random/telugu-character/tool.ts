// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTeluguCharacterInput = Readonly<Record<string, never>>;
export type RandomTeluguCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xb83, 0xb83],
    [0xc00, 0xc0c],
    [0xc0e, 0xc10],
    [0xc12, 0xc28],
    [0xc2a, 0xc39],
    [0xc3c, 0xc44],
    [0xc46, 0xc48],
    [0xc4a, 0xc4d],
    [0xc55, 0xc56],
    [0xc58, 0xc5a],
    [0xc5c, 0xc5d],
    [0xc60, 0xc63],
    [0xc66, 0xc6f],
    [0xc77, 0xc7f],
    [0x1cd5, 0x1cd6],
    [0x1cd8, 0x1cd8],
    [0x1cda, 0x1cda],
    [0x1cf2, 0x1cf2],
  ],
} as const;

export const randomTeluguCharacterValueCount = 111;

export const calculateRandomTeluguCharacter = (
  random: RandomSource = Math.random,
): RandomTeluguCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTeluguCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTeluguCharacterInput,
  RandomTeluguCharacterOutput
>;

export const randomTeluguCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTeluguCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Telugu Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/telugu-character",
  inputs: [],
  outputs: [
    {
      format: "random/telugu-character",
      id: "value",
      kind: "string",
      label: "Random Telugu Character",
    },
  ],
  title: "Random Telugu Character Generator",
});

export const runRandomTeluguCharacter = randomTeluguCharacterTool.execute;
export default randomTeluguCharacterTool;
