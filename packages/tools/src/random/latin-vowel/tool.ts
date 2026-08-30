// Repertoire source: https://www.unicode.org/charts/PDF/U0000.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLatinVowelInput = Readonly<Record<string, never>>;
export type RandomLatinVowelOutput = { readonly value: string };

const source = { values: ["A", "E", "I", "O", "U", "a", "e", "i", "o", "u"] } as const;

export const randomLatinVowelValueCount = 10;

export const calculateRandomLatinVowel = (
  random: RandomSource = Math.random,
): RandomLatinVowelOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLatinVowelExample = { input: {} } satisfies ToolExample<
  RandomLatinVowelInput,
  RandomLatinVowelOutput
>;

export const randomLatinVowelTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLatinVowel(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one unaccented English Latin vowel in uppercase or lowercase using injected randomness; Y is excluded.",
  id: "random/latin-vowel",
  inputs: [],
  outputs: [
    {
      format: "random/latin-vowel",
      id: "value",
      kind: "string",
      label: "Random Latin Vowel",
    },
  ],
  title: "Random Latin Vowel Generator",
});

export const runRandomLatinVowel = randomLatinVowelTool.execute;
export default randomLatinVowelTool;
