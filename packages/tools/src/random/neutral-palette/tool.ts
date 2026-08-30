// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomNeutralPaletteInput = { readonly count: number };
export type RandomNeutralPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomNeutralPalette = (input: RandomNeutralPaletteInput, random: RandomSource = Math.random): RandomNeutralPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [-30, 330], lightness: [25, 85], saturation: [0, 12] }, random);
export const randomNeutralPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomNeutralPaletteInput, RandomNeutralPaletteOutput>;
export const randomNeutralPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomNeutralPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/neutral-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Neutral Palette Generator",
});
export const runRandomNeutralPalette = randomNeutralPaletteTool.execute;
export default randomNeutralPaletteTool;
