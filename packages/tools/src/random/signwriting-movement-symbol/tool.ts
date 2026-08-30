// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingMovementSymbolInput = Readonly<
  Record<string, never>
>;
export type RandomSignwritingMovementSymbolOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d921, 0x1d94a],
    [0x1d955, 0x1d980],
    [0x1d988, 0x1d9a1],
    [0x1d9a5, 0x1d9a9],
    [0x1d9ad, 0x1d9b0],
    [0x1d9b4, 0x1d9c2],
    [0x1d9c6, 0x1d9d1],
    [0x1d9d5, 0x1d9de],
    [0x1d9e2, 0x1d9f4],
    [0x1da68, 0x1da69],
  ],
} as const;

export const randomSignwritingMovementSymbolValueCount = 179;

export const calculateRandomSignwritingMovementSymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingMovementSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingMovementSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingMovementSymbolInput,
  RandomSignwritingMovementSymbolOutput
>;

export const randomSignwritingMovementSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingMovementSymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Movement Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-movement-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-movement-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Movement Symbol",
    },
  ],
  title: "Random SignWriting Movement Symbol Generator",
});

export const runRandomSignwritingMovementSymbol =
  randomSignwritingMovementSymbolTool.execute;
export default randomSignwritingMovementSymbolTool;
