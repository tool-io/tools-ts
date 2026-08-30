// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomEvenlySpacedHuePaletteInput = { readonly count: number };
export type RandomEvenlySpacedHuePaletteOutput = RandomColorPaletteOutput;
export const calculateRandomEvenlySpacedHuePalette = (input: RandomEvenlySpacedHuePaletteInput, random: RandomSource = Math.random): RandomEvenlySpacedHuePaletteOutput | null =>
  calculateHarmonyPalette(input.count, Array.from({ length: input.count }, (_, index) => (360 * index) / input.count), random);
export const randomEvenlySpacedHuePaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomEvenlySpacedHuePaletteInput, RandomEvenlySpacedHuePaletteOutput>;
export const randomEvenlySpacedHuePaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomEvenlySpacedHuePalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using one random anchor and evenly spaced hue offsets and injected randomness.",
  id: "random/evenly-spaced-hue-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Evenly Spaced Hue Palette Generator",
});
export const runRandomEvenlySpacedHuePalette = randomEvenlySpacedHuePaletteTool.execute;
export default randomEvenlySpacedHuePaletteTool;
