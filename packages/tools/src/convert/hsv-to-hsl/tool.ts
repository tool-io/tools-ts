import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HsvToHslInput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};
export type HsvToHslOutput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};

export const hsvToHslExample = {
  input: { hue: 240, saturation: 22.22, value: 35.29 },
  output: { hue: 240, lightness: 31.37, saturation: 12.5 },
} satisfies ToolExample<HsvToHslInput, HsvToHslOutput>;

const round = (value: number): number => Number(value.toFixed(2));

export const hsvToHslTool = createSimpleTool({
  id: "convert/hsv-to-hsl",
  title: "HSV to HSL Converter",
  description:
    "Convert hue, saturation, and value to hue, saturation, and lightness.",
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
      label: "HSV saturation",
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
      label: "HSL saturation",
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
    const hue = (input.hue as number) % 360;
    const saturation = (input.saturation as number) / 100;
    const value = (input.value as number) / 100;
    const lightness = value * (1 - saturation / 2);
    const hslSaturation =
      lightness === 0 || lightness === 1
        ? 0
        : (value - lightness) / Math.min(lightness, 1 - lightness);
    return {
      hue: round(hue),
      lightness: round(lightness * 100),
      saturation: round(hslSaturation * 100),
    };
  },
});

export const runHsvToHsl = hsvToHslTool.execute;
export default hsvToHslTool;
