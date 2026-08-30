// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPahawhHmongCharacterInput = Readonly<Record<string, never>>;
export type RandomPahawhHmongCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x16b00, 0x16b45],
    [0x16b50, 0x16b59],
    [0x16b5b, 0x16b61],
    [0x16b63, 0x16b77],
    [0x16b7d, 0x16b8f],
  ],
} as const;

export const randomPahawhHmongCharacterValueCount = 127;

export const calculateRandomPahawhHmongCharacter = (
  random: RandomSource = Math.random,
): RandomPahawhHmongCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPahawhHmongCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomPahawhHmongCharacterInput,
  RandomPahawhHmongCharacterOutput
>;

export const randomPahawhHmongCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPahawhHmongCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Pahawh Hmong Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/pahawh-hmong-character",
  inputs: [],
  outputs: [
    {
      format: "random/pahawh-hmong-character",
      id: "value",
      kind: "string",
      label: "Random Pahawh Hmong Character",
    },
  ],
  title: "Random Pahawh Hmong Character Generator",
});

export const runRandomPahawhHmongCharacter =
  randomPahawhHmongCharacterTool.execute;
export default randomPahawhHmongCharacterTool;
