// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/lv.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLatvianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomLatvianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Ā", "B", "C", "Č", "D", "E", "Ē", "F", "G", "Ģ", "H", "I", "Ī", "J", "K", "Ķ", "L", "Ļ", "M", "N", "Ņ", "O", "P", "R", "S", "Š", "T", "U", "Ū", "V", "Z", "Ž"] } as const;

export const randomLatvianAlphabetLetterValueCount = 33;

export const calculateRandomLatvianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomLatvianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLatvianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomLatvianAlphabetLetterInput,
  RandomLatvianAlphabetLetterOutput
>;

export const randomLatvianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLatvianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Latvian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/latvian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/latvian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Latvian Alphabet Letter",
    },
  ],
  title: "Random Latvian Alphabet Letter Generator",
});

export const runRandomLatvianAlphabetLetter = randomLatvianAlphabetLetterTool.execute;
export default randomLatvianAlphabetLetterTool;
