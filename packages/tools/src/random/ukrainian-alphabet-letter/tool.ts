// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/uk.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUkrainianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomUkrainianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Ґ", "Д", "Е", "Є", "Ж", "З", "И", "І", "Ї", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ь", "Ю", "Я"] } as const;

export const randomUkrainianAlphabetLetterValueCount = 33;

export const calculateRandomUkrainianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomUkrainianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUkrainianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomUkrainianAlphabetLetterInput,
  RandomUkrainianAlphabetLetterOutput
>;

export const randomUkrainianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUkrainianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Ukrainian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/ukrainian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/ukrainian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Ukrainian Alphabet Letter",
    },
  ],
  title: "Random Ukrainian Alphabet Letter Generator",
});

export const runRandomUkrainianAlphabetLetter = randomUkrainianAlphabetLetterTool.execute;
export default randomUkrainianAlphabetLetterTool;
