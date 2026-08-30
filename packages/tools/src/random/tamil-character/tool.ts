// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTamilCharacterInput = Readonly<Record<string, never>>;
export type RandomTamilCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xb82, 0xb83],
    [0xb85, 0xb8a],
    [0xb8e, 0xb90],
    [0xb92, 0xb95],
    [0xb99, 0xb9a],
    [0xb9c, 0xb9c],
    [0xb9e, 0xb9f],
    [0xba3, 0xba4],
    [0xba8, 0xbaa],
    [0xbae, 0xbb9],
    [0xbbe, 0xbc2],
    [0xbc6, 0xbc8],
    [0xbca, 0xbcd],
    [0xbd0, 0xbd0],
    [0xbd7, 0xbd7],
    [0xbe6, 0xbfa],
    [0x1cda, 0x1cda],
    [0xa8f3, 0xa8f3],
    [0x11301, 0x11301],
    [0x11303, 0x11303],
    [0x1133b, 0x1133c],
    [0x11fc0, 0x11ff1],
    [0x11fff, 0x11fff],
  ],
} as const;

export const randomTamilCharacterValueCount = 133;

export const calculateRandomTamilCharacter = (
  random: RandomSource = Math.random,
): RandomTamilCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTamilCharacterExample = {
  input: {},
} satisfies ToolExample<RandomTamilCharacterInput, RandomTamilCharacterOutput>;

export const randomTamilCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTamilCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Tamil Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tamil-character",
  inputs: [],
  outputs: [
    {
      format: "random/tamil-character",
      id: "value",
      kind: "string",
      label: "Random Tamil Character",
    },
  ],
  title: "Random Tamil Character Generator",
});

export const runRandomTamilCharacter = randomTamilCharacterTool.execute;
export default randomTamilCharacterTool;
