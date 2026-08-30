// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicalRestInput = Readonly<Record<string, never>>;
export type RandomMusicalRestOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d129, 0x1d129],
    [0x1d13a, 0x1d142],
    [0x1d1c1, 0x1d1c6],
    [0x1d1ff, 0x1d1ff],
    [0x1d253, 0x1d255],
  ],
} as const;

export const randomMusicalRestValueCount = 20;

export const calculateRandomMusicalRest = (
  random: RandomSource = Math.random,
): RandomMusicalRestOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicalRestExample = {
  input: {},
} satisfies ToolExample<RandomMusicalRestInput, RandomMusicalRestOutput>;

export const randomMusicalRestTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicalRest(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Musical Rest using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/musical-rest",
  inputs: [],
  outputs: [
    {
      format: "random/musical-rest",
      id: "value",
      kind: "string",
      label: "Random Musical Rest",
    },
  ],
  title: "Random Musical Rest Generator",
});

export const runRandomMusicalRest = randomMusicalRestTool.execute;
export default randomMusicalRestTool;
