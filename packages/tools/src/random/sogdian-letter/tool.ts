// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSogdianLetterInput = Readonly<Record<string, never>>;
export type RandomSogdianLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x10f30, 0x10f45],
  ],
} as const;

export const randomSogdianLetterValueCount = 23;

export const calculateRandomSogdianLetter = (
  random: RandomSource = Math.random,
): RandomSogdianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSogdianLetterExample = {
  input: {},
} satisfies ToolExample<RandomSogdianLetterInput, RandomSogdianLetterOutput>;

export const randomSogdianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSogdianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Sogdian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/sogdian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/sogdian-letter",
      id: "value",
      kind: "string",
      label: "Random Sogdian Letter",
    },
  ],
  title: "Random Sogdian Letter Generator",
});

export const runRandomSogdianLetter = randomSogdianLetterTool.execute;
export default randomSogdianLetterTool;
