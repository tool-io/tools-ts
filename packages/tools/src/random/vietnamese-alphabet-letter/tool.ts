// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/vi.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomVietnameseAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomVietnameseAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Ă", "Â", "B", "C", "D", "Đ", "E", "Ê", "G", "H", "I", "K", "L", "M", "N", "O", "Ô", "Ơ", "P", "Q", "R", "S", "T", "U", "Ư", "V", "X", "Y"] } as const;

export const randomVietnameseAlphabetLetterValueCount = 29;

export const calculateRandomVietnameseAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomVietnameseAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomVietnameseAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomVietnameseAlphabetLetterInput,
  RandomVietnameseAlphabetLetterOutput
>;

export const randomVietnameseAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomVietnameseAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Vietnamese alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/vietnamese-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/vietnamese-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Vietnamese Alphabet Letter",
    },
  ],
  title: "Random Vietnamese Alphabet Letter Generator",
});

export const runRandomVietnameseAlphabetLetter = randomVietnameseAlphabetLetterTool.execute;
export default randomVietnameseAlphabetLetterTool;
