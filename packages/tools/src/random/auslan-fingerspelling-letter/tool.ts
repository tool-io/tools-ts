// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAuslanFingerspellingLetterInput = Readonly<
  Record<string, never>
>;
export type RandomAuslanFingerspellingLetterOutput = { readonly value: string };

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

export const randomAuslanFingerspellingLetterValueCount = 26;

export const calculateRandomAuslanFingerspellingLetter = (
  random: RandomSource = Math.random,
): RandomAuslanFingerspellingLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAuslanFingerspellingLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomAuslanFingerspellingLetterInput,
  RandomAuslanFingerspellingLetterOutput
>;

export const randomAuslanFingerspellingLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAuslanFingerspellingLetter(
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
    "Choose one AUSLAN fingerspelling letter prompt using injected randomness; the portable result identifies the letter and does not render a handshape.",
  id: "random/auslan-fingerspelling-letter",
  inputs: [],
  outputs: [
    {
      format: "random/auslan-fingerspelling-letter",
      id: "value",
      kind: "string",
      label: "Random Auslan Fingerspelling Letter",
    },
  ],
  title: "Random Auslan Fingerspelling Letter Generator",
});

export const runRandomAuslanFingerspellingLetter =
  randomAuslanFingerspellingLetterTool.execute;
export default randomAuslanFingerspellingLetterTool;
