// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCuneiformSignInput = Readonly<Record<string, never>>;
export type RandomCuneiformSignOutput = { readonly value: string };

const source = {
  ranges: [
    [0x12000, 0x12399],
    [0x12400, 0x12543],
    [0x12550, 0x125a7],
    [0x1264c, 0x12686],
  ],
} as const;

export const randomCuneiformSignValueCount = 1393;

export const calculateRandomCuneiformSign = (
  random: RandomSource = Math.random,
): RandomCuneiformSignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCuneiformSignExample = {
  input: {},
} satisfies ToolExample<RandomCuneiformSignInput, RandomCuneiformSignOutput>;

export const randomCuneiformSignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCuneiformSign(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Cuneiform Sign using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/cuneiform-sign",
  inputs: [],
  outputs: [
    {
      format: "random/cuneiform-sign",
      id: "value",
      kind: "string",
      label: "Random Cuneiform Sign",
    },
  ],
  title: "Random Cuneiform Sign Generator",
});

export const runRandomCuneiformSign = randomCuneiformSignTool.execute;
export default randomCuneiformSignTool;
