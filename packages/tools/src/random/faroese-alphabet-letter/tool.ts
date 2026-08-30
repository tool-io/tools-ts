// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/fo.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomFaroeseAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomFaroeseAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Á", "B", "D", "Ð", "E", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "O", "Ó", "P", "R", "S", "T", "U", "Ú", "V", "Y", "Ý", "Æ", "Ø"] } as const;

export const randomFaroeseAlphabetLetterValueCount = 29;

export const calculateRandomFaroeseAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomFaroeseAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomFaroeseAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomFaroeseAlphabetLetterInput,
  RandomFaroeseAlphabetLetterOutput
>;

export const randomFaroeseAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomFaroeseAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Faroese alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/faroese-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/faroese-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Faroese Alphabet Letter",
    },
  ],
  title: "Random Faroese Alphabet Letter Generator",
});

export const runRandomFaroeseAlphabetLetter = randomFaroeseAlphabetLetterTool.execute;
export default randomFaroeseAlphabetLetterTool;
