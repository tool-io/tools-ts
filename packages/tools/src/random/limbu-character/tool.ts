// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLimbuCharacterInput = Readonly<Record<string, never>>;
export type RandomLimbuCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x965, 0x965],
    [0x1900, 0x191e],
    [0x1920, 0x192b],
    [0x1930, 0x193b],
    [0x1940, 0x1940],
    [0x1944, 0x194f],
  ],
} as const;

export const randomLimbuCharacterValueCount = 69;

export const calculateRandomLimbuCharacter = (
  random: RandomSource = Math.random,
): RandomLimbuCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLimbuCharacterExample = {
  input: {},
} satisfies ToolExample<RandomLimbuCharacterInput, RandomLimbuCharacterOutput>;

export const randomLimbuCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLimbuCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Limbu Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/limbu-character",
  inputs: [],
  outputs: [
    {
      format: "random/limbu-character",
      id: "value",
      kind: "string",
      label: "Random Limbu Character",
    },
  ],
  title: "Random Limbu Character Generator",
});

export const runRandomLimbuCharacter = randomLimbuCharacterTool.execute;
export default randomLimbuCharacterTool;
