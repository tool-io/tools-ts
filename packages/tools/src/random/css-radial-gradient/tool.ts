// Gradient syntax source: https://www.w3.org/TR/css-images-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
import { calculateRandomColorPalette } from "../color-palette/tool.js";
export type RandomCssRadialGradientInput = { readonly count: number }; export type RandomCssRadialGradientOutput = { readonly colors: readonly string[]; readonly css: string };
export const calculateRandomCssRadialGradient = (input: RandomCssRadialGradientInput, random: RandomSource = Math.random): RandomCssRadialGradientOutput | null => {
  const palette = calculateRandomColorPalette(input, random); const angleSample = sampleRandomSource(random); if (palette === null || angleSample === null) return null;
  const colors = palette.colors; const angle = Math.floor(angleSample * 360); const stops = colors.map((color, index) => `${color} ${Math.round((100 * index) / (colors.length - 1))}%`).join(", ");
  return { colors, css: `radial-gradient(circle, ${stops})` };
};
export const randomCssRadialGradientExample = { input: { count: 4 } } satisfies ToolExample<RandomCssRadialGradientInput, RandomCssRadialGradientOutput>;
export const randomCssRadialGradientTool = createSimpleTool({ calculate: (input, context) => { const output = calculateRandomCssRadialGradient({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 12 and randomness must be valid.", "invalid_pattern_request"); return output; }, description: "Generate portable CSS for a random css radial gradient with an explicit color count and injected randomness.", id: "random/css-radial-gradient", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 12, minimum: 2 }], outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }, { format: "text/css", id: "css", kind: "string", label: "CSS" }], title: "Random CSS Radial Gradient Generator" });
export const runRandomCssRadialGradient = randomCssRadialGradientTool.execute; export default randomCssRadialGradientTool;
