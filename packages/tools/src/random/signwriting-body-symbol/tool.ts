// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingBodySymbolInput = Readonly<Record<string, never>>;
export type RandomSignwritingBodySymbolOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1da6d, 0x1da6e],
    [0x1da71, 0x1da74],
    [0x1da76, 0x1da7d],
  ],
} as const;

export const randomSignwritingBodySymbolValueCount = 14;

export const calculateRandomSignwritingBodySymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingBodySymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingBodySymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingBodySymbolInput,
  RandomSignwritingBodySymbolOutput
>;

export const randomSignwritingBodySymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingBodySymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Body Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-body-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-body-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Body Symbol",
    },
  ],
  title: "Random SignWriting Body Symbol Generator",
});

export const runRandomSignwritingBodySymbol =
  randomSignwritingBodySymbolTool.execute;
export default randomSignwritingBodySymbolTool;
