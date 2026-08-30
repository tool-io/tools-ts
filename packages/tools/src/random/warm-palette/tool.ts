// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomWarmPaletteInput = { readonly count: number };
export type RandomWarmPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomWarmPalette = (input: RandomWarmPaletteInput, random: RandomSource = Math.random): RandomWarmPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [-30, 90], lightness: [38, 68], saturation: [55, 90] }, random);
export const randomWarmPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomWarmPaletteInput, RandomWarmPaletteOutput>;
export const randomWarmPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomWarmPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/warm-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Warm Palette Generator",
});
export const runRandomWarmPalette = randomWarmPaletteTool.execute;
export default randomWarmPaletteTool;
