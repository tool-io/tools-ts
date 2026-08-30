// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/pl.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPolishAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomPolishAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L", "Ł", "M", "N", "Ń", "O", "Ó", "P", "R", "S", "Ś", "T", "U", "W", "Y", "Z", "Ź", "Ż"] } as const;

export const randomPolishAlphabetLetterValueCount = 32;

export const calculateRandomPolishAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomPolishAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPolishAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomPolishAlphabetLetterInput,
  RandomPolishAlphabetLetterOutput
>;

export const randomPolishAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPolishAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Polish alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/polish-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/polish-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Polish Alphabet Letter",
    },
  ],
  title: "Random Polish Alphabet Letter Generator",
});

export const runRandomPolishAlphabetLetter = randomPolishAlphabetLetterTool.execute;
export default randomPolishAlphabetLetterTool;
