// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTangutCharacterInput = Readonly<Record<string, never>>;
export type RandomTangutCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2ff0, 0x2fff],
    [0x31ef, 0x31ef],
    [0x16fe0, 0x16fe0],
    [0x17000, 0x18aff],
    [0x18d00, 0x18d20],
    [0x18d80, 0x18df2],
  ],
} as const;

export const randomTangutCharacterValueCount = 7078;

export const calculateRandomTangutCharacter = (
  random: RandomSource = Math.random,
): RandomTangutCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTangutCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTangutCharacterInput,
  RandomTangutCharacterOutput
>;

export const randomTangutCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTangutCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tangut Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tangut-character",
  inputs: [],
  outputs: [
    {
      format: "random/tangut-character",
      id: "value",
      kind: "string",
      label: "Random Tangut Character",
    },
  ],
  title: "Random Tangut Character Generator",
});

export const runRandomTangutCharacter = randomTangutCharacterTool.execute;
export default randomTangutCharacterTool;
