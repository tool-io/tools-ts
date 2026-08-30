// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomEgyptianHieroglyphInput = Readonly<Record<string, never>>;
export type RandomEgyptianHieroglyphOutput = { readonly value: string };

const source = {
  ranges: [
    [0x13000, 0x1342f],
    [0x13441, 0x13446],
    [0x13460, 0x143fa],
  ],
} as const;

export const randomEgyptianHieroglyphValueCount = 5073;

export const calculateRandomEgyptianHieroglyph = (
  random: RandomSource = Math.random,
): RandomEgyptianHieroglyphOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomEgyptianHieroglyphExample = {
  input: {},
} satisfies ToolExample<
  RandomEgyptianHieroglyphInput,
  RandomEgyptianHieroglyphOutput
>;

export const randomEgyptianHieroglyphTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomEgyptianHieroglyph(
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
    "Choose one assigned Unicode 18.0 Egyptian Hieroglyph using injected randomness.",
  id: "random/egyptian-hieroglyph",
  inputs: [],
  outputs: [
    {
      format: "random/egyptian-hieroglyph",
      id: "value",
      kind: "string",
      label: "Random Egyptian Hieroglyph",
    },
  ],
  title: "Random Egyptian Hieroglyph Generator",
});

export const runRandomEgyptianHieroglyph = randomEgyptianHieroglyphTool.execute;
export default randomEgyptianHieroglyphTool;
