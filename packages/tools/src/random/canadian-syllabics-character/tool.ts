// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCanadianSyllabicsCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomCanadianSyllabicsCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1400, 0x167f],
    [0x18b0, 0x18f5],
    [0x11ab0, 0x11abf],
  ],
} as const;

export const randomCanadianSyllabicsCharacterValueCount = 726;

export const calculateRandomCanadianSyllabicsCharacter = (
  random: RandomSource = Math.random,
): RandomCanadianSyllabicsCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCanadianSyllabicsCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomCanadianSyllabicsCharacterInput,
  RandomCanadianSyllabicsCharacterOutput
>;

export const randomCanadianSyllabicsCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCanadianSyllabicsCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Canadian Syllabics Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/canadian-syllabics-character",
  inputs: [],
  outputs: [
    {
      format: "random/canadian-syllabics-character",
      id: "value",
      kind: "string",
      label: "Random Canadian Syllabics Character",
    },
  ],
  title: "Random Canadian Syllabics Character Generator",
});

export const runRandomCanadianSyllabicsCharacter =
  randomCanadianSyllabicsCharacterTool.execute;
export default randomCanadianSyllabicsCharacterTool;
