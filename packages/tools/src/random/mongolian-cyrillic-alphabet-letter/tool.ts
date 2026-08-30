// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/mn.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMongolianCyrillicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomMongolianCyrillicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"] } as const;

export const randomMongolianCyrillicAlphabetLetterValueCount = 35;

export const calculateRandomMongolianCyrillicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomMongolianCyrillicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMongolianCyrillicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomMongolianCyrillicAlphabetLetterInput,
  RandomMongolianCyrillicAlphabetLetterOutput
>;

export const randomMongolianCyrillicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMongolianCyrillicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Mongolian Cyrillic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/mongolian-cyrillic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/mongolian-cyrillic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Mongolian Cyrillic Alphabet Letter",
    },
  ],
  title: "Random Mongolian Cyrillic Alphabet Letter Generator",
});

export const runRandomMongolianCyrillicAlphabetLetter = randomMongolianCyrillicAlphabetLetterTool.execute;
export default randomMongolianCyrillicAlphabetLetterTool;
