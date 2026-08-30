// Repertoire source: https://www.unicode.org/reports/tr44/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomCombiningEnclosureMarkInput = Readonly<Record<string, never>>;
export type RandomCombiningEnclosureMarkOutput = { readonly value: string };

const source = { ranges: [[0x488, 0x489], [0x1abe, 0x1abe], [0x20dd, 0x20e0], [0x20e2, 0x20e4], [0xa670, 0xa672]] } as const;

export const randomCombiningEnclosureMarkValueCount = 13;

export const calculateRandomCombiningEnclosureMark = (
  random: RandomSource = Math.random,
): RandomCombiningEnclosureMarkOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomCombiningEnclosureMarkExample = { input: {} } satisfies ToolExample<
  RandomCombiningEnclosureMarkInput,
  RandomCombiningEnclosureMarkOutput
>;

export const randomCombiningEnclosureMarkTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomCombiningEnclosureMark(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one assigned Unicode combining enclosing mark in the General_Category=Me repertoire using injected randomness.",
  id: "random/combining-enclosure-mark",
  inputs: [],
  outputs: [
    {
      format: "random/combining-enclosure-mark",
      id: "value",
      kind: "string",
      label: "Random Combining Enclosure Mark",
    },
  ],
  title: "Random Combining Enclosure Mark Generator",
});

export const runRandomCombiningEnclosureMark = randomCombiningEnclosureMarkTool.execute;
export default randomCombiningEnclosureMarkTool;
