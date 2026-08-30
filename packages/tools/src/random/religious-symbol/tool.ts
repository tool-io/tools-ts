// Repertoire source: https://www.unicode.org/Public/18.0.0/emoji/emoji-test.txt
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomReligiousSymbolInput = Readonly<Record<string, never>>;
export type RandomReligiousSymbolOutput = { readonly value: string };

const source = {
  values: [
    "🛐",
    "⚛️",
    "🕉️",
    "✡️",
    "☸️",
    "☯️",
    "✝️",
    "☦️",
    "☪️",
    "☮️",
    "🕎",
    "🔯",
    "🪯",
  ],
} as const;

export const randomReligiousSymbolValueCount = 13;

export const calculateRandomReligiousSymbol = (
  random: RandomSource = Math.random,
): RandomReligiousSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomReligiousSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomReligiousSymbolInput,
  RandomReligiousSymbolOutput
>;

export const randomReligiousSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomReligiousSymbol(
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
    "Choose one symbol from the complete Unicode Emoji 18.0 religion subgroup using injected randomness without implying equivalence between traditions.",
  id: "random/religious-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/religious-symbol",
      id: "value",
      kind: "string",
      label: "Random Religious Symbol",
    },
  ],
  title: "Random Religious Symbol Generator",
});

export const runRandomReligiousSymbol = randomReligiousSymbolTool.execute;
export default randomReligiousSymbolTool;
