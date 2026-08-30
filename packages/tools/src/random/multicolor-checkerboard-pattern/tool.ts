// Gradient syntax source: https://www.w3.org/TR/css-images-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
import { calculateRandomColorPalette } from "../color-palette/tool.js";
export type RandomMulticolorCheckerboardPatternInput = { readonly count: number }; export type RandomMulticolorCheckerboardPatternOutput = { readonly colors: readonly string[]; readonly css: string };
export const calculateRandomMulticolorCheckerboardPattern = (input: RandomMulticolorCheckerboardPatternInput, random: RandomSource = Math.random): RandomMulticolorCheckerboardPatternOutput | null => {
  const palette = calculateRandomColorPalette(input, random); const angleSample = sampleRandomSource(random); if (palette === null || angleSample === null) return null;
  const colors = palette.colors; const angle = Math.floor(angleSample * 360); const stops = colors.map((color, index) => `${color} ${Math.round((100 * index) / (colors.length - 1))}%`).join(", ");
  return { colors, css: `conic-gradient(${colors[0]} 25%, ${colors[1]} 0 50%, ${colors[0]} 0 75%, ${colors[1]} 0) 0 0 / 24px 24px` };
};
export const randomMulticolorCheckerboardPatternExample = { input: { count: 4 } } satisfies ToolExample<RandomMulticolorCheckerboardPatternInput, RandomMulticolorCheckerboardPatternOutput>;
export const randomMulticolorCheckerboardPatternTool = createSimpleTool({ calculate: (input, context) => { const output = calculateRandomMulticolorCheckerboardPattern({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 12 and randomness must be valid.", "invalid_pattern_request"); return output; }, description: "Generate portable CSS for a random multicolor checkerboard pattern with an explicit color count and injected randomness.", id: "random/multicolor-checkerboard-pattern", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 12, minimum: 2 }], outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }, { format: "text/css", id: "css", kind: "string", label: "CSS" }], title: "Random Multicolor Checkerboard Pattern Generator" });
export const runRandomMulticolorCheckerboardPattern = randomMulticolorCheckerboardPatternTool.execute; export default randomMulticolorCheckerboardPatternTool;
