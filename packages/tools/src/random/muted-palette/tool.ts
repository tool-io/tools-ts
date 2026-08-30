// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomMutedPaletteInput = { readonly count: number };
export type RandomMutedPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomMutedPalette = (input: RandomMutedPaletteInput, random: RandomSource = Math.random): RandomMutedPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [-30, 330], lightness: [40, 68], saturation: [20, 45] }, random);
export const randomMutedPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomMutedPaletteInput, RandomMutedPaletteOutput>;
export const randomMutedPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomMutedPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/muted-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Muted Palette Generator",
});
export const runRandomMutedPalette = randomMutedPaletteTool.execute;
export default randomMutedPaletteTool;
