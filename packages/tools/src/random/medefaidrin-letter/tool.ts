// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMedefaidrinLetterInput = Readonly<Record<string, never>>;
export type RandomMedefaidrinLetterOutput = { readonly value: string };

const source = { ranges: [[0x16e40, 0x16e7f]] } as const;

export const randomMedefaidrinLetterValueCount = 64;

export const calculateRandomMedefaidrinLetter = (
  random: RandomSource = Math.random,
): RandomMedefaidrinLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMedefaidrinLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomMedefaidrinLetterInput,
  RandomMedefaidrinLetterOutput
>;

export const randomMedefaidrinLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMedefaidrinLetter(
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
    "Choose one assigned Unicode 18.0 Medefaidrin Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/medefaidrin-letter",
  inputs: [],
  outputs: [
    {
      format: "random/medefaidrin-letter",
      id: "value",
      kind: "string",
      label: "Random Medefaidrin Letter",
    },
  ],
  title: "Random Medefaidrin Letter Generator",
});

export const runRandomMedefaidrinLetter = randomMedefaidrinLetterTool.execute;
export default randomMedefaidrinLetterTool;
