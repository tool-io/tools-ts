// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPlayingCardInput = Readonly<Record<string, never>>;
export type RandomPlayingCardOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1f0a0, 0x1f0ae],
    [0x1f0b1, 0x1f0bf],
    [0x1f0c1, 0x1f0cf],
    [0x1f0d1, 0x1f0f5],
  ],
} as const;

export const randomPlayingCardValueCount = 82;

export const calculateRandomPlayingCard = (
  random: RandomSource = Math.random,
): RandomPlayingCardOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPlayingCardExample = {
  input: {},
} satisfies ToolExample<RandomPlayingCardInput, RandomPlayingCardOutput>;

export const randomPlayingCardTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPlayingCard(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Playing Card using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/playing-card",
  inputs: [],
  outputs: [
    {
      format: "random/playing-card",
      id: "value",
      kind: "string",
      label: "Random Playing Card",
    },
  ],
  title: "Random Playing Card Generator",
});

export const runRandomPlayingCard = randomPlayingCardTool.execute;
export default randomPlayingCardTool;
