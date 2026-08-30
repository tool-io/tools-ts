// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIChingHexagramInput = Readonly<Record<string, never>>;
export type RandomIChingHexagramOutput = { readonly value: string };

const source = { ranges: [[0x4dc0, 0x4dff]] } as const;

export const randomIChingHexagramValueCount = 64;

export const calculateRandomIChingHexagram = (
  random: RandomSource = Math.random,
): RandomIChingHexagramOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIChingHexagramExample = {
  input: {},
} satisfies ToolExample<RandomIChingHexagramInput, RandomIChingHexagramOutput>;

export const randomIChingHexagramTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIChingHexagram(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 I Ching Hexagram using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/i-ching-hexagram",
  inputs: [],
  outputs: [
    {
      format: "random/i-ching-hexagram",
      id: "value",
      kind: "string",
      label: "Random I Ching Hexagram",
    },
  ],
  title: "Random I Ching Hexagram Generator",
});

export const runRandomIChingHexagram = randomIChingHexagramTool.execute;
export default randomIChingHexagramTool;
