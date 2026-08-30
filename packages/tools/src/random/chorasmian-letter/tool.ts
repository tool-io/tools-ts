// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomChorasmianLetterInput = Readonly<Record<string, never>>;
export type RandomChorasmianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10fb0, 0x10fc4]] } as const;

export const randomChorasmianLetterValueCount = 21;

export const calculateRandomChorasmianLetter = (
  random: RandomSource = Math.random,
): RandomChorasmianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomChorasmianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomChorasmianLetterInput,
  RandomChorasmianLetterOutput
>;

export const randomChorasmianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomChorasmianLetter(
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
    "Choose one assigned Unicode 18.0 Chorasmian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/chorasmian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/chorasmian-letter",
      id: "value",
      kind: "string",
      label: "Random Chorasmian Letter",
    },
  ],
  title: "Random Chorasmian Letter Generator",
});

export const runRandomChorasmianLetter = randomChorasmianLetterTool.execute;
export default randomChorasmianLetterTool;
