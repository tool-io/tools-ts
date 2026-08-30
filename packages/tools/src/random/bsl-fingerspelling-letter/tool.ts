// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBslFingerspellingLetterInput = Readonly<
  Record<string, never>
>;
export type RandomBslFingerspellingLetterOutput = { readonly value: string };

const source = {
  values: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
} as const;

export const randomBslFingerspellingLetterValueCount = 26;

export const calculateRandomBslFingerspellingLetter = (
  random: RandomSource = Math.random,
): RandomBslFingerspellingLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBslFingerspellingLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomBslFingerspellingLetterInput,
  RandomBslFingerspellingLetterOutput
>;

export const randomBslFingerspellingLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBslFingerspellingLetter(
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
    "Choose one BSL fingerspelling letter prompt using injected randomness; the portable result identifies the letter and does not render a handshape.",
  id: "random/bsl-fingerspelling-letter",
  inputs: [],
  outputs: [
    {
      format: "random/bsl-fingerspelling-letter",
      id: "value",
      kind: "string",
      label: "Random BSL Fingerspelling Letter",
    },
  ],
  title: "Random BSL Fingerspelling Letter Generator",
});

export const runRandomBslFingerspellingLetter =
  randomBslFingerspellingLetterTool.execute;
export default randomBslFingerspellingLetterTool;
