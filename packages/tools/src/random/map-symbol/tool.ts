// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMapSymbolInput = Readonly<Record<string, never>>;
export type RandomMapSymbolOutput = { readonly value: string };

const source = { values: ["⌖", "⛯", "⚑", "⚐", "⛰", "⛺", "⚓", "✈"] } as const;

export const randomMapSymbolValueCount = 8;

export const calculateRandomMapSymbol = (
  random: RandomSource = Math.random,
): RandomMapSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMapSymbolExample = {
  input: {},
} satisfies ToolExample<RandomMapSymbolInput, RandomMapSymbolOutput>;

export const randomMapSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMapSymbol(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one commonly encoded map or wayfinding symbol using injected randomness.",
  id: "random/map-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/map-symbol",
      id: "value",
      kind: "string",
      label: "Random Map Symbol",
    },
  ],
  title: "Random Map Symbol Generator",
});

export const runRandomMapSymbol = randomMapSymbolTool.execute;
export default randomMapSymbolTool;
