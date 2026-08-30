// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAnatolianHieroglyphInput = Readonly<Record<string, never>>;
export type RandomAnatolianHieroglyphOutput = { readonly value: string };

const source = { ranges: [[0x14400, 0x14646]] } as const;

export const randomAnatolianHieroglyphValueCount = 583;

export const calculateRandomAnatolianHieroglyph = (
  random: RandomSource = Math.random,
): RandomAnatolianHieroglyphOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAnatolianHieroglyphExample = {
  input: {},
} satisfies ToolExample<
  RandomAnatolianHieroglyphInput,
  RandomAnatolianHieroglyphOutput
>;

export const randomAnatolianHieroglyphTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAnatolianHieroglyph(
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
    "Choose one assigned Unicode 18.0 Anatolian Hieroglyph using injected randomness.",
  id: "random/anatolian-hieroglyph",
  inputs: [],
  outputs: [
    {
      format: "random/anatolian-hieroglyph",
      id: "value",
      kind: "string",
      label: "Random Anatolian Hieroglyph",
    },
  ],
  title: "Random Anatolian Hieroglyph Generator",
});

export const runRandomAnatolianHieroglyph =
  randomAnatolianHieroglyphTool.execute;
export default randomAnatolianHieroglyphTool;
