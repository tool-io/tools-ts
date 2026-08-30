// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCrossSymbolInput = Readonly<Record<string, never>>;
export type RandomCrossSymbolOutput = { readonly value: string };

const source = {
  values: [
    "☦",
    "☨",
    "☩",
    "♰",
    "♱",
    "✙",
    "✚",
    "✛",
    "✜",
    "✝",
    "✞",
    "✟",
    "✠",
    "⹐",
    "⹑",
    "🕀",
    "🕁",
    "🕂",
    "🕆",
    "🕇",
    "🕈",
    "🞡",
    "🞢",
    "🞣",
    "🞤",
    "🞥",
    "🞦",
    "🞧",
    "🤀",
    "🤁",
    "🤂",
    "🮻",
  ],
} as const;

export const randomCrossSymbolValueCount = 32;

export const calculateRandomCrossSymbol = (
  random: RandomSource = Math.random,
): RandomCrossSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCrossSymbolExample = {
  input: {},
} satisfies ToolExample<RandomCrossSymbolInput, RandomCrossSymbolOutput>;

export const randomCrossSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCrossSymbol(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one Unicode 18.0 character explicitly encoded as a cross form using injected randomness; unrelated cross marks, crossed objects, and mathematical operators are excluded.",
  id: "random/cross-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/cross-symbol",
      id: "value",
      kind: "string",
      label: "Random Cross Symbol",
    },
  ],
  title: "Random Cross Symbol Generator",
});

export const runRandomCrossSymbol = randomCrossSymbolTool.execute;
export default randomCrossSymbolTool;
