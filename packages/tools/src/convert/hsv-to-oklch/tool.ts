import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { runHsvToRgb } from "../hsv-to-rgb/tool.js";
import type { HsvToRgbOutput } from "../hsv-to-rgb/tool.js";
import { rgbToOklch } from "../oklch.js";

export type HsvToOklchInput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};
export type HsvToOklchOutput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};

const round = (value: number, precision: number): number =>
  Number(value.toFixed(precision));

export const convertHsvToOklch = (
  input: HsvToOklchInput,
): HsvToOklchOutput | null => {
  const result = (() => {
    const rgb = runHsvToRgb(input);
    return rgb.ok ? rgbToOklch(rgb.output as HsvToRgbOutput) : null;
  })();
  return result
    ? {
        chroma: round(result.chroma, 6),
        hue: round(result.hue, 6),
        lightness: round(result.lightness, 6),
      }
    : null;
};

export const hsvToOklchExample = {
  input: { hue: 240, saturation: 22.22, value: 35.29 },
  output: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
} satisfies ToolExample<HsvToOklchInput, HsvToOklchOutput>;

export const hsvToOklchTool = createSimpleTool({
  id: "convert/hsv-to-oklch",
  title: "HSV to OKLCH Converter",
  description: "Convert HSV color values to perceptual OKLCH.",
  inputs: [
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      maximum: 360,
      minimum: 0,
      unit: "degree",
    },
    {
      format: "color/hsv-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      format: "color/hsv-value",
      id: "value",
      kind: "number",
      label: "Value",
      maximum: 100,
      minimum: 0,
      unit: "percent",
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
    const result = convertHsvToOklch(input as HsvToOklchInput);
    if (!result) simpleError("", "Enter a valid color.");
    return result;
  },
});

export const runHsvToOklch = hsvToOklchTool.execute;
export default hsvToOklchTool;
