// Named color source: https://www.w3.org/TR/css-color-4/#named-colors
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateRandomCssNamedColor } from "../css-named-color/tool.js";
export type RandomCssNamedColorPaletteInput = { readonly count: number };
export type RandomCssNamedColorPaletteOutput = { readonly colors: readonly string[] };
export const calculateRandomCssNamedColorPalette = (input: RandomCssNamedColorPaletteInput, random: RandomSource = Math.random): RandomCssNamedColorPaletteOutput | null => {
  if (!Number.isSafeInteger(input.count) || input.count < 2 || input.count > 32) return null;
  const colors: string[] = [];
  for (let index = 0; index < input.count; index += 1) { const selected = calculateRandomCssNamedColor(random); if (selected === null) return null; colors.push(selected.value); }
  return { colors };
};
export const randomCssNamedColorPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomCssNamedColorPaletteInput, RandomCssNamedColorPaletteOutput>;
export const randomCssNamedColorPaletteTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomCssNamedColorPalette({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request"); return output; },
  description: "Select 2 through 32 CSS named color keywords with replacement using injected randomness.",
  id: "random/css-named-color-palette", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/css-name-list", id: "colors", kind: "stringList", label: "Colors" }], title: "Random CSS Named Color Palette Generator",
});
export const runRandomCssNamedColorPalette = randomCssNamedColorPaletteTool.execute;
export default randomCssNamedColorPaletteTool;
