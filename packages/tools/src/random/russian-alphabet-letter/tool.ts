// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ru.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRussianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomRussianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"] } as const;

export const randomRussianAlphabetLetterValueCount = 33;

export const calculateRandomRussianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomRussianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRussianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomRussianAlphabetLetterInput,
  RandomRussianAlphabetLetterOutput
>;

export const randomRussianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRussianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Russian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/russian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/russian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Russian Alphabet Letter",
    },
  ],
  title: "Random Russian Alphabet Letter Generator",
});

export const runRandomRussianAlphabetLetter = randomRussianAlphabetLetterTool.execute;
export default randomRussianAlphabetLetterTool;
