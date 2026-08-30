// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGothicLetterInput = Readonly<Record<string, never>>;
export type RandomGothicLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10330, 0x10340],
    [0x10342, 0x10349],
  ],
} as const;

export const randomGothicLetterValueCount = 25;

export const calculateRandomGothicLetter = (
  random: RandomSource = Math.random,
): RandomGothicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGothicLetterExample = {
  input: {},
} satisfies ToolExample<RandomGothicLetterInput, RandomGothicLetterOutput>;

export const randomGothicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGothicLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Gothic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/gothic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/gothic-letter",
      id: "value",
      kind: "string",
      label: "Random Gothic Letter",
    },
  ],
  title: "Random Gothic Letter Generator",
});

export const runRandomGothicLetter = randomGothicLetterTool.execute;
export default randomGothicLetterTool;
