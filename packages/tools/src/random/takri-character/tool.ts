// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTakriCharacterInput = Readonly<Record<string, never>>;
export type RandomTakriCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0xa830, 0xa839],
    [0x11680, 0x116b9],
    [0x116c0, 0x116c9],
  ],
} as const;

export const randomTakriCharacterValueCount = 80;

export const calculateRandomTakriCharacter = (
  random: RandomSource = Math.random,
): RandomTakriCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTakriCharacterExample = {
  input: {},
} satisfies ToolExample<RandomTakriCharacterInput, RandomTakriCharacterOutput>;

export const randomTakriCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTakriCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Takri Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/takri-character",
  inputs: [],
  outputs: [
    {
      format: "random/takri-character",
      id: "value",
      kind: "string",
      label: "Random Takri Character",
    },
  ],
  title: "Random Takri Character Generator",
});

export const runRandomTakriCharacter = randomTakriCharacterTool.execute;
export default randomTakriCharacterTool;
