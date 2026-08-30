// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNewaCharacterInput = Readonly<Record<string, never>>;
export type RandomNewaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x1cd5, 0x1cd5],
    [0x1cd7, 0x1cd8],
    [0x1ce2, 0x1ce2],
    [0x1ce9, 0x1ce9],
    [0x1ceb, 0x1ceb],
    [0x1ced, 0x1ced],
    [0x11400, 0x1145b],
    [0x1145d, 0x11461],
  ],
} as const;

export const randomNewaCharacterValueCount = 106;

export const calculateRandomNewaCharacter = (
  random: RandomSource = Math.random,
): RandomNewaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNewaCharacterExample = {
  input: {},
} satisfies ToolExample<RandomNewaCharacterInput, RandomNewaCharacterOutput>;

export const randomNewaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNewaCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Newa Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/newa-character",
  inputs: [],
  outputs: [
    {
      format: "random/newa-character",
      id: "value",
      kind: "string",
      label: "Random Newa Character",
    },
  ],
  title: "Random Newa Character Generator",
});

export const runRandomNewaCharacter = randomNewaCharacterTool.execute;
export default randomNewaCharacterTool;
