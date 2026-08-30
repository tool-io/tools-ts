// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomCoolPaletteInput = { readonly count: number };
export type RandomCoolPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomCoolPalette = (input: RandomCoolPaletteInput, random: RandomSource = Math.random): RandomCoolPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [150, 300], lightness: [35, 70], saturation: [45, 85] }, random);
export const randomCoolPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomCoolPaletteInput, RandomCoolPaletteOutput>;
export const randomCoolPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomCoolPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using bounded HSL style ranges and injected randomness.",
  id: "random/cool-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Cool Palette Generator",
});
export const runRandomCoolPalette = randomCoolPaletteTool.execute;
export default randomCoolPaletteTool;
