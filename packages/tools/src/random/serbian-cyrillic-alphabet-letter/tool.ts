// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/sr.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSerbianCyrillicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomSerbianCyrillicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Ђ", "Е", "Ж", "З", "И", "Ј", "К", "Л", "Љ", "М", "Н", "Њ", "О", "П", "Р", "С", "Т", "Ћ", "У", "Ф", "Х", "Ц", "Ч", "Џ", "Ш"] } as const;

export const randomSerbianCyrillicAlphabetLetterValueCount = 30;

export const calculateRandomSerbianCyrillicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomSerbianCyrillicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSerbianCyrillicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomSerbianCyrillicAlphabetLetterInput,
  RandomSerbianCyrillicAlphabetLetterOutput
>;

export const randomSerbianCyrillicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSerbianCyrillicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Serbian Cyrillic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/serbian-cyrillic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/serbian-cyrillic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Serbian Cyrillic Alphabet Letter",
    },
  ],
  title: "Random Serbian Cyrillic Alphabet Letter Generator",
});

export const runRandomSerbianCyrillicAlphabetLetter = randomSerbianCyrillicAlphabetLetterTool.execute;
export default randomSerbianCyrillicAlphabetLetterTool;
