// Repertoire source: https://www.itu.int/rec/R-REC-M.1677-1-200910-I/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMorseCodePunctuationInput = Readonly<Record<string, never>>;
export type RandomMorseCodePunctuationOutput = { readonly value: string };

const source = { values: [".:·−·−·−", ",:−−··−−", "::−−−···", "?:··−−··", "':·−−−−·", "-:−····−", "/:−··−·", "(:−·−−·", "):−·−−·−", "=:−···−", "+:·−·−·", "@:·−−·−·"] } as const;

export const randomMorseCodePunctuationValueCount = 12;

export const calculateRandomMorseCodePunctuation = (
  random: RandomSource = Math.random,
): RandomMorseCodePunctuationOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMorseCodePunctuationExample = { input: {} } satisfies ToolExample<
  RandomMorseCodePunctuationInput,
  RandomMorseCodePunctuationOutput
>;

export const randomMorseCodePunctuationTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMorseCodePunctuation(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one punctuation mark with its International Morse code sequence from ITU-R M.1677-1 using injected randomness.",
  id: "random/morse-code-punctuation",
  inputs: [],
  outputs: [
    {
      format: "random/morse-code-punctuation",
      id: "value",
      kind: "string",
      label: "Random Morse Code Punctuation",
    },
  ],
  title: "Random Morse Code Punctuation Generator",
});

export const runRandomMorseCodePunctuation = randomMorseCodePunctuationTool.execute;
export default randomMorseCodePunctuationTool;
