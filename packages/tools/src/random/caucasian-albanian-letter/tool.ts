// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCaucasianAlbanianLetterInput = Readonly<
  Record<string, never>
>;
export type RandomCaucasianAlbanianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10530, 0x10563]] } as const;

export const randomCaucasianAlbanianLetterValueCount = 52;

export const calculateRandomCaucasianAlbanianLetter = (
  random: RandomSource = Math.random,
): RandomCaucasianAlbanianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCaucasianAlbanianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomCaucasianAlbanianLetterInput,
  RandomCaucasianAlbanianLetterOutput
>;

export const randomCaucasianAlbanianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCaucasianAlbanianLetter(
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
    "Choose one assigned Unicode 18.0 Caucasian Albanian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/caucasian-albanian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/caucasian-albanian-letter",
      id: "value",
      kind: "string",
      label: "Random Caucasian Albanian Letter",
    },
  ],
  title: "Random Caucasian Albanian Letter Generator",
});

export const runRandomCaucasianAlbanianLetter =
  randomCaucasianAlbanianLetterTool.execute;
export default randomCaucasianAlbanianLetterTool;
