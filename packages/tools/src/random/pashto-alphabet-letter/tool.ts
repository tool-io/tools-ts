// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ps.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPashtoAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomPashtoAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "پ", "ت", "ټ", "ث", "ج", "ځ", "چ", "څ", "ح", "خ", "د", "ډ", "ذ", "ر", "ړ", "ز", "ژ", "ږ", "س", "ش", "ښ", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "ګ", "ل", "م", "ن", "ڼ", "و", "ه", "ۀ", "ي", "ې", "ی", "ئ", "ۍ"] } as const;

export const randomPashtoAlphabetLetterValueCount = 45;

export const calculateRandomPashtoAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomPashtoAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPashtoAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomPashtoAlphabetLetterInput,
  RandomPashtoAlphabetLetterOutput
>;

export const randomPashtoAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPashtoAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Pashto alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/pashto-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/pashto-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Pashto Alphabet Letter",
    },
  ],
  title: "Random Pashto Alphabet Letter Generator",
});

export const runRandomPashtoAlphabetLetter = randomPashtoAlphabetLetterTool.execute;
export default randomPashtoAlphabetLetterTool;
