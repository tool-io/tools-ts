// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/is.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIcelandicAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomIcelandicAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Á", "B", "D", "Ð", "E", "É", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "O", "Ó", "P", "R", "S", "T", "U", "Ú", "V", "X", "Y", "Ý", "Þ", "Æ", "Ö"] } as const;

export const randomIcelandicAlphabetLetterValueCount = 32;

export const calculateRandomIcelandicAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomIcelandicAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIcelandicAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomIcelandicAlphabetLetterInput,
  RandomIcelandicAlphabetLetterOutput
>;

export const randomIcelandicAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIcelandicAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Icelandic alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/icelandic-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/icelandic-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Icelandic Alphabet Letter",
    },
  ],
  title: "Random Icelandic Alphabet Letter Generator",
});

export const runRandomIcelandicAlphabetLetter = randomIcelandicAlphabetLetterTool.execute;
export default randomIcelandicAlphabetLetterTool;
