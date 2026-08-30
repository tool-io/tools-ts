// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomArabicLetterInput = Readonly<Record<string, never>>;
export type RandomArabicLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x620, 0x64a],
    [0x66e, 0x66f],
    [0x671, 0x6d3],
    [0x6d5, 0x6d5],
    [0x6e5, 0x6e6],
    [0x6ee, 0x6ef],
    [0x6fa, 0x6fc],
    [0x6ff, 0x6ff],
    [0x750, 0x77f],
    [0x870, 0x887],
    [0x889, 0x88f],
    [0x8a0, 0x8c9],
    [0xfb50, 0xfbb1],
    [0xfbd3, 0xfd3d],
    [0xfd50, 0xfd8f],
    [0xfd92, 0xfdc7],
    [0xfdf0, 0xfdfb],
    [0xfe70, 0xfe74],
    [0xfe76, 0xfefc],
    [0x10ec2, 0x10ec7],
    [0x10ed9, 0x10eee],
    [0x1ee00, 0x1ee03],
    [0x1ee05, 0x1ee1f],
    [0x1ee21, 0x1ee22],
    [0x1ee24, 0x1ee24],
    [0x1ee27, 0x1ee27],
    [0x1ee29, 0x1ee32],
    [0x1ee34, 0x1ee37],
    [0x1ee39, 0x1ee39],
    [0x1ee3b, 0x1ee3b],
    [0x1ee42, 0x1ee42],
    [0x1ee47, 0x1ee47],
    [0x1ee49, 0x1ee49],
    [0x1ee4b, 0x1ee4b],
    [0x1ee4d, 0x1ee4f],
    [0x1ee51, 0x1ee52],
    [0x1ee54, 0x1ee54],
    [0x1ee57, 0x1ee57],
    [0x1ee59, 0x1ee59],
    [0x1ee5b, 0x1ee5b],
    [0x1ee5d, 0x1ee5d],
    [0x1ee5f, 0x1ee5f],
    [0x1ee61, 0x1ee62],
    [0x1ee64, 0x1ee64],
    [0x1ee67, 0x1ee6a],
    [0x1ee6c, 0x1ee72],
    [0x1ee74, 0x1ee77],
    [0x1ee79, 0x1ee7c],
    [0x1ee7e, 0x1ee7e],
    [0x1ee80, 0x1ee89],
    [0x1ee8b, 0x1ee9b],
    [0x1eea1, 0x1eea3],
    [0x1eea5, 0x1eea9],
    [0x1eeab, 0x1eebb],
  ],
} as const;

export const randomArabicLetterValueCount = 1174;

export const calculateRandomArabicLetter = (
  random: RandomSource = Math.random,
): RandomArabicLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomArabicLetterExample = {
  input: {},
} satisfies ToolExample<RandomArabicLetterInput, RandomArabicLetterOutput>;

export const randomArabicLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomArabicLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Arabic Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/arabic-letter",
  inputs: [],
  outputs: [
    {
      format: "random/arabic-letter",
      id: "value",
      kind: "string",
      label: "Random Arabic Letter",
    },
  ],
  title: "Random Arabic Letter Generator",
});

export const runRandomArabicLetter = randomArabicLetterTool.execute;
export default randomArabicLetterTool;
