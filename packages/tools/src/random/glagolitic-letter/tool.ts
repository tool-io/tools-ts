// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGlagoliticLetterInput = Readonly<Record<string, never>>;
export type RandomGlagoliticLetterOutput = { readonly value: string };

const source = { ranges: [[0x2c00, 0x2c5f]] } as const;

export const randomGlagoliticLetterValueCount = 96;

export const calculateRandomGlagoliticLetter = (
  random: RandomSource = Math.random,
): RandomGlagoliticLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGlagoliticLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomGlagoliticLetterInput,
  RandomGlagoliticLetterOutput
>;

export const randomGlagoliticLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGlagoliticLetter(
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
    "Choose one assigned Unicode 18.0 Glagolitic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/glagolitic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/glagolitic-letter",
      id: "value",
      kind: "string",
      label: "Random Glagolitic Letter",
    },
  ],
  title: "Random Glagolitic Letter Generator",
});

export const runRandomGlagoliticLetter = randomGlagoliticLetterTool.execute;
export default randomGlagoliticLetterTool;
