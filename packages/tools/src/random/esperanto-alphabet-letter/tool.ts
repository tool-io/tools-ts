// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/eo.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomEsperantoAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomEsperantoAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "Ĉ", "D", "E", "F", "G", "Ĝ", "H", "Ĥ", "I", "J", "Ĵ", "K", "L", "M", "N", "O", "P", "R", "S", "Ŝ", "T", "U", "Ŭ", "V", "Z"] } as const;

export const randomEsperantoAlphabetLetterValueCount = 28;

export const calculateRandomEsperantoAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomEsperantoAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomEsperantoAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomEsperantoAlphabetLetterInput,
  RandomEsperantoAlphabetLetterOutput
>;

export const randomEsperantoAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomEsperantoAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Esperanto alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/esperanto-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/esperanto-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Esperanto Alphabet Letter",
    },
  ],
  title: "Random Esperanto Alphabet Letter Generator",
});

export const runRandomEsperantoAlphabetLetter = randomEsperantoAlphabetLetterTool.execute;
export default randomEsperantoAlphabetLetterTool;
