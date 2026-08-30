// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/tg.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTajikCyrillicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomTajikCyrillicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Ғ", "Д", "Е", "Ё", "Ж", "З", "И", "Ӣ", "Й", "К", "Қ", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ӯ", "Ф", "Х", "Ҳ", "Ч", "Ҷ", "Ш", "Ъ", "Э", "Ю", "Я"] } as const;

export const randomTajikCyrillicAlphabetLetterValueCount = 35;

export const calculateRandomTajikCyrillicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomTajikCyrillicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTajikCyrillicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomTajikCyrillicAlphabetLetterInput,
  RandomTajikCyrillicAlphabetLetterOutput
>;

export const randomTajikCyrillicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTajikCyrillicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Tajik Cyrillic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/tajik-cyrillic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/tajik-cyrillic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Tajik Cyrillic Alphabet Letter",
    },
  ],
  title: "Random Tajik Cyrillic Alphabet Letter Generator",
});

export const runRandomTajikCyrillicAlphabetLetter = randomTajikCyrillicAlphabetLetterTool.execute;
export default randomTajikCyrillicAlphabetLetterTool;
