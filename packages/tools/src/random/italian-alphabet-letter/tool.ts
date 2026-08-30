// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/it.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomItalianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomItalianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"] } as const;

export const randomItalianAlphabetLetterValueCount = 21;

export const calculateRandomItalianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomItalianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomItalianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomItalianAlphabetLetterInput,
  RandomItalianAlphabetLetterOutput
>;

export const randomItalianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomItalianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Italian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/italian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/italian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Italian Alphabet Letter",
    },
  ],
  title: "Random Italian Alphabet Letter Generator",
});

export const runRandomItalianAlphabetLetter = randomItalianAlphabetLetterTool.execute;
export default randomItalianAlphabetLetterTool;
