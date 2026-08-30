// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCypriotSyllableInput = Readonly<Record<string, never>>;
export type RandomCypriotSyllableOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10800, 0x10805],
    [0x10808, 0x10808],
    [0x1080a, 0x10835],
    [0x10837, 0x10838],
    [0x1083c, 0x1083c],
    [0x1083f, 0x1083f],
  ],
} as const;

export const randomCypriotSyllableValueCount = 55;

export const calculateRandomCypriotSyllable = (
  random: RandomSource = Math.random,
): RandomCypriotSyllableOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCypriotSyllableExample = {
  input: {},
} satisfies ToolExample<
  RandomCypriotSyllableInput,
  RandomCypriotSyllableOutput
>;

export const randomCypriotSyllableTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCypriotSyllable(
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
    "Choose one assigned Unicode 18.0 Cypriot Syllable using injected randomness.",
  id: "random/cypriot-syllable",
  inputs: [],
  outputs: [
    {
      format: "random/cypriot-syllable",
      id: "value",
      kind: "string",
      label: "Random Cypriot Syllable",
    },
  ],
  title: "Random Cypriot Syllable Generator",
});

export const runRandomCypriotSyllable = randomCypriotSyllableTool.execute;
export default randomCypriotSyllableTool;
