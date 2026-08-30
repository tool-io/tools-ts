// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTirhutaCharacterInput = Readonly<Record<string, never>>;
export type RandomTirhutaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0x1cd5, 0x1cd5],
    [0x1ce2, 0x1ce2],
    [0x1cf2, 0x1cf2],
    [0xa830, 0xa839],
    [0x11480, 0x114c7],
    [0x114d0, 0x114d9],
  ],
} as const;

export const randomTirhutaCharacterValueCount = 99;

export const calculateRandomTirhutaCharacter = (
  random: RandomSource = Math.random,
): RandomTirhutaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTirhutaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTirhutaCharacterInput,
  RandomTirhutaCharacterOutput
>;

export const randomTirhutaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTirhutaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tirhuta Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tirhuta-character",
  inputs: [],
  outputs: [
    {
      format: "random/tirhuta-character",
      id: "value",
      kind: "string",
      label: "Random Tirhuta Character",
    },
  ],
  title: "Random Tirhuta Character Generator",
});

export const runRandomTirhutaCharacter = randomTirhutaCharacterTool.execute;
export default randomTirhutaCharacterTool;
