// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMasaramGondiCharacterInput = Readonly<Record<string, never>>;
export type RandomMasaramGondiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0x11d00, 0x11d06],
    [0x11d08, 0x11d09],
    [0x11d0b, 0x11d36],
    [0x11d3a, 0x11d3a],
    [0x11d3c, 0x11d3d],
    [0x11d3f, 0x11d47],
    [0x11d50, 0x11d59],
  ],
} as const;

export const randomMasaramGondiCharacterValueCount = 77;

export const calculateRandomMasaramGondiCharacter = (
  random: RandomSource = Math.random,
): RandomMasaramGondiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMasaramGondiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMasaramGondiCharacterInput,
  RandomMasaramGondiCharacterOutput
>;

export const randomMasaramGondiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMasaramGondiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Masaram Gondi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/masaram-gondi-character",
  inputs: [],
  outputs: [
    {
      format: "random/masaram-gondi-character",
      id: "value",
      kind: "string",
      label: "Random Masaram Gondi Character",
    },
  ],
  title: "Random Masaram Gondi Character Generator",
});

export const runRandomMasaramGondiCharacter =
  randomMasaramGondiCharacterTool.execute;
export default randomMasaramGondiCharacterTool;
