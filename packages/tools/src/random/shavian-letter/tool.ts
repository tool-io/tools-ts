// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomShavianLetterInput = Readonly<Record<string, never>>;
export type RandomShavianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10450, 0x1047f]] } as const;

export const randomShavianLetterValueCount = 48;

export const calculateRandomShavianLetter = (
  random: RandomSource = Math.random,
): RandomShavianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomShavianLetterExample = {
  input: {},
} satisfies ToolExample<RandomShavianLetterInput, RandomShavianLetterOutput>;

export const randomShavianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomShavianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Shavian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/shavian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/shavian-letter",
      id: "value",
      kind: "string",
      label: "Random Shavian Letter",
    },
  ],
  title: "Random Shavian Letter Generator",
});

export const runRandomShavianLetter = randomShavianLetterTool.execute;
export default randomShavianLetterTool;
