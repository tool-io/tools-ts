// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLinearASignInput = Readonly<Record<string, never>>;
export type RandomLinearASignOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10107, 0x10133],
    [0x10600, 0x10736],
    [0x10740, 0x10755],
    [0x10760, 0x10767],
  ],
} as const;

export const randomLinearASignValueCount = 386;

export const calculateRandomLinearASign = (
  random: RandomSource = Math.random,
): RandomLinearASignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLinearASignExample = {
  input: {},
} satisfies ToolExample<RandomLinearASignInput, RandomLinearASignOutput>;

export const randomLinearASignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLinearASign(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Linear A Sign using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/linear-a-sign",
  inputs: [],
  outputs: [
    {
      format: "random/linear-a-sign",
      id: "value",
      kind: "string",
      label: "Random Linear A Sign",
    },
  ],
  title: "Random Linear A Sign Generator",
});

export const runRandomLinearASign = randomLinearASignTool.execute;
export default randomLinearASignTool;
