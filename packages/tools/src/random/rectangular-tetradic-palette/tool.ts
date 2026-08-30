// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomRectangularTetradicPaletteInput = { readonly count: number };
export type RandomRectangularTetradicPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomRectangularTetradicPalette = (input: RandomRectangularTetradicPaletteInput, random: RandomSource = Math.random): RandomRectangularTetradicPaletteOutput | null =>
  calculateHarmonyPalette(input.count, [0, 60, 180, 240], random);
export const randomRectangularTetradicPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomRectangularTetradicPaletteInput, RandomRectangularTetradicPaletteOutput>;
export const randomRectangularTetradicPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomRectangularTetradicPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using the named hue harmony with derived lightness steps and injected randomness.",
  id: "random/rectangular-tetradic-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Rectangular Tetradic Palette Generator",
});
export const runRandomRectangularTetradicPalette = randomRectangularTetradicPaletteTool.execute;
export default randomRectangularTetradicPaletteTool;
