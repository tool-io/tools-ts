// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGreekLetterInput = Readonly<Record<string, never>>;
export type RandomGreekLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x370, 0x374],
    [0x376, 0x377],
    [0x37a, 0x37d],
    [0x37f, 0x37f],
    [0x386, 0x386],
    [0x388, 0x38a],
    [0x38c, 0x38c],
    [0x38e, 0x3a1],
    [0x3a3, 0x3e1],
    [0x3f0, 0x3f5],
    [0x3f7, 0x3ff],
    [0x1d26, 0x1d2a],
    [0x1d5d, 0x1d61],
    [0x1d66, 0x1d6a],
    [0x1dbf, 0x1dbf],
    [0x1f00, 0x1f15],
    [0x1f18, 0x1f1d],
    [0x1f20, 0x1f45],
    [0x1f48, 0x1f4d],
    [0x1f50, 0x1f57],
    [0x1f59, 0x1f59],
    [0x1f5b, 0x1f5b],
    [0x1f5d, 0x1f5d],
    [0x1f5f, 0x1f7d],
    [0x1f80, 0x1fb4],
    [0x1fb6, 0x1fbc],
    [0x1fbe, 0x1fbe],
    [0x1fc2, 0x1fc4],
    [0x1fc6, 0x1fcc],
    [0x1fd0, 0x1fd3],
    [0x1fd6, 0x1fdb],
    [0x1fe0, 0x1fec],
    [0x1ff2, 0x1ff4],
    [0x1ff6, 0x1ffc],
    [0x2126, 0x2126],
    [0xab65, 0xab65],
    [0x1dff3, 0x1dff4],
  ],
} as const;

export const randomGreekLetterValueCount = 353;

export const calculateRandomGreekLetter = (
  random: RandomSource = Math.random,
): RandomGreekLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGreekLetterExample = {
  input: {},
} satisfies ToolExample<RandomGreekLetterInput, RandomGreekLetterOutput>;

export const randomGreekLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGreekLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Greek Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/greek-letter",
  inputs: [],
  outputs: [
    {
      format: "random/greek-letter",
      id: "value",
      kind: "string",
      label: "Random Greek Letter",
    },
  ],
  title: "Random Greek Letter Generator",
});

export const runRandomGreekLetter = randomGreekLetterTool.execute;
export default randomGreekLetterTool;
