// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNkoCharacterInput = Readonly<Record<string, never>>;
export type RandomNkoCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x60c, 0x60c],
    [0x61b, 0x61b],
    [0x61f, 0x61f],
    [0x7c0, 0x7fa],
    [0x7fd, 0x7ff],
    [0xfd3e, 0xfd3f],
  ],
} as const;

export const randomNkoCharacterValueCount = 67;

export const calculateRandomNkoCharacter = (
  random: RandomSource = Math.random,
): RandomNkoCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNkoCharacterExample = {
  input: {},
} satisfies ToolExample<RandomNkoCharacterInput, RandomNkoCharacterOutput>;

export const randomNkoCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNkoCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 NKo Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/nko-character",
  inputs: [],
  outputs: [
    {
      format: "random/nko-character",
      id: "value",
      kind: "string",
      label: "Random NKo Character",
    },
  ],
  title: "Random NKo Character Generator",
});

export const runRandomNkoCharacter = randomNkoCharacterTool.execute;
export default randomNkoCharacterTool;
