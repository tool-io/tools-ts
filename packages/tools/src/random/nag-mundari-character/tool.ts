// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNagMundariCharacterInput = Readonly<Record<string, never>>;
export type RandomNagMundariCharacterOutput = { readonly value: string };

const source = { ranges: [[0x1e4d0, 0x1e4f9]] } as const;

export const randomNagMundariCharacterValueCount = 42;

export const calculateRandomNagMundariCharacter = (
  random: RandomSource = Math.random,
): RandomNagMundariCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNagMundariCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomNagMundariCharacterInput,
  RandomNagMundariCharacterOutput
>;

export const randomNagMundariCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNagMundariCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Nag Mundari Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/nag-mundari-character",
  inputs: [],
  outputs: [
    {
      format: "random/nag-mundari-character",
      id: "value",
      kind: "string",
      label: "Random Nag Mundari Character",
    },
  ],
  title: "Random Nag Mundari Character Generator",
});

export const runRandomNagMundariCharacter =
  randomNagMundariCharacterTool.execute;
export default randomNagMundariCharacterTool;
