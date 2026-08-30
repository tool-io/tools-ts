// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomMonochromaticPaletteInput = { readonly count: number };
export type RandomMonochromaticPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomMonochromaticPalette = (input: RandomMonochromaticPaletteInput, random: RandomSource = Math.random): RandomMonochromaticPaletteOutput | null =>
  calculateHarmonyPalette(input.count, [0], random);
export const randomMonochromaticPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomMonochromaticPaletteInput, RandomMonochromaticPaletteOutput>;
export const randomMonochromaticPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomMonochromaticPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using one random anchor hue with derived lightness steps and injected randomness.",
  id: "random/monochromatic-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Monochromatic Palette Generator",
});
export const runRandomMonochromaticPalette = randomMonochromaticPaletteTool.execute;
export default randomMonochromaticPaletteTool;
