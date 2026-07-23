import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HslToRgbInput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};
export type HslToRgbOutput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export const hslToRgbExample = {
  input: { hue: 240, lightness: 31.37, saturation: 12.5 },
  output: { blue: 90, green: 70, red: 70 },
} satisfies ToolExample<HslToRgbInput, HslToRgbOutput>;

export const hslToRgbTool = createSimpleTool({
  id: "convert/hsl-to-rgb",
  title: "HSL to RGB Converter",
  description:
    "Convert hue, saturation, and lightness to red, green, and blue channels.",
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
    const hue = (input.hue as number) % 360;
    const saturation = (input.saturation as number) / 100;
    const lightness = (input.lightness as number) / 100;
    const amplitude = saturation * Math.min(lightness, 1 - lightness);
    const channel = (offset: number): number => {
      const position = (offset + hue / 30) % 12;
      const value =
        lightness -
        amplitude * Math.max(-1, Math.min(position - 3, 9 - position, 1));
      return Math.round(255 * value);
    };
    return { blue: channel(4), green: channel(8), red: channel(0) };
  },
});

export const runHslToRgb = hslToRgbTool.execute;
export default hslToRgbTool;
