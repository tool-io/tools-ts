// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/es.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSpanishAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomSpanishAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] } as const;

export const randomSpanishAlphabetLetterValueCount = 27;

export const calculateRandomSpanishAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomSpanishAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSpanishAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomSpanishAlphabetLetterInput,
  RandomSpanishAlphabetLetterOutput
>;

export const randomSpanishAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSpanishAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Spanish alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/spanish-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/spanish-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Spanish Alphabet Letter",
    },
  ],
  title: "Random Spanish Alphabet Letter Generator",
});

export const runRandomSpanishAlphabetLetter = randomSpanishAlphabetLetterTool.execute;
export default randomSpanishAlphabetLetterTool;
