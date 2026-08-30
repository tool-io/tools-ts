// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMandaicLetterInput = Readonly<Record<string, never>>;
export type RandomMandaicLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x840, 0x858],
  ],
} as const;

export const randomMandaicLetterValueCount = 26;

export const calculateRandomMandaicLetter = (
  random: RandomSource = Math.random,
): RandomMandaicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMandaicLetterExample = {
  input: {},
} satisfies ToolExample<RandomMandaicLetterInput, RandomMandaicLetterOutput>;

export const randomMandaicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMandaicLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Mandaic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/mandaic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/mandaic-letter",
      id: "value",
      kind: "string",
      label: "Random Mandaic Letter",
    },
  ],
  title: "Random Mandaic Letter Generator",
});

export const runRandomMandaicLetter = randomMandaicLetterTool.execute;
export default randomMandaicLetterTool;
