// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIChingTrigramInput = Readonly<Record<string, never>>;
export type RandomIChingTrigramOutput = { readonly value: string };

const source = { ranges: [[0x2630, 0x2637]] } as const;

export const randomIChingTrigramValueCount = 8;

export const calculateRandomIChingTrigram = (
  random: RandomSource = Math.random,
): RandomIChingTrigramOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIChingTrigramExample = {
  input: {},
} satisfies ToolExample<RandomIChingTrigramInput, RandomIChingTrigramOutput>;

export const randomIChingTrigramTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIChingTrigram(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 I Ching Trigram using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/i-ching-trigram",
  inputs: [],
  outputs: [
    {
      format: "random/i-ching-trigram",
      id: "value",
      kind: "string",
      label: "Random I Ching Trigram",
    },
  ],
  title: "Random I Ching Trigram Generator",
});

export const runRandomIChingTrigram = randomIChingTrigramTool.execute;
export default randomIChingTrigramTool;
