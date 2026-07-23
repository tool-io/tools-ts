import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HslToHsvInput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};
export type HslToHsvOutput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};

export const hslToHsvExample = {
  input: { hue: 240, lightness: 31.37, saturation: 12.5 },
  output: { hue: 240, saturation: 22.22, value: 35.29 },
} satisfies ToolExample<HslToHsvInput, HslToHsvOutput>;

const round = (value: number): number => Number(value.toFixed(2));

export const hslToHsvTool = createSimpleTool({
  id: "convert/hsl-to-hsv",
  title: "HSL to HSV Converter",
  description:
    "Convert hue, saturation, and lightness to hue, saturation, and value.",
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
      label: "HSL saturation",
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
      label: "HSV saturation",
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
    const hue = (input.hue as number) % 360;
    const saturation = (input.saturation as number) / 100;
    const lightness = (input.lightness as number) / 100;
    const value = lightness + saturation * Math.min(lightness, 1 - lightness);
    const hsvSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);
    return {
      hue: round(hue),
      saturation: round(hsvSaturation * 100),
      value: round(value * 100),
    };
  },
});

export const runHslToHsv = hslToHsvTool.execute;
export default hslToHsvTool;
