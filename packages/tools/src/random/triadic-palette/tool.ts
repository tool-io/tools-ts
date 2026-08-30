// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomTriadicPaletteInput = { readonly count: number };
export type RandomTriadicPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomTriadicPalette = (input: RandomTriadicPaletteInput, random: RandomSource = Math.random): RandomTriadicPaletteOutput | null =>
  calculateHarmonyPalette(input.count, [0, 120, 240], random);
export const randomTriadicPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomTriadicPaletteInput, RandomTriadicPaletteOutput>;
export const randomTriadicPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomTriadicPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using the named hue harmony with derived lightness steps and injected randomness.",
  id: "random/triadic-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Triadic Palette Generator",
});
export const runRandomTriadicPalette = randomTriadicPaletteTool.execute;
export default randomTriadicPaletteTool;
