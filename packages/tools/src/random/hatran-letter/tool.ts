// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHatranLetterInput = Readonly<Record<string, never>>;
export type RandomHatranLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x108e0, 0x108f2],
    [0x108f4, 0x108f5],
  ],
} as const;

export const randomHatranLetterValueCount = 21;

export const calculateRandomHatranLetter = (
  random: RandomSource = Math.random,
): RandomHatranLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHatranLetterExample = {
  input: {},
} satisfies ToolExample<RandomHatranLetterInput, RandomHatranLetterOutput>;

export const randomHatranLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHatranLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Hatran Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/hatran-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hatran-letter",
      id: "value",
      kind: "string",
      label: "Random Hatran Letter",
    },
  ],
  title: "Random Hatran Letter Generator",
});

export const runRandomHatranLetter = randomHatranLetterTool.execute;
export default randomHatranLetterTool;
