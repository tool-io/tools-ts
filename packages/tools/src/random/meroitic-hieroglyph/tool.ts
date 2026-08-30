// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMeroiticHieroglyphInput = Readonly<Record<string, never>>;
export type RandomMeroiticHieroglyphOutput = { readonly value: string };

const source = { ranges: [[0x10980, 0x1099f]] } as const;

export const randomMeroiticHieroglyphValueCount = 32;

export const calculateRandomMeroiticHieroglyph = (
  random: RandomSource = Math.random,
): RandomMeroiticHieroglyphOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMeroiticHieroglyphExample = {
  input: {},
} satisfies ToolExample<
  RandomMeroiticHieroglyphInput,
  RandomMeroiticHieroglyphOutput
>;

export const randomMeroiticHieroglyphTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMeroiticHieroglyph(
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
    "Choose one assigned Unicode 18.0 Meroitic Hieroglyph using injected randomness.",
  id: "random/meroitic-hieroglyph",
  inputs: [],
  outputs: [
    {
      format: "random/meroitic-hieroglyph",
      id: "value",
      kind: "string",
      label: "Random Meroitic Hieroglyph",
    },
  ],
  title: "Random Meroitic Hieroglyph Generator",
});

export const runRandomMeroiticHieroglyph = randomMeroiticHieroglyphTool.execute;
export default randomMeroiticHieroglyphTool;
