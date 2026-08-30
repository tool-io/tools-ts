// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomByzantineMusicalSymbolInput = Readonly<Record<string, never>>;
export type RandomByzantineMusicalSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d000, 0x1d0f5]] } as const;

export const randomByzantineMusicalSymbolValueCount = 246;

export const calculateRandomByzantineMusicalSymbol = (
  random: RandomSource = Math.random,
): RandomByzantineMusicalSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomByzantineMusicalSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomByzantineMusicalSymbolInput,
  RandomByzantineMusicalSymbolOutput
>;

export const randomByzantineMusicalSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomByzantineMusicalSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Byzantine Musical Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/byzantine-musical-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/byzantine-musical-symbol",
      id: "value",
      kind: "string",
      label: "Random Byzantine Musical Symbol",
    },
  ],
  title: "Random Byzantine Musical Symbol Generator",
});

export const runRandomByzantineMusicalSymbol =
  randomByzantineMusicalSymbolTool.execute;
export default randomByzantineMusicalSymbolTool;
