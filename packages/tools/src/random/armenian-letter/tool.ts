// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomArmenianLetterInput = Readonly<Record<string, never>>;
export type RandomArmenianLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x531, 0x556],
    [0x558, 0x559],
    [0x560, 0x588],
    [0x58b, 0x58c],
    [0xfb13, 0xfb17],
  ],
} as const;

export const randomArmenianLetterValueCount = 88;

export const calculateRandomArmenianLetter = (
  random: RandomSource = Math.random,
): RandomArmenianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomArmenianLetterExample = {
  input: {},
} satisfies ToolExample<RandomArmenianLetterInput, RandomArmenianLetterOutput>;

export const randomArmenianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomArmenianLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Armenian Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/armenian-letter",
  inputs: [],
  outputs: [
    {
      format: "random/armenian-letter",
      id: "value",
      kind: "string",
      label: "Random Armenian Letter",
    },
  ],
  title: "Random Armenian Letter Generator",
});

export const runRandomArmenianLetter = randomArmenianLetterTool.execute;
export default randomArmenianLetterTool;
