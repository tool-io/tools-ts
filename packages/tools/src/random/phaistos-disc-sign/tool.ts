// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPhaistosDiscSignInput = Readonly<Record<string, never>>;
export type RandomPhaistosDiscSignOutput = { readonly value: string };

const source = { ranges: [[0x101d0, 0x101fd]] } as const;

export const randomPhaistosDiscSignValueCount = 46;

export const calculateRandomPhaistosDiscSign = (
  random: RandomSource = Math.random,
): RandomPhaistosDiscSignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPhaistosDiscSignExample = {
  input: {},
} satisfies ToolExample<
  RandomPhaistosDiscSignInput,
  RandomPhaistosDiscSignOutput
>;

export const randomPhaistosDiscSignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPhaistosDiscSign(
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
    "Choose one assigned graphic Unicode 18.0 Phaistos Disc Sign using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/phaistos-disc-sign",
  inputs: [],
  outputs: [
    {
      format: "random/phaistos-disc-sign",
      id: "value",
      kind: "string",
      label: "Random Phaistos Disc Sign",
    },
  ],
  title: "Random Phaistos Disc Sign Generator",
});

export const runRandomPhaistosDiscSign = randomPhaistosDiscSignTool.execute;
export default randomPhaistosDiscSignTool;
