import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { runRgbToHsv } from "../rgb-to-hsv/tool.js";
import { oklchToRgb } from "../oklch.js";

export type OklchToHsvInput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};
export type OklchToHsvOutput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};

export const convertOklchToHsv = (
  input: OklchToHsvInput,
): OklchToHsvOutput | null =>
  (() => {
    const rgb = oklchToRgb(input);
    if (!rgb) return null;
    const result = runRgbToHsv(rgb);
    return result.ok ? result.output : null;
  })();

export const oklchToHsvExample = {
  input: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
  output: { hue: 240, saturation: 22.22, value: 35.29 },
} satisfies ToolExample<OklchToHsvInput, OklchToHsvOutput>;

export const oklchToHsvTool = createSimpleTool({
  id: "convert/oklch-to-hsv",
  title: "OKLCH to HSV Converter",
  description:
    "Convert perceptual OKLCH color values to HSV, clipping values outside the sRGB gamut.",
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
      format: "color/hsv-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      unit: "percent",
    },
    {
      format: "color/hsv-value",
      id: "value",
      kind: "number",
      label: "Value",
      unit: "percent",
    },
  ],
  calculate: (input) => {
    const result = convertOklchToHsv(input as OklchToHsvInput);
    if (!result) simpleError("", "Enter a valid OKLCH color.");
    return result;
  },
});

export const runOklchToHsv = oklchToHsvTool.execute;
export default oklchToHsvTool;
