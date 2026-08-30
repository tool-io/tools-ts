// Color syntax source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type RandomColorPaletteInput = { readonly count: number };
export type RandomColorPaletteOutput = { readonly colors: readonly string[] };

const channelToHex = (value: number): string => Math.round(value * 255).toString(16).padStart(2, "0").toUpperCase();
export const hslToHex = (hue: number, saturationPercent: number, lightnessPercent: number): string => {
  const h = ((hue % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, saturationPercent)) / 100;
  const l = Math.min(100, Math.max(0, lightnessPercent)) / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  const [r, g, b] = h < 60 ? [chroma, x, 0] : h < 120 ? [x, chroma, 0] : h < 180 ? [0, chroma, x] : h < 240 ? [0, x, chroma] : h < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return `#${channelToHex(r + m)}${channelToHex(g + m)}${channelToHex(b + m)}`;
};

const take = (random: RandomSource): number | null => sampleRandomSource(random);
export const calculateStyledPalette = (
  count: number,
  ranges: Readonly<{ saturation: readonly [number, number]; lightness: readonly [number, number]; hue: readonly [number, number] }>,
  random: RandomSource = Math.random,
): RandomColorPaletteOutput | null => {
  if (!Number.isSafeInteger(count) || count < 2 || count > 32) return null;
  const colors: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const hueSample = take(random); const saturationSample = take(random); const lightnessSample = take(random);
    if (hueSample === null || saturationSample === null || lightnessSample === null) return null;
    const hue = ranges.hue[0] + hueSample * (ranges.hue[1] - ranges.hue[0]);
    const saturation = ranges.saturation[0] + saturationSample * (ranges.saturation[1] - ranges.saturation[0]);
    const lightness = ranges.lightness[0] + lightnessSample * (ranges.lightness[1] - ranges.lightness[0]);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return { colors };
};

export const calculateHarmonyPalette = (
  count: number,
  offsets: readonly number[],
  random: RandomSource = Math.random,
): RandomColorPaletteOutput | null => {
  if (!Number.isSafeInteger(count) || count < 2 || count > 32 || offsets.length === 0) return null;
  const hueSample = take(random); const saturationSample = take(random); const lightnessSample = take(random);
  if (hueSample === null || saturationSample === null || lightnessSample === null) return null;
  const baseHue = hueSample * 360;
  const saturation = 55 + saturationSample * 35;
  const baseLightness = 42 + lightnessSample * 16;
  return { colors: Array.from({ length: count }, (_, index) => hslToHex(baseHue + (offsets[index % offsets.length] ?? 0), saturation, Math.min(85, baseLightness + Math.floor(index / offsets.length) * 8))) };
};

export const calculateRandomColorPalette = (input: RandomColorPaletteInput, random: RandomSource = Math.random): RandomColorPaletteOutput | null =>
  calculateStyledPalette(input.count, { hue: [0, 360], lightness: [25, 80], saturation: [35, 95] }, random);

export const randomColorPaletteExample = { input: { count: 5 } } satisfies ToolExample<RandomColorPaletteInput, RandomColorPaletteOutput>;
export const randomColorPaletteTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomColorPalette({ count: input.count as number }, context.random ?? Math.random);
    if (output === null) return simpleError("count", "Count must be an integer from 2 through 32 and randomness must be valid.", "invalid_palette_request");
    return output;
  },
  description: "Generate 2 through 32 random sRGB hex colors from bounded HSL coordinates using injected randomness.",
  id: "random/color-palette",
  inputs: [{ id: "count", kind: "integer", label: "Color count", maximum: 32, minimum: 2 }],
  outputs: [{ format: "color/hex-list", id: "colors", kind: "stringList", label: "Colors" }],
  title: "Random Color Palette Generator",
});
export const runRandomColorPalette = randomColorPaletteTool.execute;
export default randomColorPaletteTool;
