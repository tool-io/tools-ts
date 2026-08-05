import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rgbToOklch } from "../oklch.js";

export type RgbToOklchInput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};
export type RgbToOklchOutput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};

const round = (value: number, precision: number): number =>
  Number(value.toFixed(precision));

export const convertRgbToOklch = (
  input: RgbToOklchInput,
): RgbToOklchOutput | null => {
  const result = rgbToOklch(input);
  return result
    ? {
        chroma: round(result.chroma, 6),
        hue: round(result.hue, 6),
        lightness: round(result.lightness, 6),
      }
    : null;
};

export const rgbToOklchExample = {
  input: { blue: 90, green: 70, red: 70 },
  output: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
} satisfies ToolExample<RgbToOklchInput, RgbToOklchOutput>;

export const rgbToOklchTool = createSimpleTool({
  id: "convert/rgb-to-oklch",
  title: "RGB to OKLCH Converter",
  description: "Convert RGB color values to perceptual OKLCH.",
  inputs: [
    {
      format: "color/rgb-channel",
      id: "red",
      kind: "number",
      label: "Red",
      maximum: 255,
      minimum: 0,
    },
    {
      format: "color/rgb-channel",
      id: "green",
      kind: "number",
      label: "Green",
      maximum: 255,
      minimum: 0,
    },
    {
      format: "color/rgb-channel",
      id: "blue",
      kind: "number",
      label: "Blue",
      maximum: 255,
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "color/oklch-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      unit: "percent",
    },
    {
      format: "color/oklch-chroma",
      id: "chroma",
      kind: "number",
      label: "Chroma",
    },
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      unit: "degree",
    },
  ],
  calculate: (input) => {
    const result = convertRgbToOklch(input as RgbToOklchInput);
    if (!result) simpleError("", "Enter a valid color.");
    return result;
  },
});

export const runRgbToOklch = rgbToOklchTool.execute;
export default rgbToOklchTool;
