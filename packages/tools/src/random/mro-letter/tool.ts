// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMroLetterInput = Readonly<Record<string, never>>;
export type RandomMroLetterOutput = { readonly value: string };

const source = { ranges: [[0x16a40, 0x16a5e]] } as const;

export const randomMroLetterValueCount = 31;

export const calculateRandomMroLetter = (
  random: RandomSource = Math.random,
): RandomMroLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMroLetterExample = {
  input: {},
} satisfies ToolExample<RandomMroLetterInput, RandomMroLetterOutput>;

export const randomMroLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMroLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Mro Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/mro-letter",
  inputs: [],
  outputs: [
    {
      format: "random/mro-letter",
      id: "value",
      kind: "string",
      label: "Random Mro Letter",
    },
  ],
  title: "Random Mro Letter Generator",
});

export const runRandomMroLetter = randomMroLetterTool.execute;
export default randomMroLetterTool;
