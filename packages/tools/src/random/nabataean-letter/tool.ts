// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNabataeanLetterInput = Readonly<Record<string, never>>;
export type RandomNabataeanLetterOutput = { readonly value: string };

const source = { ranges: [[0x10880, 0x1089e]] } as const;

export const randomNabataeanLetterValueCount = 31;

export const calculateRandomNabataeanLetter = (
  random: RandomSource = Math.random,
): RandomNabataeanLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNabataeanLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomNabataeanLetterInput,
  RandomNabataeanLetterOutput
>;

export const randomNabataeanLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNabataeanLetter(
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
    "Choose one assigned Unicode 18.0 Nabataean Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/nabataean-letter",
  inputs: [],
  outputs: [
    {
      format: "random/nabataean-letter",
      id: "value",
      kind: "string",
      label: "Random Nabataean Letter",
    },
  ],
  title: "Random Nabataean Letter Generator",
});

export const runRandomNabataeanLetter = randomNabataeanLetterTool.execute;
export default randomNabataeanLetterTool;
