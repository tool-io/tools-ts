// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPalmyreneLetterInput = Readonly<Record<string, never>>;
export type RandomPalmyreneLetterOutput = { readonly value: string };

const source = { ranges: [[0x10860, 0x10876]] } as const;

export const randomPalmyreneLetterValueCount = 23;

export const calculateRandomPalmyreneLetter = (
  random: RandomSource = Math.random,
): RandomPalmyreneLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPalmyreneLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomPalmyreneLetterInput,
  RandomPalmyreneLetterOutput
>;

export const randomPalmyreneLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPalmyreneLetter(
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
    "Choose one assigned Unicode 18.0 Palmyrene Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/palmyrene-letter",
  inputs: [],
  outputs: [
    {
      format: "random/palmyrene-letter",
      id: "value",
      kind: "string",
      label: "Random Palmyrene Letter",
    },
  ],
  title: "Random Palmyrene Letter Generator",
});

export const runRandomPalmyreneLetter = randomPalmyreneLetterTool.execute;
export default randomPalmyreneLetterTool;
