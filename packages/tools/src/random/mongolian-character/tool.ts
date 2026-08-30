// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMongolianCharacterInput = Readonly<Record<string, never>>;
export type RandomMongolianCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1800, 0x180d],
    [0x180f, 0x1819],
    [0x1820, 0x1878],
    [0x1880, 0x18aa],
    [0x3001, 0x3002],
    [0x3008, 0x300b],
    [0x11660, 0x1166c],
  ],
} as const;

export const randomMongolianCharacterValueCount = 176;

export const calculateRandomMongolianCharacter = (
  random: RandomSource = Math.random,
): RandomMongolianCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMongolianCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMongolianCharacterInput,
  RandomMongolianCharacterOutput
>;

export const randomMongolianCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMongolianCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Mongolian Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/mongolian-character",
  inputs: [],
  outputs: [
    {
      format: "random/mongolian-character",
      id: "value",
      kind: "string",
      label: "Random Mongolian Character",
    },
  ],
  title: "Random Mongolian Character Generator",
});

export const runRandomMongolianCharacter = randomMongolianCharacterTool.execute;
export default randomMongolianCharacterTool;
