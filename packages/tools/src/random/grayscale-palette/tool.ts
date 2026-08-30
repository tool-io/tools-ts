// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomGrayscalePaletteInput = { readonly count: number };
export type RandomGrayscalePaletteOutput = RandomColorPaletteOutput;
export const calculateRandomGrayscalePalette = (input: RandomGrayscalePaletteInput, random: RandomSource = Math.random): RandomGrayscalePaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [0, 0], lightness: [5, 95], saturation: [0, 0] }, random);
export const randomGrayscalePaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomGrayscalePaletteInput, RandomGrayscalePaletteOutput>;
export const randomGrayscalePaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomGrayscalePalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using zero saturation and bounded lightness and injected randomness.",
  id: "random/grayscale-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Grayscale Palette Generator",
});
export const runRandomGrayscalePalette = randomGrayscalePaletteTool.execute;
export default randomGrayscalePaletteTool;
