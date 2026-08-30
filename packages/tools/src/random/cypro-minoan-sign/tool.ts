// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCyproMinoanSignInput = Readonly<Record<string, never>>;
export type RandomCyproMinoanSignOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10100, 0x10101],
    [0x12f90, 0x12ff2],
  ],
} as const;

export const randomCyproMinoanSignValueCount = 101;

export const calculateRandomCyproMinoanSign = (
  random: RandomSource = Math.random,
): RandomCyproMinoanSignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCyproMinoanSignExample = {
  input: {},
} satisfies ToolExample<
  RandomCyproMinoanSignInput,
  RandomCyproMinoanSignOutput
>;

export const randomCyproMinoanSignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCyproMinoanSign(
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
    "Choose one assigned graphic Unicode 18.0 Cypro-Minoan Sign using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/cypro-minoan-sign",
  inputs: [],
  outputs: [
    {
      format: "random/cypro-minoan-sign",
      id: "value",
      kind: "string",
      label: "Random Cypro-Minoan Sign",
    },
  ],
  title: "Random Cypro-Minoan Sign Generator",
});

export const runRandomCyproMinoanSign = randomCyproMinoanSignTool.execute;
export default randomCyproMinoanSignTool;
