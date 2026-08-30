// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateHarmonyPalette, calculateStyledPalette, type RandomColorPaletteOutput } from "../color-palette/tool.js";

export type RandomAnalogousPaletteInput = { readonly count: number };
export type RandomAnalogousPaletteOutput = RandomColorPaletteOutput;
export const calculateRandomAnalogousPalette = (input: RandomAnalogousPaletteInput, random: RandomSource = Math.random): RandomAnalogousPaletteOutput | null =>
  calculateHarmonyPalette(input.count, [-30, 0, 30], random);
export const randomAnalogousPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomAnalogousPaletteInput, RandomAnalogousPaletteOutput>;
export const randomAnalogousPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomAnalogousPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 sRGB hex colors using the named hue harmony with derived lightness steps and injected randomness.",
  id: "random/analogous-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Analogous Palette Generator",
});
export const runRandomAnalogousPalette = randomAnalogousPaletteTool.execute;
export default randomAnalogousPaletteTool;
