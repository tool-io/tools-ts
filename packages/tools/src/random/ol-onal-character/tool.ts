// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOlOnalCharacterInput = Readonly<Record<string, never>>;
export type RandomOlOnalCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0x1e5d0, 0x1e5fa],
    [0x1e5ff, 0x1e5ff],
  ],
} as const;

export const randomOlOnalCharacterValueCount = 46;

export const calculateRandomOlOnalCharacter = (
  random: RandomSource = Math.random,
): RandomOlOnalCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOlOnalCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOlOnalCharacterInput,
  RandomOlOnalCharacterOutput
>;

export const randomOlOnalCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOlOnalCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Ol Onal Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ol-onal-character",
  inputs: [],
  outputs: [
    {
      format: "random/ol-onal-character",
      id: "value",
      kind: "string",
      label: "Random Ol Onal Character",
    },
  ],
  title: "Random Ol Onal Character Generator",
});

export const runRandomOlOnalCharacter = randomOlOnalCharacterTool.execute;
export default randomOlOnalCharacterTool;
