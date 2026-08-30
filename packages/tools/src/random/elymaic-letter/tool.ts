// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomElymaicLetterInput = Readonly<Record<string, never>>;
export type RandomElymaicLetterOutput = { readonly value: string };

const source = { ranges: [[0x10fe0, 0x10ff6]] } as const;

export const randomElymaicLetterValueCount = 23;

export const calculateRandomElymaicLetter = (
  random: RandomSource = Math.random,
): RandomElymaicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomElymaicLetterExample = {
  input: {},
} satisfies ToolExample<RandomElymaicLetterInput, RandomElymaicLetterOutput>;

export const randomElymaicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomElymaicLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Elymaic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/elymaic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/elymaic-letter",
      id: "value",
      kind: "string",
      label: "Random Elymaic Letter",
    },
  ],
  title: "Random Elymaic Letter Generator",
});

export const runRandomElymaicLetter = randomElymaicLetterTool.execute;
export default randomElymaicLetterTool;
