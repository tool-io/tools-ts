// Repertoire source: https://www.brailleauthority.org/ueb/ueb.html
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGradeOneEnglishBrailleDigitInput = Readonly<Record<string, never>>;
export type RandomGradeOneEnglishBrailleDigitOutput = { readonly value: string };

const source = { values: ["⠼⠁", "⠼⠃", "⠼⠉", "⠼⠙", "⠼⠑", "⠼⠋", "⠼⠛", "⠼⠓", "⠼⠊", "⠼⠚"] } as const;

export const randomGradeOneEnglishBrailleDigitValueCount = 10;

export const calculateRandomGradeOneEnglishBrailleDigit = (
  random: RandomSource = Math.random,
): RandomGradeOneEnglishBrailleDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGradeOneEnglishBrailleDigitExample = { input: {} } satisfies ToolExample<
  RandomGradeOneEnglishBrailleDigitInput,
  RandomGradeOneEnglishBrailleDigitOutput
>;

export const randomGradeOneEnglishBrailleDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGradeOneEnglishBrailleDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Grade 1 English Braille digit sequence for 1 through 0, including the numeric indicator, using injected randomness.",
  id: "random/grade-one-english-braille-digit",
  inputs: [],
  outputs: [
    {
      format: "random/grade-one-english-braille-digit",
      id: "value",
      kind: "string",
      label: "Random Grade 1 English Braille Digit",
    },
  ],
  title: "Random Grade 1 English Braille Digit Generator",
});

export const runRandomGradeOneEnglishBrailleDigit = randomGradeOneEnglishBrailleDigitTool.execute;
export default randomGradeOneEnglishBrailleDigitTool;
