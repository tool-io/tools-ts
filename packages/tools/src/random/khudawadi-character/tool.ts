// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKhudawadiCharacterInput = Readonly<Record<string, never>>;
export type RandomKhudawadiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0xa830, 0xa839],
    [0x112b0, 0x112ea],
    [0x112f0, 0x112f9],
  ],
} as const;

export const randomKhudawadiCharacterValueCount = 81;

export const calculateRandomKhudawadiCharacter = (
  random: RandomSource = Math.random,
): RandomKhudawadiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKhudawadiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKhudawadiCharacterInput,
  RandomKhudawadiCharacterOutput
>;

export const randomKhudawadiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKhudawadiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Khudawadi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/khudawadi-character",
  inputs: [],
  outputs: [
    {
      format: "random/khudawadi-character",
      id: "value",
      kind: "string",
      label: "Random Khudawadi Character",
    },
  ],
  title: "Random Khudawadi Character Generator",
});

export const runRandomKhudawadiCharacter = randomKhudawadiCharacterTool.execute;
export default randomKhudawadiCharacterTool;
