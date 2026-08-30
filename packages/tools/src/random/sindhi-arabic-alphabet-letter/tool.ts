// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/sd.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSindhiArabicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomSindhiArabicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "ٻ", "ڀ", "ت", "ٿ", "ٽ", "ٺ", "ث", "پ", "ج", "ڄ", "جھ", "ڃ", "چ", "ڇ", "ح", "خ", "د", "ڌ", "ڏ", "ڊ", "ڍ", "ذ", "ر", "ڙ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ڦ", "ق", "ڪ", "ک", "گ", "ڳ", "گھ", "ڱ", "ل", "م", "ن", "ڻ", "و", "ھ", "ه", "ء", "ي", "ې"] } as const;

export const randomSindhiArabicAlphabetLetterValueCount = 54;

export const calculateRandomSindhiArabicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomSindhiArabicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSindhiArabicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomSindhiArabicAlphabetLetterInput,
  RandomSindhiArabicAlphabetLetterOutput
>;

export const randomSindhiArabicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSindhiArabicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Sindhi Arabic-script alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/sindhi-arabic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/sindhi-arabic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Sindhi Arabic Alphabet Letter",
    },
  ],
  title: "Random Sindhi Arabic Alphabet Letter Generator",
});

export const runRandomSindhiArabicAlphabetLetter = randomSindhiArabicAlphabetLetterTool.execute;
export default randomSindhiArabicAlphabetLetterTool;
