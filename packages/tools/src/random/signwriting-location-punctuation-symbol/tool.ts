// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingLocationPunctuationSymbolInput = Readonly<
  Record<string, never>
>;
export type RandomSignwritingLocationPunctuationSymbolOutput = {
  readonly value: string;
};

const source = { ranges: [[0x1da7f, 0x1da86]] } as const;

export const randomSignwritingLocationPunctuationSymbolValueCount = 8;

export const calculateRandomSignwritingLocationPunctuationSymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingLocationPunctuationSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingLocationPunctuationSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingLocationPunctuationSymbolInput,
  RandomSignwritingLocationPunctuationSymbolOutput
>;

export const randomSignwritingLocationPunctuationSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingLocationPunctuationSymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Location and Punctuation Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-location-punctuation-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-location-punctuation-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Location and Punctuation Symbol",
    },
  ],
  title: "Random SignWriting Location and Punctuation Symbol Generator",
});

export const runRandomSignwritingLocationPunctuationSymbol =
  randomSignwritingLocationPunctuationSymbolTool.execute;
export default randomSignwritingLocationPunctuationSymbolTool;
