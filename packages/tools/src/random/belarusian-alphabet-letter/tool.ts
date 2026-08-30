// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/be.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBelarusianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomBelarusianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "І", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ў", "Ф", "Х", "Ц", "Ч", "Ш", "Ы", "Ь", "Э", "Ю", "Я"] } as const;

export const randomBelarusianAlphabetLetterValueCount = 32;

export const calculateRandomBelarusianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomBelarusianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBelarusianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomBelarusianAlphabetLetterInput,
  RandomBelarusianAlphabetLetterOutput
>;

export const randomBelarusianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBelarusianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Belarusian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/belarusian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/belarusian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Belarusian Alphabet Letter",
    },
  ],
  title: "Random Belarusian Alphabet Letter Generator",
});

export const runRandomBelarusianAlphabetLetter = randomBelarusianAlphabetLetterTool.execute;
export default randomBelarusianAlphabetLetterTool;
