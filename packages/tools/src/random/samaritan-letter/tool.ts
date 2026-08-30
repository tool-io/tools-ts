// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSamaritanLetterInput = Readonly<Record<string, never>>;
export type RandomSamaritanLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x800, 0x815],
    [0x81a, 0x81a],
    [0x824, 0x824],
    [0x828, 0x828],
  ],
} as const;

export const randomSamaritanLetterValueCount = 25;

export const calculateRandomSamaritanLetter = (
  random: RandomSource = Math.random,
): RandomSamaritanLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSamaritanLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomSamaritanLetterInput,
  RandomSamaritanLetterOutput
>;

export const randomSamaritanLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSamaritanLetter(
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
    "Choose one assigned Unicode 18.0 Samaritan Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/samaritan-letter",
  inputs: [],
  outputs: [
    {
      format: "random/samaritan-letter",
      id: "value",
      kind: "string",
      label: "Random Samaritan Letter",
    },
  ],
  title: "Random Samaritan Letter Generator",
});

export const runRandomSamaritanLetter = randomSamaritanLetterTool.execute;
export default randomSamaritanLetterTool;
