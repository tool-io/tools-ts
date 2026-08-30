// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTarotTrumpInput = Readonly<Record<string, never>>;
export type RandomTarotTrumpOutput = { readonly value: string };

const source = { ranges: [[0x1f0e0, 0x1f0f5]] } as const;

export const randomTarotTrumpValueCount = 22;

export const calculateRandomTarotTrump = (
  random: RandomSource = Math.random,
): RandomTarotTrumpOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTarotTrumpExample = {
  input: {},
} satisfies ToolExample<RandomTarotTrumpInput, RandomTarotTrumpOutput>;

export const randomTarotTrumpTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTarotTrump(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Tarot Trump using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tarot-trump",
  inputs: [],
  outputs: [
    {
      format: "random/tarot-trump",
      id: "value",
      kind: "string",
      label: "Random Tarot Trump",
    },
  ],
  title: "Random Tarot Trump Generator",
});

export const runRandomTarotTrump = randomTarotTrumpTool.execute;
export default randomTarotTrumpTool;
