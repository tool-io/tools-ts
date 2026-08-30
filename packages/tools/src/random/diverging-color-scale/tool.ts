// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
import { hslToHex, type RandomColorPaletteOutput } from "../color-palette/tool.js";
export type RandomDivergingColorScaleInput = { readonly count: number }; export type RandomDivergingColorScaleOutput = RandomColorPaletteOutput;
export const calculateRandomDivergingColorScale = (input: RandomDivergingColorScaleInput, random: RandomSource = Math.random): RandomDivergingColorScaleOutput | null => { if (!Number.isSafeInteger(input.count) || input.count < 2 || input.count > 32) return null;
  const first = sampleRandomSource(random); const second = sampleRandomSource(random); const third = sampleRandomSource(random);
  if (first === null || second === null || third === null) return null;
  const hueA = first * 360; const hueB = second * 360; const saturation = 45 + third * 45;
  const colors = Array.from({ length: input.count }, (_, index) => {
    const fraction = input.count === 1 ? 0 : index / (input.count - 1);
    const hue = fraction <= 0.5 ? hueA : hueB;
    const lightness = 35 + 60 * (1 - Math.abs(2 * fraction - 1));
    return hslToHex(hue, saturation, lightness);
  });
  return { colors };
};
export const randomDivergingColorScaleExample = { input: { count: 7 } } satisfies ToolExample<RandomDivergingColorScaleInput, RandomDivergingColorScaleOutput>;
export const randomDivergingColorScaleTool = createSimpleTool({ calculate: (input, context) => { const output = calculateRandomDivergingColorScale({ count: input.count as number }, context.random ?? Math.random); if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_scale_request"); return output; }, description: "Generate a two-ended diverging sRGB color scale with 2 through 32 entries using injected randomness.", id: "random/diverging-color-scale", inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }], outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }], title: "Random Diverging Color Scale Generator" });
export const runRandomDivergingColorScale = randomDivergingColorScaleTool.execute; export default randomDivergingColorScaleTool;
