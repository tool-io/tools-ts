// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ur.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUrduAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomUrduAlphabetLetterOutput = { readonly value: string };

const source = { values: ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ذ", "ر", "ڑ", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "ں", "و", "ہ", "ھ", "ء", "ی", "ے"] } as const;

export const randomUrduAlphabetLetterValueCount = 39;

export const calculateRandomUrduAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomUrduAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUrduAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomUrduAlphabetLetterInput,
  RandomUrduAlphabetLetterOutput
>;

export const randomUrduAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUrduAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Urdu alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/urdu-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/urdu-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Urdu Alphabet Letter",
    },
  ],
  title: "Random Urdu Alphabet Letter Generator",
});

export const runRandomUrduAlphabetLetter = randomUrduAlphabetLetterTool.execute;
export default randomUrduAlphabetLetterTool;
