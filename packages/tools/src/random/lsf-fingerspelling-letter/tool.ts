// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLsfFingerspellingLetterInput = Readonly<
  Record<string, never>
>;
export type RandomLsfFingerspellingLetterOutput = { readonly value: string };

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

export const randomLsfFingerspellingLetterValueCount = 26;

export const calculateRandomLsfFingerspellingLetter = (
  random: RandomSource = Math.random,
): RandomLsfFingerspellingLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLsfFingerspellingLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomLsfFingerspellingLetterInput,
  RandomLsfFingerspellingLetterOutput
>;

export const randomLsfFingerspellingLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLsfFingerspellingLetter(
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
    "Choose one LSF fingerspelling letter prompt using injected randomness; the portable result identifies the letter and does not render a handshape.",
  id: "random/lsf-fingerspelling-letter",
  inputs: [],
  outputs: [
    {
      format: "random/lsf-fingerspelling-letter",
      id: "value",
      kind: "string",
      label: "Random LSF Fingerspelling Letter",
    },
  ],
  title: "Random LSF Fingerspelling Letter Generator",
});

export const runRandomLsfFingerspellingLetter =
  randomLsfFingerspellingLetterTool.execute;
export default randomLsfFingerspellingLetterTool;
