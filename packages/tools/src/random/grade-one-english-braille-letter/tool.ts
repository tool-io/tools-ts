// Repertoire source: https://www.brailleauthority.org/ueb/ueb.html
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGradeOneEnglishBrailleLetterInput = Readonly<Record<string, never>>;
export type RandomGradeOneEnglishBrailleLetterOutput = { readonly value: string };

const source = { values: ["⠁", "⠃", "⠉", "⠙", "⠑", "⠋", "⠛", "⠓", "⠊", "⠚", "⠅", "⠇", "⠍", "⠝", "⠕", "⠏", "⠟", "⠗", "⠎", "⠞", "⠥", "⠧", "⠺", "⠭", "⠽", "⠵"] } as const;

export const randomGradeOneEnglishBrailleLetterValueCount = 26;

export const calculateRandomGradeOneEnglishBrailleLetter = (
  random: RandomSource = Math.random,
): RandomGradeOneEnglishBrailleLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGradeOneEnglishBrailleLetterExample = { input: {} } satisfies ToolExample<
  RandomGradeOneEnglishBrailleLetterInput,
  RandomGradeOneEnglishBrailleLetterOutput
>;

export const randomGradeOneEnglishBrailleLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGradeOneEnglishBrailleLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one uncapitalized Grade 1 English Braille letter cell from a through z using injected randomness.",
  id: "random/grade-one-english-braille-letter",
  inputs: [],
  outputs: [
    {
      format: "random/grade-one-english-braille-letter",
      id: "value",
      kind: "string",
      label: "Random Grade 1 English Braille Letter",
    },
  ],
  title: "Random Grade 1 English Braille Letter Generator",
});

export const runRandomGradeOneEnglishBrailleLetter = randomGradeOneEnglishBrailleLetterTool.execute;
export default randomGradeOneEnglishBrailleLetterTool;
