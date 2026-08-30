// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldUyghurLetterInput = Readonly<Record<string, never>>;
export type RandomOldUyghurLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x10f70, 0x10f81],
  ],
} as const;

export const randomOldUyghurLetterValueCount = 19;

export const calculateRandomOldUyghurLetter = (
  random: RandomSource = Math.random,
): RandomOldUyghurLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldUyghurLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldUyghurLetterInput,
  RandomOldUyghurLetterOutput
>;

export const randomOldUyghurLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldUyghurLetter(
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
    "Choose one assigned Unicode 18.0 Old Uyghur Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-uyghur-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-uyghur-letter",
      id: "value",
      kind: "string",
      label: "Random Old Uyghur Letter",
    },
  ],
  title: "Random Old Uyghur Letter Generator",
});

export const runRandomOldUyghurLetter = randomOldUyghurLetterTool.execute;
export default randomOldUyghurLetterTool;
