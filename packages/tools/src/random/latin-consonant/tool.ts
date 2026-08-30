// Repertoire source: https://www.unicode.org/charts/PDF/U0000.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLatinConsonantInput = Readonly<Record<string, never>>;
export type RandomLatinConsonantOutput = { readonly value: string };

const source = { values: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"] } as const;

export const randomLatinConsonantValueCount = 42;

export const calculateRandomLatinConsonant = (
  random: RandomSource = Math.random,
): RandomLatinConsonantOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLatinConsonantExample = { input: {} } satisfies ToolExample<
  RandomLatinConsonantInput,
  RandomLatinConsonantOutput
>;

export const randomLatinConsonantTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLatinConsonant(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one unaccented English Latin consonant in uppercase or lowercase using injected randomness; Y is included.",
  id: "random/latin-consonant",
  inputs: [],
  outputs: [
    {
      format: "random/latin-consonant",
      id: "value",
      kind: "string",
      label: "Random Latin Consonant",
    },
  ],
  title: "Random Latin Consonant Generator",
});

export const runRandomLatinConsonant = randomLatinConsonantTool.execute;
export default randomLatinConsonantTool;
