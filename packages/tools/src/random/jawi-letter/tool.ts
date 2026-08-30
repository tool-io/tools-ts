// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-9/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomJawiLetterInput = Readonly<Record<string, never>>;
export type RandomJawiLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ڠ", "ف", "ڤ", "ق", "ک", "ݢ", "گ", "ل", "م", "ن", "و", "ۏ", "ه", "ء", "ي", "ڽ"] } as const;

export const randomJawiLetterValueCount = 36;

export const calculateRandomJawiLetter = (
  random: RandomSource = Math.random,
): RandomJawiLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomJawiLetterExample = { input: {} } satisfies ToolExample<
  RandomJawiLetterInput,
  RandomJawiLetterOutput
>;

export const randomJawiLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomJawiLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Jawi alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/jawi-letter",
  inputs: [],
  outputs: [
    {
      format: "random/jawi-letter",
      id: "value",
      kind: "string",
      label: "Random Jawi Letter",
    },
  ],
  title: "Random Jawi Letter Generator",
});

export const runRandomJawiLetter = randomJawiLetterTool.execute;
export default randomJawiLetterTool;
