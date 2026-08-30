// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/mk.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMacedonianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomMacedonianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Ѓ", "Е", "Ж", "З", "Ѕ", "И", "Ј", "К", "Л", "Љ", "М", "Н", "Њ", "О", "П", "Р", "С", "Т", "Ќ", "У", "Ф", "Х", "Ц", "Ч", "Џ", "Ш"] } as const;

export const randomMacedonianAlphabetLetterValueCount = 31;

export const calculateRandomMacedonianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomMacedonianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMacedonianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomMacedonianAlphabetLetterInput,
  RandomMacedonianAlphabetLetterOutput
>;

export const randomMacedonianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMacedonianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Macedonian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/macedonian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/macedonian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Macedonian Alphabet Letter",
    },
  ],
  title: "Random Macedonian Alphabet Letter Generator",
});

export const runRandomMacedonianAlphabetLetter = randomMacedonianAlphabetLetterTool.execute;
export default randomMacedonianAlphabetLetterTool;
