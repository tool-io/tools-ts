// Repertoire source: https://www.itu.int/rec/R-REC-M.1677-1-200910-I/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMorseCodeDigitInput = Readonly<Record<string, never>>;
export type RandomMorseCodeDigitOutput = { readonly value: string };

const source = { values: ["0:−−−−−", "1:·−−−−", "2:··−−−", "3:···−−", "4:····−", "5:·····", "6:−····", "7:−−···", "8:−−−··", "9:−−−−·"] } as const;

export const randomMorseCodeDigitValueCount = 10;

export const calculateRandomMorseCodeDigit = (
  random: RandomSource = Math.random,
): RandomMorseCodeDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMorseCodeDigitExample = { input: {} } satisfies ToolExample<
  RandomMorseCodeDigitInput,
  RandomMorseCodeDigitOutput
>;

export const randomMorseCodeDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMorseCodeDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one decimal digit with its International Morse code sequence using injected randomness.",
  id: "random/morse-code-digit",
  inputs: [],
  outputs: [
    {
      format: "random/morse-code-digit",
      id: "value",
      kind: "string",
      label: "Random Morse Code Digit",
    },
  ],
  title: "Random Morse Code Digit Generator",
});

export const runRandomMorseCodeDigit = randomMorseCodeDigitTool.execute;
export default randomMorseCodeDigitTool;
