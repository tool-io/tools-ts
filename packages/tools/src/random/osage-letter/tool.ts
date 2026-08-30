// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOsageLetterInput = Readonly<Record<string, never>>;
export type RandomOsageLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x104b0, 0x104d3],
    [0x104d8, 0x104fb],
  ],
} as const;

export const randomOsageLetterValueCount = 72;

export const calculateRandomOsageLetter = (
  random: RandomSource = Math.random,
): RandomOsageLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOsageLetterExample = {
  input: {},
} satisfies ToolExample<RandomOsageLetterInput, RandomOsageLetterOutput>;

export const randomOsageLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOsageLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Osage Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/osage-letter",
  inputs: [],
  outputs: [
    {
      format: "random/osage-letter",
      id: "value",
      kind: "string",
      label: "Random Osage Letter",
    },
  ],
  title: "Random Osage Letter Generator",
});

export const runRandomOsageLetter = randomOsageLetterTool.execute;
export default randomOsageLetterTool;
