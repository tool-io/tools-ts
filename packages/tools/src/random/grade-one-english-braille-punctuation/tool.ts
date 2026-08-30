// Repertoire source: https://www.brailleauthority.org/ueb/ueb.html
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGradeOneEnglishBraillePunctuationInput = Readonly<Record<string, never>>;
export type RandomGradeOneEnglishBraillePunctuationOutput = { readonly value: string };

const source = { values: ["⠂", "⠆", "⠒", "⠲", "⠖", "⠦", "⠄", "⠤", "⠶", "⠴", "⠌"] } as const;

export const randomGradeOneEnglishBraillePunctuationValueCount = 11;

export const calculateRandomGradeOneEnglishBraillePunctuation = (
  random: RandomSource = Math.random,
): RandomGradeOneEnglishBraillePunctuationOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGradeOneEnglishBraillePunctuationExample = { input: {} } satisfies ToolExample<
  RandomGradeOneEnglishBraillePunctuationInput,
  RandomGradeOneEnglishBraillePunctuationOutput
>;

export const randomGradeOneEnglishBraillePunctuationTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGradeOneEnglishBraillePunctuation(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one common Grade 1 English Braille punctuation cell for comma, semicolon, colon, period, exclamation, question, apostrophe, hyphen, quotation mark, or slash using injected randomness.",
  id: "random/grade-one-english-braille-punctuation",
  inputs: [],
  outputs: [
    {
      format: "random/grade-one-english-braille-punctuation",
      id: "value",
      kind: "string",
      label: "Random Grade 1 English Braille Punctuation",
    },
  ],
  title: "Random Grade 1 English Braille Punctuation Generator",
});

export const runRandomGradeOneEnglishBraillePunctuation = randomGradeOneEnglishBraillePunctuationTool.execute;
export default randomGradeOneEnglishBraillePunctuationTool;
