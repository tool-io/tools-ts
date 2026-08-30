// Repertoire source: https://www.unicode.org/emoji/charts-18.0/full-emoji-list.html
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomZodiacSymbolInput = Readonly<Record<string, never>>;
export type RandomZodiacSymbolOutput = { readonly value: string };

const source = {
  values: [
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "⛎",
  ],
} as const;

export const randomZodiacSymbolValueCount = 13;

export const calculateRandomZodiacSymbol = (
  random: RandomSource = Math.random,
): RandomZodiacSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomZodiacSymbolExample = {
  input: {},
} satisfies ToolExample<RandomZodiacSymbolInput, RandomZodiacSymbolOutput>;

export const randomZodiacSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomZodiacSymbol(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one symbol from the complete Unicode Emoji 18.0 zodiac subgroup, including Ophiuchus, using injected randomness.",
  id: "random/zodiac-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/zodiac-symbol",
      id: "value",
      kind: "string",
      label: "Random Zodiac Symbol",
    },
  ],
  title: "Random Zodiac Symbol Generator",
});

export const runRandomZodiacSymbol = randomZodiacSymbolTool.execute;
export default randomZodiacSymbolTool;
