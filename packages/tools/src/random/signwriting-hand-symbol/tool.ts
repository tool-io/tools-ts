// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingHandSymbolInput = Readonly<Record<string, never>>;
export type RandomSignwritingHandSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d800, 0x1d904]] } as const;

export const randomSignwritingHandSymbolValueCount = 261;

export const calculateRandomSignwritingHandSymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingHandSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingHandSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingHandSymbolInput,
  RandomSignwritingHandSymbolOutput
>;

export const randomSignwritingHandSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingHandSymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Hand Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-hand-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-hand-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Hand Symbol",
    },
  ],
  title: "Random SignWriting Hand Symbol Generator",
});

export const runRandomSignwritingHandSymbol =
  randomSignwritingHandSymbolTool.execute;
export default randomSignwritingHandSymbolTool;
