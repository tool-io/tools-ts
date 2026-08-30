// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUgariticLetterInput = Readonly<Record<string, never>>;
export type RandomUgariticLetterOutput = { readonly value: string };

const source = { ranges: [[0x10380, 0x1039d]] } as const;

export const randomUgariticLetterValueCount = 30;

export const calculateRandomUgariticLetter = (
  random: RandomSource = Math.random,
): RandomUgariticLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUgariticLetterExample = {
  input: {},
} satisfies ToolExample<RandomUgariticLetterInput, RandomUgariticLetterOutput>;

export const randomUgariticLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUgariticLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Ugaritic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/ugaritic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/ugaritic-letter",
      id: "value",
      kind: "string",
      label: "Random Ugaritic Letter",
    },
  ],
  title: "Random Ugaritic Letter Generator",
});

export const runRandomUgariticLetter = randomUgariticLetterTool.execute;
export default randomUgariticLetterTool;
