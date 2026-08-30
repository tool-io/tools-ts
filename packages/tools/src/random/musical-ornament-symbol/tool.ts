// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicalOrnamentSymbolInput = Readonly<Record<string, never>>;
export type RandomMusicalOrnamentSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d196, 0x1d1a5]] } as const;

export const randomMusicalOrnamentSymbolValueCount = 16;

export const calculateRandomMusicalOrnamentSymbol = (
  random: RandomSource = Math.random,
): RandomMusicalOrnamentSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicalOrnamentSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomMusicalOrnamentSymbolInput,
  RandomMusicalOrnamentSymbolOutput
>;

export const randomMusicalOrnamentSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicalOrnamentSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Musical Ornament Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/musical-ornament-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/musical-ornament-symbol",
      id: "value",
      kind: "string",
      label: "Random Musical Ornament Symbol",
    },
  ],
  title: "Random Musical Ornament Symbol Generator",
});

export const runRandomMusicalOrnamentSymbol =
  randomMusicalOrnamentSymbolTool.execute;
export default randomMusicalOrnamentSymbolTool;
