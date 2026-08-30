// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/sk.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSlovakAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomSlovakAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Á", "Ä", "B", "C", "Č", "D", "Ď", "Dz", "Dž", "E", "É", "F", "G", "H", "Ch", "I", "Í", "J", "K", "L", "Ĺ", "Ľ", "M", "N", "Ň", "O", "Ó", "Ô", "P", "Q", "R", "Ŕ", "S", "Š", "T", "Ť", "U", "Ú", "V", "W", "X", "Y", "Ý", "Z", "Ž"] } as const;

export const randomSlovakAlphabetLetterValueCount = 46;

export const calculateRandomSlovakAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomSlovakAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSlovakAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomSlovakAlphabetLetterInput,
  RandomSlovakAlphabetLetterOutput
>;

export const randomSlovakAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSlovakAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Slovak alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/slovak-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/slovak-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Slovak Alphabet Letter",
    },
  ],
  title: "Random Slovak Alphabet Letter Generator",
});

export const runRandomSlovakAlphabetLetter = randomSlovakAlphabetLetterTool.execute;
export default randomSlovakAlphabetLetterTool;
