// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/kk.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKazakhCyrillicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomKazakhCyrillicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Ә", "Б", "В", "Г", "Ғ", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Қ", "Л", "М", "Н", "Ң", "О", "Ө", "П", "Р", "С", "Т", "У", "Ұ", "Ү", "Ф", "Х", "Һ", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "І", "Ь", "Э", "Ю", "Я"] } as const;

export const randomKazakhCyrillicAlphabetLetterValueCount = 42;

export const calculateRandomKazakhCyrillicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomKazakhCyrillicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKazakhCyrillicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomKazakhCyrillicAlphabetLetterInput,
  RandomKazakhCyrillicAlphabetLetterOutput
>;

export const randomKazakhCyrillicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKazakhCyrillicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Kazakh Cyrillic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/kazakh-cyrillic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/kazakh-cyrillic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Kazakh Cyrillic Alphabet Letter",
    },
  ],
  title: "Random Kazakh Cyrillic Alphabet Letter Generator",
});

export const runRandomKazakhCyrillicAlphabetLetter = randomKazakhCyrillicAlphabetLetterTool.execute;
export default randomKazakhCyrillicAlphabetLetterTool;
