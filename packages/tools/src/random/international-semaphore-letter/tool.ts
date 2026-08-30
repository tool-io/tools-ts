// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomInternationalSemaphoreLetterInput = Readonly<
  Record<string, never>
>;
export type RandomInternationalSemaphoreLetterOutput = {
  readonly value: string;
};

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

export const randomInternationalSemaphoreLetterValueCount = 26;

export const calculateRandomInternationalSemaphoreLetter = (
  random: RandomSource = Math.random,
): RandomInternationalSemaphoreLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomInternationalSemaphoreLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomInternationalSemaphoreLetterInput,
  RandomInternationalSemaphoreLetterOutput
>;

export const randomInternationalSemaphoreLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomInternationalSemaphoreLetter(
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
    "Choose one International Flag Semaphore letter prompt using injected randomness; the portable result identifies the letter and does not render flag positions.",
  id: "random/international-semaphore-letter",
  inputs: [],
  outputs: [
    {
      format: "random/international-semaphore-letter",
      id: "value",
      kind: "string",
      label: "Random International Semaphore Letter",
    },
  ],
  title: "Random International Semaphore Letter Generator",
});

export const runRandomInternationalSemaphoreLetter =
  randomInternationalSemaphoreLetterTool.execute;
export default randomInternationalSemaphoreLetterTool;
