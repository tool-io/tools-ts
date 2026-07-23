import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HsvToRgbInput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};
export type HsvToRgbOutput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export const hsvToRgbExample = {
  input: { hue: 240, saturation: 22.22, value: 35.29 },
  output: { blue: 90, green: 70, red: 70 },
} satisfies ToolExample<HsvToRgbInput, HsvToRgbOutput>;

export const hsvToRgbTool = createSimpleTool({
  id: "convert/hsv-to-rgb",
  title: "HSV to RGB Converter",
  description:
    "Convert hue, saturation, and value to red, green, and blue channels.",
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
    const value = (input.value as number) / 100;
    const channel = (offset: number): number => {
      const position = (offset + hue / 60) % 6;
      const result =
        value -
        value * saturation * Math.max(0, Math.min(position, 4 - position, 1));
      return Math.round(255 * result);
    };
    return { blue: channel(1), green: channel(3), red: channel(5) };
  },
});

export const runHsvToRgb = hsvToRgbTool.execute;
export default hsvToRgbTool;
