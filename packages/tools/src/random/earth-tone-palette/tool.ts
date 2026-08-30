// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomEarthTonePaletteInput = { readonly count: number };
export type RandomEarthTonePaletteOutput = RandomColorPaletteOutput;
export const calculateRandomEarthTonePalette = (input: RandomEarthTonePaletteInput, random: RandomSource = Math.random): RandomEarthTonePaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [15, 85], lightness: [25, 62], saturation: [25, 65] }, random);
export const randomEarthTonePaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomEarthTonePaletteInput, RandomEarthTonePaletteOutput>;
export const randomEarthTonePaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomEarthTonePalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/earth-tone-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Earth Tone Palette Generator",
});
export const runRandomEarthTonePalette = randomEarthTonePaletteTool.execute;
export default randomEarthTonePaletteTool;
