// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/ga.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIrishAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomIrishAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "R", "S", "T", "U"] } as const;

export const randomIrishAlphabetLetterValueCount = 18;

export const calculateRandomIrishAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomIrishAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIrishAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomIrishAlphabetLetterInput,
  RandomIrishAlphabetLetterOutput
>;

export const randomIrishAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIrishAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Irish alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/irish-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/irish-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Irish Alphabet Letter",
    },
  ],
  title: "Random Irish Alphabet Letter Generator",
});

export const runRandomIrishAlphabetLetter = randomIrishAlphabetLetterTool.execute;
export default randomIrishAlphabetLetterTool;
