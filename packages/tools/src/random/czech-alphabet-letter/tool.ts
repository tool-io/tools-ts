// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/cs.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCzechAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomCzechAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Á", "B", "C", "Č", "D", "Ď", "E", "É", "Ě", "F", "G", "H", "Ch", "I", "Í", "J", "K", "L", "M", "N", "Ň", "O", "Ó", "P", "Q", "R", "Ř", "S", "Š", "T", "Ť", "U", "Ú", "Ů", "V", "W", "X", "Y", "Ý", "Z", "Ž"] } as const;

export const randomCzechAlphabetLetterValueCount = 42;

export const calculateRandomCzechAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomCzechAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCzechAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomCzechAlphabetLetterInput,
  RandomCzechAlphabetLetterOutput
>;

export const randomCzechAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCzechAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Czech alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/czech-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/czech-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Czech Alphabet Letter",
    },
  ],
  title: "Random Czech Alphabet Letter Generator",
});

export const runRandomCzechAlphabetLetter = randomCzechAlphabetLetterTool.execute;
export default randomCzechAlphabetLetterTool;
