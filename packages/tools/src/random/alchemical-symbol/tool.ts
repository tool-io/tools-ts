// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAlchemicalSymbolInput = Readonly<Record<string, never>>;
export type RandomAlchemicalSymbolOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1ced2, 0x1ced4],
    [0x1f700, 0x1f773],
  ],
} as const;

export const randomAlchemicalSymbolValueCount = 119;

export const calculateRandomAlchemicalSymbol = (
  random: RandomSource = Math.random,
): RandomAlchemicalSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAlchemicalSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomAlchemicalSymbolInput,
  RandomAlchemicalSymbolOutput
>;

export const randomAlchemicalSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAlchemicalSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Alchemical Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/alchemical-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/alchemical-symbol",
      id: "value",
      kind: "string",
      label: "Random Alchemical Symbol",
    },
  ],
  title: "Random Alchemical Symbol Generator",
});

export const runRandomAlchemicalSymbol = randomAlchemicalSymbolTool.execute;
export default randomAlchemicalSymbolTool;
