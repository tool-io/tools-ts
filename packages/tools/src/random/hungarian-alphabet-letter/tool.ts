// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/hu.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHungarianAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomHungarianAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "Á", "B", "C", "Cs", "D", "Dz", "Dzs", "E", "É", "F", "G", "Gy", "H", "I", "Í", "J", "K", "L", "Ly", "M", "N", "Ny", "O", "Ó", "Ö", "Ő", "P", "Q", "R", "S", "Sz", "T", "Ty", "U", "Ú", "Ü", "Ű", "V", "W", "X", "Y", "Z", "Zs"] } as const;

export const randomHungarianAlphabetLetterValueCount = 44;

export const calculateRandomHungarianAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomHungarianAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHungarianAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomHungarianAlphabetLetterInput,
  RandomHungarianAlphabetLetterOutput
>;

export const randomHungarianAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHungarianAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Hungarian alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/hungarian-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hungarian-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Hungarian Alphabet Letter",
    },
  ],
  title: "Random Hungarian Alphabet Letter Generator",
});

export const runRandomHungarianAlphabetLetter = randomHungarianAlphabetLetterTool.execute;
export default randomHungarianAlphabetLetterTool;
