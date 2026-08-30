// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomVithkuqiLetterInput = Readonly<Record<string, never>>;
export type RandomVithkuqiLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10570, 0x1057a],
    [0x1057c, 0x1058a],
    [0x1058c, 0x10592],
    [0x10594, 0x10595],
    [0x10597, 0x105a1],
    [0x105a3, 0x105b1],
    [0x105b3, 0x105b9],
    [0x105bb, 0x105bc],
  ],
} as const;

export const randomVithkuqiLetterValueCount = 70;

export const calculateRandomVithkuqiLetter = (
  random: RandomSource = Math.random,
): RandomVithkuqiLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomVithkuqiLetterExample = {
  input: {},
} satisfies ToolExample<RandomVithkuqiLetterInput, RandomVithkuqiLetterOutput>;

export const randomVithkuqiLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomVithkuqiLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Vithkuqi Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/vithkuqi-letter",
  inputs: [],
  outputs: [
    {
      format: "random/vithkuqi-letter",
      id: "value",
      kind: "string",
      label: "Random Vithkuqi Letter",
    },
  ],
  title: "Random Vithkuqi Letter Generator",
});

export const runRandomVithkuqiLetter = randomVithkuqiLetterTool.execute;
export default randomVithkuqiLetterTool;
