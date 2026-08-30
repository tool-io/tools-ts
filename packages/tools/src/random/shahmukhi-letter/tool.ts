// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/pa_Arab.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomShahmukhiLetterInput = Readonly<Record<string, never>>;
export type RandomShahmukhiLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ذ", "ر", "ڑ", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "ں", "و", "ہ", "ھ", "ی", "ے"] } as const;

export const randomShahmukhiLetterValueCount = 38;

export const calculateRandomShahmukhiLetter = (
  random: RandomSource = Math.random,
): RandomShahmukhiLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomShahmukhiLetterExample = { input: {} } satisfies ToolExample<
  RandomShahmukhiLetterInput,
  RandomShahmukhiLetterOutput
>;

export const randomShahmukhiLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomShahmukhiLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Shahmukhi Punjabi alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/shahmukhi-letter",
  inputs: [],
  outputs: [
    {
      format: "random/shahmukhi-letter",
      id: "value",
      kind: "string",
      label: "Random Shahmukhi Letter",
    },
  ],
  title: "Random Shahmukhi Letter Generator",
});

export const runRandomShahmukhiLetter = randomShahmukhiLetterTool.execute;
export default randomShahmukhiLetterTool;
