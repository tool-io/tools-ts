// Repertoire source: https://www.sign-lang.uni-hamburg.de/fa/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDgsFingerspellingLetterInput = Readonly<
  Record<string, never>
>;
export type RandomDgsFingerspellingLetterOutput = { readonly value: string };

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
    "Ä",
    "Ö",
    "Ü",
    "ẞ",
    "SCH",
  ],
} as const;

export const randomDgsFingerspellingLetterValueCount = 31;

export const calculateRandomDgsFingerspellingLetter = (
  random: RandomSource = Math.random,
): RandomDgsFingerspellingLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDgsFingerspellingLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomDgsFingerspellingLetterInput,
  RandomDgsFingerspellingLetterOutput
>;

export const randomDgsFingerspellingLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDgsFingerspellingLetter(
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
    "Choose one German Sign Language fingerspelling prompt using injected randomness; the set includes A–Z plus the established Ä, Ö, Ü, ß, and SCH forms; the portable result identifies the prompt and does not render a handshape.",
  id: "random/dgs-fingerspelling-letter",
  inputs: [],
  outputs: [
    {
      format: "random/dgs-fingerspelling-letter",
      id: "value",
      kind: "string",
      label: "Random DGS Fingerspelling Letter",
    },
  ],
  title: "Random DGS Fingerspelling Letter Generator",
});

export const runRandomDgsFingerspellingLetter =
  randomDgsFingerspellingLetterTool.execute;
export default randomDgsFingerspellingLetterTool;
