// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/bg.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBulgarianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomBulgarianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Ю", "Я"] } as const;

export const randomBulgarianAlphabetLetterValueCount = 30;

export const calculateRandomBulgarianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomBulgarianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBulgarianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomBulgarianAlphabetLetterInput,
  RandomBulgarianAlphabetLetterOutput
>;

export const randomBulgarianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBulgarianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Bulgarian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/bulgarian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/bulgarian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Bulgarian Alphabet Letter",
    },
  ],
  title: "Random Bulgarian Alphabet Letter Generator",
});

export const runRandomBulgarianAlphabetLetter = randomBulgarianAlphabetLetterTool.execute;
export default randomBulgarianAlphabetLetterTool;
