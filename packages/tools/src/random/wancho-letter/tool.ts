// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomWanchoLetterInput = Readonly<Record<string, never>>;
export type RandomWanchoLetterOutput = { readonly value: string };

const source = { ranges: [[0x1e2c0, 0x1e2eb]] } as const;

export const randomWanchoLetterValueCount = 44;

export const calculateRandomWanchoLetter = (
  random: RandomSource = Math.random,
): RandomWanchoLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomWanchoLetterExample = {
  input: {},
} satisfies ToolExample<RandomWanchoLetterInput, RandomWanchoLetterOutput>;

export const randomWanchoLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomWanchoLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned Unicode 18.0 Wancho Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/wancho-letter",
  inputs: [],
  outputs: [
    {
      format: "random/wancho-letter",
      id: "value",
      kind: "string",
      label: "Random Wancho Letter",
    },
  ],
  title: "Random Wancho Letter Generator",
});

export const runRandomWanchoLetter = randomWanchoLetterTool.execute;
export default randomWanchoLetterTool;
