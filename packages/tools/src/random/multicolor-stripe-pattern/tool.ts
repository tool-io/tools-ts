// Gradient syntax source: https://www.w3.org/TR/css-images-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
import { calculateRandomColorPalette } from "../color-palette/tool.js";
export type RandomMulticolorStripePatternInput = { readonly count: number }; export type RandomMulticolorStripePatternOutput = { readonly colors: readonly string[]; readonly css: string };
export const calculateRandomMulticolorStripePattern = (input: RandomMulticolorStripePatternInput, random: RandomSource = Math.random): RandomMulticolorStripePatternOutput | null => {
  const palette = calculateRandomColorPalette(input, random); const angleSample = sampleRandomSource(random); if (palette === null || angleSample === null) return null;
  const colors = palette.colors; const angle = Math.floor(angleSample * 360); const stops = colors.map((color, index) => `${color} ${Math.round((100 * index) / (colors.length - 1))}%`).join(", ");
  return { colors, css: `repeating-linear-gradient(${angle}deg, ${colors.map((color, index) => `${color} ${index * 12}px ${(index + 1) * 12}px`).join(", ")})` };
};
export const randomMulticolorStripePatternExample = { input: { count: 4 } } satisfies ToolExample<RandomMulticolorStripePatternInput, RandomMulticolorStripePatternOutput>;
export const randomMulticolorStripePatternTool = createSimpleTool({ calculate: (input, context) => { const output = calculateRandomMulticolorStripePattern({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 12 and randomness must be valid.", "invalid_pattern_request"); return output; }, description: "Generate portable CSS for a random multicolor stripe pattern with an explicit color count and injected randomness.", id: "random/multicolor-stripe-pattern", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 12, minimum: 2 }], outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }, { format: "text/css", id: "css", kind: "string", label: "CSS" }], title: "Random Multicolor Stripe Pattern Generator" });
export const runRandomMulticolorStripePattern = randomMulticolorStripePatternTool.execute; export default randomMulticolorStripePatternTool;
