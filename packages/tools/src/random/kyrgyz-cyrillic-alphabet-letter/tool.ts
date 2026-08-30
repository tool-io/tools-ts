// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ky.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKyrgyzCyrillicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomKyrgyzCyrillicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "Ң", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"] } as const;

export const randomKyrgyzCyrillicAlphabetLetterValueCount = 36;

export const calculateRandomKyrgyzCyrillicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomKyrgyzCyrillicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKyrgyzCyrillicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomKyrgyzCyrillicAlphabetLetterInput,
  RandomKyrgyzCyrillicAlphabetLetterOutput
>;

export const randomKyrgyzCyrillicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKyrgyzCyrillicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Kyrgyz Cyrillic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/kyrgyz-cyrillic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/kyrgyz-cyrillic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Kyrgyz Cyrillic Alphabet Letter",
    },
  ],
  title: "Random Kyrgyz Cyrillic Alphabet Letter Generator",
});

export const runRandomKyrgyzCyrillicAlphabetLetter = randomKyrgyzCyrillicAlphabetLetterTool.execute;
export default randomKyrgyzCyrillicAlphabetLetterTool;
