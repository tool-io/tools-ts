// Gradient syntax source: https://www.w3.org/TR/css-images-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
import { calculateRandomColorPalette } from "../color-palette/tool.js";
export type RandomMulticolorDotPatternInput = { readonly count: number }; export type RandomMulticolorDotPatternOutput = { readonly colors: readonly string[]; readonly css: string };
export const calculateRandomMulticolorDotPattern = (input: RandomMulticolorDotPatternInput, random: RandomSource = Math.random): RandomMulticolorDotPatternOutput | null => {
  const palette = calculateRandomColorPalette(input, random); const angleSample = sampleRandomSource(random); if (palette === null || angleSample === null) return null;
  const colors = palette.colors; const angle = Math.floor(angleSample * 360); const stops = colors.map((color, index) => `${color} ${Math.round((100 * index) / (colors.length - 1))}%`).join(", ");
  return { colors, css: `radial-gradient(circle, ${colors[0]} 0 25%, transparent 26%) 0 0 / 20px 20px ${colors[1]}` };
};
export const randomMulticolorDotPatternExample = { input: { count: 4 } } satisfies ToolExample<RandomMulticolorDotPatternInput, RandomMulticolorDotPatternOutput>;
export const randomMulticolorDotPatternTool = createSimpleTool({ calculate: (input, context) => { const output = calculateRandomMulticolorDotPattern({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 12 and randomness must be valid.", "invalid_pattern_request"); return output; }, description: "Generate portable CSS for a random multicolor dot pattern with an explicit color count and injected randomness.", id: "random/multicolor-dot-pattern", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 12, minimum: 2 }], outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }, { format: "text/css", id: "css", kind: "string", label: "CSS" }], title: "Random Multicolor Dot Pattern Generator" });
export const runRandomMulticolorDotPattern = randomMulticolorDotPatternTool.execute; export default randomMulticolorDotPatternTool;
