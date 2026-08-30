// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/he.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHebrewFinalFormLetterInput = Readonly<Record<string, never>>;
export type RandomHebrewFinalFormLetterOutput = { readonly value: string };

const source = { values: ["ך", "ם", "ן", "ף", "ץ"] } as const;

export const randomHebrewFinalFormLetterValueCount = 5;

export const calculateRandomHebrewFinalFormLetter = (
  random: RandomSource = Math.random,
): RandomHebrewFinalFormLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHebrewFinalFormLetterExample = { input: {} } satisfies ToolExample<
  RandomHebrewFinalFormLetterInput,
  RandomHebrewFinalFormLetterOutput
>;

export const randomHebrewFinalFormLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHebrewFinalFormLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one of the five Hebrew final-form letters using injected randomness.",
  id: "random/hebrew-final-form-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hebrew-final-form-letter",
      id: "value",
      kind: "string",
      label: "Random Hebrew Final Form Letter",
    },
  ],
  title: "Random Hebrew Final Form Letter Generator",
});

export const runRandomHebrewFinalFormLetter = randomHebrewFinalFormLetterTool.execute;
export default randomHebrewFinalFormLetterTool;
