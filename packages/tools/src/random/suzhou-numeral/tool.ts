// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSuzhouNumeralInput = Readonly<Record<string, never>>;
export type RandomSuzhouNumeralOutput = { readonly value: string };

const source = { ranges: [[0x3021, 0x3029], [0x3038, 0x303a]] } as const;

export const randomSuzhouNumeralValueCount = 12;

export const calculateRandomSuzhouNumeral = (
  random: RandomSource = Math.random,
): RandomSuzhouNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSuzhouNumeralExample = { input: {} } satisfies ToolExample<
  RandomSuzhouNumeralInput,
  RandomSuzhouNumeralOutput
>;

export const randomSuzhouNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSuzhouNumeral(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode Suzhou numeral character from the Hangzhou numeral one-through-nine and ten, twenty, and thirty repertoire using injected randomness.",
  id: "random/suzhou-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/suzhou-numeral",
      id: "value",
      kind: "string",
      label: "Random Suzhou Numeral",
    },
  ],
  title: "Random Suzhou Numeral Generator",
});

export const runRandomSuzhouNumeral = randomSuzhouNumeralTool.execute;
export default randomSuzhouNumeralTool;
