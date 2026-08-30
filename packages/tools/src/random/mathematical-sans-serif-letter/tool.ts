// Repertoire source: https://www.unicode.org/charts/PDF/U1D400.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMathematicalSansSerifLetterInput = Readonly<Record<string, never>>;
export type RandomMathematicalSansSerifLetterOutput = { readonly value: string };

const source = { ranges: [[0x1d5a0, 0x1d66f]] } as const;

export const randomMathematicalSansSerifLetterValueCount = 208;

export const calculateRandomMathematicalSansSerifLetter = (
  random: RandomSource = Math.random,
): RandomMathematicalSansSerifLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMathematicalSansSerifLetterExample = { input: {} } satisfies ToolExample<
  RandomMathematicalSansSerifLetterInput,
  RandomMathematicalSansSerifLetterOutput
>;

export const randomMathematicalSansSerifLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMathematicalSansSerifLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one mathematical sans-serif Latin letter from the regular, bold, italic, or bold-italic Unicode styles using injected randomness.",
  id: "random/mathematical-sans-serif-letter",
  inputs: [],
  outputs: [
    {
      format: "random/mathematical-sans-serif-letter",
      id: "value",
      kind: "string",
      label: "Random Mathematical Sans-Serif Letter",
    },
  ],
  title: "Random Mathematical Sans-Serif Letter Generator",
});

export const runRandomMathematicalSansSerifLetter = randomMathematicalSansSerifLetterTool.execute;
export default randomMathematicalSansSerifLetterTool;
