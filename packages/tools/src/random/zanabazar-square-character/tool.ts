// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomZanabazarSquareCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomZanabazarSquareCharacterOutput = { readonly value: string };

const source = { ranges: [[0x11a00, 0x11a47]] } as const;

export const randomZanabazarSquareCharacterValueCount = 72;

export const calculateRandomZanabazarSquareCharacter = (
  random: RandomSource = Math.random,
): RandomZanabazarSquareCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomZanabazarSquareCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomZanabazarSquareCharacterInput,
  RandomZanabazarSquareCharacterOutput
>;

export const randomZanabazarSquareCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomZanabazarSquareCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Zanabazar Square Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/zanabazar-square-character",
  inputs: [],
  outputs: [
    {
      format: "random/zanabazar-square-character",
      id: "value",
      kind: "string",
      label: "Random Zanabazar Square Character",
    },
  ],
  title: "Random Zanabazar Square Character Generator",
});

export const runRandomZanabazarSquareCharacter =
  randomZanabazarSquareCharacterTool.execute;
export default randomZanabazarSquareCharacterTool;
