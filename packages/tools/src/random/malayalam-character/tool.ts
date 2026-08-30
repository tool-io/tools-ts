// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMalayalamCharacterInput = Readonly<Record<string, never>>;
export type RandomMalayalamCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xb83, 0xb83],
    [0xd00, 0xd0c],
    [0xd0e, 0xd10],
    [0xd12, 0xd44],
    [0xd46, 0xd48],
    [0xd4a, 0xd4f],
    [0xd54, 0xd63],
    [0xd66, 0xd7f],
    [0x1cda, 0x1cda],
    [0x1cf2, 0x1cf2],
    [0xa830, 0xa832],
  ],
} as const;

export const randomMalayalamCharacterValueCount = 128;

export const calculateRandomMalayalamCharacter = (
  random: RandomSource = Math.random,
): RandomMalayalamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMalayalamCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMalayalamCharacterInput,
  RandomMalayalamCharacterOutput
>;

export const randomMalayalamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMalayalamCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Malayalam Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/malayalam-character",
  inputs: [],
  outputs: [
    {
      format: "random/malayalam-character",
      id: "value",
      kind: "string",
      label: "Random Malayalam Character",
    },
  ],
  title: "Random Malayalam Character Generator",
});

export const runRandomMalayalamCharacter = randomMalayalamCharacterTool.execute;
export default randomMalayalamCharacterTool;
