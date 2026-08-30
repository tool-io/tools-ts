// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAslFingerspellingLetterInput = Readonly<
  Record<string, never>
>;
export type RandomAslFingerspellingLetterOutput = { readonly value: string };

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

export const randomAslFingerspellingLetterValueCount = 26;

export const calculateRandomAslFingerspellingLetter = (
  random: RandomSource = Math.random,
): RandomAslFingerspellingLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAslFingerspellingLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomAslFingerspellingLetterInput,
  RandomAslFingerspellingLetterOutput
>;

export const randomAslFingerspellingLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAslFingerspellingLetter(
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
    "Choose one ASL fingerspelling letter prompt using injected randomness; the portable result identifies the letter and does not render a handshape.",
  id: "random/asl-fingerspelling-letter",
  inputs: [],
  outputs: [
    {
      format: "random/asl-fingerspelling-letter",
      id: "value",
      kind: "string",
      label: "Random ASL Fingerspelling Letter",
    },
  ],
  title: "Random ASL Fingerspelling Letter Generator",
});

export const runRandomAslFingerspellingLetter =
  randomAslFingerspellingLetterTool.execute;
export default randomAslFingerspellingLetterTool;
