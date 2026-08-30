// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDuployanCharacterInput = Readonly<Record<string, never>>;
export type RandomDuployanCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xb7, 0xb7],
    [0x307, 0x308],
    [0x30a, 0x30a],
    [0x323, 0x324],
    [0x2e3c, 0x2e3c],
    [0x1bc00, 0x1bc6a],
    [0x1bc70, 0x1bc7c],
    [0x1bc80, 0x1bc88],
    [0x1bc90, 0x1bc99],
    [0x1bc9c, 0x1bc9f],
  ],
} as const;

export const randomDuployanCharacterValueCount = 150;

export const calculateRandomDuployanCharacter = (
  random: RandomSource = Math.random,
): RandomDuployanCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDuployanCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomDuployanCharacterInput,
  RandomDuployanCharacterOutput
>;

export const randomDuployanCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDuployanCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Duployan Shorthand Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/duployan-character",
  inputs: [],
  outputs: [
    {
      format: "random/duployan-character",
      id: "value",
      kind: "string",
      label: "Random Duployan Shorthand Character",
    },
  ],
  title: "Random Duployan Shorthand Character Generator",
});

export const runRandomDuployanCharacter = randomDuployanCharacterTool.execute;
export default randomDuployanCharacterTool;
