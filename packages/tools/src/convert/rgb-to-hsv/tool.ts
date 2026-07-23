import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RgbToHsvInput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};
export type RgbToHsvOutput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};

export const rgbToHsvExample = {
  input: { blue: 90, green: 70, red: 70 },
  output: { hue: 240, saturation: 22.22, value: 35.29 },
} satisfies ToolExample<RgbToHsvInput, RgbToHsvOutput>;

const round = (value: number): number => Number(value.toFixed(2));
const channelField = (id: "blue" | "green" | "red", label: string) => ({
  format: "color/rgb-channel",
  id,
  kind: "number" as const,
  label,
  maximum: 255,
  minimum: 0,
});

export const rgbToHsvTool = createSimpleTool({
  id: "convert/rgb-to-hsv",
  title: "RGB to HSV Converter",
  description:
    "Convert red, green, and blue channels to hue, saturation, and value.",
  inputs: [
    channelField("red", "Red"),
    channelField("green", "Green"),
    channelField("blue", "Blue"),
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
    const red = (input.red as number) / 255;
    const green = (input.green as number) / 255;
    const blue = (input.blue as number) / 255;
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const chroma = maximum - minimum;
    let hue = 0;
    if (chroma !== 0) {
      if (maximum === red) hue = 60 * (((green - blue) / chroma) % 6);
      else if (maximum === green) hue = 60 * ((blue - red) / chroma + 2);
      else hue = 60 * ((red - green) / chroma + 4);
    }
    if (hue < 0) hue += 360;
    const saturation = maximum === 0 ? 0 : chroma / maximum;
    return {
      hue: round(hue),
      saturation: round(saturation * 100),
      value: round(maximum * 100),
    };
  },
});

export const runRgbToHsv = rgbToHsvTool.execute;
export default rgbToHsvTool;
