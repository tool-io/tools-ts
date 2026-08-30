// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCardSuitInput = Readonly<Record<string, never>>;
export type RandomCardSuitOutput = { readonly value: string };

const source = { values: ["♠", "♥", "♦", "♣"] } as const;

export const randomCardSuitValueCount = 4;

export const calculateRandomCardSuit = (
  random: RandomSource = Math.random,
): RandomCardSuitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCardSuitExample = {
  input: {},
} satisfies ToolExample<RandomCardSuitInput, RandomCardSuitOutput>;

export const randomCardSuitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCardSuit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one of the four standard French playing-card suit symbols using injected randomness.",
  id: "random/card-suit",
  inputs: [],
  outputs: [
    {
      format: "random/card-suit",
      id: "value",
      kind: "string",
      label: "Random Card Suit",
    },
  ],
  title: "Random Card Suit Generator",
});

export const runRandomCardSuit = randomCardSuitTool.execute;
export default randomCardSuitTool;
