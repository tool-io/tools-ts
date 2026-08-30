// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/de.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGermanAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomGermanAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Ä", "Ö", "Ü", "ẞ"] } as const;

export const randomGermanAlphabetLetterValueCount = 30;

export const calculateRandomGermanAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomGermanAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGermanAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomGermanAlphabetLetterInput,
  RandomGermanAlphabetLetterOutput
>;

export const randomGermanAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGermanAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern German alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/german-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/german-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random German Alphabet Letter",
    },
  ],
  title: "Random German Alphabet Letter Generator",
});

export const runRandomGermanAlphabetLetter = randomGermanAlphabetLetterTool.execute;
export default randomGermanAlphabetLetterTool;
