// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGujaratiCharacterInput = Readonly<Record<string, never>>;
export type RandomGujaratiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xa81, 0xa83],
    [0xa85, 0xa8d],
    [0xa8f, 0xa91],
    [0xa93, 0xaa8],
    [0xaaa, 0xab0],
    [0xab2, 0xab3],
    [0xab5, 0xab9],
    [0xabc, 0xac5],
    [0xac7, 0xac9],
    [0xacb, 0xacd],
    [0xad0, 0xad0],
    [0xae0, 0xae3],
    [0xae6, 0xaf1],
    [0xaf9, 0xaff],
    [0xa830, 0xa839],
  ],
} as const;

export const randomGujaratiCharacterValueCount = 105;

export const calculateRandomGujaratiCharacter = (
  random: RandomSource = Math.random,
): RandomGujaratiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGujaratiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomGujaratiCharacterInput,
  RandomGujaratiCharacterOutput
>;

export const randomGujaratiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGujaratiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Gujarati Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/gujarati-character",
  inputs: [],
  outputs: [
    {
      format: "random/gujarati-character",
      id: "value",
      kind: "string",
      label: "Random Gujarati Character",
    },
  ],
  title: "Random Gujarati Character Generator",
});

export const runRandomGujaratiCharacter = randomGujaratiCharacterTool.execute;
export default randomGujaratiCharacterTool;
