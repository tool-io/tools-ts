// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomSplitComplementaryPaletteInput = { readonly count: number };
export type RandomSplitComplementaryPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomSplitComplementaryPalette = (input: RandomSplitComplementaryPaletteInput, random: RandomSource = Math.random): RandomSplitComplementaryPaletteOutput | null =>
  calculateHarmonyPalette(input.count, [0, 150, 210], random);
export const randomSplitComplementaryPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomSplitComplementaryPaletteInput, RandomSplitComplementaryPaletteOutput>;
export const randomSplitComplementaryPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomSplitComplementaryPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using the named hue harmony with derived lightness steps and injected randomness.",
  id: "random/split-complementary-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Split-Complementary Palette Generator",
});
export const runRandomSplitComplementaryPalette = randomSplitComplementaryPaletteTool.execute;
export default randomSplitComplementaryPaletteTool;
