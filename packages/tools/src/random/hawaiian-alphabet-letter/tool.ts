// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/haw.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHawaiianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomHawaiianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "E", "I", "O", "U", "H", "K", "L", "M", "N", "P", "W", "ʻ"] } as const;

export const randomHawaiianAlphabetLetterValueCount = 13;

export const calculateRandomHawaiianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomHawaiianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHawaiianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomHawaiianAlphabetLetterInput,
  RandomHawaiianAlphabetLetterOutput
>;

export const randomHawaiianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHawaiianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Hawaiian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/hawaiian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hawaiian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Hawaiian Alphabet Letter",
    },
  ],
  title: "Random Hawaiian Alphabet Letter Generator",
});

export const runRandomHawaiianAlphabetLetter = randomHawaiianAlphabetLetterTool.execute;
export default randomHawaiianAlphabetLetterTool;
