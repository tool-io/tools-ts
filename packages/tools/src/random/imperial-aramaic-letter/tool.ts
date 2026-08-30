// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomImperialAramaicLetterInput = Readonly<Record<string, never>>;
export type RandomImperialAramaicLetterOutput = { readonly value: string };

const source = { ranges: [[0x10840, 0x10855]] } as const;

export const randomImperialAramaicLetterValueCount = 22;

export const calculateRandomImperialAramaicLetter = (
  random: RandomSource = Math.random,
): RandomImperialAramaicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomImperialAramaicLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomImperialAramaicLetterInput,
  RandomImperialAramaicLetterOutput
>;

export const randomImperialAramaicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomImperialAramaicLetter(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Imperial Aramaic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/imperial-aramaic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/imperial-aramaic-letter",
      id: "value",
      kind: "string",
      label: "Random Imperial Aramaic Letter",
    },
  ],
  title: "Random Imperial Aramaic Letter Generator",
});

export const runRandomImperialAramaicLetter =
  randomImperialAramaicLetterTool.execute;
export default randomImperialAramaicLetterTool;
