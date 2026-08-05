import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { runRgbToHsl } from "../rgb-to-hsl/tool.js";
import type { RgbToHslOutput } from "../rgb-to-hsl/tool.js";
import { oklchToRgb } from "../oklch.js";

export type OklchToHslInput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};
export type OklchToHslOutput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};

export const convertOklchToHsl = (
  input: OklchToHslInput,
): OklchToHslOutput | null =>
  (() => {
    const rgb = oklchToRgb(input);
    if (!rgb) return null;
    const result = runRgbToHsl(rgb);
    return result.ok ? (result.output as RgbToHslOutput) : null;
  })();

export const oklchToHslExample = {
  input: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
  output: { hue: 240, lightness: 31.37, saturation: 12.5 },
} satisfies ToolExample<OklchToHslInput, OklchToHslOutput>;

export const oklchToHslTool = createSimpleTool({
  id: "convert/oklch-to-hsl",
  title: "OKLCH to HSL Converter",
  description:
    "Convert perceptual OKLCH color values to HSL, clipping values outside the sRGB gamut.",
  inputs: [
    {
      format: "color/oklch-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      format: "color/oklch-chroma",
      id: "chroma",
      kind: "number",
      label: "Chroma",
      minimum: 0,
    },
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      maximum: 360,
      minimum: 0,
      unit: "degree",
    },
  ],
  outputs: [
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      unit: "degree",
    },
    {
      format: "color/hsl-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      unit: "percent",
    },
    {
      format: "color/hsl-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      unit: "percent",
    },
  ],
  calculate: (input) => {
    const result = convertOklchToHsl(input as OklchToHslInput);
    if (!result) simpleError("", "Enter a valid OKLCH color.");
    return result;
  },
});

export const runOklchToHsl = oklchToHslTool.execute;
export default oklchToHslTool;
