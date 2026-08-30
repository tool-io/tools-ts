// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLinearBSignInput = Readonly<Record<string, never>>;
export type RandomLinearBSignOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10000, 0x1000b],
    [0x1000d, 0x10026],
    [0x10028, 0x1003a],
    [0x1003c, 0x1003d],
    [0x1003f, 0x1004d],
    [0x10050, 0x1005d],
    [0x10080, 0x100fa],
    [0x10100, 0x10102],
    [0x10107, 0x10133],
    [0x10137, 0x1013f],
  ],
} as const;

export const randomLinearBSignValueCount = 268;

export const calculateRandomLinearBSign = (
  random: RandomSource = Math.random,
): RandomLinearBSignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLinearBSignExample = {
  input: {},
} satisfies ToolExample<RandomLinearBSignInput, RandomLinearBSignOutput>;

export const randomLinearBSignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLinearBSign(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Linear B Sign using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/linear-b-sign",
  inputs: [],
  outputs: [
    {
      format: "random/linear-b-sign",
      id: "value",
      kind: "string",
      label: "Random Linear B Sign",
    },
  ],
  title: "Random Linear B Sign Generator",
});

export const runRandomLinearBSign = randomLinearBSignTool.execute;
export default randomLinearBSignTool;
