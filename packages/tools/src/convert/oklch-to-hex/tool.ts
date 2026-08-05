import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { oklchToRgb } from "../oklch.js";

export type OklchToHexInput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};
export type OklchToHexOutput = { readonly hex: string };

export const convertOklchToHex = (
  input: OklchToHexInput,
): OklchToHexOutput | null =>
  (() => {
    const rgb = oklchToRgb(input);
    if (!rgb) return null;
    const hex = [rgb.red, rgb.green, rgb.blue]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return { hex: `#${hex}` };
  })();

export const oklchToHexExample = {
  input: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
  output: { hex: "#46465A" },
} satisfies ToolExample<OklchToHexInput, OklchToHexOutput>;

export const oklchToHexTool = createSimpleTool({
  id: "convert/oklch-to-hex",
  title: "OKLCH to HEX Converter",
  description:
    "Convert perceptual OKLCH color values to HEX, clipping values outside the sRGB gamut.",
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
    { format: "color/hex", id: "hex", kind: "string", label: "HEX color" },
  ],
  calculate: (input) => {
    const result = convertOklchToHex(input as OklchToHexInput);
    if (!result) simpleError("", "Enter a valid OKLCH color.");
    return result;
  },
});

export const runOklchToHex = oklchToHexTool.execute;
export default oklchToHexTool;
