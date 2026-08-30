// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomDarkPaletteInput = { readonly count: number };
export type RandomDarkPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomDarkPalette = (input: RandomDarkPaletteInput, random: RandomSource = Math.random): RandomDarkPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [-30, 330], lightness: [12, 35], saturation: [35, 85] }, random);
export const randomDarkPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomDarkPaletteInput, RandomDarkPaletteOutput>;
export const randomDarkPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomDarkPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/dark-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Dark Palette Generator",
});
export const runRandomDarkPalette = randomDarkPaletteTool.execute;
export default randomDarkPaletteTool;
