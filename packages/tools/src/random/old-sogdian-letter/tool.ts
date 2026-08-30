// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldSogdianLetterInput = Readonly<Record<string, never>>;
export type RandomOldSogdianLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10f00, 0x10f1c],
    [0x10f27, 0x10f27],
  ],
} as const;

export const randomOldSogdianLetterValueCount = 30;

export const calculateRandomOldSogdianLetter = (
  random: RandomSource = Math.random,
): RandomOldSogdianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldSogdianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldSogdianLetterInput,
  RandomOldSogdianLetterOutput
>;

export const randomOldSogdianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldSogdianLetter(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Old Sogdian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-sogdian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-sogdian-letter",
      id: "value",
      kind: "string",
      label: "Random Old Sogdian Letter",
    },
  ],
  title: "Random Old Sogdian Letter Generator",
});

export const runRandomOldSogdianLetter = randomOldSogdianLetterTool.execute;
export default randomOldSogdianLetterTool;
