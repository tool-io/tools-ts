import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { runHslToRgb } from "../hsl-to-rgb/tool.js";
import { rgbToOklch } from "../oklch.js";

export type HslToOklchInput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};
export type HslToOklchOutput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};

const round = (value: number, precision: number): number =>
  Number(value.toFixed(precision));

export const convertHslToOklch = (
  input: HslToOklchInput,
): HslToOklchOutput | null => {
  const result = (() => {
    const rgb = runHslToRgb(input);
    return rgb.ok ? rgbToOklch(rgb.output) : null;
  })();
  return result
    ? {
        chroma: round(result.chroma, 6),
        hue: round(result.hue, 6),
        lightness: round(result.lightness, 6),
      }
    : null;
};

export const hslToOklchExample = {
  input: { hue: 240, lightness: 31.37, saturation: 12.5 },
  output: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
} satisfies ToolExample<HslToOklchInput, HslToOklchOutput>;

export const hslToOklchTool = createSimpleTool({
  id: "convert/hsl-to-oklch",
  title: "HSL to OKLCH Converter",
  description: "Convert HSL color values to perceptual OKLCH.",
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
      format: "color/hsl-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      format: "color/hsl-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
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
    const result = convertHslToOklch(input as HslToOklchInput);
    if (!result) simpleError("", "Enter a valid color.");
    return result;
  },
});

export const runHslToOklch = hslToOklchTool.execute;
export default hslToOklchTool;
