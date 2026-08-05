import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { oklchToRgb } from "../oklch.js";

export type OklchToRgbInput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};
export type OklchToRgbOutput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export const convertOklchToRgb = (
  input: OklchToRgbInput,
): OklchToRgbOutput | null => oklchToRgb(input);

export const oklchToRgbExample = {
  input: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
  output: { blue: 90, green: 70, red: 70 },
} satisfies ToolExample<OklchToRgbInput, OklchToRgbOutput>;

export const oklchToRgbTool = createSimpleTool({
  id: "convert/oklch-to-rgb",
  title: "OKLCH to RGB Converter",
  description:
    "Convert perceptual OKLCH color values to RGB, clipping values outside the sRGB gamut.",
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
    { format: "color/rgb-channel", id: "red", kind: "number", label: "Red" },
    {
      format: "color/rgb-channel",
      id: "green",
      kind: "number",
      label: "Green",
    },
    { format: "color/rgb-channel", id: "blue", kind: "number", label: "Blue" },
  ],
  calculate: (input) => {
    const result = convertOklchToRgb(input as OklchToRgbInput);
    if (!result) simpleError("", "Enter a valid OKLCH color.");
    return result;
  },
});

export const runOklchToRgb = oklchToRgbTool.execute;
export default oklchToRgbTool;
