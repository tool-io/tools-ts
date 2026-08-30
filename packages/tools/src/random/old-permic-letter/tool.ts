// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldPermicLetterInput = Readonly<Record<string, never>>;
export type RandomOldPermicLetterOutput = { readonly value: string };

const source = { ranges: [[0x10350, 0x10375]] } as const;

export const randomOldPermicLetterValueCount = 38;

export const calculateRandomOldPermicLetter = (
  random: RandomSource = Math.random,
): RandomOldPermicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldPermicLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldPermicLetterInput,
  RandomOldPermicLetterOutput
>;

export const randomOldPermicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldPermicLetter(
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
    "Choose one assigned Unicode 18.0 Old Permic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/old-permic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/old-permic-letter",
      id: "value",
      kind: "string",
      label: "Random Old Permic Letter",
    },
  ],
  title: "Random Old Permic Letter Generator",
});

export const runRandomOldPermicLetter = randomOldPermicLetterTool.execute;
export default randomOldPermicLetterTool;
