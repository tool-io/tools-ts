// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomLightPaletteInput = { readonly count: number };
export type RandomLightPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomLightPalette = (input: RandomLightPaletteInput, random: RandomSource = Math.random): RandomLightPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [-30, 330], lightness: [72, 92], saturation: [25, 75] }, random);
export const randomLightPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomLightPaletteInput, RandomLightPaletteOutput>;
export const randomLightPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomLightPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/light-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Light Palette Generator",
});
export const runRandomLightPalette = randomLightPaletteTool.execute;
export default randomLightPaletteTool;
