// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOdiaCharacterInput = Readonly<Record<string, never>>;
export type RandomOdiaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xb01, 0xb03],
    [0xb05, 0xb0c],
    [0xb0f, 0xb10],
    [0xb13, 0xb28],
    [0xb2a, 0xb30],
    [0xb32, 0xb33],
    [0xb35, 0xb39],
    [0xb3c, 0xb44],
    [0xb47, 0xb48],
    [0xb4b, 0xb4d],
    [0xb53, 0xb57],
    [0xb5c, 0xb5d],
    [0xb5f, 0xb63],
    [0xb66, 0xb77],
    [0x1cda, 0x1cda],
    [0x1cf2, 0x1cf2],
  ],
} as const;

export const randomOdiaCharacterValueCount = 99;

export const calculateRandomOdiaCharacter = (
  random: RandomSource = Math.random,
): RandomOdiaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOdiaCharacterExample = {
  input: {},
} satisfies ToolExample<RandomOdiaCharacterInput, RandomOdiaCharacterOutput>;

export const randomOdiaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOdiaCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Odia Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/odia-character",
  inputs: [],
  outputs: [
    {
      format: "random/odia-character",
      id: "value",
      kind: "string",
      label: "Random Odia Character",
    },
  ],
  title: "Random Odia Character Generator",
});

export const runRandomOdiaCharacter = randomOdiaCharacterTool.execute;
export default randomOdiaCharacterTool;
