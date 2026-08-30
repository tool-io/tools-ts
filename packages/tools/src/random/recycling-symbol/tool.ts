// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRecyclingSymbolInput = Readonly<Record<string, never>>;
export type RandomRecyclingSymbolOutput = { readonly value: string };

const source = { ranges: [[0x2672, 0x267b]] } as const;

export const randomRecyclingSymbolValueCount = 10;

export const calculateRandomRecyclingSymbol = (
  random: RandomSource = Math.random,
): RandomRecyclingSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRecyclingSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomRecyclingSymbolInput,
  RandomRecyclingSymbolOutput
>;

export const randomRecyclingSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRecyclingSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Recycling Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/recycling-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/recycling-symbol",
      id: "value",
      kind: "string",
      label: "Random Recycling Symbol",
    },
  ],
  title: "Random Recycling Symbol Generator",
});

export const runRandomRecyclingSymbol = randomRecyclingSymbolTool.execute;
export default randomRecyclingSymbolTool;
